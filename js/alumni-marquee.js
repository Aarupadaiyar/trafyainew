/*
  Vanilla port of Magic UI's "Marquee" (vertical, dual-column, pause-on-hover)
  testimonial layout. The original is a React component wrapping a CSS
  keyframe animation with content duplicated once for a seamless loop; here
  that's just two plain DOM columns with duplicated markup and the same
  keyframes, so no React/Tailwind/shadcn dependency is needed. Two changes
  from the source: real Cohort '25 photos/quotes (already used elsewhere on
  this page) instead of placeholder avatar.vercel.sh images, and
  prefers-reduced-motion pauses the loop instead of leaving it running.
*/
(function () {
  'use strict';

  var col1 = document.getElementById('alumniMarqueeCol1');
  var col2 = document.getElementById('alumniMarqueeCol2');
  if (!col1 || !col2) return;

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

  var firstRow = DATA.slice(0, 2);
  var secondRow = DATA.slice(2);

  function cardHTML(d) {
    return (
      '<figure class="alumni-marquee__card">' +
        '<div class="alumni-marquee__card-head">' +
          '<img class="alumni-marquee__card-avatar" src="' + d.image + '" alt="" loading="lazy" decoding="async">' +
          '<div>' +
            '<figcaption class="alumni-marquee__card-name">' + d.name + '</figcaption>' +
            '<p class="alumni-marquee__card-role">' + d.role + '</p>' +
          '</div>' +
        '</div>' +
        '<blockquote class="alumni-marquee__card-quote">“' + d.quote + '”</blockquote>' +
      '</figure>'
    );
  }

  function buildTrack(container, items) {
    var track = document.createElement('div');
    track.className = 'alumni-marquee__track';
    var html = '';
    items.concat(items).forEach(function (d) { html += cardHTML(d); });
    track.innerHTML = html;
    container.appendChild(track);
  }

  buildTrack(col1, firstRow);
  buildTrack(col2, secondRow);

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    document.getElementById('alumniMarquee').classList.add('is-paused');
  }
})();
