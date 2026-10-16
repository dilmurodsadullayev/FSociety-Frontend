
import React, { memo } from "react";
import { Link } from "react-router-dom";

import {
    Award,
    Check,
    CheckCircle2,
    Clock3,
    Edit3,
    Loader2,
    Sparkles,
    Star,
    UserRound,
} from "lucide-react";

import ProblemSolutionCode from "./ProblemSolutionCode";

import {
    getSolutionImageUrl,
    getSolutionLanguageName,
    getSolutionSkillLevel,
    getSolutionStarCount,
    getSolutionTimeLabel,
    isSolutionAuthor,
    SOLUTION_DEFAULT_AVATAR,
} from "./problemSolutionsHelpers";

// =========================================================
// AUTHOR AVATAR
// =========================================================

const AuthorAvatar = memo(({
    username,
    image,
}) => {
    const handleError = (event) => {
        event.currentTarget.onerror = null;
        event.currentTarget.src = SOLUTION_DEFAULT_AVATAR;
    };

    const avatar = (
        <img
            src={getSolutionImageUrl(image)}
            alt={`${username || "Foydalanuvchi"} avatari`}
            loading="lazy"
            decoding="async"
            onError={handleError}
            className="
                h-11
                w-11
                shrink-0
                rounded-2xl
                border
                border-slate-200
                bg-slate-100
                object-cover

                sm:h-12
                sm:w-12

                dark:border-white/[0.12]
                dark:bg-slate-800
            "
        />
    );

    return username ? (
        <Link
            to={`/${encodeURIComponent(username)}/profile`}
            className="shrink-0"
            aria-label={`@${username} profilini ochish`}
        >
            {avatar}
        </Link>
    ) : avatar;
});

// =========================================================
// LABELS
// =========================================================

const SolutionLabels = memo(({
    index,
    accepted,
    isFresh,
    isAuthor,
}) => (
    <div className="mb-4 flex flex-wrap items-center gap-2">
        <span
            className="
                rounded-full
                border
                border-slate-200
                bg-slate-100
                px-2.5
                py-1
                font-mono
                text-[10px]
                font-bold
                text-slate-600

                dark:border-white/[0.09]
                dark:bg-white/[0.04]
                dark:text-gray-400
            "
        >
            solution #{String(index + 1).padStart(2, "0")}
        </span>

        {accepted && (
            <span
                className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    border
                    border-emerald-300
                    bg-emerald-50
                    px-2.5
                    py-1
                    text-[10px]
                    font-bold
                    text-emerald-800

                    dark:border-emerald-400/25
                    dark:bg-emerald-400/[0.09]
                    dark:text-emerald-300
                "
            >
                <CheckCircle2 size={12} aria-hidden="true" />
                Qabul qilingan yechim
            </span>
        )}

        {isFresh && (
            <span
                className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    border
                    border-cyan-300
                    bg-cyan-50
                    px-2.5
                    py-1
                    text-[10px]
                    font-bold
                    text-cyan-800

                    dark:border-cyan-400/25
                    dark:bg-cyan-400/[0.09]
                    dark:text-cyan-300
                "
            >
                <Sparkles size={12} aria-hidden="true" />
                Yangi
            </span>
        )}

        {isAuthor && (
            <span
                className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    border
                    border-indigo-300
                    bg-indigo-50
                    px-2.5
                    py-1
                    text-[10px]
                    font-bold
                    text-indigo-800

                    dark:border-indigo-400/25
                    dark:bg-indigo-400/[0.09]
                    dark:text-indigo-300
                "
            >
                <UserRound size={12} aria-hidden="true" />
                Sizning yechimingiz
            </span>
        )}
    </div>
));

// =========================================================
// SOLUTION TEXT
// =========================================================

const SolutionText = memo(({
    title,
    children,
    variant = "answer",
}) => {
    const isAnswer = variant === "answer";

    return (
        <section
            className={`
                mt-4
                min-w-0
                rounded-2xl
                border
                p-4

                sm:p-5

                ${
                    isAnswer
                        ? `
                            border-slate-200
                            bg-slate-50

                            dark:border-white/[0.09]
                            dark:bg-white/[0.03]
                        `
                        : `
                            border-indigo-200
                            bg-indigo-50/60

                            dark:border-indigo-400/15
                            dark:bg-indigo-400/[0.05]
                        `
                }
            `}
        >
            <p
                className="
                    mb-2
                    inline-flex
                    items-center
                    gap-2
                    font-mono
                    text-[10px]
                    font-black
                    uppercase
                    tracking-wide
                    text-indigo-700

                    dark:text-indigo-300
                "
            >
                {isAnswer ? (
                    <Check size={13} aria-hidden="true" />
                ) : (
                    <Sparkles size={13} aria-hidden="true" />
                )}

                {title}
            </p>

            <p
                className="
                    whitespace-pre-wrap
                    break-words
                    [overflow-wrap:anywhere]
                    text-sm
                    font-medium
                    leading-7
                    text-slate-700

                    dark:text-gray-300
                "
            >
                {children}
            </p>
        </section>
    );
});

