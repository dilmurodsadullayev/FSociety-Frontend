
import React, { memo, useId } from "react";
import { Sparkles } from "lucide-react";

const EditProfileSection = memo(function EditProfileSection({
    Icon,
    title,
    description,
    code,
    children,
    columns = 2,
    className = "",
    contentClassName = "",
}) {
    const titleId = useId();

    const gridClass =
        columns === 1
            ? "grid-cols-1"
            : "grid-cols-1 md:grid-cols-2";

    return (
        <section
            aria-labelledby={titleId}
            className={`
                relative min-w-0 overflow-hidden
                rounded-2xl sm:rounded-[24px]
                border border-slate-200/90
                bg-white/90
                p-4 sm:p-5 md:p-6
                shadow-sm shadow-slate-900/5
                transition-colors duration-200

                dark:border-white/[0.08]
                dark:bg-[#10141d]/90
                dark:shadow-black/10

                ${className}
            `}
        >
            {/* Decorative glow */}
            <div
                aria-hidden="true"
                className="
                    pointer-events-none absolute
                    -right-14 -top-14
                    h-36 w-36 rounded-full
                    bg-indigo-500/[0.045] blur-3xl
                    dark:bg-indigo-400/[0.06]
                "
            />

            {/* Section heading */}
            <div className="relative mb-5 flex min-w-0 items-start gap-3 sm:mb-6">
                {Icon && (
                    <div
                        aria-hidden="true"
                        className="
                            grid h-10 w-10 shrink-0
                            place-items-center
                            rounded-xl
                            border border-indigo-200
                            bg-indigo-50
                            text-indigo-600

                            dark:border-indigo-400/15
                            dark:bg-indigo-400/[0.08]
                            dark:text-indigo-300
                        "
                    >
                        <Icon size={19} strokeWidth={1.9} />
                    </div>
                )}

                <div className="min-w-0 flex-1">
                    {code && (
                        <p
                            className="
                                mb-1 flex items-center gap-1.5
                                font-mono text-[10px]
                                font-semibold uppercase
                                tracking-[0.14em]
                                text-indigo-600/80
                                dark:text-indigo-300/75
                            "
                        >
                            <Sparkles size={11} aria-hidden="true" />
                            {code}
                        </p>
                    )}

                    <h3
                        id={titleId}
                        className="
                            break-words font-sans
                            text-sm font-bold
                            leading-6 text-slate-900
                            sm:text-base

                            dark:text-slate-100
                        "
                    >
                        {title}
                    </h3>

                    {description && (
                        <p
                            className="
                                mt-0.5 text-xs
                                leading-5 text-slate-500
                                sm:text-[13px]

                                dark:text-slate-400
                            "
                        >
                            {description}
                        </p>
                    )}
                </div>
            </div>

            {/* Responsive section fields */}
            <div
                className={`
                    relative grid min-w-0
                    gap-x-4 gap-y-5
                    sm:gap-x-5 sm:gap-y-5

                    ${gridClass}
                    ${contentClassName}
                `}
            >
                {children}
            </div>
        </section>
    );
});

export default EditProfileSection;
