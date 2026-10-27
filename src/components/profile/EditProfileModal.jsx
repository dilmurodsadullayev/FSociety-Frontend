
import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import { createPortal } from "react-dom";
import { useDispatch } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";

import {
    AlertTriangle,
    Image as ImageIcon,
    ShieldAlert,
} from "lucide-react";

import ProfileService from "../../services/profile";
import { getProfileSuccess } from "../../features/profile";
import { siteToast } from "../ui/AuthToast";

import EditProfileAvatar from "./edit/EditProfileAvatar";
import EditProfilePersonal from "./edit/EditProfilePersonal";
import EditProfileProfessional from "./edit/EditProfileProfessional";
import EditProfileLinks from "./edit/EditProfileLinks";
import EditProfileHeader from "./edit/EditProfileHeader";
import EditProfileFooter from "./edit/EditProfileFooter";

import {
    INITIAL_PROFILE_FORM,
    normalizeProfileFormData,
    validateProfileForm,
    hasProfileChanges,
    hasProfileTextChanges,
    buildProfilePayload,
    getProfileErrorDetails,
} from "./edit/profileEditUtils";

// ============================================================
// EDIT PROFILE MODAL
// ============================================================

const EditProfileModal = ({
    profileData,
    isOpen,
    onClose,
}) => {
    const dispatch = useDispatch();

    const dialogRef = useRef(null);
    const previousFocusRef = useRef(null);
    const objectUrlRef = useRef(null);
    const initializedRef = useRef(false);

    const requestCloseRef = useRef(null);
    const discardVisibleRef = useRef(false);

    const initialFormRef = useRef({
        ...INITIAL_PROFILE_FORM,
    });

    // ========================================================
    // STATE
    // ========================================================

    const [formData, setFormData] = useState({
        ...INITIAL_PROFILE_FORM,
    });

    const [
        profileImagePreview,
        setProfileImagePreview,
    ] = useState(null);

    const [
        profileImageFile,
        setProfileImageFile,
    ] = useState(null);

    const [
        removeProfileImage,
        setRemoveProfileImage,
    ] = useState(false);

    const [loading, setLoading] = useState(false);

    const [
        generalError,
        setGeneralError,
    ] = useState("");

    const [
        fieldErrors,
        setFieldErrors,
    ] = useState({});

    const [
        confirmDiscard,
        setConfirmDiscard,
    ] = useState(false);

    // ========================================================
    // OBJECT URL CLEANUP
    // ========================================================

    const clearObjectUrl = useCallback(() => {
        if (objectUrlRef.current) {
            URL.revokeObjectURL(
                objectUrlRef.current
            );

            objectUrlRef.current = null;
        }
    }, []);

    // ========================================================
    // INITIALIZE FORM ON OPEN
    //
    // Redux changes during editing must not overwrite
    // the user's unsaved input.
    // ========================================================

    useEffect(() => {
        if (!isOpen) {
            initializedRef.current = false;
            clearObjectUrl();
            return;
        }

        if (
            initializedRef.current ||
            !profileData?.username
        ) {
            return;
        }

        initializedRef.current = true;

        const normalized =
            normalizeProfileFormData(profileData);

        initialFormRef.current = normalized;

        setFormData(normalized);

        setProfileImagePreview(
            profileData.image || null
        );

        setProfileImageFile(null);
        setRemoveProfileImage(false);
        setLoading(false);

        setGeneralError("");
        setFieldErrors({});
        setConfirmDiscard(false);
    }, [isOpen, profileData, clearObjectUrl]);

    useEffect(
        () => () => clearObjectUrl(),
        [clearObjectUrl]
    );

    // ========================================================
    // DETECT CHANGES
    // ========================================================

    const textChanged = hasProfileTextChanges(
        formData,
        initialFormRef.current
    );

    const hasChanges = hasProfileChanges({
        formData,
        initialData: initialFormRef.current,
        profileImageFile,
        removeProfileImage,
    });

    // ========================================================
    // CLOSE PROTECTION
    // ========================================================

    const requestClose = useCallback(() => {
        if (loading) {
            return;
        }

        if (hasChanges) {
            setConfirmDiscard(true);

            siteToast.warning(
                "Saqlanmagan o‘zgarishlar mavjud. " +
                "Chiqishdan oldin tekshiring."
            );

            return;
        }

        onClose?.();
    }, [loading, hasChanges, onClose]);

    requestCloseRef.current = requestClose;
    discardVisibleRef.current = confirmDiscard;

    // ========================================================
    // SCROLL LOCK + KEYBOARD + FOCUS
    // ========================================================

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const previousOverflow =
            document.body.style.overflow;

        previousFocusRef.current =
            document.activeElement;

        document.body.style.overflow = "hidden";

        const focusFrame = window.requestAnimationFrame(
            () => {
                dialogRef.current?.focus();
            }
        );

        const handleKeyDown = (event) => {
            // ESCAPE
            if (event.key === "Escape") {
                event.preventDefault();

                if (discardVisibleRef.current) {
                    setConfirmDiscard(false);
                } else {
                    requestCloseRef.current?.();
                }

                return;
            }

            // TAB FOCUS TRAP
            if (
                event.key !== "Tab" ||
                !dialogRef.current
            ) {
                return;
            }

            const focusable = Array.from(
                dialogRef.current.querySelectorAll(
                    'button:not([disabled]), ' +
                    'input:not([disabled]), ' +
                    'select:not([disabled]), ' +
                    'textarea:not([disabled]), ' +
                    'a[href], ' +
                    '[tabindex]:not([tabindex="-1"])'
                )
            ).filter(
                (node) =>
                    node.getClientRects().length > 0
            );

            if (!focusable.length) {
                event.preventDefault();
                dialogRef.current.focus();
                return;
            }

            const first = focusable[0];
            const last = focusable[
                focusable.length - 1
            ];

            const active = document.activeElement;

            if (
                event.shiftKey &&
                (
                    active === first ||
                    active === dialogRef.current
                )
            ) {
                event.preventDefault();
                last.focus();
            } else if (
                !event.shiftKey &&
                (
                    active === last ||
                    !dialogRef.current.contains(active)
                )
            ) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            window.cancelAnimationFrame(focusFrame);

            document.removeEventListener(
                "keydown",
                handleKeyDown
            );

            document.body.style.overflow =
                previousOverflow;

            previousFocusRef.current?.focus?.();
        };
    }, [isOpen]);

    // ========================================================
    // FIELD ERRORS
    // ========================================================

    const clearFieldError = useCallback(
        (name) => {
            setFieldErrors((previous) => {
                if (
                    !Object.prototype.hasOwnProperty.call(
                        previous,
                        name
                    )
                ) {
                    return previous;
                }

                const next = { ...previous };
                delete next[name];

                return next;
            });
        },
        []
    );

    // ========================================================
    // INPUT CHANGE
    // ========================================================

    const handleChange = useCallback(
        (event) => {
            const { name, value } = event.target;

            setFormData((previous) => ({
                ...previous,
                [name]: value,
            }));

            clearFieldError(name);
            setGeneralError("");
        },
        [clearFieldError]
    );

    // ========================================================
    // INPUT BLUR VALIDATION
    // ========================================================

    const handleBlur = useCallback(
        (event) => {
            const name = event.target.name;

            if (!name) {
                return;
            }

            const errors =
                validateProfileForm(formData);

            setFieldErrors((previous) => {
                const next = { ...previous };

                if (errors[name]) {
                    next[name] = errors[name];
                } else {
                    delete next[name];
                }

                return next;
            });
        },
        [formData]
    );

    // ========================================================
    // AVATAR SELECT
    // ========================================================

    const handleSelectFile = useCallback(
        (file) => {
            if (loading || !file) {
                return;
            }

            clearObjectUrl();

            const url = URL.createObjectURL(file);

            objectUrlRef.current = url;

            setProfileImageFile(file);
            setProfileImagePreview(url);

            setRemoveProfileImage(false);

            clearFieldError("image");
            setGeneralError("");
        },
        [
            loading,
            clearObjectUrl,
            clearFieldError,
        ]
    );

    // ========================================================
    // AVATAR REMOVE
    // ========================================================

    const handleRemoveImage = useCallback(
        () => {
            if (loading) {
                return;
            }

            clearObjectUrl();

            setProfileImageFile(null);
            setProfileImagePreview(null);

            // Canceling a newly selected avatar must not
            // delete an image that never existed.
            setRemoveProfileImage(
                Boolean(profileData?.image)
            );

            clearFieldError("image");
            setGeneralError("");
        },
        [
            loading,
            profileData,
            clearObjectUrl,
            clearFieldError,
        ]
    );

    // ========================================================
    // AVATAR VALIDATION ALERT
    // ========================================================

    const handleImageValidationError = useCallback(
        (message) => {
            setFieldErrors((previous) => ({
                ...previous,
                image: message,
            }));

            siteToast.warning(message);
        },
        []
    );

    // ========================================================
    // FOCUS FIRST INVALID FIELD
    // ========================================================

    const focusFirstInvalid = (errors) => {
        const field = Object.keys(errors)[0];

        if (!field) {
            return;
        }

        const control =
            dialogRef.current?.querySelector(
                `[name="${field}"]`
            );

        control?.focus();

        control?.scrollIntoView({
            block: "nearest",
            behavior: "smooth",
        });
    };

    // ========================================================
    // SAVE PROFILE
    // ========================================================

    const handleSave = async (event) => {
        event.preventDefault();

        if (loading) {
            return;
        }

        const username = profileData?.username;

        if (!username) {
            const message =
                "Username topilmadi. " +
                "Profilni yangilab bo‘lmadi.";

            setGeneralError(message);
            siteToast.error(message);
            return;
        }

        if (!hasChanges) {
            siteToast.info(
                "Saqlanmagan o‘zgarish topilmadi."
            );
            return;
        }

        // ====================================================
        // CLIENT VALIDATION
        // ====================================================

        const errors = validateProfileForm(
            formData,
            { profileImageFile }
        );

        if (Object.keys(errors).length) {
            setFieldErrors(errors);

            const firstMessage =
                Object.values(errors)[0];

            setGeneralError(firstMessage);
            siteToast.error(firstMessage);

            window.requestAnimationFrame(
                () => focusFirstInvalid(errors)
            );

            return;
        }

        // ====================================================
        // BUILD JSON AND IMAGE PAYLOAD
        // ====================================================

        let payloads;

        try {
            payloads = buildProfilePayload({
                formData,
                profileImageFile,
                removeProfileImage,
            });
        } catch (error) {
            const details =
                getProfileErrorDetails(error);

            setGeneralError(details.message);
            siteToast.error(details.message);
            return;
        }

        const snapshot = { ...formData };

        const shouldSaveText = textChanged;

        const shouldSaveImage = Boolean(
            profileImageFile ||
            removeProfileImage
        );

        // ====================================================
        // SEND ONLY CHANGED FIELDS
        //
        // Some DRF CharFields reject blank values.
        // Untouched empty fields should not be sent.
        // ====================================================

        const changedTextPayload = {};

        if (shouldSaveText) {
            for (
                const [name, value]
                of Object.entries(payloads.profilePayload)
            ) {
                const probe = {
                    ...initialFormRef.current,
                    [name]: snapshot[name],
                };

                if (
                    hasProfileTextChanges(
                        probe,
                        initialFormRef.current
                    )
                ) {
                    changedTextPayload[name] = value;
                }
            }
        }

        const isRemovingImage = removeProfileImage;

        // ====================================================
        // LOADING + UNIVERSAL ALERT
        // ====================================================

        setLoading(true);
        setFieldErrors({});
        setGeneralError("");
        setConfirmDiscard(false);

        const toastId = siteToast.loading(
            "Profil saqlanmoqda..."
        );

        let phase = "text";

        let textSaved = false;
        let imageSaved = false;

        let textResponse = null;
        let imageResponse = null;

        try {
            // =================================================
            // STEP 1 — JSON PATCH
            //
            // skills: [] is correctly transmitted in JSON.
            // =================================================

            if (shouldSaveText) {
                textResponse =
                    await ProfileService.updateProfile(
                        username,
                        changedTextPayload
                    );

                textSaved = true;

                initialFormRef.current =
                    normalizeProfileFormData({
                        ...snapshot,
                        ...changedTextPayload,
                    });
            }

            // =================================================
            // STEP 2 — IMAGE PATCH
            // =================================================

            phase = "image";

            if (shouldSaveImage) {
                imageResponse =
                    await ProfileService.updateProfile(
                        username,
                        payloads.imagePayload
                    );

                imageSaved = true;

                clearObjectUrl();

                setProfileImageFile(null);
                setRemoveProfileImage(false);

                setProfileImagePreview(
                    isRemovingImage
                        ? null
                        : (
                            imageResponse?.image ||
                            profileData?.image ||
                            null
                        )
                );
            }

            // =================================================
            // STEP 3 — FETCH FULL PROFILE
            //
            // ProfileUpdateSerializer may not return all
            // profile fields, counts or badges.
            // =================================================

            phase = "refresh";

            const freshProfile =
                await ProfileService.getProfile(username);

            dispatch(
                getProfileSuccess(freshProfile)
            );

            initialFormRef.current =
                normalizeProfileFormData(freshProfile);

            siteToast.update(
                toastId,
                "success",
                "Profil muvaffaqiyatli saqlandi."
            );

            onClose?.();

        } catch (error) {
            const details =
                getProfileErrorDetails(error);

            // =================================================
            // PARTIAL SUCCESS
            //
            // If text saved but image failed, do not falsely
            // claim that all changes were rolled back.
            // =================================================

            if (textSaved || imageSaved) {
                const fallback = {
                    ...profileData,

                    ...(textSaved
                        ? changedTextPayload
                        : {}),

                    ...(textResponse || {}),
                    ...(imageResponse || {}),

                    ...(
                        imageSaved && isRemovingImage
                            ? { image: null }
                            : {}
                    ),
                };

                dispatch(
                    getProfileSuccess(fallback)
                );
            }

            // =================================================
            // UPDATE SUCCEEDED BUT REFRESH FAILED
            // =================================================

            if (phase === "refresh") {
                const message =
                    "O‘zgarishlar saqlandi, ammo " +
                    "profilni qayta yuklab bo‘lmadi. " +
                    "Sahifani yangilab tekshiring.";

                siteToast.update(
                    toastId,
                    "warning",
                    message
                );

                onClose?.();
                return;
            }

            // =================================================
            // TEXT SAVED, IMAGE REQUEST FAILED
            // =================================================

            if (
                phase === "image" &&
                textSaved
            ) {
                const message =
                    "Ma’lumotlar saqlandi, ammo profil " +
                    "rasmi bilan muammo yuz berdi: " +
                    details.message;

                setGeneralError(message);

                setFieldErrors({
                    ...details.fieldErrors,

                    image:
                        details.fieldErrors.image ||
                        details.message,
                });

                siteToast.update(
                    toastId,
                    "warning",
                    message
                );

                // Image remains selected for a retry.
                return;
            }

            // =================================================
            // GENERAL ERROR
            // =================================================

            setGeneralError(details.message);

            setFieldErrors({
                ...details.fieldErrors,

                ...(
                    phase === "image" &&
                    !details.fieldErrors.image
                        ? { image: details.message }
                        : {}
                ),
            });

            siteToast.update(
                toastId,
                "error",
                details.message
            );

        } finally {
            setLoading(false);
        }
    };

    // ========================================================
    // PORTAL
    // ========================================================

    if (typeof document === "undefined") {
        return null;
    }

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="edit-profile-backdrop"

                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}

                    transition={{ duration: 0.18 }}

                    onMouseDown={(event) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            requestClose();
                        }
                    }}

                    className="
                        fixed inset-0 z-[1000]
                        flex items-center justify-center
                        bg-slate-950/75
                        backdrop-blur-sm
                        sm:p-4
                        dark:bg-black/85
                    "
                >
                    {/* ======================================
                        MODAL CONTAINER
                    ======================================= */}

                    <motion.div
                        ref={dialogRef}

                        role="dialog"
                        aria-modal="true"

                        aria-labelledby="edit-profile-title"
                        aria-describedby="edit-profile-description"

                        tabIndex={-1}

                        key="edit-profile-dialog"

                        initial={{
                            opacity: 0,
                            y: 20,
                            scale: 0.985,
                        }}

                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                        }}

                        exit={{
                            opacity: 0,
                            y: 12,
                            scale: 0.99,
                        }}

                        transition={{
                            duration: 0.2,
                            ease: "easeOut",
                        }}

                        onMouseDown={(event) => {
                            event.stopPropagation();
                        }}

                        className="
                            relative flex
                            h-[100dvh] max-h-[100dvh]
                            w-full min-w-0
                            flex-col overflow-hidden

                            border border-slate-200
                            bg-slate-50 shadow-2xl
                            outline-none

                            sm:h-auto
                            sm:max-h-[92dvh]
                            sm:max-w-4xl
                            sm:rounded-[28px]

                            dark:border-white/[0.09]
                            dark:bg-[#0b0f17]
                        "
                    >
                        {/* ================================
                            HEADER
                        ================================= */}

                        <EditProfileHeader
                            onClose={requestClose}
                            loading={loading}
                            username={profileData?.username}
                        />

                        {/* ================================
                            SCROLLABLE FORM
                        ================================= */}

                        <div
                            className="
                                min-h-0 flex-1
                                overflow-y-auto
                                overscroll-contain

                                px-4 py-4
                                sm:px-6 sm:py-6

                                [scrollbar-gutter:stable]
                            "
                        >
                            <form
                                id="fsociety-edit-profile-form"
                                onSubmit={handleSave}
                                noValidate

                                className="
                                    space-y-4
                                    sm:space-y-5
                                "
                            >
                                {/* AVATAR */}

                                <EditProfileAvatar
                                    profileImagePreview={
                                        profileImagePreview
                                    }
                                    profileImageFile={
                                        profileImageFile
                                    }
                                    removeProfileImage={
                                        removeProfileImage
                                    }
                                    loading={loading}
                                    onSelectFile={
                                        handleSelectFile
                                    }
                                    onRemoveImage={
                                        handleRemoveImage
                                    }
                                    onValidationError={
                                        handleImageValidationError
                                    }
                                />

                                {/* IMAGE SERVER ERROR */}

                                {fieldErrors.image && (
                                    <div
                                        role="alert"

                                        className="
                                            flex items-start gap-2
                                            rounded-xl

                                            border border-rose-200
                                            bg-rose-50
                                            px-4 py-3

                                            text-xs font-medium
                                            text-rose-700

                                            dark:border-rose-400/20
                                            dark:bg-rose-500/[0.08]
                                            dark:text-rose-300
                                        "
                                    >
                                        <ImageIcon
                                            size={16}
                                            className="
                                                mt-0.5 shrink-0
                                            "
                                        />

                                        <span
                                            className="
                                                min-w-0 break-words
                                            "
                                        >
                                            {fieldErrors.image}
                                        </span>
                                    </div>
                                )}

                                {/* PERSONAL */}

                                <EditProfilePersonal
                                    formData={formData}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    loading={loading}
                                    fieldErrors={fieldErrors}
                                />

                                {/* PROFESSIONAL */}

                                <EditProfileProfessional
                                    formData={formData}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    loading={loading}
                                    fieldErrors={fieldErrors}
                                />

                                {/* LINKS */}

                                <EditProfileLinks
                                    formData={formData}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    loading={loading}
                                    fieldErrors={fieldErrors}
                                />

                                {/* COVER IMAGE INFORMATION */}

                                <div
                                    className="
                                        flex items-start gap-3
                                        rounded-2xl

                                        border border-cyan-200/80
                                        bg-cyan-50/80
                                        p-4

                                        dark:border-cyan-400/15
                                        dark:bg-cyan-500/[0.05]
                                    "
                                >
                                    <ImageIcon
                                        size={19}
                                        aria-hidden="true"

                                        className="
                                            mt-0.5 shrink-0
                                            text-cyan-700
                                            dark:text-cyan-300
                                        "
                                    />

                                    <div className="min-w-0">
                                        <p
                                            className="
                                                text-xs font-bold
                                                text-slate-800
                                                dark:text-slate-200
                                            "
                                        >
                                            Fon rasmi
                                        </p>

                                        <p
                                            className="
                                                mt-1 text-xs
                                                leading-5
                                                text-slate-600

                                                dark:text-slate-400
                                            "
                                        >
                                            Cover image profil
                                            sahifasidagi alohida
                                            “Fon rasmi” tugmasi
                                            orqali tahrirlanadi.
                                        </p>
                                    </div>
                                </div>

                                {/* GENERAL ERROR */}

                                {generalError && (
                                    <div
                                        role="alert"
                                        aria-live="assertive"

                                        className="
                                            flex items-start gap-3
                                            rounded-2xl

                                            border border-rose-200
                                            bg-rose-50
                                            p-4

                                            text-sm font-medium
                                            text-rose-700

                                            dark:border-rose-400/25
                                            dark:bg-rose-500/[0.08]
                                            dark:text-rose-200
                                        "
                                    >
                                        <AlertTriangle
                                            size={19}
                                            aria-hidden="true"
                                            className="
                                                mt-0.5 shrink-0
                                            "
                                        />

                                        <span
                                            className="
                                                min-w-0 break-words
                                            "
                                        >
                                            {generalError}
                                        </span>
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* ================================
                            DISCARD CONFIRMATION
                        ================================= */}

                        {confirmDiscard && !loading && (
                            <div
                                role="alert"

                                className="
                                    border-t border-amber-200
                                    bg-amber-50 p-4

                                    dark:border-amber-400/20
                                    dark:bg-[#211b13]

                                    sm:px-6
                                "
                            >
                                <div
                                    className="
                                        flex items-start gap-2
                                        text-amber-800
                                        dark:text-amber-200
                                    "
                                >
                                    <ShieldAlert
                                        size={18}
                                        aria-hidden="true"
                                        className="
                                            mt-0.5 shrink-0
                                        "
                                    />

                                    <p
                                        className="
                                            text-xs font-semibold
                                            leading-5
                                        "
                                    >
                                        Saqlanmagan o‘zgarishlar
                                        yo‘qoladi. Chiqishni
                                        tasdiqlaysizmi?
                                    </p>
                                </div>

                                <div
                                    className="
                                        mt-3 flex flex-wrap
                                        justify-end gap-2
                                    "
                                >
                                    <button
                                        type="button"

                                        onClick={() =>
                                            setConfirmDiscard(false)
                                        }

                                        className="
                                            rounded-xl
                                            border border-amber-300
                                            bg-white
                                            px-4 py-2.5

                                            text-xs font-semibold
                                            text-amber-900

                                            hover:bg-amber-100

                                            dark:border-amber-400/20
                                            dark:bg-white/[0.06]
                                            dark:text-amber-100
                                            dark:hover:bg-white/10
                                        "
                                    >
                                        Tahrirlashda qolish
                                    </button>

                                    <button
                                        type="button"

                                        onClick={() => {
                                            setConfirmDiscard(false);
                                            onClose?.();
                                        }}

                                        className="
                                            rounded-xl
                                            bg-rose-600
                                            px-4 py-2.5

                                            text-xs font-semibold
                                            text-white

                                            hover:bg-rose-500
                                        "
                                    >
                                        O‘zgarishlarni bekor qilish
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ================================
                            FOOTER
                        ================================= */}

                        <div
                            className="
                                px-4 pb-4
                                sm:px-6 sm:pb-6
                            "
                        >
                            <EditProfileFooter
                                formId="fsociety-edit-profile-form"
                                onClose={requestClose}
                                loading={loading}
                                hasChanges={hasChanges}
                                disabled={
                                    !profileData?.username
                                }
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default EditProfileModal;
