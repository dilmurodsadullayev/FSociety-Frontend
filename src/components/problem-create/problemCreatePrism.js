
/**
 * FSociety — Problem Create Prism
 *
 * All grammars are loaded on one Prism instance.
 * Base grammars load before dependent extensions.
 */

const Prism = require("prismjs");

require("prismjs/components/prism-clike");
require("prismjs/components/prism-javascript");
require("prismjs/components/prism-typescript");
require("prismjs/components/prism-css");
require("prismjs/components/prism-python");
require("prismjs/components/prism-java");
require("prismjs/components/prism-c");
require("prismjs/components/prism-cpp");
require("prismjs/components/prism-csharp");

require("prismjs/components/prism-markup-templating");
require("prismjs/components/prism-php");

require("prismjs/components/prism-go");
require("prismjs/components/prism-rust");
require("prismjs/components/prism-dart");
require("prismjs/components/prism-kotlin");
require("prismjs/components/prism-swift");
require("prismjs/components/prism-ruby");
require("prismjs/components/prism-sql");
require("prismjs/components/prism-bash");

const escapeHtml = (value) =>
    String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

export const highlightProblemCode = (
    code,
    language = "clike"
) => {
    const text = String(code ?? "");
    const name = Prism.languages[language] ? language : "clike";
    const grammar = Prism.languages[name];

    if (!grammar) return escapeHtml(text);

    try {
        return Prism.highlight(text, grammar, name);
    } catch (error) {
        console.error("Prism highlighting error:", error);
        return escapeHtml(text);
    }
};
