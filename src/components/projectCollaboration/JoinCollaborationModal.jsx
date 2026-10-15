
import React, {
    useId,
    useRef,
} from "react";

import {
    AlertCircle,
    Code2,
    Loader2,
    Send,
    Sparkles,
} from "lucide-react";

import CollaborationModalFrame from "./CollaborationModalFrame";

import {
    COLLABORATION_ROLES,
} from "./collaborationConfig";

import {
    getErrorMessage,
} from "../projectDetail/projectDetailHelpers";

// =========================================================
// FSOCIETY — JOIN COLLABORATION MODAL
//
// Features:
// - Dark / Light Mode
// - Responsive layout
// - 26 collaboration roles
// - Optional message
// - Validation
// - Loading / error states
// - Keyboard accessibility
//
// API logic stays in useProjectCollaboration.
// =========================================================

// =========================================================
// SHARED STYLES
// =========================================================

const LABEL_CLASS = `
    mb-2
    block
    text-xs
    font-bold
    text-slate-700
    dark:text-gray-300
`;

const INPUT_CLASS = `
    block
    w-full
    min-w-0
    rounded-xl
    border
    border-[#d7e1ee]
    bg-[#f8faff]
    px-3.5
    py-3
    text-sm
    font-medium
    text-slate-900
    outline-none
    transition-colors

    placeholder:text-slate-400

    focus:border-indigo-400
    focus:bg-white
    focus:ring-2
    focus:ring-indigo-500/10

    disabled:cursor-not-allowed
    disabled:opacity-60

    dark:border-white/[0.10]
    dark:bg-[#090e16]
    dark:text-gray-100
    dark:placeholder:text-gray-600

    dark:focus:border-indigo-400/40
    dark:focus:bg-[#0b111c]
    dark:focus:ring-indigo-400/10
`;

const SECONDARY_BUTTON_CLASS = `
    inline-flex
    min-h-11
    items-center
    justify-center
    rounded-xl
    border
    border-[#dce5f0]
    bg-white
    px-4
    py-2.5
    text-xs
    font-bold
    text-slate-700
    transition-colors

    hover:bg-slate-50
    hover:border-slate-300

    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-indigo-500

    disabled:cursor-not-allowed
    disabled:opacity-50

    dark:border-white/[0.10]
    dark:bg-white/[0.04]
    dark:text-gray-300
    dark:hover:bg-white/[0.07]
`;

// =========================================================
// COMPONENT
// =========================================================

