
import React, {
    memo,
    useEffect,
    useRef,
    useState,
} from "react";

import {
    Check,
    Clipboard,
    Code2,
    Loader2,
    Terminal,
} from "lucide-react";

const ProblemSolutionCode = ({
    code = "",
    languageName = "Kod",
    onCopy,
}) => {
    const [copied, setCopied] = useState(false);
    const [copying, setCopying] = useState(false);

    const timerRef = useRef(null);
    const copyingRef = useRef(false);
    const mountedRef = useRef(false);

    useEffect(() => {
        mountedRef.current = true;

        return () => {
            mountedRef.current = false;

            if (timerRef.current !== null) {
                window.clearTimeout(timerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        setCopied(false);

        if (timerRef.current !== null) {
            window.clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, [code]);

    if (typeof code !== "string" || !code) {
        return null;
    }

    const handleCopy = async () => {
        if (
            copyingRef.current ||
            typeof onCopy !== "function"
        ) {
            return;
        }

        copyingRef.current = true;
        setCopying(true);

        try {
            const successful = await onCopy(code);

            if (!mountedRef.current) return;

            if (successful) {
                setCopied(true);

                if (timerRef.current !== null) {
                    window.clearTimeout(timerRef.current);
                }

                timerRef.current = window.setTimeout(() => {
                    if (mountedRef.current) {
                        setCopied(false);
                    }
                    timerRef.current = null;
                }, 2000);
            }
        } finally {
            copyingRef.current = false;

            if (mountedRef.current) {
                setCopying(false);
            }
        }
    };

    return (
        <section
            aria-label="Yechim kodi"
            className="
                mt-4
                min-w-0
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-slate-50

                dark:border-white/[0.09]
                dark:bg-[#080e19]
            "
        >
            {/* EDITOR HEADER */}

            <div
                className="
                    flex
                    flex-wrap
                    items-center
                    justify-between
                    gap-3
                    border-b
                    border-slate-200
                    bg-white/70
                    px-4
                    py-3

                    dark:border-white/[0.08]
                    dark:bg-white/[0.035]
                "
            >
                <div className="flex min-w-0 items-center gap-3">
                    <div
                        aria-hidden="true"
                        className="flex shrink-0 items-center gap-1.5"
                    >
                        <span className="h-2 w-2 rounded-full bg-rose-400" />
                        <span className="h-2 w-2 rounded-full bg-amber-400" />
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    </div>

                    <div className="h-4 w-px bg-slate-200 dark:bg-white/10" />

                    <Terminal
                        size={14}
                        aria-hidden="true"
                        className="shrink-0 text-indigo-600 dark:text-indigo-400"
                    />

                    <span
                        className="
                            min-w-0
                            truncate
                            font-mono
                            text-[11px]
                            font-bold
                            text-slate-600
                            dark:text-gray-300
                        "
                    >
                        {languageName}
                    </span>
                </div>

                <button
                    type="button"
                    onClick={handleCopy}
                    disabled={
                        copying ||
                        typeof onCopy !== "function"
                    }
                    aria-label="Yechim kodini nusxalash"
                    className={`
                        inline-flex
                        min-h-9
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border
                        px-3
                        py-2
                        text-[11px]
                        font-bold
                        transition-colors

                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-indigo-500

                        disabled:cursor-not-allowed
                        disabled:opacity-50

                        ${
                            copied
                                ? `
                                    border-emerald-300
                                    bg-emerald-50
                                    text-emerald-700

                                    dark:border-emerald-400/25
                                    dark:bg-emerald-400/10
                                    dark:text-emerald-300
                                `
                                : `
                                    border-indigo-200
                                    bg-indigo-50
                                    text-indigo-700

                                    hover:bg-indigo-100

                                    dark:border-indigo-400/25
                                    dark:bg-indigo-400/10
                                    dark:text-indigo-300
                                `
                        }
                    `}
                >
                    {copying ? (
                        <Loader2
                            size={14}
                            aria-hidden="true"
                            className="animate-spin motion-reduce:animate-none"
                        />
                    ) : copied ? (
                        <Check size={14} aria-hidden="true" />
                    ) : (
                        <Clipboard size={14} aria-hidden="true" />
                    )}

                    {copying
                        ? "Nusxalanmoqda..."
                        : copied
                            ? "Nusxalandi"
                            : "Nusxalash"}
                </button>
            </div>

            {/* CODE */}

            <pre
                tabIndex={0}
                className="
                    max-h-[430px]
                    w-full
                    overflow-auto
                    overscroll-contain
                    p-4
                    font-mono
                    text-xs
                    leading-6
                    text-slate-800

                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-inset
                    focus-visible:ring-indigo-500

                    sm:p-5
                    sm:text-[13px]

                    dark:text-slate-200
                "
            >
                <code>{code}</code>
            </pre>

            {/* CODE FOOTER */}

            <div
                className="
                    flex
                    flex-wrap
                    items-center
                    justify-between
                    gap-2
                    border-t
                    border-slate-200
                    px-4
                    py-2.5

                    dark:border-white/[0.08]
                "
            >
                <span
                    className="
                        inline-flex
                        items-center
                        gap-1.5
                        font-mono
                        text-[10px]
                        font-bold
                        uppercase
                        text-slate-500

                        dark:text-gray-400
                    "
                >
                    <Code2 size={13} aria-hidden="true" />
                    Solution code
                </span>

                <span
                    className="
                        font-mono
                        text-[10px]
                        text-slate-500
                        dark:text-gray-400
                    "
                >
                    {code.length} chars
                </span>
            </div>
        </section>
    );
};

export default memo(ProblemSolutionCode);
