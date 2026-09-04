# -*- coding: utf-8 -*-
"""Generates the Trafy Cohort '26 curriculum PDF."""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, Table, TableStyle,
    NextPageTemplate, PageBreak, HRFlowable, KeepTogether
)
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.pdfgen import canvas as pdfcanvas

OUT = r"C:\Users\aarup\OneDrive\Desktop\repository folder\trafyainew\assets\downloads\trafy-cohort26-curriculum.pdf"

VIOLET = colors.HexColor("#6C5CE7")
VIOLET_DARK = colors.HexColor("#241E45")
BLUE = colors.HexColor("#4F8CFF")
INK = colors.HexColor("#12121A")
DIM = colors.HexColor("#55556B")
FAINT = colors.HexColor("#8A8AA0")
LINE = colors.HexColor("#E4E2F5")
BG_SOFT = colors.HexColor("#F7F6FC")
WHITE = colors.white

PAGE_W, PAGE_H = A4
MARGIN = 20 * mm

styles = {
    "cover_kicker": ParagraphStyle("cover_kicker", fontName="Helvetica-Bold", fontSize=10.5,
                                    textColor=VIOLET, leading=14, tracking=1),
    "cover_title": ParagraphStyle("cover_title", fontName="Helvetica-Bold", fontSize=34,
                                   textColor=INK, leading=39, spaceBefore=10),
    "cover_sub": ParagraphStyle("cover_sub", fontName="Helvetica", fontSize=12.5,
                                 textColor=DIM, leading=18, spaceBefore=14),
    "cover_meta": ParagraphStyle("cover_meta", fontName="Helvetica", fontSize=9.5,
                                  textColor=FAINT, leading=13),
    "h1": ParagraphStyle("h1", fontName="Helvetica-Bold", fontSize=18, textColor=INK,
                          leading=22, spaceBefore=0, spaceAfter=10),
    "h2": ParagraphStyle("h2", fontName="Helvetica-Bold", fontSize=12.5, textColor=VIOLET,
                          leading=16, spaceBefore=0, spaceAfter=4),
    "kicker": ParagraphStyle("kicker", fontName="Helvetica-Bold", fontSize=9, textColor=VIOLET,
                              leading=12, spaceAfter=4),
    "body": ParagraphStyle("body", fontName="Helvetica", fontSize=9.7, textColor=DIM, leading=14.5),
    "body_sm": ParagraphStyle("body_sm", fontName="Helvetica", fontSize=8.7, textColor=DIM, leading=12.8),
    "month_label": ParagraphStyle("month_label", fontName="Helvetica-Bold", fontSize=9,
                                   textColor=WHITE, leading=11),
    "month_theme": ParagraphStyle("month_theme", fontName="Helvetica-Bold", fontSize=11.5,
                                   textColor=INK, leading=14, spaceAfter=2),
    "cell_head": ParagraphStyle("cell_head", fontName="Helvetica-Bold", fontSize=8.6,
                                 textColor=INK, leading=11.5),
    "cell_body": ParagraphStyle("cell_body", fontName="Helvetica", fontSize=8.3,
                                 textColor=DIM, leading=11.8),
    "footer": ParagraphStyle("footer", fontName="Helvetica", fontSize=7.5, textColor=FAINT, leading=10),
    "stat_num": ParagraphStyle("stat_num", fontName="Helvetica-Bold", fontSize=19, textColor=INK, leading=22, alignment=TA_CENTER),
    "stat_label": ParagraphStyle("stat_label", fontName="Helvetica", fontSize=7.6, textColor=DIM, leading=10, alignment=TA_CENTER),
    "principle_num": ParagraphStyle("principle_num", fontName="Helvetica-Bold", fontSize=13, textColor=VIOLET, leading=16),
    "principle_title": ParagraphStyle("principle_title", fontName="Helvetica-Bold", fontSize=10.5, textColor=INK, leading=13, spaceAfter=2),
    "cta_title": ParagraphStyle("cta_title", fontName="Helvetica-Bold", fontSize=20, textColor=WHITE, leading=24, alignment=TA_CENTER),
    "cta_body": ParagraphStyle("cta_body", fontName="Helvetica", fontSize=10.5, textColor=colors.HexColor("#D8D4F5"), leading=15, alignment=TA_CENTER),
}


