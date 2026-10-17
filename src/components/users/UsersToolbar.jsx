import React, { memo } from "react";

import {
    Search,
    SlidersHorizontal,
    X,
} from "lucide-react";

import {
    USER_FILTERS,
    USERS_PER_PAGE,
} from "./usersHelpers";

const UsersToolbar = ({
    searchTerm = "",
    filter = "Reyting",
    currentPage = 1,
    totalPages = 1,
    visibleCount = 0,
    totalUsersCount = 0,
    isLoading = false,
    onSearchChange,
    onFilterChange,
}) => (
    <section
        aria-label="Foydalanuvchilarni qidirish va saralash"
        className="mx-auto mb-9 w-full max-w-5xl sm:mb-11"
    >
        <div
            className="
                relative overflow-hidden rounded-[24px]
                border border-slate-200 bg-white/95 p-4
                shadow-[0_15px_45px_rgba(15,23,42,0.05)]
                sm:p-5 dark:border-white/[0.09]
                dark:bg-[#0e1421]/95
                dark:shadow-[0_20px_55px_rgba(0,0,0,0.17)]
            "
        >
            <div className="relative grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                <div className="min-w-0">
                    <label
                        htmlFor="users-search"
                        className="
                            mb-2 block text-xs font-black
                            text-slate-700 dark:text-slate-300
                        "
                    >
                        Foydalanuvchi qidirish
                    </label>

                    <div className="relative">
                        <Search
                            size={18}
                            aria-hidden="true"
                            className="
                                pointer-events-none absolute left-4 top-1/2
                                -translate-y-1/2 text-slate-400
                                dark:text-slate-500
                            "
                        />

                        <input
                            id="users-search"
                            type="search"
                            autoComplete="off"
                            value={searchTerm}
                            onChange={(event) =>
                                onSearchChange(event.target.value)
                            }
                            placeholder="Username, ism yoki ko‘nikma..."
                            className="
                                min-h-12 w-full rounded-2xl
                                border border-slate-200 bg-slate-50
                                py-3 pl-11 pr-11 text-sm
                                font-medium text-slate-900 outline-none
                                placeholder:text-slate-400
                                focus:border-indigo-400
                                focus:ring-4 focus:ring-indigo-500/10
                                dark:border-white/10 dark:bg-[#090f1b]
                                dark:text-white dark:placeholder:text-slate-500
                            "
                        />

                        {searchTerm && (
                            <button
                                type="button"
                                aria-label="Qidiruvni tozalash"
                                onClick={() => onSearchChange("")}
                                className="
                                    absolute right-2 top-1/2
                                    grid h-9 w-9 -translate-y-1/2
                                    place-items-center rounded-xl
                                    text-slate-500 hover:bg-slate-200
                                    focus-visible:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-indigo-500
                                    dark:hover:bg-white/10
                                "
                            >
                                <X size={16} aria-hidden="true" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="min-w-0">
                    <p
                        className="
                            mb-2 flex items-center gap-2 text-xs
                            font-black text-slate-700 dark:text-slate-300
                        "
                    >
                        <SlidersHorizontal size={15} aria-hidden="true" />
                        Saralash
                    </p>

                    <div
                        role="group"
                        aria-label="Foydalanuvchilar saralash turi"
                        className="
                            grid grid-cols-3 gap-1.5 rounded-2xl
                            border border-slate-200 bg-slate-100 p-1.5
                            dark:border-white/[0.08] dark:bg-[#090f1b]
                        "
                    >
                        {USER_FILTERS.map((item) => (
                            <button
                                key={item}
                                type="button"
                                aria-pressed={filter === item}
                                onClick={() => onFilterChange(item)}
                                className={`
                                    min-h-10 rounded-xl px-3 py-2
                                    text-xs font-black transition-colors
                                    focus-visible:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-indigo-500
                                    sm:min-w-24

                                    ${
                                        filter === item
                                            ? `
                                                bg-indigo-600 text-white
                                                shadow-md shadow-indigo-600/20
                                            `
                                            : `
                                                text-slate-600
                                                hover:bg-white
                                                dark:text-slate-400
                                                dark:hover:bg-white/[0.07]
                                            `
                                    }
                                `}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div
                className="
                    mt-4 flex flex-wrap items-center
                    justify-center gap-x-3 gap-y-2
                    border-t border-slate-200 pt-4
                    text-xs font-medium text-slate-500
                    dark:border-white/[0.08] dark:text-slate-400
                "
            >
                <span>
                    Sahifa:{" "}
                    <strong className="text-indigo-700 dark:text-indigo-300">
                        {currentPage}
                    </strong>
                    {" / "}{totalPages}
                </span>

                <span aria-hidden="true">•</span>

                <span>
                    Ko‘rsatilmoqda:{" "}
                    <strong className="text-indigo-700 dark:text-indigo-300">
                        {isLoading ? "…" : visibleCount}
                    </strong>
                    {" / "}{USERS_PER_PAGE}
                </span>

                {searchTerm.trim() && (
                    <>
                        <span aria-hidden="true">•</span>
                        <span>
                            Natijalar:{" "}
                            <strong className="text-indigo-700 dark:text-indigo-300">
                                {isLoading ? "…" : totalUsersCount}
                            </strong>
                        </span>
                    </>
                )}
            </div>
        </div>
    </section>
);

export default memo(UsersToolbar);