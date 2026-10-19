
// src/components/projects/ProjectFormModal.jsx

import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { createPortal } from "react-dom";
import { AlertTriangle } from "lucide-react";

import ProjectService from "../../services/project";
import { siteToast } from "../ui/AuthToast";

import ProjectCreateHeader from "./create/ProjectCreateHeader";
import ProjectCreateFields from "./create/ProjectCreateFields";
import ProjectCreateStack from "./create/ProjectCreateStack";
import ProjectCreateImages from "./create/ProjectCreateImages";
import ProjectCreateStackPreview from "./create/ProjectCreateStackPreview";
import ProjectCreateFooter from "./create/ProjectCreateFooter";

import {
    MAX_PROJECT_IMAGES,
    EMPTY_PROJECT_FORM,
    normalizeCatalog,
    getInitialLanguageIds,
    getInitialTechnologyIds,
    technologyMatchesLanguages,
    getInitialProjectForm,
    formatImagesForEdit,
    createLocalImage,
    isAllowedImage,
    revokeLocalImageUrl,
    getErrorMessage,
    validateProjectForm,
    buildProjectFormData,
} from "./create/projectCreateHelpers";

// =========================================================
// CONSTANTS
// =========================================================

const EMPTY_ARRAY = [];

const FOCUSABLE_SELECTOR = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'textarea:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
].join(", ");

// =========================================================
// PROJECT FORM MODAL
//
// Create: initialData = null
// Edit: initialData = existing project
// API: onSubmit(multipartFormData, projectId)
//
// Mobile: full viewport, scrollable body, fixed header/footer.
// Desktop: centered dialog, two-column form.
// Portal keeps the modal above Navbar/Profile stacking contexts.
// =========================================================