def header_footer(canvas, doc, page_label):
    canvas.saveState()
    canvas.setFont("Helvetica-Bold", 8)
    canvas.setFillColor(FAINT)
    canvas.drawString(MARGIN, PAGE_H - 13 * mm, "TRAFY COHORT '26 · CURRICULUM")
    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(0.6)
    canvas.line(MARGIN, PAGE_H - 15 * mm, PAGE_W - MARGIN, PAGE_H - 15 * mm)
    canvas.setFont("Helvetica", 7.5)
    canvas.setFillColor(FAINT)
    canvas.drawString(MARGIN, 12 * mm, "trafy.ai")
    canvas.drawRightString(PAGE_W - MARGIN, 12 * mm, f"Page {doc.page}")
    canvas.restoreState()


def cover_bg(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(INK)
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    # soft violet glow blocks (rects standing in for radial gradient, kept subtle)
    canvas.setFillColor(VIOLET_DARK)
    canvas.circle(PAGE_W - 20 * mm, PAGE_H - 30 * mm, 70 * mm, fill=1, stroke=0)
    canvas.setFillColor(INK)
    canvas.circle(PAGE_W - 20 * mm, PAGE_H - 30 * mm, 68 * mm, fill=1, stroke=0)
    canvas.restoreState()


def body_page(canvas, doc):
    header_footer(canvas, doc, doc._page_label)


def make_pill_table(rows, col_widths, header=False):
    t = Table(rows, colWidths=col_widths)
    style = [
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
        ("LINEBELOW", (0, 0), (-1, -2), 0.5, LINE),
    ]
    t.setStyle(TableStyle(style))
    return t


def build():
    doc = BaseDocTemplate(OUT, pagesize=A4,
                           leftMargin=MARGIN, rightMargin=MARGIN,
                           topMargin=MARGIN, bottomMargin=MARGIN,
                           title="Trafy Cohort '26 Curriculum", author="Trafy")

    cover_frame = Frame(0, 0, PAGE_W, PAGE_H, id="cover", leftPadding=MARGIN, rightPadding=MARGIN,
                         topPadding=70 * mm, bottomPadding=MARGIN)
    body_frame = Frame(MARGIN, MARGIN, PAGE_W - 2 * MARGIN, PAGE_H - 2 * MARGIN - 8 * mm,
                        id="body", topPadding=10 * mm)

    doc.addPageTemplates([
        PageTemplate(id="Cover", frames=[cover_frame], onPage=cover_bg),
        PageTemplate(id="Body", frames=[body_frame], onPage=lambda c, d: header_footer(c, d, d._page_label)),
    ])

    story = []

    # ---------------- COVER ----------------
    story.append(Paragraph("THE CURRICULUM", ParagraphStyle("k", parent=styles["cover_kicker"])))
    story.append(Paragraph("Trafy Cohort &apos;26", ParagraphStyle("t", parent=styles["cover_title"], textColor=WHITE)))
    story.append(Paragraph("A 6-month, builder-led program to ship a real AI SaaS product, "
                            "build a real audience from zero, and walk out with either funding "
                            "or a job, backed by an IIT Madras certification.",
                            ParagraphStyle("s", parent=styles["cover_sub"], textColor=colors.HexColor("#B9B6D6"))))
    story.append(Spacer(1, 26))
    meta_rows = [
        ["FORMAT", "Hybrid — in-person sprints\n+ online build weeks"],
        ["DURATION", "6 months, full immersion"],
        ["ELIGIBILITY", "Students, early founders\n& career-switchers"],
        ["CREDENTIAL", "AICTE-approved diploma,\ncertified with IIT Madras"],
    ]
    meta_table = Table(meta_rows, colWidths=[38 * mm, 55 * mm])
    meta_table.setStyle(TableStyle([
        ("TEXTCOLOR", (0, 0), (0, -1), colors.HexColor("#8B7CFF")),
        ("TEXTCOLOR", (1, 0), (1, -1), colors.HexColor("#E7E5F7")),
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("FONTNAME", (1, 0), (1, -1), "Helvetica"),
        ("FONTSIZE", (0, 0), (0, -1), 7.6),
        ("FONTSIZE", (1, 0), (1, -1), 9),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 16),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
    ]))
    story.append(meta_table)

    story.append(NextPageTemplate("Body"))
    story.append(PageBreak())

    def set_label(label):
        story.append(Paragraph("", styles["body"]))  # placeholder, real label set via doc attr in onPage
        doc._page_label = label

    # ---------------- PAGE: Program overview ----------------
    doc._page_label = "PROGRAM OVERVIEW"
    story.append(Paragraph("Learn business by building it, with AI", styles["h1"]))
    story.append(Paragraph(
        "Trafy Cohort &apos;26 isn&apos;t a bootcamp and it isn&apos;t a lecture series. Every founder spends "
        "the first four months learning and building, together, then the last two months split by "
        "track: build a startup and pitch it, or build the portfolio and score that gets you hired. "
        "Six months later, you walk out having shipped a real product, grown a real audience from "
        "zero, and either pitched investors or interviewed with partner companies, backed by a "
        "certification from IIT Madras.",
        styles["body"]))
    story.append(Spacer(1, 14))

    story.append(Paragraph("THE TWO TRACKS", styles["kicker"]))
    track_rows = [
        [Paragraph("<b>Startup Track</b>", styles["cell_head"]),
         Paragraph("<b>Employability Track</b>", styles["cell_head"])],
        [Paragraph("Pitch a real idea to CTOs and investors, get matched with a C-suite mentor, "
                   "build and validate an MVP, then get access to Trafy&apos;s pre-seed and VC network "
                   "to raise your round.", styles["cell_body"]),
         Paragraph("Build the technical fundamentals, ship a portfolio worth showing, and sit the "
                   "Employability Index, a 45-question MCQ round, 2 timed DSA problems, and a "
                   "portfolio/GitHub/LinkedIn/LeetCode verification, then get shortlisted directly "
                   "by partner companies.", styles["cell_body"])],
    ]
    tt = Table(track_rows, colWidths=[(PAGE_W - 2 * MARGIN - 10) / 2, (PAGE_W - 2 * MARGIN - 10) / 2])
    tt.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("BACKGROUND", (0, 0), (0, -1), BG_SOFT),
        ("BACKGROUND", (1, 0), (1, -1), BG_SOFT),
        ("BOX", (0, 0), (0, -1), 0.6, LINE),
        ("BOX", (1, 0), (1, -1), 0.6, LINE),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 12),
    ]))
    story.append(tt)
    story.append(Spacer(1, 16))

    story.append(Paragraph("COHORT &apos;25 RESULTS", styles["kicker"]))
    stat_data = [
        [Paragraph("Rs. 1 Cr+", styles["stat_num"]), Paragraph("25+", styles["stat_num"]),
         Paragraph("7+", styles["stat_num"]), Paragraph("17+", styles["stat_num"]), Paragraph("Rs. 21.73L", styles["stat_num"])],
        [Paragraph("Grants allocated", styles["stat_label"]), Paragraph("VC meetings booked", styles["stat_label"]),
         Paragraph("Startups incubated", styles["stat_label"]), Paragraph("Students placed abroad", styles["stat_label"]),
         Paragraph("Average CTC", styles["stat_label"])],
    ]
    colw = (PAGE_W - 2 * MARGIN) / 5
    stat_table = Table(stat_data, colWidths=[colw] * 5)
    stat_table.setStyle(TableStyle([
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 2),
    ]))
    story.append(stat_table)

    story.append(Spacer(1, 20))
    story.append(HRFlowable(width="100%", thickness=0.6, color=LINE))
    story.append(Spacer(1, 14))
    story.append(Paragraph("THE CURRICULUM, IN TWO PHASES", styles["kicker"]))
    story.append(Paragraph(
        "The first 3&ndash;4 months are spent entirely on learning AI engineering and building "
        "real projects, no pitching, no pressure to raise or apply yet. Months 5&ndash;6 split by "
        "track: the Startup Track pitches VCs and closes its first sale, the Employability Track "
        "interviews and gets hired.",
        styles["body"]))

    story.append(NextPageTemplate("Body"))
    story.append(PageBreak())

    # ---------------- PAGE: Curriculum months ----------------
    doc._page_label = "CURRICULUM"

    def phase_divider(label, sub):
        row = Table([[Paragraph(label, ParagraphStyle("pd", parent=styles["h2"], textColor=WHITE, fontSize=11))]],
                     colWidths=[PAGE_W - 2 * MARGIN])
        row.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), INK),
            ("LEFTPADDING", (0, 0), (-1, -1), 10),
            ("TOPPADDING", (0, 0), (-1, -1), 8),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ]))
        story.append(row)
        story.append(Spacer(1, 4))
        story.append(Paragraph(sub, styles["body_sm"]))
        story.append(Spacer(1, 10))

    months_phase1 = [
        ("01", "Foundations", VIOLET,
         "Everyone builds the same base: how to actually ship with AI.",
         [
             ("Python Foundations", "Programming fundamentals from scratch, the base every AI build sits on."),
             ("Large Language Models", "How LLMs actually work: tokens, context windows, and calling them via API."),
             ("LangChain", "Chaining prompts, tools and memory into real, working pipelines."),
             ("AI Agents", "Design and ship your first working AI agent."),
             ("No-Code Tools", "Automate a real workflow without writing a line of code."),
             ("Prompting Techniques", "Structured prompting, few-shot examples, and getting reliable output out of a model."),
             ("CS Fundamentals Refresher", "Computer Networks, OS, DBMS and System Design basics."),
             ("Pick Your Track", "End of month: choose Startup or Employability."),
             ("Live Session: CEO", "Judgment, hiring, and what the first 90 days of a company actually look like."),
         ]),
        ("02", "Build & Distribution", BLUE,
         "You start shipping publicly, not just privately.",
         [
             ("Product Engineering", "Full-stack build sprints using AI-assisted tooling."),
             ("Build in Public", "Pick one channel (LinkedIn, X, Instagram or YouTube) and start posting daily build logs."),
             ("Startup: Ideation Review", "Pitch your raw idea to real Trafy CTOs and investors."),
             ("Startup: Idea Evaluation", "Market potential, problem fit, team and feasibility, checked properly."),
             ("Employability: DSA Foundations", "Core data structures and algorithms, with timed practice rounds beginning."),
         ]),
        ("03", "The MVP Sprint", VIOLET,
         "An intense, focused sprint to ship something real.",
         [
             ("4-Day Build Sprint", "Ship a working MVP against a hard deadline, stand-ups every morning."),
             ("First Real Users", "Get the product in front of strangers, not just classmates."),
             ("Startup: C-Suite Mentorship", "Matched with a CEO, CTO, CMO or CFO mentor who works with you directly."),
             ("Startup: Build & Validate", "Build your MVP with expert guidance, tools and technical support."),
             ("Employability: Portfolio Setup", "Get your portfolio site, GitHub, LinkedIn and LeetCode profiles investor/recruiter-ready."),
             ("Growth: First 100", "Push toward your first 100 followers or users through content and direct outreach."),
         ]),
        ("04", "Scale", BLUE,
         "Iterate on real feedback and build systems that compound, the last shared month.",
         [
             ("Retention & Growth Loops", "Move past one-time users: build referral and retention mechanics."),
             ("$10,000-in-30-Days Check-in", "Revenue milestone review across every team."),
             ("Startup: Prototype Milestone", "Ship a working prototype and unlock the next level of incubation."),
             ("Startup: Networking Opportunities", "Access to Trafy&apos;s founder network, workshops and peer community."),
             ("Employability: Systems & Advanced DSA", "System design depth and harder algorithmic problem sets."),
         ]),
    ]

    months_phase2 = [
        ("05", "Raise or Apply", VIOLET,
         "The track-specific push toward your actual outcome begins.",
         [
             ("Startup: Pre-Seeding Support", "Pitch deck help, investor intros, and actually raising your pre-seed round."),
             ("Startup: VC Meetings Begin", "Meet Trafy&apos;s network of VCs and angels directly, first rounds of pitching."),
             ("Employability: The Employability Test", "45-question MCQ round, plus 2 DSA problems in 45 minutes."),
             ("Employability: Your Index", "Portfolio, GitHub, LinkedIn and LeetCode cross-checked into one verified score."),
             ("Applications Go Out", "Your Index is shared directly with Trafy&apos;s partner companies."),
         ]),
        ("06", "Pitch Day or Hired", BLUE,
         "You walk out with something real in hand.",
         [
             ("Startup: Pitch Day", "Pitch your startup live to VCs and angels in the room."),
             ("Startup: First Sale", "Close your first real revenue from an actual paying customer."),
             ("Employability: Interviews", "Interview directly with the partner companies your Index was shared with."),
             ("Employability: Get Hired", "Convert interviews into offers."),
             ("IIT Madras Certification", "Complete the cohort and earn your certified credential."),
             ("Build. Scale. Exit.", "Ongoing support to keep building, grow, and get acquired if that&apos;s the goal."),
         ]),
    ]

    def render_month(num, theme, color, blurb, rows):
        head_row = Table([[
            Paragraph(f"MONTH {num}", styles["month_label"]),
        ]], colWidths=[28 * mm])
        head_row.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), color),
            ("LEFTPADDING", (0, 0), (-1, -1), 8),
            ("TOPPADDING", (0, 0), (-1, -1), 5),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ]))
        story.append(KeepTogether([
            head_row,
            Spacer(1, 6),
            Paragraph(theme, styles["month_theme"]),
            Paragraph(blurb, styles["body_sm"]),
            Spacer(1, 6),
        ]))
        table_rows = [[Paragraph(t, styles["cell_head"]), Paragraph(d, styles["cell_body"])] for t, d in rows]
        mtable = make_pill_table(table_rows, [45 * mm, PAGE_W - 2 * MARGIN - 45 * mm])
        story.append(mtable)
        story.append(Spacer(1, 16))

    phase_divider("PHASE 1 &middot; MONTHS 1&ndash;4 &middot; AI ENGINEERING &amp; BUILDING PROJECTS",
                  "Entirely learning and building, together, no pitching or applying yet.")
    for num, theme, color, blurb, rows in months_phase1:
        render_month(num, theme, color, blurb, rows)

    story.append(PageBreak())
    doc._page_label = "CURRICULUM"
    phase_divider("PHASE 2 &middot; MONTHS 5&ndash;6 &middot; PITCH &amp; HIRE",
                  "Tracks diverge: pitch VCs and land your first sale, or interview and get hired.")
    for num, theme, color, blurb, rows in months_phase2:
        render_month(num, theme, color, blurb, rows)

    story.append(NextPageTemplate("Body"))
    story.append(PageBreak())

    # ---------------- PAGE: Growth framework ----------------
    doc._page_label = "GROWTH FRAMEWORK"
    story.append(Paragraph("How you go from zero", styles["h1"]))
    story.append(Paragraph(
        "Every founder starts this cohort with zero followers and zero users. Growth isn&apos;t a "
        "module you sit through in Month 4, it&apos;s a discipline that runs underneath every month "
        "of the curriculum. Five principles drive it.",
        styles["body"]))
    story.append(Spacer(1, 14))

    principles = [
        ("01", "Build in public from day one",
         "Post progress daily, not just the finished product. An audience that watches you build "
         "trusts you more than one that only sees the launch."),
        ("02", "Talk to 10 users before you write a feature",
         "Validation comes before code. Every feature on the roadmap should trace back to a "
         "conversation with a real, named user."),
        ("03", "One channel, mastered",
         "Pick a single platform, LinkedIn, X, Instagram or YouTube, and go deep instead of "
         "spreading thin across five."),
        ("04", "Ship weekly, not monthly",
         "Small, compounding releases beat one big launch. Momentum is a growth channel of its own."),
        ("05", "Let the cohort be your first distribution",
         "150+ builders in the room amplifying each other&apos;s work is real distribution, use it "
         "before you look anywhere else."),
    ]
    for num, title, desc in principles:
        row = Table([[
            Paragraph(num, styles["principle_num"]),
            [Paragraph(title, styles["principle_title"]), Paragraph(desc, styles["body_sm"])],
        ]], colWidths=[14 * mm, PAGE_W - 2 * MARGIN - 14 * mm])
        row.setStyle(TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("TOPPADDING", (0, 0), (-1, -1), 8),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ("LINEBELOW", (0, 0), (-1, -1), 0.5, LINE),
        ]))
        story.append(row)

    story.append(Spacer(1, 22))
    story.append(Paragraph("WHAT&apos;S INCLUDED THROUGHOUT", styles["kicker"]))
    incl = ["Expert Mentorship", "Technical Support", "Investor Network", "Growth Resources", "Long-term Partnership"]
    incl_row = Table([[Paragraph("&#10003; " + i, styles["body_sm"]) for i in incl]],
                      colWidths=[(PAGE_W - 2 * MARGIN) / 5] * 5)
    story.append(incl_row)

    story.append(NextPageTemplate("Body"))
    story.append(PageBreak())

    # ---------------- PAGE: CTA ----------------
    doc._page_label = "APPLY"

    cta_block = Table([[Paragraph("Applications for Cohort &apos;26 are open", styles["cta_title"])],
                        [Spacer(1, 8)],
                        [Paragraph("31/40 seats filled &middot; Applications close September 30",
                                   styles["cta_body"])],
                        [Spacer(1, 10)],
                        [Paragraph("Apply at trafy.ai/apply", ParagraphStyle(
                            "link", parent=styles["cta_body"], textColor=colors.HexColor("#B7A9FF"),
                            fontName="Helvetica-Bold"))],
                        ], colWidths=[PAGE_W - 2 * MARGIN])
    cta_block.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), INK),
        ("TOPPADDING", (0, 0), (-1, -1), 26),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 26),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
    ]))
    story.append(Spacer(1, 40))
    story.append(cta_block)
    story.append(Spacer(1, 24))
    story.append(Paragraph(
        "Trafy Cohort &apos;26 is a 6-month, AICTE-approved diploma program, certified with IIT Madras. "
        "This document is an overview of the curriculum as of publication and individual sessions "
        "may be reordered between batches.",
        styles["footer"]))

    doc.build(story)
    print("PDF written to", OUT)


if __name__ == "__main__":
    build()
