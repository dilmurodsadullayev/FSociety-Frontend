
import React, { memo, useId } from "react";

import {
    AlertCircle,
    ChevronDown,
} from "lucide-react";

const BASE_CONTROL_CLASS = `
    block w-full min-w-0
    rounded-xl sm:rounded-2xl
    border
    bg-slate-50/90
    px-4 py-3
    font-sans text-base
    font-medium text-slate-900
    outline-none
    transition-colors duration-200

    placeholder:text-slate-400

    focus:border-indigo-400
    focus:bg-white
    focus:ring-2 focus:ring-indigo-500/10

    disabled:cursor-not-allowed
    disabled:opacity-55

    sm:text-sm

    dark:bg-white/[0.035]
    dark:text-slate-100
    dark:placeholder:text-slate-500
    dark:focus:bg-white/[0.055]
    dark:focus:border-indigo-400/50
    dark:focus:ring-indigo-400/10
`;

const EditProfileField = memo(function EditProfileField({
    name,
    label,
    value = "",
    onChange,
    onBlur,

    Icon,

    control = "input",
    type = "text",

    placeholder = "",
    options = [],

    optional = true,
    required = false,
    disabled = false,

    hint = "",
    error = "",

    rows = 4,
    maxLength,
    min,
    max,

    autoComplete,
    inputMode,

    className = "",
    inputClassName = "",
}) {
    const generatedId = useId();

    const fieldId = `edit-profile-${generatedId}`;
    const hintId = `${fieldId}-hint`;
    const errorId = `${fieldId}-error`;

    const errorText = Array.isArray(error)
        ? error.filter(Boolean).join(" ")
        : error
          ? String(error)
          : "";

    const hasError = Boolean(errorText);

    const descriptionIds = [
        hint ? hintId : null,
        hasError ? errorId : null,
    ]
        .filter(Boolean)
        .join(" ");

    const isTextarea = control === "textarea";
    const isSelect = control === "select";

    const hasLeftIcon = Boolean(Icon);

    const controlClasses = `
        ${BASE_CONTROL_CLASS}

        ${hasLeftIcon ? "pl-10" : ""}

        ${isSelect ? "appearance-none pr-10" : ""}

        ${
            hasError
                ? `
                    border-rose-400
                    focus:border-rose-500
                    focus:ring-rose-500/10
                    dark:border-rose-400/60
                `
                : `
                    border-slate-200
                    dark:border-white/[0.09]
                `
        }

        ${
            type === "date"
                ? `
                    [color-scheme:light]
                    dark:[color-scheme:dark]
                `
                : ""
        }

        ${inputClassName}
    `;

    const sharedProps = {
        id: fieldId,
        name,
        value: value ?? "",
        onChange,
        onBlur,
        disabled,
        required,
        "aria-invalid": hasError || undefined,
        "aria-describedby": descriptionIds || undefined,
    };

    return (
        <div className={`min-w-0 ${className}`}>
            {/* Label */}
            <div
                className="
                    mb-2 flex min-w-0
                    flex-wrap items-center gap-2
                "
            >
                <label
                    htmlFor={fieldId}
                    className="
                        font-sans text-xs
                        font-semibold text-slate-700
                        dark:text-slate-200
                    "
                >
                    {label}
                </label>

                {optional && !required && (
                    <span
                        className="
                            rounded-md
                            bg-slate-100
                            px-1.5 py-0.5
                            text-[10px] font-medium
                            text-slate-500

                            dark:bg-white/[0.055]
                            dark:text-slate-400
                        "
                    >
                        Ixtiyoriy
                    </span>
                )}

                {required && (
                    <span
                        aria-hidden="true"
                        className="text-rose-500"
                    >
                        *
                    </span>
                )}
            </div>

            {/* Input container */}
            <div className="relative min-w-0">
                {Icon && (
                    <Icon
                        size={16}
                        strokeWidth={1.9}
                        aria-hidden="true"
                        className={`
                            pointer-events-none
                            absolute left-3.5 z-10
                            text-slate-400
                            dark:text-slate-500

                            ${
                                isTextarea
                                    ? "top-3.5"
                                    : "top-1/2 -translate-y-1/2"
                            }
                        `}
                    />
                )}

                {/* Textarea */}
                {isTextarea ? (
                    <textarea
                        {...sharedProps}
                        placeholder={placeholder}
                        rows={rows}
                        maxLength={maxLength}
                        className={`
                            ${controlClasses}
                            min-h-[120px]
                            resize-y leading-relaxed
                        `}
                    />
                ) : isSelect ? (
                    /* Select */
                    <>
                        <select
                            {...sharedProps}
                            autoComplete={autoComplete}
                            className={controlClasses}
                        >
                            {options.map((option) => (
                                <option
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        <ChevronDown
                            size={16}
                            aria-hidden="true"
                            className="
                                pointer-events-none
                                absolute right-3.5
                                top-1/2 -translate-y-1/2
                                text-slate-400
                                dark:text-slate-500
                            "
                        />
                    </>
                ) : (
                    /* Standard input */
                    <input
                        {...sharedProps}
                        type={type}
                        placeholder={placeholder}
                        autoComplete={autoComplete}
                        inputMode={inputMode}
                        maxLength={maxLength}
                        min={min}
                        max={max}
                        className={controlClasses}
                    />
                )}
            </div>

            {/* Helper text */}
            {hint && (
                <p
                    id={hintId}
                    className="
                        mt-1.5 text-xs
                        leading-5 text-slate-500
                        dark:text-slate-400
                    "
                >
                    {hint}
                </p>
            )}

            {/* Field-level error */}
            {hasError && (
                <p
                    id={errorId}
                    role="alert"
                    className="
                        mt-2 flex items-start
                        gap-1.5 text-xs
                        font-medium leading-5
                        text-rose-600
                        dark:text-rose-300
                    "
                >
                    <AlertCircle
                        size={14}
                        aria-hidden="true"
                        className="mt-0.5 shrink-0"
                    />

                    <span className="min-w-0 break-words">
                        {errorText}
                    </span>
                </p>
            )}
        </div>
    );
});

export default EditProfileField;
