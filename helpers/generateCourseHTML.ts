// generateCourseHTML.ts
import { Course } from "@/types/course";

type Theme = {
    primary: string;
    accent: string;
    bg: string;
    text: string;
    muted: string;
    panel: string;
    codeBg: string;
    codeText: string;
    exampleBg: string;
    tableHeaderBg: string;
    tableHeaderText: string;
    watermark: string;
};

type HighlightStyle = "github" | "dracula";

type GenerateOptions = {
    titleSuffix?: string;                 // e.g., "– CheFu Academy"
    includeWatermark?: boolean;           // watermark across pages
    hideQuizAnswers?: boolean;            // answers collapsed by default
    collapseTopicsByDefault?: boolean;    // <details> default state
    enableHighlighting?: boolean;         // PrismJS highlighting
    highlightStyle?: HighlightStyle;      // Prism theme
    tocDepth?: 2;                         // 1 = chapters only, 2 = chapters + topics
    showBackToTopLinks?: boolean;         // adds "Back to TOC" anchors
    theme?: Partial<Theme>;               // override CSS variables
};

const DEFAULT_THEME: Theme = {
    primary: "#0984e3",
    accent: "#ff4757",
    bg: "#fefefe",
    text: "#333333",
    muted: "#636e72",
    panel: "#f8f9fa",
    codeBg: "#1e1e2f",
    codeText: "#f8f8f2",
    exampleBg: "#f1f2f6",
    tableHeaderBg: "#2d98da",
    tableHeaderText: "#ffffff",
    watermark: "rgba(200,200,200,0.15)",
};