const ProjectFormModal = ({
    isOpen,
    onClose,
    onSubmit,
    initialData = null,
    isSubmitting: parentSubmitting = false,
}) => {
    const isEditMode = Boolean(initialData);
    const projectId = initialData?.id ?? null;

    // =====================================================
    // FORM AND CATALOG STATE
    // =====================================================

    const [formData, setFormData] = useState(() => ({
        ...EMPTY_PROJECT_FORM,
    }));
    const [languages, setLanguages] = useState(EMPTY_ARRAY);
    const [technologies, setTechnologies] = useState(EMPTY_ARRAY);
    const [selectedLanguageIds, setSelectedLanguageIds] = useState([]);
    const [selectedTechnologyIds, setSelectedTechnologyIds] = useState([]);
    const [stackLoading, setStackLoading] = useState(false);
    const [stackError, setStackError] = useState("");
    const [images, setImages] = useState([]);
    const [localSubmitting, setLocalSubmitting] = useState(false);
    const [error, setError] = useState("");

    const isSubmitting = localSubmitting || parentSubmitting;

    // =====================================================
    // REFS
    // =====================================================

    const dialogRef = useRef(null);
    const modalScrollRef = useRef(null);
    const initialDataRef = useRef(initialData);
    const previousFocusedElementRef = useRef(null);
    const blobUrlsRef = useRef(new Set());
    const submittingRef = useRef(false);
    const sessionRef = useRef(0);

    // Keep current data without resetting the form every
    // time the parent recreates the same project object.
    initialDataRef.current = initialData;

    // =====================================================
    // TEMPORARY IMAGE URL MANAGEMENT
    // =====================================================

    const trackBlobUrl = useCallback((url) => {
        if (typeof url === "string" && url.startsWith("blob:")) {
            blobUrlsRef.current.add(url);
        }
    }, []);

    const releaseBlobUrl = useCallback((url) => {
        if (
            typeof url !== "string" ||
            !blobUrlsRef.current.has(url)
        ) {
            return;
        }

        revokeLocalImageUrl({ url });
        blobUrlsRef.current.delete(url);
    }, []);

    const releaseAllBlobUrls = useCallback(() => {
        blobUrlsRef.current.forEach((url) => {
            revokeLocalImageUrl({ url });
        });
        blobUrlsRef.current.clear();
    }, []);

    // =====================================================
    // MODAL INITIALIZATION AND STACK CATALOG
    //
    // Reload only on modal open / project ID change.
    // Ignore responses from earlier modal sessions.
    // =====================================================

    useEffect(() => {
        if (!isOpen) return undefined;

        let cancelled = false;
        sessionRef.current += 1;
        const currentInitialData = initialDataRef.current;

        setError("");
        setStackError("");
        setStackLoading(true);
        setLocalSubmitting(false);
        submittingRef.current = false;
        releaseAllBlobUrls();

        if (modalScrollRef.current) {
            modalScrollRef.current.scrollTop = 0;
        }

        setFormData(getInitialProjectForm(currentInitialData));
        setImages(
            currentInitialData
                ? formatImagesForEdit(currentInitialData.images)
                : []
        );

        const initialLanguageIds = getInitialLanguageIds(
            currentInitialData
        ).map(String);
        const initialTechnologyIds = getInitialTechnologyIds(
            currentInitialData
        ).map(String);

        setSelectedLanguageIds(initialLanguageIds);
        setSelectedTechnologyIds(initialTechnologyIds);
        setLanguages([]);
        setTechnologies([]);

        const loadStackCatalog = async () => {
            try {
                const response = await ProjectService.getStackCatalog();
                if (cancelled) return;

                const loadedLanguages = normalizeCatalog(
                    response?.languages
                );
                const loadedTechnologies = normalizeCatalog(
                    response?.technologies
                );

                setLanguages(loadedLanguages);
                setTechnologies(loadedTechnologies);
                setStackError("");

                if (currentInitialData) {
                    const validIds = initialTechnologyIds.filter((id) => {
                        const technology = loadedTechnologies.find(
                            (item) => String(item.id) === String(id)
                        );
                        return Boolean(
                            technology &&
                            technologyMatchesLanguages(
                                technology,
                                initialLanguageIds
                            )
                        );
                    });
                    setSelectedTechnologyIds(validIds);
                }
            } catch (requestError) {
                if (cancelled) return;

                console.error(
                    "Stack katalogini olishda xato:",
                    requestError
                );
                setStackError(
                    getErrorMessage(
                        requestError,
                        "Tillar va texnologiyalarni yuklab bo‘lmadi."
                    )
                );
                setLanguages([]);
                setTechnologies([]);
            } finally {
                if (!cancelled) setStackLoading(false);
            }
        };

        loadStackCatalog();

        return () => {
            cancelled = true;
            sessionRef.current += 1;
            releaseAllBlobUrls();
        };
    }, [isOpen, projectId, releaseAllBlobUrls]);

    // =====================================================
    // BODY SCROLL LOCK
    // =====================================================

    useEffect(() => {
        if (!isOpen) return undefined;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isOpen]);

    // =====================================================
    // FOCUS MANAGEMENT
    //
    // Focus the dialog, not an input: avoids opening the
    // on-screen keyboard immediately on mobile.
    // =====================================================

    useEffect(() => {
        if (!isOpen) return undefined;

        previousFocusedElementRef.current = document.activeElement;

        const frameId = window.requestAnimationFrame(() => {
            dialogRef.current?.focus({ preventScroll: true });
        });

        return () => {
            window.cancelAnimationFrame(frameId);
            const previous = previousFocusedElementRef.current;
            if (
                previous?.isConnected &&
                typeof previous.focus === "function"
            ) {
                previous.focus({ preventScroll: true });
            }
        };
    }, [isOpen]);

    const handleClose = useCallback(() => {
        if (isSubmitting || submittingRef.current) return;
        onClose?.();
    }, [isSubmitting, onClose]);

    // =====================================================
    // ESCAPE AND TAB FOCUS TRAP
    // =====================================================

    useEffect(() => {
        if (!isOpen) return undefined;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                if (!isSubmitting && !submittingRef.current) {
                    event.preventDefault();
                    handleClose();
                }
                return;
            }

            if (event.key !== "Tab" || !dialogRef.current) return;

            const focusable = Array.from(
                dialogRef.current.querySelectorAll(FOCUSABLE_SELECTOR)
            ).filter(
                (element) =>
                    element.getClientRects().length > 0 &&
                    element.getAttribute("aria-hidden") !== "true"
            );

            if (focusable.length === 0) {
                event.preventDefault();
                dialogRef.current.focus();
                return;
            }

            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            const active = document.activeElement;

            if (
                active === dialogRef.current ||
                !dialogRef.current.contains(active)
            ) {
                event.preventDefault();
                (event.shiftKey ? last : first).focus();
            } else if (event.shiftKey && active === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && active === last) {
                event.preventDefault();
                first.focus();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, isSubmitting, handleClose]);

    // =====================================================
    // SELECTED LANGUAGES / TECHNOLOGIES
    // =====================================================

    const selectedLanguages = useMemo(
        () => languages.filter((language) =>
            selectedLanguageIds.includes(String(language.id))
        ),
        [languages, selectedLanguageIds]
    );

    const compatibleTechnologies = useMemo(
        () => technologies.filter((technology) =>
            technologyMatchesLanguages(
                technology,
                selectedLanguageIds
            )
        ),
        [technologies, selectedLanguageIds]
    );

    const selectedTechnologies = useMemo(
        () => technologies.filter((technology) =>
            selectedTechnologyIds.includes(String(technology.id))
        ),
        [technologies, selectedTechnologyIds]
    );

    // =====================================================
    // FORM INPUT CHANGE
    // =====================================================

    const clearError = () => setError("");

    const handleInputChange = (event) => {
        if (isSubmitting) return;

        const { name, value } = event.target;
        setFormData((current) => ({ ...current, [name]: value }));
        clearError();
    };

    // =====================================================
    // LANGUAGE TOGGLE
    //
    // Remove selected technologies which no longer match.
    // =====================================================

    const handleLanguageToggle = (language) => {
        if (isSubmitting || stackLoading || !language) return;

        const languageId = String(language.id);
        const alreadySelected = selectedLanguageIds.includes(languageId);
        const nextLanguageIds = alreadySelected
            ? selectedLanguageIds.filter((id) => id !== languageId)
            : [...selectedLanguageIds, languageId];

        setSelectedLanguageIds(nextLanguageIds);

        setSelectedTechnologyIds((currentIds) =>
            currentIds.filter((technologyId) => {
                const technology = technologies.find(
                    (item) => String(item.id) === String(technologyId)
                );
                return Boolean(
                    technology &&
                    technologyMatchesLanguages(technology, nextLanguageIds)
                );
            })
        );

        clearError();
    };

    // =====================================================
    // TECHNOLOGY TOGGLE
    // =====================================================

    const handleTechnologyToggle = (technology) => {
        if (isSubmitting || stackLoading || !technology) return;

        if (!technologyMatchesLanguages(technology, selectedLanguageIds)) {
            siteToast.warning(
                "Bu texnologiya tanlangan dasturlash tillariga mos kelmaydi.",
                { title: "Technology mos emas" }
            );
            return;
        }

        const technologyId = String(technology.id);
        setSelectedTechnologyIds((current) =>
            current.includes(technologyId)
                ? current.filter((id) => id !== technologyId)
                : [...current, technologyId]
        );
        clearError();
    };

    // =====================================================
    // IMAGE TITLE CHANGE
    // =====================================================

    const handleImageTitleChange = (id, value) => {
        if (isSubmitting) return;

        setImages((current) =>
            current.map((image) =>
                image.id === id ? { ...image, title: value } : image
            )
        );
        clearError();
    };

    // =====================================================
    // MULTIPLE IMAGE SELECTION
    //
    // Parent validates formats, enforces max count,
    // and creates object URLs for previews.
    // =====================================================

    const handleMultipleImageSelect = (event) => {
        const files = Array.from(event.target.files || []);
        event.target.value = "";

        if (isSubmitting || files.length === 0) return;

        const invalidFiles = files.filter((file) => !isAllowedImage(file));
        if (invalidFiles.length > 0) {
            siteToast.warning(
                "Faqat JPG, JPEG, PNG yoki WEBP rasmlarini yuklash mumkin.",
                { title: "Noto‘g‘ri fayl" }
            );
        }

        const validFiles = files.filter(isAllowedImage);
        if (validFiles.length === 0) return;

        const remainingSlots = MAX_PROJECT_IMAGES - images.length;
        if (remainingSlots <= 0) {
            siteToast.warning(
                `Bitta loyihaga maksimum ${MAX_PROJECT_IMAGES} ta rasm qo‘shish mumkin.`,
                { title: "Rasm limiti" }
            );
            return;
        }

        const acceptedFiles = validFiles.slice(0, remainingSlots);
        if (validFiles.length > remainingSlots) {
            siteToast.info(
                `Faqat ${remainingSlots} ta rasm uchun joy qoldi. Birinchi ${acceptedFiles.length} ta rasm qo‘shildi.`,
                { title: `${MAX_PROJECT_IMAGES} ta rasm limiti` }
            );
        }

        const newImages = acceptedFiles.map((file, index) => {
            const image = createLocalImage(file, index);
            trackBlobUrl(image.url);
            return image;
        });

        setImages((current) => [...current, ...newImages]);
        clearError();
    };

    // =====================================================
    // REPLACE IMAGE
    //
    // Preserve the image ID and isNew flag for FormData.
    // =====================================================

    const handleReplaceImage = (id, file) => {
        if (isSubmitting || !file) return;

        if (!isAllowedImage(file)) {
            siteToast.warning(
                "Faqat JPG, JPEG, PNG yoki WEBP rasmlarini yuklash mumkin.",
                { title: "Noto‘g‘ri fayl" }
            );
            return;
        }

        const previousImage = images.find((image) => image.id === id);
        if (!previousImage) return;

        const nextUrl = URL.createObjectURL(file);
        trackBlobUrl(nextUrl);

        setImages((current) =>
            current.map((image) =>
                image.id === id
                    ? { ...image, file, url: nextUrl }
                    : image
            )
        );

        releaseBlobUrl(previousImage.url);
        clearError();
    };

    // =====================================================
    // REMOVE IMAGE
    // =====================================================

    const handleRemoveImage = (id) => {
        if (isSubmitting) return;

        const removedImage = images.find((image) => image.id === id);
        if (!removedImage) return;

        setImages((current) =>
            current.filter((image) => image.id !== id)
        );
        releaseBlobUrl(removedImage.url);
        clearError();
    };

    // =====================================================
    // VALIDATION AND SUBMIT
    // =====================================================

    const scrollToFormTop = () => {
        modalScrollRef.current?.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const validateForm = () =>
        validateProjectForm({
            formData,
            selectedLanguageIds,
            selectedTechnologyIds,
            images,
        });

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isSubmitting || submittingRef.current) return;

        setError("");

        if (stackLoading) {
            const message = "Tillar va texnologiyalar hali yuklanmoqda.";
            setError(message);
            siteToast.warning(message, { title: "Iltimos, kuting" });
            scrollToFormTop();
            return;
        }

        if (stackError) {
            const message =
                "Stack katalogi yuklanmadi. Modalni qayta ochib urinib ko‘ring.";
            setError(message);
            siteToast.warning(message, { title: "Katalog xatoligi" });
            scrollToFormTop();
            return;
        }

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            siteToast.warning(validationError, {
                title: "Formani tekshiring",
            });
            scrollToFormTop();
            return;
        }

        if (typeof onSubmit !== "function") {
            const message = "Loyihani saqlash funksiyasi ulanmagan.";
            setError(message);
            siteToast.error(message, { title: "Saqlashda xatolik" });
            scrollToFormTop();
            return;
        }

        const submitSession = sessionRef.current;
        submittingRef.current = true;
        setLocalSubmitting(true);

        try {
            const projectData = buildProjectFormData({
                formData,
                selectedLanguageIds,
                selectedTechnologyIds,
                images,
                isEditMode,
            });

            const result = await onSubmit(
                projectData,
                initialDataRef.current?.id
            );

            // Do not let an old request close a new modal session.
            if (sessionRef.current !== submitSession) return;

            if (result === false) {
                throw new Error("Loyihani saqlash amalga oshmadi.");
            }

            onClose?.();
        } catch (requestError) {
            if (sessionRef.current !== submitSession) return;

            const message = getErrorMessage(requestError);
            setError(message);
            console.error("Project create/update error:", requestError);
            siteToast.error(message, { title: "Saqlashda xatolik" });
            scrollToFormTop();
        } finally {
            if (sessionRef.current === submitSession) {
                submittingRef.current = false;
                setLocalSubmitting(false);
            }
        }
    };

    // Keep all hooks above the early return.
    if (!isOpen) return null;

    // =====================================================
    // PORTAL / MODAL LAYOUT
    //
    // z-index and Portal solve the Navbar overlap.
    // Desktop height is capped at 780px and centered.
    // Header/Footer remain outside the inner scrolling area.
    // =====================================================

    return createPortal(
        <div
            className="
                fixed inset-0 z-[99999]
                flex items-stretch justify-center
                overflow-hidden bg-slate-950/75 p-0
                backdrop-blur-md dark:bg-black/80
                sm:items-center sm:px-5 sm:py-10
                lg:px-8 lg:py-12
            "
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    handleClose();
                }
            }}
        >
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="project-create-modal-title"
                aria-describedby="project-create-modal-description"
                tabIndex={-1}
                className="
                    relative flex h-[100dvh] max-h-[100dvh]
                    w-full min-w-0 max-w-5xl flex-col overflow-hidden
                    rounded-none border-0 bg-white
                    shadow-[0_40px_120px_rgba(0,0,0,0.30)]
                    dark:bg-[#0b1018]
                    dark:shadow-[0_40px_120px_rgba(0,0,0,0.70)]
                    sm:h-[min(780px,calc(100dvh-80px))]
                    sm:max-h-[calc(100dvh-80px)]
                    sm:rounded-[26px] sm:border sm:border-slate-200
                    dark:sm:border-white/[0.08]
                    lg:rounded-[30px]
                "
            >
                {/* DECORATIVE BACKGROUND */}
                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none absolute -right-32 -top-32
                        h-80 w-80 rounded-full bg-indigo-500/[0.08]
                        blur-[110px] dark:bg-indigo-500/[0.12]
                    "
                />
                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none absolute -bottom-32 left-1/4
                        h-72 w-72 rounded-full bg-purple-500/[0.04]
                        blur-[110px] dark:bg-purple-500/[0.06]
                    "
                />

                {/* HEADER: outside the scrollable form */}
                <div className="relative z-20 min-w-0 shrink-0">
                    <ProjectCreateHeader
                        isEditMode={isEditMode}
                        isSubmitting={isSubmitting}
                        onClose={handleClose}
                    />
                </div>

                {/* FORM: footer remains inside so type=submit works */}
                <form
                    onSubmit={handleSubmit}
                    className="
                        relative z-10 flex min-h-0 min-w-0 flex-1
                        flex-col overflow-hidden
                    "
                >
                    {/* ONLY THE FORM BODY SCROLLS */}
                    <div
                        ref={modalScrollRef}
                        className="
                            min-h-0 min-w-0 flex-1
                            overflow-x-hidden overflow-y-auto
                            overscroll-contain scroll-smooth
                            [scrollbar-gutter:stable] touch-pan-y
                        "
                    >
                        <div
                            className="
                                grid min-w-0 grid-cols-1 items-start
                                gap-4 p-3 pb-6
                                sm:gap-6 sm:p-5 sm:pb-7 md:p-7
                                xl:grid-cols-[minmax(0,1fr)_minmax(0,340px)]
                            "
                        >
                            {/* LEFT SIDE: FIELDS + STACK */}
                            <div className="w-full min-w-0 space-y-5 sm:space-y-6">
                                {error && (
                                    <div
                                        role="alert"
                                        className="
                                            flex min-w-0 items-start gap-3
                                            rounded-2xl border border-red-200
                                            bg-red-50 p-3 text-xs font-semibold
                                            leading-6 text-red-700
                                            dark:border-red-400/20
                                            dark:bg-red-500/[0.06]
                                            dark:text-red-300 sm:p-4
                                        "
                                    >
                                        <AlertTriangle
                                            size={17}
                                            aria-hidden="true"
                                            className="mt-0.5 shrink-0"
                                        />
                                        <span className="min-w-0 flex-1 break-words [overflow-wrap:anywhere]">
                                            {error}
                                        </span>
                                    </div>
                                )}

                                <ProjectCreateFields
                                    formData={formData}
                                    onChange={handleInputChange}
                                    disabled={isSubmitting}
                                />

                                <ProjectCreateStack
                                    languages={languages}
                                    compatibleTechnologies={compatibleTechnologies}
                                    selectedLanguageIds={selectedLanguageIds}
                                    selectedTechnologyIds={selectedTechnologyIds}
                                    stackLoading={stackLoading}
                                    stackError={stackError}
                                    isSubmitting={isSubmitting}
                                    onLanguageToggle={handleLanguageToggle}
                                    onTechnologyToggle={handleTechnologyToggle}
                                />
                            </div>

                            {/* RIGHT SIDE: IMAGES + STACK PREVIEW */}
                            <div className="w-full min-w-0 space-y-5 sm:space-y-6">
                                <ProjectCreateImages
                                    images={images}
                                    isSubmitting={isSubmitting}
                                    onMultipleImageSelect={handleMultipleImageSelect}
                                    onImageTitleChange={handleImageTitleChange}
                                    onReplaceImage={handleReplaceImage}
                                    onRemoveImage={handleRemoveImage}
                                />

                                <ProjectCreateStackPreview
                                    selectedLanguages={selectedLanguages}
                                    selectedTechnologies={selectedTechnologies}
                                />
                            </div>
                        </div>
                    </div>

                    {/* FOOTER: always visible, still inside form */}
                    <div className="relative z-20 min-w-0 shrink-0">
                        <ProjectCreateFooter
                            isEditMode={isEditMode}
                            isSubmitting={isSubmitting}
                            stackLoading={stackLoading}
                            onClose={handleClose}
                        />
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default ProjectFormModal;
