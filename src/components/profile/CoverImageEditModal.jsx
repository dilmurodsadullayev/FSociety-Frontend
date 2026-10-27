
 // src/components/profile/CoverImageEditModal.jsx

import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import { createPortal } from "react-dom";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    AnimatePresence,
    motion,
} from "framer-motion";

import {
    ShieldAlert,
} from "lucide-react";

import ProfileService from "../../services/profile";

import {
    getProfileSuccess,
} from "../../features/profile";

import {
    siteToast,
} from "../ui/AuthToast";

// ============================================================
// EXTRACTED COMPONENTS
// ============================================================

import CoverImageHeader from "./edit/cover/CoverImageHeader";
import CoverImageFooter from "./edit/cover/CoverImageFooter";
import CoverImagePreview from "./edit/cover/CoverImagePreview";

// ============================================================
// UTILS
// ============================================================

import {
    COVER_IMAGE_ACCEPT,
    buildCoverImagePayload,
    getCoverImageErrorMessage,
    validateCoverImage,
} from "./edit/cover/coverImageUtils";

// ============================================================
// USERNAME COMPARISON
// ============================================================

const sameUser = (left, right) => {
    return (
        Boolean(left && right) &&
        String(left).trim().toLowerCase() ===
            String(right).trim().toLowerCase()
    );
};

// ============================================================
// COVER IMAGE EDIT MODAL
// ============================================================

