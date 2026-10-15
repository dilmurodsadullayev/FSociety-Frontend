
import React, {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    MessageCircle,
    Sparkles,
} from "lucide-react";

// =========================================================
// REDUX ACTIONS
// =========================================================

import {
    getCommentStart,
    getCommentSuccess,
} from "../features/comments/Comment";

// =========================================================
// SERVICE
// =========================================================

import CommentService from "../services/comments";

// =========================================================
// COMPONENTS
// =========================================================

import CommentComposer from "./comment-section/CommentComposer";

import CommentItem from "./comment-section/CommentItem";

import {
    CommentsSkeleton,
    CommentsErrorState,
    EmptyComments,
} from "./comment-section/CommentStates";

// =========================================================
// UTILS
// =========================================================

import {
    getCommentErrorMessage,
} from "./comment-section/commentUtils";

// =========================================================
// FSOCIETY — COMMENT SECTION
//
// Responsibilities:
//
// - Redux comments
// - Fetch comments
// - Handle API errors
// - Refresh comments after submit
// - Authenticated / guest composer
// - Render comment list
//
// Dark / Light Mode
// Responsive 320px+
//
// Existing Redux and CommentService contracts preserved.
// =========================================================

const CommentSection = () => {
    const dispatch = useDispatch();

    // =====================================================
    // REDUX
    // =====================================================

    const isLoggedIn = useSelector(
        (state) => Boolean(state.auth?.isLoggedIn)
    );

    const {
        comments,
        isLoading = false,
    } = useSelector(
        (state) => state.comment || {}
    );

    // =====================================================
    // LOCAL STATE
    // =====================================================

    const [error, setError] = useState(null);

    // =====================================================
    // SAFE COMMENTS
    // =====================================================

    const safeComments = Array.isArray(comments)
        ? comments
        : [];

    // =====================================================
    // FETCH COMMENTS
    // =====================================================

    const getComments = useCallback(
        async () => {
            setError(null);

            dispatch(
                getCommentStart()
            );

            try {
                const response =
                    await CommentService.getComments();

                dispatch(
                    getCommentSuccess(response)
                );
            } catch (requestError) {
                console.error(
                    "Commentlarni olishda xato:",
                    requestError
                );

                setError(
                    getCommentErrorMessage(requestError)
                );
            }
        },
        [dispatch]
    );

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {
        getComments();
    }, [getComments]);

    // =====================================================
    // JSX
    // =====================================================

    return (
        <section
            id="feedback"
            aria-labelledby="fsociety-comments-title"

            className="
                relative
                min-w-0
                overflow-hidden

                py-2

                sm:py-4
            "
        >
            {/* ======================================
                BACKGROUND ACCENTS
            ====================================== */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    left-1/2
                    top-0

                    hidden
                    h-64
                    w-64

                    -translate-x-1/2

                    rounded-full
                    bg-indigo-500/[0.045]

                    blur-3xl

                    sm:block

                    dark:bg-indigo-500/[0.07]
                "
            />

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    bottom-0
                    right-0

                    hidden
                    h-64
                    w-64

                    rounded-full
                    bg-pink-500/[0.035]

                    blur-3xl

                    sm:block

                    dark:bg-pink-500/[0.06]
                "
            />

            {/* ======================================
                CONTENT
            ====================================== */}

            <div
                className="
                    relative
                    z-10

                    mx-auto
                    w-full
                    min-w-0
                    max-w-5xl
                "
            >
                {/* ==================================
                    SECTION HEADER
                ================================== */}

                <div
                    className="
                        mx-auto
                        mb-9
                        max-w-3xl
                        text-center

                        sm:mb-11
                    "
                >
                    {/* COMMUNITY BADGE */}

                    <span
                        className="
                            inline-flex
                            max-w-full
                            items-center
                            gap-2

                            rounded-full
                            border
                            border-indigo-400/25

                            bg-indigo-500/[0.07]

                            px-3
                            py-1.5

                            text-[10px]
                            font-black
                            uppercase
                            tracking-[0.1em]

                            text-indigo-700

                            sm:px-4
                            sm:py-2
                            sm:text-xs

                            dark:border-indigo-400/20
                            dark:bg-indigo-500/10
                            dark:text-indigo-300
                        "
                    >
                        <Sparkles
                            size={15}
                            strokeWidth={2}
                            aria-hidden="true"
                            className="shrink-0"
                        />

                        FSociety Community
                    </span>

                    {/* TITLE */}

                    <h2
                        id="fsociety-comments-title"

                        className="
                            mt-5

                            text-[27px]
                            font-black
                            leading-tight
                            tracking-[-0.04em]

                            text-slate-900

                            sm:text-4xl

                            lg:text-[42px]

                            dark:text-white
                        "
                    >
                        Hamjamiyatimiz{" "}

                        <span
                            className="
                                bg-gradient-to-r

                                from-cyan-600
                                via-indigo-600
                                to-fuchsia-600

                                bg-clip-text
                                text-transparent

                                dark:from-cyan-300
                                dark:via-indigo-300
                                dark:to-fuchsia-300
                            "
                        >
                            biz haqimizda
                        </span>
                    </h2>

                    {/* DESCRIPTION */}

                    <p
                        className="
                            mx-auto
                            mt-4
                            max-w-2xl

                            text-[13px]
                            font-medium
                            leading-6

                            text-slate-600

                            sm:text-sm
                            sm:leading-7

                            dark:text-gray-400
                        "
                    >
                        Platformamiz foydalanuvchilarining
                        fikrlari biz uchun eng muhim rag‘bat.
                        O‘z tajribangiz bilan bo‘lishing va
                        FSociety rivojiga hissa qo‘shing.
                    </p>
                </div>

                {/* ==================================
                    COMMENT COMPOSER
                ================================== */}

                <CommentComposer
                    isLoggedIn={isLoggedIn}
                    onSuccess={getComments}
                />

                {/* ==================================
                    COMMENTS LIST
                ================================== */}

                <div
                    className="
                        mx-auto
                        w-full
                        min-w-0
                        max-w-3xl
                    "
                >
                    {/* LIST HEADER */}

                    <div
                        className="
                            mb-5

                            flex
                            min-w-0
                            items-start
                            justify-between
                            gap-3

                            sm:items-center
                        "
                    >
                        <div className="min-w-0">
                            <h3
                                className="
                                    text-base
                                    font-black
                                    text-slate-900

                                    sm:text-xl

                                    dark:text-white
                                "
                            >
                                Foydalanuvchilar fikrlari
                            </h3>

                            <p
                                className="
                                    mt-1
                                    text-[11px]
                                    font-medium
                                    text-slate-500

                                    sm:text-xs

                                    dark:text-gray-500
                                "
                            >
                                So‘nggi izohlar va taassurotlar
                            </p>
                        </div>

                        {/* COMMENTS COUNT */}

                        <span
                            className="
                                inline-flex
                                shrink-0
                                items-center
                                gap-1.5

                                rounded-full
                                border
                                border-indigo-400/25

                                bg-indigo-500/[0.08]

                                px-2.5
                                py-1.5

                                font-mono
                                text-[10px]
                                font-bold

                                text-indigo-700

                                sm:px-3

                                dark:border-indigo-400/20
                                dark:bg-indigo-500/10
                                dark:text-indigo-300
                            "
                        >
                            <MessageCircle
                                size={12}
                                strokeWidth={2}
                                aria-hidden="true"
                            />

                            {safeComments.length} ta
                        </span>
                    </div>

                    {/* ==================================
                        COMMENTS CONTENT
                    ================================== */}

                    {error ? (
                        // Error takes priority over Redux
                        // loading to avoid a stuck skeleton.
                        <CommentsErrorState
                            message={error}
                            onRetry={getComments}
                        />
                    ) : isLoading ? (
                        <CommentsSkeleton />
                    ) : safeComments.length === 0 ? (
                        <EmptyComments />
                    ) : (
                        <div className="space-y-3">
                            {safeComments.map(
                                (comment, index) => (
                                    <CommentItem
                                        key={
                                            comment?.id ??
                                            `comment-${index}`
                                        }
                                        comment={comment}
                                    />
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default CommentSection;
