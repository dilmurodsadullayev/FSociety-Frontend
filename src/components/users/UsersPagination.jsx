import React, { memo, useMemo } from "react";

import {
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import {
    getUserPageNumbers,
} from "./usersHelpers";

const BASE_BUTTON = `
    grid h-10 min-w-10 place-items-center rounded-xl
    border text-xs font-black transition-colors
    focus-visible:outline-none focus-visible:ring-2
    focus-visible:ring-indigo-500
    disabled:cursor-not-allowed disabled:opacity-35
    sm:h-11 sm:min-w-11
`;

const UsersPagination = ({
    currentPage = 1,
    totalPages = 1,
    hasPrevious = false,
    hasNext = false,
    onPageChange,
    onPrevious,
    onNext,
}) => {
    const pageNumbers = useMemo(
        () => getUserPageNumbers(currentPage, totalPages),
        [currentPage, totalPages]
    );

    if (totalPages <= 1) return null;

    return (
        <nav
            aria-label="Foydalanuvchilar sahifalari"
            className="
                mt-12 flex flex-wrap items-center
                justify-center gap-2 sm:mt-16
            "
        >
            <button
                type="button"
                aria-label="Oldingi sahifa"
                onClick={onPrevious}
                disabled={!hasPrevious || currentPage <= 1}
                className={`
                    ${BASE_BUTTON}
                    border-slate-200 bg-white text-indigo-700
                    hover:bg-indigo-50
                    dark:border-white/10 dark:bg-[#111827]
                    dark:text-indigo-300 dark:hover:bg-white/[0.06]
                `}
            >
                <ChevronLeft size={18} aria-hidden="true" />
            </button>

            <div className="flex flex-wrap items-center justify-center gap-1.5">
                {pageNumbers.map((page, index) => {
                    if (typeof page !== "number") {
                        return (
                            <span
                                key={`dots-${index}`}
                                aria-hidden="true"
                                className="
                                    grid h-10 min-w-6 place-items-center
                                    text-xs text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                …
                            </span>
                        );
                    }

                    const active = page === currentPage;

                    return (
                        <button
                            key={page}
                            type="button"
                            aria-label={`${page}-sahifa`}
                            aria-current={active ? "page" : undefined}
                            onClick={() => onPageChange(page)}
                            className={`
                                ${BASE_BUTTON}
                                ${
                                    active
                                        ? `
                                            border-indigo-600 bg-indigo-600
                                            text-white shadow-md
                                            shadow-indigo-500/20
                                        `
                                        : `
                                            border-slate-200 bg-white
                                            text-slate-600 hover:border-indigo-300
                                            hover:text-indigo-700
                                            dark:border-white/10
                                            dark:bg-[#111827]
                                            dark:text-slate-300
                                            dark:hover:text-white
                                        `
                                }
                            `}
                        >
                            {page}
                        </button>
                    );
                })}
            </div>

            <button
                type="button"
                aria-label="Keyingi sahifa"
                onClick={onNext}
                disabled={!hasNext || currentPage >= totalPages}
                className={`
                    ${BASE_BUTTON}
                    border-slate-200 bg-white text-indigo-700
                    hover:bg-indigo-50
                    dark:border-white/10 dark:bg-[#111827]
                    dark:text-indigo-300 dark:hover:bg-white/[0.06]
                `}
            >
                <ChevronRight size={18} aria-hidden="true" />
            </button>
        </nav>
    );
};

export default memo(UsersPagination);