// =========================================================
// MAIN CARD
// =========================================================

const ProblemSolutionCard = ({
    response,
    index = 0,
    problemId,
    authUser,
    isOwner = false,
    isSolved = false,
    isFresh = false,
    isStarLoading = false,
    onAcceptSolution,
    onStar,
    onCopyCode,
}) => {
    if (!response || typeof response !== "object") {
        return null;
    }

    const responseId = response.id;
    const user = response.user || {};

    const username = user.username || "";
    const accepted = Boolean(response.is_selected);
    const author = isSolutionAuthor(response, authUser);

    const starred = Boolean(response.star_by_user);
    const starCount = getSolutionStarCount(response);
    const timeLabel = getSolutionTimeLabel(response.created_at);

    const canAccept =
        Boolean(isOwner) &&
        !isSolved &&
        !accepted &&
        responseId != null &&
        typeof onAcceptSolution === "function";

    const canEdit =
        author &&
        !isSolved &&
        problemId != null &&
        responseId != null;

    const cardColor = accepted
        ? `
            border-emerald-300
            bg-emerald-50/40

            dark:border-emerald-400/25
            dark:bg-emerald-400/[0.045]
        `
        : isFresh
            ? `
                border-cyan-300
                bg-cyan-50/40

                dark:border-cyan-400/25
                dark:bg-cyan-400/[0.045]
            `
            : `
                border-slate-200
                bg-white

                hover:border-indigo-200

                dark:border-white/[0.09]
                dark:bg-white/[0.025]
                dark:hover:border-white/[0.15]
            `;

    return (
        <article
            className={`
                group
                relative
                min-w-0
                overflow-hidden
                rounded-[22px]
                border
                p-4
                shadow-[0_12px_35px_rgba(15,23,42,0.035)]
                transition-colors

                sm:rounded-[26px]
                sm:p-5

                dark:shadow-[0_15px_45px_rgba(0,0,0,0.12)]

                ${cardColor}
            `}
        >
            {accepted && (
                <div
                    aria-hidden="true"
                    className="
                        absolute
                        inset-x-0
                        top-0
                        h-[2px]
                        bg-gradient-to-r
                        from-emerald-500
                        via-cyan-500/60
                        to-transparent
                    "
                />
            )}

            <SolutionLabels
                index={index}
                accepted={accepted}
                isFresh={isFresh}
                isAuthor={author}
            />

            {/* AUTHOR AND ACTIONS */}

            <div
                className="
                    flex
                    min-w-0
                    flex-col
                    gap-4

                    sm:flex-row
                    sm:items-start
                    sm:justify-between
                "
            >
                <div className="flex min-w-0 items-center gap-3">
                    <AuthorAvatar
                        username={username}
                        image={user.image}
                    />

                    <div className="min-w-0">
                        {username ? (
                            <Link
                                to={`/${encodeURIComponent(username)}/profile`}
                                className="
                                    block
                                    truncate
                                    font-bold
                                    text-slate-900
                                    hover:text-cyan-700

                                    dark:text-white
                                    dark:hover:text-cyan-300
                                "
                            >
                                @{username}
                            </Link>
                        ) : (
                            <p className="font-bold text-slate-900 dark:text-white">
                                Noma’lum developer
                            </p>
                        )}

                        <div
                            className="
                                mt-1
                                flex
                                flex-wrap
                                items-center
                                gap-x-2
                                gap-y-1
                                text-[10px]
                                font-medium
                                text-slate-500

                                dark:text-gray-400
                            "
                        >
                            <span>
                                {getSolutionSkillLevel(
                                    user.skill_level
                                )}
                            </span>

                            <span aria-hidden="true">•</span>

                            <span className="inline-flex items-center gap-1">
                                <Clock3 size={12} aria-hidden="true" />
                                {timeLabel}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {canAccept && (
                        <button
                            type="button"
                            onClick={() =>
                                onAcceptSolution(responseId)
                            }
                            className="
                                inline-flex
                                min-h-10
                                items-center
                                gap-2
                                rounded-xl
                                border
                                border-emerald-300
                                bg-emerald-50
                                px-3
                                py-2
                                text-[11px]
                                font-bold
                                text-emerald-800

                                hover:bg-emerald-100
                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-emerald-500

                                dark:border-emerald-400/25
                                dark:bg-emerald-400/[0.09]
                                dark:text-emerald-300
                            "
                        >
                            <Award size={15} aria-hidden="true" />
                            Qabul qilish
                        </button>
                    )}

                    {canEdit && (
                        <Link
                            to={`/problem/${encodeURIComponent(
                                problemId
                            )}/solution/${encodeURIComponent(
                                responseId
                            )}/edit`}
                            className="
                                inline-flex
                                min-h-10
                                items-center
                                gap-2
                                rounded-xl
                                border
                                border-indigo-200
                                bg-indigo-50
                                px-3
                                py-2
                                text-[11px]
                                font-bold
                                text-indigo-800

                                hover:bg-indigo-100
                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-indigo-500

                                dark:border-indigo-400/25
                                dark:bg-indigo-400/[0.09]
                                dark:text-indigo-300
                            "
                        >
                            <Edit3 size={14} aria-hidden="true" />
                            Tahrirlash
                        </Link>
                    )}
                </div>
            </div>

            {/* ANSWER */}

            <SolutionText title="Qisqa yechim">
                {response.answer || "Yechim matni kiritilmagan."}
            </SolutionText>

            {/* DESCRIPTION */}

            {response.description && (
                <SolutionText
                    title="Batafsil tushuntirish"
                    variant="description"
                >
                    {response.description}
                </SolutionText>
            )}

            {/* CODE */}

            <ProblemSolutionCode
                code={response.code}
                languageName={
                    getSolutionLanguageName(response)
                }
                onCopy={onCopyCode}
            />

            {/* FOOTER */}

            <footer
                className="
                    mt-5
                    flex
                    min-w-0
                    flex-wrap
                    items-center
                    justify-between
                    gap-3
                    border-t
                    border-slate-200
                    pt-4

                    dark:border-white/[0.09]
                "
            >
                <button
                    type="button"
                    onClick={() => onStar?.(responseId)}
                    disabled={
                        isStarLoading ||
                        responseId == null ||
                        typeof onStar !== "function"
                    }
                    aria-pressed={starred}
                    aria-label={
                        starred
                            ? "Yechimdan starni olib tashlash"
                            : "Yechimga star berish"
                    }
                    className={`
                        inline-flex
                        min-h-10
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border
                        px-3
                        py-2
                        text-[11px]
                        font-bold

                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-amber-500

                        disabled:cursor-not-allowed
                        disabled:opacity-50

                        ${
                            starred
                                ? `
                                    border-amber-300
                                    bg-amber-50
                                    text-amber-800

                                    dark:border-amber-400/25
                                    dark:bg-amber-400/10
                                    dark:text-amber-300
                                `
                                : `
                                    border-slate-200
                                    bg-slate-50
                                    text-slate-600

                                    hover:border-amber-300

                                    dark:border-white/[0.10]
                                    dark:bg-white/[0.04]
                                    dark:text-gray-300
                                `
                        }
                    `}
                >
                    {isStarLoading ? (
                        <Loader2
                            size={15}
                            aria-hidden="true"
                            className="animate-spin motion-reduce:animate-none"
                        />
                    ) : (
                        <Star
                            size={15}
                            aria-hidden="true"
                            className={starred ? "fill-current" : ""}
                        />
                    )}

                    {starred ? "Star berilgan" : "Star berish"}

                    <span
                        className="
                            rounded-full
                            border
                            border-current/10
                            px-2
                            py-0.5
                            text-[10px]
                            tabular-nums
                        "
                    >
                        {starCount.toLocaleString("uz-UZ")}
                    </span>
                </button>

                <span
                    className="
                        inline-flex
                        items-center
                        gap-1.5
                        text-[11px]
                        font-medium
                        text-slate-500

                        dark:text-gray-400
                    "
                >
                    <Clock3 size={13} aria-hidden="true" />
                    {timeLabel}
                </span>
            </footer>
        </article>
    );
};

export default memo(ProblemSolutionCard);
