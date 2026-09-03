/*
  Vanilla-JS port of a React "circular split roll" GSAP component: two
  columns (names / portraits) drift around independent circles, each side
  reaching full focus opposite the other, driven by scroll through a pinned
  section. Ported behavior, three deliberate departures from the original:

  1. No React/Tailwind/shadcn — this is a plain HTML/CSS/JS site, so the
     math (wrapProgress, circular position, focus easing) is ported as-is
     but wired to plain DOM nodes with gsap.set()/ScrollTrigger, reusing the
     GSAP + ScrollTrigger build already loaded globally for the hero morph.
  2. The pinned circular effect is desktop-only (>=1025px, matching the
     source component's own grid-fallback breakpoint) and skipped entirely
     under prefers-reduced-motion or if GSAP fails to load — the static
     grid below is the fallback in both cases, never an empty pinned box.
  3. Uses the site's real Cohort '25 testimonial photos/quotes (already
     used elsewhere on the page) instead of placeholder Unsplash images.
*/
(function () {
  'use strict';

  var root = document.getElementById('circularAlumni');
  if (!root) return;

  var pin = document.getElementById('circularAlumniPin');
  var namesOrbit = document.getElementById('circularAlumniNames');
  var photosOrbit = document.getElementById('circularAlumniPhotos');
  var grid = document.getElementById('circularAlumniGrid');

  var DATA = [
    {
      name: 'Ananya Singh',
      role: 'Product Designer',
      quote: 'This cohort pushed us out of our comfort zones in the best way possible, from understanding real business problems to shipping AI-powered solutions.',
      image: 'assets/img/testimonial-1.webp'
    },
    {
      name: 'Rohan Verma',
      role: 'Developer',
      quote: 'From ideating in late-night sessions to building, breaking and building again, every step pushed me to think bigger and ship faster.',
      image: 'assets/img/testimonial-2.webp'
    },
    {
      name: 'Aditya Kulkarni',
      role: 'AI Enthusiast',
      quote: 'This cohort gave me clarity, direction and a community that pushes you to do better every day. I learned to think like a builder, not just a coder.',
      image: 'assets/img/testimonial-3.webp'
    },
    {
      name: 'Karan Bansal',
      role: 'AI/ML Enthusiast',
      quote: "Today's session on building AI-powered products and evaluating real-world problems was incredible. Grateful for the mentors and the discussions.",
      image: 'assets/img/testimonial-4.webp'
    },
    {
      name: 'Sarthak Jain',
      role: 'Software Developer',
      quote: 'Every week was a new challenge and a new learning. Grateful for the mentors, the feedback, and the amazing community.',
      image: 'assets/img/testimonial-5.webp'
    }
  ];

  var nameEls = [];
  var photoEls = [];

  DATA.forEach(function (d) {
    var nameEl = document.createElement('div');
    nameEl.className = 'circular-alumni__name';
    nameEl.innerHTML =
      '<span class="circular-alumni__name-text">' + d.name + '</span>' +
      '<span class="circular-alumni__name-role">' + d.role + '</span>';
    namesOrbit.appendChild(nameEl);
    nameEls.push(nameEl);

    var card = document.createElement('div');
    card.className = 'circular-alumni__card';
    card.innerHTML = '<img src="' + d.image + '" alt="" loading="lazy" decoding="async">';
    photosOrbit.appendChild(card);
    photoEls.push(card);
  });

  DATA.forEach(function (d) {
    var card = document.createElement('article');
    card.className = 'circular-alumni__grid-card';
    card.innerHTML =
      '<div class="circular-alumni__grid-media"><img src="' + d.image + '" alt="" loading="lazy" decoding="async"></div>' +
      '<p class="circular-alumni__grid-quote">“' + d.quote + '”</p>' +
      '<p class="circular-alumni__grid-byline"><strong>' + d.name + '</strong> · ' + d.role + '</p>';
    grid.appendChild(card);
  });

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var gsapReady = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

  if (reduceMotion || !gsapReady) {
    root.classList.add('is-static');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  var DESKTOP_WIDTH = 1200;
  var LEFT_ANGLE_OFFSET = Math.PI;
  var RIGHT_ANGLE_OFFSET = -Math.PI * 0.08;
  var DEPTH_MIN = -1, DEPTH_MAX = 1, Z_INDEX_MIN = 1;
  var LEFT_DEPTH_MAX = 30, RIGHT_DEPTH_MAX = 40;

  /* Horizontal radius is intentionally smaller than vertical: the source
     component leans the focused name/photo toward the column boundary as
     a "converging" flourish, but at this section's narrower column width
     the original 220/260px pull was enough to slide the photo directly
     over the name text. Vertical spread (radiusY) stays generous so the
     carousel motion still reads clearly. */
  var LEFT_RADIUS_X = 120, LEFT_RADIUS_Y = 260;
  var RIGHT_RADIUS_X = 140, RIGHT_RADIUS_Y = 300;
  var CARD_W = 170, CARD_H = 190;
  var SECTION_HEIGHT_PCT = 70;
  var SCRUB = 1.2;
  var FOCUS_PHASE = 0.5;

  /* With only 5 items on a vertical circle, adjacent items naturally bunch
     near the top/bottom of the loop (y-motion slows to near zero there).
     Keeping off-focus items small and faint hides that crowding instead of
     letting half-opacity text visibly collide. */
  var TEXT_SIDE_SCALE = 0.55, TEXT_CENTER_SCALE = 1;
  var TEXT_SIDE_OPACITY = 0.08, TEXT_CENTER_OPACITY = 1;
  var IMG_SIDE_SCALE = 0.5, IMG_CENTER_SCALE = 1;
  var IMG_SIDE_OPACITY = 0.08, IMG_CENTER_OPACITY = 1;
  var TEXT_FOCUS_START = 0.42, TEXT_FOCUS_POWER = 2.6;
  var IMG_FOCUS_START = 0.45, IMG_FOCUS_POWER = 3.2;

  function wrapProgress(value) {
    var w = value % 1;
    if (w < 0) w += 1;
    return w;
  }

  function circularPosition(progress, radiusX, radiusY, angleOffset) {
    var angle = progress * Math.PI * 2 + angleOffset;
    return {
      x: Math.sin(angle) * radiusX,
      y: Math.cos(angle) * radiusY,
      horizontalDepth: Math.sin(angle)
    };
  }

  function strengthFromDepth(value) {
    return gsap.utils.clamp(0, 1, gsap.utils.mapRange(DEPTH_MIN, DEPTH_MAX, 0, 1, value));
  }

  function shapeFocus(strength, start, power) {
    var n = gsap.utils.clamp(0, 1, (strength - start) / (1 - start));
    return Math.pow(n, power);
  }

  var total = DATA.length;
  var mm = gsap.matchMedia();

  mm.add('(min-width: 1025px)', function () {
    gsap.set(nameEls.concat(photoEls), { opacity: 1 });

    function render(progress) {
      var width = window.innerWidth;
      var factor = width < DESKTOP_WIDTH ? width / DESKTOP_WIDTH : 1;
      var lrx = LEFT_RADIUS_X * factor, lry = LEFT_RADIUS_Y * factor;
      var rrx = RIGHT_RADIUS_X * factor, rry = RIGHT_RADIUS_Y * factor;

      root.style.setProperty('--circ-card-w', (CARD_W * factor) + 'px');
      root.style.setProperty('--circ-card-h', (CARD_H * factor) + 'px');

      nameEls.forEach(function (el, i) {
        var local = wrapProgress(i / total - progress + FOCUS_PHASE / total);
        var pos = circularPosition(local, lrx, lry, LEFT_ANGLE_OFFSET);
        var focus = shapeFocus(strengthFromDepth(pos.horizontalDepth), TEXT_FOCUS_START, TEXT_FOCUS_POWER);
        var scale = gsap.utils.interpolate(TEXT_SIDE_SCALE, TEXT_CENTER_SCALE, focus);
        var opacity = gsap.utils.interpolate(TEXT_SIDE_OPACITY, TEXT_CENTER_OPACITY, focus);
        var z = Math.round(gsap.utils.interpolate(Z_INDEX_MIN, LEFT_DEPTH_MAX, focus));
        gsap.set(el, { x: pos.x, y: pos.y, scale: scale, opacity: opacity, zIndex: z });
      });

      photoEls.forEach(function (el, i) {
        var local = wrapProgress(i / total - progress + FOCUS_PHASE / total);
        var pos = circularPosition(local, rrx, rry, RIGHT_ANGLE_OFFSET);
        var focus = shapeFocus(strengthFromDepth(-pos.horizontalDepth), IMG_FOCUS_START, IMG_FOCUS_POWER);
        var scale = gsap.utils.interpolate(IMG_SIDE_SCALE, IMG_CENTER_SCALE, focus);
        var opacity = gsap.utils.interpolate(IMG_SIDE_OPACITY, IMG_CENTER_OPACITY, focus);
        var z = Math.round(gsap.utils.interpolate(Z_INDEX_MIN, RIGHT_DEPTH_MAX, focus));
        gsap.set(el, { x: pos.x, y: pos.y, scale: scale, opacity: opacity, zIndex: z });
      });
    }

    render(0);

    var st = ScrollTrigger.create({
      trigger: root,
      start: 'top top',
      end: '+=' + (SECTION_HEIGHT_PCT * total) + '%',
      pin: pin,
      scrub: SCRUB,
      invalidateOnRefresh: true,
      onUpdate: function (self) { render(self.progress); }
    });

    return function () { st.kill(); };
  });
})();
