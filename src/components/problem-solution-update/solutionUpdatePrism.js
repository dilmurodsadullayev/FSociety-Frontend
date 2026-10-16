
// =========================================================
// FSOCIETY — SOLUTION UPDATE PRISM
//
// Use one Prism instance.
//
// Important:
// PrismJS base languages must exist before
// JSX / TSX extensions are registered.
//
// CommonJS require() calls are intentionally
// executed in dependency order.
// =========================================================

import "prismjs/themes/prism-dark.css";

const Prism = require("prismjs");

// =========================================================
// EXTENDED GRAMMARS
// =========================================================

// JavaScript is loaded by the main prismjs package.

require("prismjs/components/prism-typescript");
require("prismjs/components/prism-jsx");
require("prismjs/components/prism-tsx");

require("prismjs/components/prism-python");
require("prismjs/components/prism-java");

require("prismjs/components/prism-c");
require("prismjs/components/prism-cpp");
require("prismjs/components/prism-csharp");

require("prismjs/components/prism-sql");
require("prismjs/components/prism-bash");
require("prismjs/components/prism-json");

require("prismjs/components/prism-go");
require("prismjs/components/prism-rust");

require("prismjs/components/prism-markup-templating");
require("prismjs/components/prism-php");

// =========================================================
// FALLBACK HTML ESCAPING
// =========================================================

const escapeHtml = (value) =>
    String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

// =========================================================
// HIGHLIGHT
// =========================================================

export const highlightSolutionUpdateCode = (
    code,
    language = "javascript"
) => {
    const source = String(code ?? "");

    const grammar =
        Prism.languages[language] ||
        Prism.languages.javascript ||
        Prism.languages.clike;

    if (!grammar) {
        return escapeHtml(source);
    }

    try {
        return Prism.highlight(
            source,
            grammar,
            Prism.languages[language]
                ? language
                : "javascript"
        );
    } catch (error) {
        console.error(
            "Solution syntax highlight xatosi:",
            error
        );

        return escapeHtml(source);
    }
};

export default Prism;
