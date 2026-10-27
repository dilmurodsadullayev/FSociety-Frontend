
import React, { memo } from "react";

import {
    Loader2,
    ShieldCheck,
    Sparkles,
    UserRound,
    X,
} from "lucide-react";

// ============================================================
// EDIT PROFILE HEADER
// ============================================================

const EditProfileHeader = memo(function EditProfileHeader({
    onClose,
    loading = false,
    username = "",
    className = "",
}) {
    const safeUsername = String(username || "")
        .trim()
        .replace(/^@+/, "");

    const handleClose = () => {
        if (loading) return;

        onClose?.();
    };

    return (
        <header
            className={`
                sticky top-0 z-30
                flex min-w-0 items-center
                justify-between gap-3

                border-b border-slate-200/90
                bg-white/95
                px-4 py-3.5

                backdrop-blur-xl
                sm:px-6 sm:py-5

                dark:border-white/[0.08]
                dark:bg-[#0b0f17]/95

                ${className}
            `}
        >
            {/* ==========================================
                HEADER LEFT
            =========================================== */}

            <div
                className="
                    flex min-w-0 flex-1
                    items-center gap-3
                    sm:gap-4
                "
            >
                {/* ICON */}

                <div
                    aria-hidden="true"
                    className="
                        relative grid h-11 w-11
                        shrink-0 place-items-center
                        overflow-hidden rounded-2xl

                        border border-indigo-200
                        bg-indigo-50
                        text-indigo-600

                        sm:h-12 sm:w-12

                        dark:border-indigo-400/20
                        dark:bg-indigo-500/10
                        dark:text-indigo-300
                    "
                >
                    <div
                        className="
                            pointer-events-none
                            absolute -right-3 -top-3
                            h-8 w-8 rounded-full
                            bg-indigo-400/15 blur-xl
                        "
                    />

                    <UserRound
                        size={21}
                        strokeWidth={1.8}
                        className="relative z-10"
                    />

                    <span
                        className="
                            absolute bottom-0 left-0
                            h-[2px] w-full
                            bg-gradient-to-r
                            from-transparent
                            via-indigo-500
                            to-transparent

                            dark:via-indigo-400
                        "
                    />
                </div>

                {/* TITLE AREA */}

                <div className="min-w-0 flex-1">
                    <div
                        className="
                            flex min-w-0
                            items-center gap-2
                        "
                    >
                        <h2
                            id="edit-profile-title"
                            className="
                                min-w-0 truncate
                                font-display
                                text-base font-bold
                                tracking-tight
                                text-slate-900

                                sm:text-xl

                                dark:text-white
                            "
                        >
                            Profilni tahrirlash
                        </h2>

                        <Sparkles
                            size={15}
                            aria-hidden="true"
                            className="
                                hidden shrink-0
                                text-indigo-500

                                sm:block

                                dark:text-indigo-400
                            "
                        />
                    </div>

                    <p
                        id="edit-profile-description"
                        className="
                            mt-0.5
                            truncate text-[11px]
                            leading-5
                            text-slate-500

                            sm:text-xs

                            dark:text-slate-400
                        "
                    >
                        Shaxsiy va kasbiy ma’lumotlaringiz
                    </p>

                    {/* USERNAME */}

                    {safeUsername && (
                        <p
                            className="
                                mt-1 max-w-full
                                truncate font-mono
                                text-[10px]
                                font-medium
                                text-indigo-600

                                dark:text-indigo-400
                            "
                            title={`@${safeUsername}`}
                        >
                            @{safeUsername}
                        </p>
                    )}
                </div>
            </div>

            {/* ==========================================
                HEADER RIGHT
            =========================================== */}

            <div
                className="
                    flex shrink-0
                    items-center gap-2
                "
            >
                {/* SECURITY LABEL */}

                <div
                    className="
                        hidden items-center
                        gap-1.5 rounded-xl
                        border border-emerald-200
                        bg-emerald-50

                        px-3 py-2

                        text-[10px] font-semibold
                        text-emerald-700

                        dark:border-emerald-400/15
                        dark:bg-emerald-400/[0.06]
                        dark:text-emerald-300

                        md:inline-flex
                    "
                    title="Profil ma’lumotlarini tahrirlash"
                >
                    <ShieldCheck
                        size={14}
                        aria-hidden="true"
                    />

                    Profile Settings
                </div>

                {/* CLOSE BUTTON */}

                <button
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    aria-label="Profil tahrirlash oynasini yopish"
                    title={
                        loading
                            ? "Saqlash davom etmoqda"
                            : "Yopish"
                    }
                    className="
                        grid h-10 w-10
                        shrink-0 place-items-center
                        rounded-xl

                        border border-slate-200
                        bg-slate-50
                        text-slate-500

                        transition-all duration-200

                        hover:border-rose-200
                        hover:bg-rose-50
                        hover:text-rose-600

                        focus-visible:outline
                        focus-visible:outline-2
                        focus-visible:outline-offset-2
                        focus-visible:outline-indigo-500

                        disabled:cursor-not-allowed
                        disabled:opacity-40

                        dark:border-white/[0.09]
                        dark:bg-white/[0.035]
                        dark:text-slate-400

                        dark:hover:border-rose-400/20
                        dark:hover:bg-rose-500/10
                        dark:hover:text-rose-300
                    "
                >
                    {loading ? (
                        <Loader2
                            size={18}
                            className="animate-spin"
                            aria-hidden="true"
                        />
                    ) : (
                        <X
                            size={18}
                            aria-hidden="true"
                        />
                    )}
                </button>
            </div>
        </header>
    );
});

export default EditProfileHeader;
