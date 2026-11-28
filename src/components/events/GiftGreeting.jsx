import React from "react";

export default function GiftGreeting({ greeting, kind = "seasonal" }) {
    const title = typeof greeting?.title === "string" ? greeting.title : null;
    const message = typeof greeting?.message === "string" ? greeting.message : null;
    if (!title && !message) return null;
    return (
        <div className={`mt-4 rounded-2xl border p-4 ${kind === "daily"
            ? "border-cyan-300/30 bg-cyan-500/10 text-cyan-900 dark:text-cyan-100"
            : "border-fuchsia-300/30 bg-fuchsia-500/10 text-fuchsia-900 dark:text-fuchsia-100"}`}>
            {title && <p className="break-words font-bold">{title}</p>}
            {message && <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6">{message}</p>}
        </div>
    );
}