const JoinCollaborationModal = ({
    isOpen = false,

    onClose,
    onSend,

    selectedRole = "",
    onRoleChange,

    comment = "",
    onCommentChange,

    error = "",

    isSubmitting = false,
}) => {
    // =====================================================
    // IDS
    // =====================================================

    const id = useId();

    const titleId = `${id}-title`;
    const roleId = `${id}-role`;
    const messageId = `${id}-message`;
    const errorId = `${id}-error`;

    // =====================================================
    // REFS
    // =====================================================

    const roleInputRef = useRef(null);

    // =====================================================
    // VALUES
    // =====================================================

    const roleValue =
        typeof selectedRole === "string"
            ? selectedRole
            : "";

    const messageValue =
        typeof comment === "string"
            ? comment
            : "";

    const submitting = Boolean(
        isSubmitting
    );

    // =====================================================
    // VALIDATION
    // =====================================================

    const validRole = COLLABORATION_ROLES.some(
        (role) => role.value === roleValue
    );

    const canSubmit =
        validRole &&
        !submitting &&
        typeof onSend === "function";

    // =====================================================
    // ERROR
    // =====================================================

    const errorMessage = error
        ? getErrorMessage(
            error,
            "Hamkorlik so‘rovini yuborib bo‘lmadi."
        )
        : "";

    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!canSubmit) {
            return;
        }

        onSend();
    };

    // =====================================================
    // JSX
    // =====================================================

    return (
        <CollaborationModalFrame
            isOpen={isOpen}
            title="Loyiha hamkorligi so‘rovi"
            subtitle="Jamoaga qo‘shilish uchun rolingizni tanlang va loyihaga qanday yordam bera olishingizni ko‘rsating."
            titleId={titleId}
            onClose={onClose}
            busy={submitting}
            initialFocusRef={roleInputRef}
        >
            <form
                onSubmit={handleSubmit}
                className="w-full min-w-0 space-y-5"
            >
                {/* ==================================
                    INTRODUCTION
                ================================== */}

                <div
                    className="
                        flex
                        min-w-0
                        items-start
                        gap-3
                        rounded-2xl
                        border
                        border-indigo-400/25
                        bg-gradient-to-r
                        from-indigo-500/[0.08]
                        to-cyan-500/[0.04]
                        p-4

                        dark:border-indigo-400/15
                        dark:from-indigo-400/[0.07]
                        dark:to-cyan-400/[0.03]
                    "
                >
                    <div
                        className="
                            grid
                            h-10
                            w-10
                            shrink-0
                            place-items-center
                            rounded-xl
                            border
                            border-indigo-400/20
                            bg-indigo-500/[0.09]
                            text-indigo-700

                            dark:text-indigo-300
                        "
                    >
                        <Sparkles
                            size={19}
                            aria-hidden="true"
                        />
                    </div>

                    <div className="min-w-0 flex-1">
                        <h4
                            className="
                                text-sm
                                font-black
                                text-slate-900

                                dark:text-white
                            "
                        >
                            Jamoaga qo‘shiling
                        </h4>

                        <p
                            className="
                                mt-1
                                text-xs
                                font-medium
                                leading-6
                                text-slate-600

                                dark:text-gray-400
                            "
                        >
                            So‘rovingiz loyiha muallifiga
                            yuboriladi. Muallif so‘rovni
                            qabul qilishi yoki rad etishi
                            mumkin.
                        </p>
                    </div>
                </div>

                {/* ==================================
                    ROLE
                ================================== */}

                <div className="min-w-0">
                    <label
                        htmlFor={roleId}
                        className={LABEL_CLASS}
                    >
                        Sizning rolingiz

                        <span
                            className="
                                ml-1
                                text-red-600
                                dark:text-red-400
                            "
                        >
                            *
                        </span>
                    </label>

                    <div className="relative">
                        <Code2
                            size={17}
                            aria-hidden="true"

                            className="
                                pointer-events-none
                                absolute
                                left-3.5
                                top-1/2
                                -translate-y-1/2
                                text-slate-400

                                dark:text-gray-500
                            "
                        />

                        <select
                            ref={roleInputRef}
                            id={roleId}

                            name="collaboration-role"

                            value={roleValue}

                            onChange={(event) => {
                                if (
                                    typeof onRoleChange ===
                                    "function"
                                ) {
                                    onRoleChange(
                                        event.target.value
                                    );
                                }
                            }}

                            required
                            disabled={submitting}

                            aria-invalid={Boolean(
                                errorMessage
                            )}

                            aria-describedby={
                                errorMessage
                                    ? errorId
                                    : undefined
                            }

                            className={`
                                ${INPUT_CLASS}
                                cursor-pointer
                                pl-10
                                pr-8
                            `}
                        >
                            <option value="">
                                Rolni tanlang
                            </option>

                            {COLLABORATION_ROLES.map(
                                (role) => (
                                    <option
                                        key={role.value}
                                        value={role.value}
                                    >
                                        {role.label}
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    <p
                        className="
                            mt-2
                            text-[11px]
                            font-medium
                            leading-5
                            text-slate-500

                            dark:text-gray-500
                        "
                    >
                        Qaysi yo‘nalishda ishlamoqchi
                        ekaningizni belgilang.
                    </p>
                </div>

                {/* ==================================
                    OPTIONAL MESSAGE
                ================================== */}

                <div className="min-w-0">
                    <label
                        htmlFor={messageId}
                        className={LABEL_CLASS}
                    >
                        Qo‘shimcha izoh

                        <span
                            className="
                                ml-1
                                text-[11px]
                                font-normal
                                text-slate-400

                                dark:text-gray-500
                            "
                        >
                            (ixtiyoriy)
                        </span>
                    </label>

                    <textarea
                        id={messageId}
                        name="collaboration-message"

                        value={messageValue}

                        onChange={(event) => {
                            if (
                                typeof onCommentChange ===
                                "function"
                            ) {
                                onCommentChange(
                                    event.target.value
                                );
                            }
                        }}

                        disabled={submitting}

                        rows={4}

                        placeholder="Qaysi texnologiyalarni bilasiz va loyihaga qanday yordam bera olasiz?"

                        className={`
                            ${INPUT_CLASS}
                            min-h-[120px]
                            resize-y
                            leading-6
                        `}
                    />

                    <div
                        className="
                            mt-2
                            flex
                            flex-wrap
                            justify-between
                            gap-2

                            text-[11px]
                            font-medium
                            text-slate-500

                            dark:text-gray-500
                        "
                    >
                        <span>
                            Izoh yozish majburiy emas.
                        </span>

                        <span
                            className="
                                font-mono
                                tabular-nums
                            "
                        >
                            {messageValue.length} belgi
                        </span>
                    </div>
                </div>

                {/* ==================================
                    ERROR
                ================================== */}

                {errorMessage && (
                    <div
                        id={errorId}
                        role="alert"

                        className="
                            flex
                            items-start
                            gap-2.5
                            rounded-xl
                            border
                            border-red-200
                            bg-red-50
                            p-3.5

                            text-xs
                            font-medium
                            leading-6
                            text-red-700

                            dark:border-red-400/20
                            dark:bg-red-500/[0.07]
                            dark:text-red-300
                        "
                    >
                        <AlertCircle
                            size={17}
                            aria-hidden="true"
                            className="mt-0.5 shrink-0"
                        />

                        <span
                            className="
                                min-w-0
                                break-words
                                [overflow-wrap:anywhere]
                            "
                        >
                            {errorMessage}
                        </span>
                    </div>
                )}

                {/* ==================================
                    ACTIONS
                ================================== */}

                <div
                    className="
                        flex
                        flex-col-reverse
                        gap-2.5

                        border-t
                        border-[#e7ebf2]
                        pt-5

                        sm:flex-row
                        sm:justify-end

                        dark:border-white/[0.08]
                    "
                >
                    <button
                        type="button"
                        onClick={onClose}

                        disabled={
                            submitting ||
                            typeof onClose !== "function"
                        }

                        className={SECONDARY_BUTTON_CLASS}
                    >
                        Bekor qilish
                    </button>

                    <button
                        type="submit"
                        disabled={!canSubmit}
                        aria-busy={submitting}

                        className="
                            inline-flex
                            min-h-11
                            items-center
                            justify-center
                            gap-2

                            rounded-xl
                            border
                            border-indigo-500
                            bg-indigo-600

                            px-5
                            py-2.5

                            text-xs
                            font-black
                            text-white

                            transition-colors

                            hover:bg-indigo-700

                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-indigo-500

                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        {submitting ? (
                            <Loader2
                                size={16}
                                aria-hidden="true"

                                className="
                                    animate-spin
                                    motion-reduce:animate-none
                                "
                            />
                        ) : (
                            <Send
                                size={16}
                                aria-hidden="true"
                            />
                        )}

                        {submitting
                            ? "Yuborilmoqda..."
                            : "So‘rov yuborish"}
                    </button>
                </div>
            </form>
        </CollaborationModalFrame>
    );
};

export default React.memo(
    JoinCollaborationModal
);