const CoverImageEditModal = ({
    isOpen,
    onClose,
    currentCoverImage,
}) => {
    const dispatch = useDispatch();

    // ========================================================
    // REDUX
    // ========================================================

    const profile = useSelector(
        (state) => state.profile?.profile ?? null
    );

    const authUsername = useSelector(
        (state) => state.auth?.user?.username ?? ""
    );

    // ========================================================
    // STATE
    // ========================================================

    const [
        file,
        setFile,
    ] = useState(null);

    const [
        previewUrl,
        setPreviewUrl,
    ] = useState(currentCoverImage || null);

    const [
        loading,
        setLoading,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState("");

    const [
        confirmDiscard,
        setConfirmDiscard,
    ] = useState(false);

    // ========================================================
    // REFS
    // ========================================================

    const fileInputRef = useRef(null);
    const dialogRef = useRef(null);
    const confirmationRef = useRef(null);

    const originalFocusRef = useRef(null);
    const localPreviewUrlRef = useRef(null);

    const initializedRef = useRef(false);
    const savingRef = useRef(false);
    const mountedRef = useRef(false);

    const requestCloseRef = useRef(null);

    const loadingRef = useRef(loading);
    const confirmRef = useRef(confirmDiscard);

    loadingRef.current = loading;
    confirmRef.current = confirmDiscard;

    // ========================================================
    // RELEASE BLOB PREVIEW URL
    // ========================================================

    const revokeLocalPreview = useCallback(() => {
        if (localPreviewUrlRef.current) {
            URL.revokeObjectURL(
                localPreviewUrlRef.current
            );

            localPreviewUrlRef.current = null;
        }
    }, []);

    // ========================================================
    // MOUNT / UNMOUNT
    // ========================================================

    useEffect(() => {
        mountedRef.current = true;

        return () => {
            mountedRef.current = false;
            revokeLocalPreview();
        };
    }, [revokeLocalPreview]);

    // ========================================================
    // INITIALIZE WHEN MODAL OPENS
    //
    // Redux refresh must not overwrite an unsaved file.
    // ========================================================

    useEffect(() => {
        if (!isOpen) {
            initializedRef.current = false;

            revokeLocalPreview();

            return;
        }

        if (initializedRef.current) {
            return;
        }

        initializedRef.current = true;

        setFile(null);

        setPreviewUrl(
            currentCoverImage || null
        );

        setError("");
        setConfirmDiscard(false);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }, [
        isOpen,
        currentCoverImage,
        revokeLocalPreview,
    ]);

    // ========================================================
    // REQUEST CLOSE
    // ========================================================

    const requestClose = useCallback(() => {
        if (
            savingRef.current ||
            loadingRef.current
        ) {
            return;
        }

        if (file) {
            setConfirmDiscard(true);
            return;
        }

        onClose?.();
    }, [
        file,
        onClose,
    ]);

    requestCloseRef.current = requestClose;

    // ========================================================
    // CONFIRM DISCARD
    // ========================================================

    const confirmClose = () => {
        if (
            savingRef.current ||
            loadingRef.current
        ) {
            return;
        }

        setConfirmDiscard(false);

        onClose?.();
    };

    // ========================================================
    // BODY LOCK + KEYBOARD + FOCUS TRAP
    // ========================================================

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const priorOverflow =
            document.body.style.overflow;

        originalFocusRef.current =
            document.activeElement;

        document.body.style.overflow =
            "hidden";

        const frameId =
            window.requestAnimationFrame(() => {
                dialogRef.current?.focus();
            });

        const handleKeyDown = (event) => {
            // ================================================
            // ESC
            // ================================================

            if (event.key === "Escape") {
                event.preventDefault();

                if (
                    loadingRef.current ||
                    savingRef.current
                ) {
                    return;
                }

                if (confirmRef.current) {
                    setConfirmDiscard(false);
                } else {
                    requestCloseRef.current?.();
                }

                return;
            }

            // ================================================
            // TAB FOCUS TRAP
            // ================================================

            if (event.key !== "Tab") {
                return;
            }

            const container =
                confirmRef.current
                    ? confirmationRef.current
                    : dialogRef.current;

            if (!container) {
                return;
            }

            const focusable = Array.from(
                container.querySelectorAll(
                    'button:not(:disabled), ' +
                    'input:not(:disabled), ' +
                    'select:not(:disabled), ' +
                    'textarea:not(:disabled), ' +
                    'a[href], ' +
                    '[tabindex]:not([tabindex="-1"])'
                )
            ).filter(
                (element) =>
                    element.getClientRects().length > 0
            );

            if (!focusable.length) {
                event.preventDefault();
                container.focus();
                return;
            }

            const first = focusable[0];

            const last =
                focusable[focusable.length - 1];

            const active =
                document.activeElement;

            if (
                event.shiftKey &&
                (
                    active === first ||
                    !container.contains(active)
                )
            ) {
                event.preventDefault();
                last.focus();
            } else if (
                !event.shiftKey &&
                (
                    active === last ||
                    !container.contains(active)
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
            window.cancelAnimationFrame(frameId);

            document.removeEventListener(
                "keydown",
                handleKeyDown
            );

            document.body.style.overflow =
                priorOverflow;

            originalFocusRef.current?.focus?.();
        };
    }, [isOpen]);

    // ========================================================
    // FOCUS CONFIRMATION
    // ========================================================

    useEffect(() => {
        if (!confirmDiscard) {
            return;
        }

        const button =
            confirmationRef.current?.querySelector(
                "button"
            );

        button?.focus();
    }, [confirmDiscard]);

    // ========================================================
    // OPEN FILE PICKER
    // ========================================================

    const handleOpenFilePicker = () => {
        if (
            savingRef.current ||
            loadingRef.current ||
            confirmDiscard
        ) {
            return;
        }

        fileInputRef.current?.click();
    };

    // ========================================================
    // FILE CHANGE
    // ========================================================

    const handleFileChange = (event) => {
        const selected =
            event.target.files?.[0];

        // Allow selecting the same file again.
        event.target.value = "";

        if (
            !selected ||
            savingRef.current ||
            loadingRef.current
        ) {
            return;
        }

        const validationError =
            validateCoverImage(selected);

        if (validationError) {
            setError(validationError);

            siteToast.warning(
                validationError
            );

            // Preserve a previous valid selection.
            return;
        }

        try {
            const nextPreviewUrl =
                URL.createObjectURL(selected);

            revokeLocalPreview();

            localPreviewUrlRef.current =
                nextPreviewUrl;

            setFile(selected);
            setPreviewUrl(nextPreviewUrl);
            setError("");
        } catch {
            const message =
                "Rasmni ochib bo‘lmadi. " +
                "Boshqa fayl tanlang.";

            setError(message);

            siteToast.error(message);
        }
    };

    // ========================================================
    // SAVE
    // ========================================================

    const handleSave = async (event) => {
        event.preventDefault();

        if (
            savingRef.current ||
            loadingRef.current ||
            confirmRef.current
        ) {
            return;
        }

        // ====================================================
        // VALIDATE
        // ====================================================

        const validationError =
            validateCoverImage(file);

        if (validationError) {
            setError(validationError);

            siteToast.warning(
                validationError
            );

            return;
        }

        // ====================================================
        // CREATE FORMDATA
        // ====================================================

        let payload;

        try {
            payload = buildCoverImagePayload(file);
        } catch (buildError) {
            const message =
                buildError.message ||
                "Rasm fayli noto‘g‘ri.";

            setError(message);

            siteToast.error(message);

            return;
        }

        // ====================================================
        // REQUEST START
        // ====================================================

        savingRef.current = true;

        setLoading(true);
        setError("");
        setConfirmDiscard(false);

        const toastId = siteToast.loading(
            "Fon rasmi saqlanmoqda..."
        );

        try {
            // =================================================
            // PATCH COVER IMAGE
            // =================================================

            const response =
                await ProfileService.updateCoverImage(
                    payload
                );

            if (!mountedRef.current) {
                siteToast.dismiss(toastId);
                return;
            }

            // =================================================
            // IMPORTANT:
            //
            // CoverImageUpdateSerializer returns:
            //
            // {
            //    id: number,
            //    cover_image: string
            // }
            //
            // This is NOT a full profile.
            // =================================================

            const updated =
                response?.profile ??
                response?.data ??
                response;

            const updatedCover =
                updated?.cover_image;

            const username =
                authUsername ||
                profile?.username;

            const ownsDisplayedProfile =
                sameUser(
                    profile?.username,
                    username
                );

            // =================================================
            // FETCH FULL PROFILE
            // =================================================

            try {
                if (!username) {
                    throw new Error(
                        "Username missing for refresh"
                    );
                }

                const freshProfile =
                    await ProfileService.getProfile(
                        username
                    );

                if (!mountedRef.current) {
                    siteToast.dismiss(toastId);
                    return;
                }

                // Prevent overwriting a different
                // user's profile in Redux.
                if (
                    ownsDisplayedProfile &&
                    sameUser(
                        freshProfile?.username,
                        username
                    )
                ) {
                    dispatch(
                        getProfileSuccess(
                            freshProfile
                        )
                    );
                }

                siteToast.update(
                    toastId,
                    "success",
                    "Fon rasmi muvaffaqiyatli yangilandi."
                );
            } catch {
                // =================================================
                // COVER SAVED, PROFILE REFRESH FAILED
                // =================================================

                if (!mountedRef.current) {
                    siteToast.dismiss(toastId);
                    return;
                }

                // Keep the complete current profile.
                // Merge only the new cover image.
                if (
                    ownsDisplayedProfile &&
                    typeof updatedCover === "string" &&
                    updatedCover
                ) {
                    dispatch(
                        getProfileSuccess({
                            ...profile,
                            cover_image: updatedCover,
                        })
                    );
                }

                siteToast.update(
                    toastId,
                    "warning",
                    "Fon rasmi saqlandi, ammo profilni " +
                    "qayta yuklab bo‘lmadi. " +
                    "Sahifani yangilab tekshiring."
                );
            }

            // =================================================
            // SUCCESS CLEANUP
            // =================================================

            revokeLocalPreview();

            setFile(null);

            onClose?.();
        } catch (saveError) {
            // =================================================
            // REQUEST FAILED
            // =================================================

            if (!mountedRef.current) {
                siteToast.dismiss(toastId);
                return;
            }

            const message =
                getCoverImageErrorMessage(
                    saveError
                );

            setError(message);

            siteToast.update(
                toastId,
                "error",
                message
            );

            // Keep selected file and preview
            // so the user can retry.
        } finally {
            savingRef.current = false;

            if (mountedRef.current) {
                setLoading(false);
            }
        }
    };

    // ========================================================
    // SSR SAFETY
    // ========================================================

    if (typeof document === "undefined") {
        return null;
    }

    // ========================================================
    // PORTAL
    // ========================================================

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="cover-modal-backdrop"
                    initial={{
                        opacity: 0,
                    }}
                    animate={{
                        opacity: 1,
                    }}
                    exit={{
                        opacity: 0,
                    }}
                    transition={{
                        duration: 0.18,
                    }}
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
                    {/* =====================================
                        DIALOG
                    ====================================== */}

                    <motion.div
                        key="cover-modal-dialog"
                        ref={dialogRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="cover-image-modal-title"
                        aria-describedby="cover-image-modal-description"
                        tabIndex={-1}
                        initial={{
                            opacity: 0,
                            y: 18,
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
                            sm:max-h-[calc(100dvh-2rem)]
                            sm:max-w-2xl
                            sm:rounded-[28px]

                            dark:border-white/[0.09]
                            dark:bg-[#0b0f17]
                        "
                    >
                        {/* =================================
                            HEADER
                        ================================== */}

                        <CoverImageHeader
                            onClose={requestClose}
                            loading={loading}
                        />

                        {/* =================================
                            SCROLLABLE CONTENT
                        ================================== */}

                        <div
                            className="
                                min-h-0 flex-1
                                overflow-y-auto
                                overscroll-contain

                                px-4 py-4
                                sm:px-6 sm:py-6
                            "
                        >
                            <form
                                id="fsociety-cover-image-form"
                                onSubmit={handleSave}
                                noValidate
                                className="space-y-4"
                            >
                                {/* PREVIEW */}

                                <CoverImagePreview
                                    previewUrl={previewUrl}
                                    file={file}
                                    loading={loading}
                                    error={error}
                                    onChooseImage={
                                        handleOpenFilePicker
                                    }
                                />

                                {/* HIDDEN FILE INPUT */}

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept={COVER_IMAGE_ACCEPT}
                                    aria-label="Fon rasmi faylini tanlash"
                                    onChange={handleFileChange}
                                    disabled={loading}
                                    className="sr-only"
                                    tabIndex={-1}
                                />
                            </form>
                        </div>

                        {/* =================================
                            UNSAVED IMAGE CONFIRMATION
                        ================================== */}

                        {confirmDiscard && !loading && (
                            <div
                                ref={confirmationRef}
                                role="alertdialog"
                                aria-label="Saqlanmagan rasmni bekor qilish"
                                aria-modal="true"
                                tabIndex={-1}
                                className="
                                    shrink-0
                                    border-t border-amber-200
                                    bg-amber-50
                                    p-4 sm:px-6

                                    dark:border-amber-400/20
                                    dark:bg-[#211b13]
                                "
                            >
                                <p
                                    className="
                                        flex items-start gap-2
                                        text-xs font-semibold
                                        leading-5
                                        text-amber-800

                                        dark:text-amber-200
                                    "
                                >
                                    <ShieldAlert
                                        size={17}
                                        aria-hidden="true"
                                        className="
                                            mt-0.5 shrink-0
                                        "
                                    />

                                    Tanlangan fon rasmi hali
                                    saqlanmadi. Chiqishni
                                    tasdiqlaysizmi?
                                </p>

                                <div
                                    className="
                                        mt-3 flex flex-wrap
                                        justify-end gap-2
                                    "
                                >
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setConfirmDiscard(false);
                                        }}
                                        className="
                                            rounded-xl
                                            border border-amber-300
                                            bg-white px-4 py-2.5

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
                                        onClick={confirmClose}
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

                        {/* =================================
                            FOOTER
                        ================================== */}

                        <CoverImageFooter
                            formId="fsociety-cover-image-form"
                            onClose={requestClose}
                            loading={loading}
                            hasChanges={Boolean(file)}
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default CoverImageEditModal;