export function generateCourseHTML(course: Course, opts: GenerateOptions = {}) {
    const {
        courseTitle,
        description = "",
        category = "",
        flashcards = [],
        chapters = [],
        qa = [],
        quiz = [],
    } = course;

    const {
        titleSuffix = "– CheFu Academy",
        includeWatermark = true,
        hideQuizAnswers = false,
        collapseTopicsByDefault = false,
        enableHighlighting = false,
        highlightStyle = "github",
        tocDepth = 2,
        showBackToTopLinks = true,
        theme = {},
    } = opts;

    const THEME = { ...DEFAULT_THEME, ...theme };

    // Utilities
    const escapeHtml = (s: unknown): string =>
        String(s ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");

    const slugify = (s: string): string =>
        s
            .toLowerCase()
            .trim()
            .replace(/[\s/]+/g, "-")
            .replace(/[^a-z0-9\-]/g, "");

    // Ensure unique IDs for anchors
    const idRegistry = new Map<string, number>();
    const uniqueId = (base: string): string => {
        const slug = slugify(base);
        const count = idRegistry.get(slug) ?? 0;
        idRegistry.set(slug, count + 1);
        return count === 0 ? slug : `${slug}-${count}`;
    };

    // Build IDs ahead of time for TOC/deep links
    type ChapterWithIds = {
        id: string;
        chapterName: string;
        content: Array<{
            topic: string;
            explain?: string;
            example?: string;
            code?: string;
            language?: string; // optional
        }>;
    };
    const chaptersWithIds: ChapterWithIds[] = chapters.map((ch) => ({
        id: uniqueId(ch.chapterName),
        chapterName: ch.chapterName,
        content: (ch.content ?? []).map((c) => {
            if (typeof c.topic !== "string") {
                throw new Error(`Invalid topic in chapter "${ch.chapterName}"`);
            }
            return {
                topic: c.topic,
                explain: c.explain,
                example: c.example,
                code: c.code,
                language: c.language,
            };
        }),
    }));

    // TOC
    const tocHtml = (() => {
        const items = chaptersWithIds
            .map((ch) => {
                const chapterLink = `<li><a href="#${ch.id}">${escapeHtml(ch.chapterName)}</a></li>`;
                if (tocDepth < 2 || !ch.content?.length) return chapterLink;

                const topics = ch.content
                    .map((c) => {
                        const topicId = uniqueId(`${ch.id}-${c.topic}`);
                        // store back onto the topic so chapter render reuses the same id
                        (c as any).__id = topicId;
                        return `<li><a href="#${topicId}">${escapeHtml(c.topic)}</a></li>`;
                    })
                    .join("");

                return `
          <li>
            <a href="#${ch.id}">${escapeHtml(ch.chapterName)}</a>
            <ul class="toc-topics">
              ${topics}
            </ul>
          </li>
        `;
            })
            .join("");

        return items || "<li><em>No chapters</em></li>";
    })();

    // Chapters
    const chapterHtml = chaptersWithIds
        .map((ch, idx) => {
            const topicsHtml = (ch.content ?? [])
                .map((c, i) => {
                    const topicId = (c as any).__id || uniqueId(`${ch.id}-${c.topic}`);
                    const openAttr = collapseTopicsByDefault ? "" : " open";
                    const explain = c.explain ? `<p>${escapeHtml(c.explain)}</p>` : "";
                    const example = c.example
                        ? `
              <pre class="example" aria-label="Example">
${escapeHtml(c.example)}
              </pre>
            `
                        : "";
                    const lang = c.language || "plaintext";
                    const code = c.code
                        ? `
              <pre class="code-block" aria-label="Code sample"><code class="language-${escapeHtml(
                            lang
                        )}">${escapeHtml(c.code)}</code></pre>
            `
                        : "";

                    return `
            <article class="topic" aria-labelledby="${topicId}">
              <details${openAttr}>
                <summary id="${topicId}">
                  <span class="topic-label">Topic:</span> ${escapeHtml(c.topic)}
                </summary>
                <div class="topic-body">
                  ${explain}
                  ${example}
                  ${code}
                  ${showBackToTopLinks
                            ? `<p class="back-to-top"><a href="#toc" aria-label="Back to table of contents">↑ Back to TOC</a></p>`
                            : ""
                        }
                </div>
              </details>
            </article>
          `;
                })
                .join("");

            return `
        <section class="chapter" aria-labelledby="${ch.id}">
          <h3 id="${ch.id}"><span class="chapter-counter">${idx + 1}.</span> ${escapeHtml(ch.chapterName)}</h3>
          ${topicsHtml || `<p class="muted">No topics in this chapter.</p>`}
        </section>
      `;
        })
        .join("");

    // Generic table builder (escapes cells)
    const renderTable = (headers: string[], rows: string[][]): string => {
        if (!rows.length) return `<p class="muted">No data.</p>`;
        const thead = `
      <thead>
        <tr>${headers.map((h) => `<th scope="col">${escapeHtml(h)}</th>`).join("")}</tr>
      </thead>`;
        const tbody = `
      <tbody>
        ${rows
                .map(
                    (r) => `<tr>${r.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`
                )
                .join("")}
      </tbody>`;
        return `<table class="styled-table" role="table" aria-label="${escapeHtml(
            headers.join(" / ")
        )}">${thead}${tbody}</table>`;
    };

    // Flashcards
    const flashcardHtml =
        flashcards?.length
            ? renderTable(
                ["Front", "Back"],
                flashcards.map((f) => [f.front, f.back])
            )
            : `<p class="muted">No flashcards.</p>`;

    // Q&A
    const qaHtml =
        qa?.length
            ? renderTable(
                ["Question", "Answer"],
                qa.map((q) => [q.question, q.answer])
            )
            : `<p class="muted">No Q&A available.</p>`;

    // Quiz (optionally hide answers)
    const quizHtml =
        quiz?.length
            ? (() => {
                if (!hideQuizAnswers) {
                    return renderTable(
                        ["Question", "Answer"],
                        quiz.map((q) => [q.question, q.correctAns])
                    );
                }
                // Collapsible answers
                const rows = quiz
                    .map(
                        (q, i) => `
              <article class="quiz-item">
                <h4 id="quiz-q-${i + 1}">Q${i + 1}. ${escapeHtml(q.question)}</h4>
                <details>
                  <summary>Show answer</summary>
                  <p class="answer">${escapeHtml(q.correctAns)}</p>
                </details>
              </article>
            `
                    )
                    .join("");
                return `<div class="quiz-collapsible">${rows}</div>`;
            })()
            : `<p class="muted">No quiz available.</p>`;

    // Optional PrismJS (client-side highlighting)
    const prismAssets = enableHighlighting
        ? `
    <link rel="stylesheet" href="${highlightStyle === "dracula"
            ? "https://unpkg.com/prismjs/themes/prism-tomorrow.css"
            : "https://unpkg.com/prismjs/themes/prism.css"
        }">
    <script defer src="https://unpkg.com/prismjs/components/prism-core.min.js"></script>
    <script defer src="https://unpkg.com/prismjs/plugins/autoloader/prism-autoloader.min.js" data-autoloader-path="https://unpkg.com/prismjs/components/"></script>
  `
        : "";

    // JSON-LD (Course schema)
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": courseTitle,
        "description": description,
        "provider": {
            "@type": "Organization",
            "name": "CheFu Academy",
        },
        "educationalLevel": category || undefined,
    };

    // Final HTML
    return `
  <!doctype html>
  <html lang="en" data-theme="light">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta name="color-scheme" content="light dark">
      <title>${escapeHtml(courseTitle)} ${titleSuffix ? escapeHtml(titleSuffix) : ""}</title>
      <meta name="description" content="${escapeHtml(description)}" />
      <script type="application/ld+json">${escapeHtml(JSON.stringify(jsonLd))}</script>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
      ${prismAssets}
      <style>
        :root {
          --primary: ${THEME.primary};
          --accent: ${THEME.accent};
          --bg: ${THEME.bg};
          --text: ${THEME.text};
          --muted: ${THEME.muted};
          --panel: ${THEME.panel};
          --code-bg: ${THEME.codeBg};
          --code-text: ${THEME.codeText};
          --example-bg: ${THEME.exampleBg};
          --th-bg: ${THEME.tableHeaderBg};
          --th-text: ${THEME.tableHeaderText};
          --watermark: ${THEME.watermark};
          --radius: 10px;
          --shadow: 0 2px 8px rgba(0,0,0,0.06);
          --maxw: 1024px;
        }

        html, body { background: var(--bg); color: var(--text); }
        body {
          font-family: "Inter", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
          margin: 0;
          padding: 32px;
          line-height: 1.6;
          display: flex;
          justify-content: center;
        }
        main {
          width: 100%;
          max-width: var(--maxw);
          position: relative;
        }
        .container { padding: 8px; }

        /* Watermark */
        .watermark {
          position: fixed;
          inset: 0;
          display: ${includeWatermark ? "grid" : "none"};
          place-items: center;
          pointer-events: none;
          user-select: none;
          z-index: -1;
        }
        .watermark span {
          font-size: clamp(3rem, 15vw, 8rem);
          color: var(--watermark);
          transform: rotate(-24deg);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-weight: 700;
        }
        @media print {
          .watermark { display: ${includeWatermark ? "grid" : "none"} !important; }
        }

        header { text-align: center; margin-bottom: 28px; }
        header h1 { font-size: clamp(2rem, 4vw, 2.8rem); color: #1e272e; margin: 0 0 8px; }
        header p { font-size: 1.05rem; color: var(--muted); margin: 0; }

        nav#toc-wrap { background: var(--panel); border-radius: var(--radius); box-shadow: var(--shadow); padding: 20px; margin: 18px 0 26px; }
        h2.section-title {
          margin: 24px 0 12px;
          font-size: 1.6rem;
          color: #2d3436;
          border-left: 6px solid var(--primary);
          padding-left: 10px;
        }

        .intro {
          background: var(--panel);
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          padding: 20px;
          margin-bottom: 20px;
        }
        .meta { display: flex; gap: 12px; flex-wrap: wrap; color: var(--muted); }
        .meta-item { background: white; border: 1px solid #eceef1; border-radius: 999px; padding: 6px 12px; }

        /* TOC */
        ul#toc { list-style: none; padding-left: 0; margin: 0; }
        ul#toc > li { margin: 6px 0; }
        .toc-topics { list-style: disc; margin: 6px 0 0 20px; color: var(--muted); }
        a { color: var(--primary); text-decoration: none; }
        a:hover { text-decoration: underline; }

        /* Chapters & topics */
        .chapter { margin: 22px 0; padding: 20px; background: var(--panel); border-radius: var(--radius); box-shadow: var(--shadow); }
        .chapter h3 { margin: 0 0 12px; font-size: 1.35rem; color: #2d3436; }
        .chapter-counter { color: var(--primary); margin-right: 6px; }

        .topic { margin: 10px 0; }
        .topic details {
          background: white;
          border: 1px solid #e7e9ed;
          border-radius: 8px;
          padding: 10px 12px;
        }
        .topic summary {
          cursor: pointer;
          font-weight: 600;
          color: #2d3436;
          outline: none;
        }
        .topic summary::-webkit-details-marker { display: none; }
        .topic summary::before { content: "▸ "; color: var(--primary); }
        .topic details[open] summary::before { content: "▾ "; }
        .topic-label { color: var(--primary); margin-right: 6px; }
        .topic-body { margin-top: 8px; }
        .muted { color: var(--muted); }

        /* Code & examples */
        pre { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Courier New", monospace; font-size: 0.94rem; border-radius: 6px; overflow-x: auto; }
        .code-block { background: var(--code-bg); color: var(--code-text); border-left: 4px solid var(--accent); padding: 12px; margin: 10px 0; }
        .example { background: var(--example-bg); border-left: 4px solid #ffa502; padding: 12px; color: #2f3640; }

        /* Tables */
        .styled-table { width: 100%; border-collapse: collapse; margin-top: 12px; background: white; border-radius: 8px; overflow: hidden; box-shadow: var(--shadow); }
        .styled-table th, .styled-table td { border: 1px solid #e9ecef; padding: 10px; vertical-align: top; }
        .styled-table th { background: var(--th-bg); color: var(--th-text); font-weight: 600; text-align: left; }
        .styled-table tr:nth-child(even) td { background: #fafbfc; }

        /* Back to top */
        .back-to-top { margin: 8px 0 0; font-size: 0.92rem; }

        /* Footer */
        footer { margin-top: 40px; padding-top: 16px; border-top: 2px solid #eef1f4; text-align: center; font-size: 0.95rem; color: var(--muted); }

        /* Print */
        @media print {
          body { padding: 0; }
          nav#toc-wrap, .back-to-top, .quiz-collapsible details > summary { color: #000; }
          .chapter, .intro { box-shadow: none; }
          .chapter, .intro { break-inside: avoid; page-break-inside: avoid; }
          table { break-inside: avoid; page-break-inside: avoid; }
          h2.section-title { page-break-after: avoid; }
        }

        /* Accessibility helpers */
        .sr-only {
          position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0);
          white-space: nowrap; border: 0;
        }
      </style>
    </head>
    <body>
      <div class="watermark" aria-hidden="true"><span>CheFu Academy</span></div>
      <main>
        <div class="container">
          <header>
            <h1>${escapeHtml(courseTitle)}</h1>
            <p>Presented by CheFu Academy</p>
          </header>

          <section class="intro" aria-labelledby="course-meta">
            <h2 id="course-meta" class="section-title">Course overview</h2>
            <div class="meta" role="list">
              <div class="meta-item" role="listitem"><strong>Category:</strong>&nbsp;${escapeHtml(category)}</div>
            </div>
            <p>${escapeHtml(description)}</p>
          </section>

          <nav id="toc-wrap" aria-label="Table of contents">
            <h2 id="toc" class="section-title">Table of contents</h2>
            <ul id="toc">
              ${tocHtml}
            </ul>
          </nav>

          <section aria-labelledby="chapters">
            <h2 id="chapters" class="section-title">Chapters</h2>
            ${chapterHtml}
          </section>

          <section aria-labelledby="flashcards">
            <h2 id="flashcards" class="section-title">Flashcards</h2>
            ${flashcardHtml}
          </section>

          <section aria-labelledby="qa">
            <h2 id="qa" class="section-title">Q&A</h2>
            ${qaHtml}
          </section>

          <section aria-labelledby="quiz">
            <h2 id="quiz" class="section-title">Quiz</h2>
            ${quizHtml}
          </section>

          <footer role="contentinfo">
            &copy; ${new Date().getFullYear()} CheFu Inc. All rights reserved.
          </footer>
        </div>
      </main>
    </body>
  </html>
  `;
}