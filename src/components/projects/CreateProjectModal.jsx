
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    AlertTriangle,
} from "lucide-react";

import ProjectService from "../../services/project";

import {
    siteToast,
} from "../ui/AuthToast";

// =========================================================
// CREATE PROJECT COMPONENTS
// =========================================================

import ProjectCreateHeader from "./create/ProjectCreateHeader";

import ProjectCreateFields from "./create/ProjectCreateFields";

import ProjectCreateStack from "./create/ProjectCreateStack";

import ProjectCreateImages from "./create/ProjectCreateImages";

import ProjectCreateStackPreview from "./create/ProjectCreateStackPreview";

import ProjectCreateFooter from "./create/ProjectCreateFooter";

// =========================================================
// HELPERS
// =========================================================

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

// =========================================================
// PROJECT FORM MODAL
//
// Props:
// - isOpen
// - onClose
// - onSubmit
// - initialData
// - isSubmitting
//
// Create:
//   initialData = null
//
// Edit:
//   initialData = existing project
//
// Preserved backend contract:
//   onSubmit(formData, projectId)
//
// Responsibilities:
// - Form state
// - Stack catalog loading
// - Language / technology selection
// - Image state and previews
// - Form validation
// - Multipart submission
// - Create / Edit lifecycle
//
// Presentational JSX lives in ./create/
// =========================================================

const ProjectFormModal = ({
    isOpen,
    onClose,
    onSubmit,
    initialData = null,
    isSubmitting: parentSubmitting = false,
}) => {
    // =====================================================
    // MODE
    // =====================================================

    const isEditMode = Boolean(initialData);

    // =====================================================
    // FORM STATE
    // =====================================================

    const [
        formData,
        setFormData,
    ] = useState(() => ({
        ...EMPTY_PROJECT_FORM,
    }));

    // =====================================================
    // STACK CATALOG
    // =====================================================

    const [
        languages,
        setLanguages,
    ] = useState(EMPTY_ARRAY);

    const [
        technologies,
        setTechnologies,
    ] = useState(EMPTY_ARRAY);

    // =====================================================
    // SELECTED STACK IDS
    // =====================================================

    const [
        selectedLanguageIds,
        setSelectedLanguageIds,
    ] = useState([]);

    const [
        selectedTechnologyIds,
        setSelectedTechnologyIds,
    ] = useState([]);

    // =====================================================
    // STACK REQUEST STATE
    // =====================================================

    const [
        stackLoading,
        setStackLoading,
    ] = useState(false);

    const [
        stackError,
        setStackError,
    ] = useState("");

    // =====================================================
    // IMAGES
    // =====================================================

    const [
        images,
        setImages,
    ] = useState([]);

    // =====================================================
    // SUBMIT STATE
    // =====================================================

    const [
        localSubmitting,
        setLocalSubmitting,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState("");

    const isSubmitting =
        localSubmitting || parentSubmitting;

    // =====================================================
    // IMAGE OBJECT URL REGISTRY
    //
    // Track only blob URLs created by this modal.
    //
    // Existing backend image URLs must never be revoked.
    //
    // Cleanup happens:
    // - On image replacement
    // - On image removal
    // - On modal close / unmount
    // - When edit data is reset
    // =====================================================

    const blobUrlsRef = useRef(new Set());

    // =====================================================
    // TRACK LOCAL IMAGE URL
    // =====================================================

    const trackBlobUrl = useCallback((url) => {
        if (
            typeof url === "string" &&
            url.startsWith("blob:")
        ) {
            blobUrlsRef.current.add(url);
        }
    }, []);

    // =====================================================
    // RELEASE ONE LOCAL IMAGE URL
    // =====================================================

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

    // =====================================================
    // RELEASE ALL LOCAL IMAGE URLS
    // =====================================================

    const releaseAllBlobUrls = useCallback(() => {
        const urls = blobUrlsRef.current;

        urls.forEach((url) => {
            revokeLocalImageUrl({ url });
        });

        urls.clear();
    }, []);

    // =====================================================
    // INITIAL DATA + STACK CATALOG
    //
    // Load whenever the modal opens or the project
    // being edited changes.
    //
    // Original API:
    // ProjectService.getStackCatalog()
    //
    // Original response:
    // {
    //     languages: [...],
    //     technologies: [...]
    // }
    // =====================================================

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        let cancelled = false;

        // ================================================
        // RESET REQUEST STATE
        // ================================================

        setError("");
        setStackError("");
        setLocalSubmitting(false);
        setStackLoading(true);

        // A new modal session must not retain old
        // locally generated image preview URLs.

        releaseAllBlobUrls();

        // ================================================
        // INITIAL FORM
        // ================================================

        setFormData(
            getInitialProjectForm(initialData)
        );

        // ================================================
        // INITIAL IMAGES
        // ================================================

        setImages(
            initialData
                ? formatImagesForEdit(
                      initialData.images
                  )
                : []
        );

        // ================================================
        // INITIAL LANGUAGES
        // ================================================

        const initialLanguageIds =
            getInitialLanguageIds(initialData);

        setSelectedLanguageIds(
            initialLanguageIds
        );

        // ================================================
        // INITIAL TECHNOLOGIES
        // ================================================

        const initialTechnologyIds =
            getInitialTechnologyIds(initialData);

        setSelectedTechnologyIds(
            initialTechnologyIds
        );

        // ================================================
        // LOAD STACK CATALOG
        // ================================================

        const loadStackCatalog = async () => {
            try {
                const response =
                    await ProjectService
                        .getStackCatalog();

                if (cancelled) {
                    return;
                }

                // ========================================
                // NORMALIZE CATALOG
                // ========================================

                const loadedLanguages =
                    normalizeCatalog(
                        response?.languages
                    );

                const loadedTechnologies =
                    normalizeCatalog(
                        response?.technologies
                    );

                setLanguages(loadedLanguages);

                setTechnologies(
                    loadedTechnologies
                );

                setStackError("");

                // ========================================
                // EDIT MODE COMPATIBILITY
                //
                // Original behavior:
                //
                // Remove old technology selections
                // that are no longer present or no
                // longer match selected languages.
                // ========================================

                if (initialData) {
                    const validTechnologyIds =
                        initialTechnologyIds.filter(
                            (technologyId) => {
                                const technology =
                                    loadedTechnologies.find(
                                        (item) =>
                                            String(
                                                item.id
                                            ) ===
                                            String(
                                                technologyId
                                            )
                                    );

                                if (!technology) {
                                    return false;
                                }

                                return technologyMatchesLanguages(
                                    technology,
                                    initialLanguageIds
                                );
                            }
                        );

                    setSelectedTechnologyIds(
                        validTechnologyIds
                    );
                }
            } catch (requestError) {
                if (cancelled) {
                    return;
                }

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
                if (!cancelled) {
                    setStackLoading(false);
                }
            }
        };

        loadStackCatalog();

        // ================================================
        // CLEANUP
        // ================================================

        return () => {
            cancelled = true;

            releaseAllBlobUrls();
        };
    }, [
        isOpen,
        initialData,
        releaseAllBlobUrls,
    ]);

    // =====================================================
    // BODY SCROLL LOCK + ESCAPE
    //
    // Original modal behavior:
    //
    // - Disable page scrolling while open.
    // - Escape closes the modal.
    // - Escape is ignored during submission.
    // =====================================================

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const previousOverflow =
            document.body.style.overflow;

        document.body.style.overflow =
            "hidden";

        const handleKeyDown = (event) => {
            if (
                event.key === "Escape" &&
                !isSubmitting
            ) {
                onClose?.();
            }
        };

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            document.body.style.overflow =
                previousOverflow;

            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [
        isOpen,
        isSubmitting,
        onClose,
    ]);

    // =====================================================
    // SELECTED LANGUAGES
    //
    // Keep original catalog order.
    // =====================================================

    const selectedLanguages = useMemo(() => {
        return languages.filter((language) =>
            selectedLanguageIds.includes(
                String(language.id)
            )
        );
    }, [
        languages,
        selectedLanguageIds,
    ]);

    // =====================================================
    // COMPATIBLE TECHNOLOGIES
    //
    // Original rule:
    //
    // Technology is compatible when:
    // - It is universal
    // - No language is selected
    // - Its language IDs match at least one
    //   selected language
    // =====================================================

    const compatibleTechnologies = useMemo(
        () => {
            return technologies.filter(
                (technology) =>
                    technologyMatchesLanguages(
                        technology,
                        selectedLanguageIds
                    )
            );
        },
        [
            technologies,
            selectedLanguageIds,
        ]
    );

    // =====================================================
    // SELECTED TECHNOLOGIES
    //
    // Used by StackPreview.
    // =====================================================

    const selectedTechnologies = useMemo(
        () => {
            return technologies.filter(
                (technology) =>
                    selectedTechnologyIds.includes(
                        String(technology.id)
                    )
            );
        },
        [
            technologies,
            selectedTechnologyIds,
        ]
    );

    // =====================================================
    // CLEAR SUBMIT ERROR
    // =====================================================

    const clearError = () => {
        setError("");
    };

    // =====================================================
    // FORM INPUT CHANGE
    //
    // Expected event.target:
    //
    // {
    //     name,
    //     value
    // }
    //
    // Field names remain unchanged.
    // =====================================================

    const handleInputChange = (event) => {
        const {
            name,
            value,
        } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));

        clearError();
    };

    // =====================================================
    // LANGUAGE TOGGLE
    //
    // Original functionality:
    //
    // 1. Select/unselect the language.
    // 2. Remove selected technologies that no
    //    longer match the updated language set.
    // =====================================================

    const handleLanguageToggle = (language) => {
        if (
            isSubmitting ||
            stackLoading ||
            !language
        ) {
            return;
        }

        const languageId = String(
            language.id
        );

        const alreadySelected =
            selectedLanguageIds.includes(
                languageId
            );

        const nextLanguageIds =
            alreadySelected
                ? selectedLanguageIds.filter(
                      (id) =>
                          id !== languageId
                  )
                : [
                      ...selectedLanguageIds,
                      languageId,
                  ];

        // ================================================
        // UPDATE LANGUAGES
        // ================================================

        setSelectedLanguageIds(
            nextLanguageIds
        );

        // ================================================
        // REMOVE INCOMPATIBLE TECHNOLOGIES
        //
        // Preserve original filtering behavior.
        // ================================================

        setSelectedTechnologyIds(
            (currentTechnologyIds) => {
                return currentTechnologyIds.filter(
                    (technologyId) => {
                        const technology =
                            technologies.find(
                                (item) =>
                                    String(
                                        item.id
                                    ) ===
                                    String(
                                        technologyId
                                    )
                            );

                        if (!technology) {
                            return false;
                        }

                        return technologyMatchesLanguages(
                            technology,
                            nextLanguageIds
                        );
                    }
                );
            }
        );

        clearError();
    };

    // =====================================================
    // TECHNOLOGY TOGGLE
    //
    // Original behavior:
    //
    // - Do not allow incompatible technologies.
    // - Display toast for invalid selection.
    // - Toggle selected IDs.
    // =====================================================

    const handleTechnologyToggle = (
        technology
    ) => {
        if (
            isSubmitting ||
            stackLoading ||
            !technology
        ) {
            return;
        }

        // ================================================
        // LANGUAGE COMPATIBILITY
        // ================================================

        if (
            !technologyMatchesLanguages(
                technology,
                selectedLanguageIds
            )
        ) {
            siteToast.warning(
                "Bu texnologiya tanlangan dasturlash tillariga mos kelmaydi.",
                {
                    title:
                        "Technology mos emas",
                }
            );

            return;
        }

        // ================================================
        // TOGGLE TECHNOLOGY
        // ================================================

        const technologyId = String(
            technology.id
        );

        setSelectedTechnologyIds(
            (current) => {
                if (
                    current.includes(
                        technologyId
                    )
                ) {
                    return current.filter(
                        (id) =>
                            id !== technologyId
                    );
                }

                return [
                    ...current,
                    technologyId,
                ];
            }
        );

        clearError();
    };

    // =====================================================
    // IMAGE TITLE CHANGE
    //
    // No file changes.
    // Preserve ID, URL and image metadata.
    // =====================================================

    const handleImageTitleChange = (
        id,
        value
    ) => {
        if (isSubmitting) {
            return;
        }

        setImages((current) =>
            current.map((image) =>
                image.id === id
                    ? {
                          ...image,
                          title: value,
                      }
                    : image
            )
        );

        clearError();
    };

    // =====================================================
    // ADD MULTIPLE IMAGES
    //
    // Original features:
    //
    // - Multiple file selection
    // - JPG / JPEG / PNG / WEBP
    // - Maximum 4 images
    // - Partial acceptance when near limit
    // - Warning / info toast
    // - Local blob previews
    // =====================================================

    const handleMultipleImageSelect = (
        event
    ) => {
        // ================================================
        // READ FILES
        // ================================================

        const files = Array.from(
            event.target.files || []
        );

        // Allow selecting the same file later.

        event.target.value = "";

        if (
            isSubmitting ||
            files.length === 0
        ) {
            return;
        }

        // ================================================
        // VALIDATE FILE EXTENSIONS
        // ================================================

        const invalidFiles = files.filter(
            (file) =>
                !isAllowedImage(file)
        );

        if (invalidFiles.length > 0) {
            siteToast.warning(
                "Faqat JPG, JPEG, PNG yoki WEBP rasmlarini yuklash mumkin.",
                {
                    title: "Noto‘g‘ri fayl",
                }
            );
        }

        const validFiles = files.filter(
            isAllowedImage
        );

        if (validFiles.length === 0) {
            return;
        }

        // ================================================
        // REMAINING SLOTS
        // ================================================

        const remainingSlots =
            MAX_PROJECT_IMAGES -
            images.length;

        if (remainingSlots <= 0) {
            siteToast.warning(
                `Bitta loyihaga maksimum ${MAX_PROJECT_IMAGES} ta rasm qo‘shish mumkin.`,
                {
                    title: "Rasm limiti",
                }
            );

            return;
        }

        // ================================================
        // ACCEPT ONLY AVAILABLE SLOTS
        // ================================================

        const acceptedFiles =
            validFiles.slice(
                0,
                remainingSlots
            );

        if (
            validFiles.length >
            remainingSlots
        ) {
            siteToast.info(
                `Faqat ${remainingSlots} ta rasm uchun joy qoldi. Birinchi ${acceptedFiles.length} ta rasm qo‘shildi.`,
                {
                    title:
                        `${MAX_PROJECT_IMAGES} ta rasm limiti`,
                }
            );
        }

        // ================================================
        // CREATE LOCAL IMAGES
        //
        // Blob URLs must be created outside a
        // React state updater.
        // ================================================

        const newImages = acceptedFiles.map(
            (file, index) => {
                const image =
                    createLocalImage(
                        file,
                        index
                    );

                trackBlobUrl(
                    image.url
                );

                return image;
            }
        );

        // ================================================
        // UPDATE STATE
        // ================================================

        setImages((current) => [
            ...current,
            ...newImages,
        ]);

        clearError();
    };

    // =====================================================
    // REPLACE IMAGE
    //
    // Preserve original image ID.
    //
    // Existing image being replaced:
    //
    // {
    //     id: existing DB ID,
    //     isNew: false,
    //     file: new file,
    //     url: new blob URL
    // }
    //
    // This is important for multipart editing.
    // =====================================================

    const handleReplaceImage = (
        id,
        file
    ) => {
        if (
            isSubmitting ||
            !file
        ) {
            return;
        }

        // ================================================
        // VALIDATE IMAGE
        // ================================================

        if (!isAllowedImage(file)) {
            siteToast.warning(
                "Faqat JPG, JPEG, PNG yoki WEBP rasmlarini yuklash mumkin.",
                {
                    title: "Noto‘g‘ri fayl",
                }
            );

            return;
        }

        // ================================================
        // FIND EXISTING IMAGE
        // ================================================

        const previousImage =
            images.find(
                (image) =>
                    image.id === id
            );

        if (!previousImage) {
            return;
        }

        // ================================================
        // NEW PREVIEW URL
        //
        // Create it outside setState updater.
        // ================================================

        const nextUrl =
            URL.createObjectURL(file);

        trackBlobUrl(nextUrl);

        // ================================================
        // UPDATE IMAGE
        // ================================================

        setImages((current) =>
            current.map((image) => {
                if (image.id !== id) {
                    return image;
                }

                return {
                    ...image,

                    file,

                    url: nextUrl,
                };
            })
        );

        // ================================================
        // RELEASE PREVIOUS LOCAL PREVIEW
        //
        // Backend URLs are not tracked and therefore
        // are never revoked.
        // ================================================

        releaseBlobUrl(
            previousImage.url
        );

        clearError();
    };

    // =====================================================
    // REMOVE IMAGE
    //
    // Removing an existing image from the list
    // means its ID is not included in the final
    // multipart image collection.
    //
    // This preserves the original submit contract.
    // =====================================================

    const handleRemoveImage = (id) => {
        if (isSubmitting) {
            return;
        }

        // ================================================
        // FIND IMAGE
        // ================================================

        const removedImage =
            images.find(
                (image) =>
                    image.id === id
            );

        if (!removedImage) {
            return;
        }

        // ================================================
        // REMOVE FROM STATE
        // ================================================

        setImages((current) =>
            current.filter(
                (image) =>
                    image.id !== id
            )
        );

        // ================================================
        // CLEAN LOCAL URL
        // ================================================

        releaseBlobUrl(
            removedImage.url
        );

        clearError();
    };

    // =====================================================
    // VALIDATE FORM
    //
    // Existing rules:
    //
    // - Name: required, max 30
    // - Features: required, max 150
    // - Description: required
    // - Language: at least one
    // - Technology: at least one
    // - Images: 1 to 4
    //
    // Full validation lives in projectCreateHelpers.
    // =====================================================

    const validateForm = () => {
        return validateProjectForm({
            formData,
            selectedLanguageIds,
            selectedTechnologyIds,
            images,
        });
    };

    // =====================================================
    // SUBMIT
    //
    // Original API contract:
    //
    // await onSubmit(
    //     projectData,
    //     initialData?.id
    // );
    //
    // FormData fields:
    //
    // name
    // main_features
    // description
    // website_url
    // language
    // technology
    // languages
    // technologies
    // images[0]image
    // images[0]title
    // images[0]id
    // =====================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (isSubmitting) {
            return;
        }

        setError("");

        // ================================================
        // CLIENT VALIDATION
        // ================================================

        const validationError =
            validateForm();

        if (validationError) {
            setError(
                validationError
            );

            siteToast.warning(
                validationError,
                {
                    title:
                        "Formani tekshiring",
                }
            );

            return;
        }

        // ================================================
        // ENSURE SUBMIT CALLBACK EXISTS
        // ================================================

        if (
            typeof onSubmit !== "function"
        ) {
            const message =
                "Loyihani saqlash funksiyasi ulanmagan.";

            setError(message);

            siteToast.error(
                message,
                {
                    title:
                        "Saqlashda xatolik",
                }
            );

            return;
        }

        // ================================================
        // BEGIN SUBMIT
        // ================================================

        setLocalSubmitting(true);

        // ================================================
        // BUILD MULTIPART FORMDATA
        //
        // Original request field names are preserved.
        // ================================================

        try {
            const projectData =
                buildProjectFormData({
                    formData,
                    selectedLanguageIds,
                    selectedTechnologyIds,
                    images,
                    isEditMode,
                });

            // ============================================
            // CREATE OR UPDATE
            //
            // Parent callback still decides which
            // service method to call.
            // ============================================

            await onSubmit(
                projectData,
                initialData?.id
            );

            // ============================================
            // SUCCESS
            //
            // Original behavior:
            // Close after successful callback.
            // ============================================

            onClose?.();
        } catch (requestError) {
            // ============================================
            // API ERROR
            //
            // Keep modal open and show error.
            // ============================================

            const message =
                getErrorMessage(
                    requestError
                );

            setError(message);

            console.error(
                "Project create/update error:",
                requestError
            );
        } finally {
            setLocalSubmitting(false);
        }
    };

    // =====================================================
    // CLOSE
    //
    // Do not close while submitting.
    // =====================================================

    const handleClose = () => {
        if (isSubmitting) {
            return;
        }

        onClose?.();
    };

    // =====================================================
    // CLOSED MODAL
    //
    // Keep all hooks above this condition.
    // =====================================================

    if (!isOpen) {
        return null;
    }

    // =====================================================
    // JSX
    // =====================================================

    return (
        <div
            className="
                fixed
                inset-0
                z-[100]

                flex
                items-center
                justify-center

                overflow-y-auto

                bg-slate-950/70

                p-3

                backdrop-blur-md

                dark:bg-black/80

                sm:p-5
            "
            onMouseDown={(event) => {
                // =========================================
                // CLOSE ONLY WHEN CLICKING BACKDROP
                // =========================================

                if (
                    event.target ===
                    event.currentTarget
                ) {
                    handleClose();
                }
            }}
        >
            {/* =============================================
                MODAL PANEL
            ============================================== */}

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="project-create-modal-title"
                aria-describedby="project-create-modal-description"
                className="
                    relative

                    flex
                    max-h-[94vh]
                    w-full
                    max-w-5xl

                    flex-col

                    overflow-hidden

                    rounded-[30px]
                    border

                    border-slate-200

                    bg-white

                    shadow-[0_40px_120px_rgba(0,0,0,0.30)]

                    dark:border-white/[0.08]
                    dark:bg-[#0b1018]
                    dark:shadow-[0_40px_120px_rgba(0,0,0,0.70)]
                "
            >
                {/* =========================================
                    DECORATIVE BACKGROUND
                ========================================== */}

                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none

                        absolute
                        -right-32
                        -top-32

                        h-80
                        w-80

                        rounded-full

                        bg-indigo-500/[0.08]

                        blur-[110px]

                        dark:bg-indigo-500/[0.12]
                    "
                />

                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none

                        absolute
                        -bottom-32
                        left-1/4

                        h-72
                        w-72

                        rounded-full

                        bg-purple-500/[0.04]

                        blur-[110px]

                        dark:bg-purple-500/[0.06]
                    "
                />

                {/* =========================================
                    HEADER
                ========================================== */}

                <ProjectCreateHeader
                    isEditMode={isEditMode}
                    isSubmitting={isSubmitting}
                    onClose={handleClose}
                />

                {/* =========================================
                    FORM
                ========================================== */}

                <form
                    onSubmit={handleSubmit}
                    className="
                        relative
                        z-10

                        min-h-0
                        flex-1

                        overflow-y-auto
                    "
                >
                    {/* =====================================
                        MAIN GRID
                    ====================================== */}

                    <div
                        className="
                            grid
                            min-w-0
                            gap-6

                            p-5

                            sm:p-7

                            lg:grid-cols-[minmax(0,1fr)_340px]
                        "
                    >
                        {/* =================================
                            LEFT SIDE
                        ================================== */}

                        <div
                            className="
                                min-w-0
                                space-y-6
                            "
                        >
                            {/* =============================
                                SUBMIT ERROR
                            ============================== */}

                            {error && (
                                <div
                                    role="alert"
                                    className="
                                        flex
                                        items-start
                                        gap-3

                                        rounded-2xl
                                        border

                                        border-red-200
                                        bg-red-50

                                        p-4

                                        text-xs
                                        font-semibold
                                        leading-6

                                        text-red-700

                                        dark:border-red-400/20
                                        dark:bg-red-500/[0.06]
                                        dark:text-red-300
                                    "
                                >
                                    <AlertTriangle
                                        size={17}
                                        aria-hidden="true"
                                        className="
                                            mt-0.5
                                            shrink-0
                                        "
                                    />

                                    <span>
                                        {error}
                                    </span>
                                </div>
                            )}

                            {/* =============================
                                BASIC PROJECT FIELDS
                            ============================== */}

                            <ProjectCreateFields
                                formData={formData}
                                onChange={
                                    handleInputChange
                                }
                                disabled={
                                    isSubmitting
                                }
                            />

                            {/* =============================
                                TECHNOLOGY STACK
                            ============================== */}

                            <ProjectCreateStack
                                languages={
                                    languages
                                }
                                compatibleTechnologies={
                                    compatibleTechnologies
                                }
                                selectedLanguageIds={
                                    selectedLanguageIds
                                }
                                selectedTechnologyIds={
                                    selectedTechnologyIds
                                }
                                stackLoading={
                                    stackLoading
                                }
                                stackError={
                                    stackError
                                }
                                isSubmitting={
                                    isSubmitting
                                }
                                onLanguageToggle={
                                    handleLanguageToggle
                                }
                                onTechnologyToggle={
                                    handleTechnologyToggle
                                }
                            />
                        </div>

                        {/* =================================
                            RIGHT SIDE
                        ================================== */}

                        <div
                            className="
                                min-w-0
                                space-y-5
                            "
                        >
                            {/* =============================
                                PROJECT IMAGES
                            ============================== */}

                            <ProjectCreateImages
                                images={images}
                                isSubmitting={
                                    isSubmitting
                                }
                                onMultipleImageSelect={
                                    handleMultipleImageSelect
                                }
                                onImageTitleChange={
                                    handleImageTitleChange
                                }
                                onReplaceImage={
                                    handleReplaceImage
                                }
                                onRemoveImage={
                                    handleRemoveImage
                                }
                            />

                            {/* =============================
                                SELECTED STACK PREVIEW
                            ============================== */}

                            <ProjectCreateStackPreview
                                selectedLanguages={
                                    selectedLanguages
                                }
                                selectedTechnologies={
                                    selectedTechnologies
                                }
                            />
                        </div>
                    </div>

                    {/* =====================================
                        FOOTER
                        MUST REMAIN INSIDE FORM
                    ====================================== */}

                    <ProjectCreateFooter
                        isEditMode={isEditMode}
                        isSubmitting={isSubmitting}
                        stackLoading={stackLoading}
                        onClose={handleClose}
                    />
                </form>
            </div>
        </div>
    );
};

// =========================================================
// EXPORT
//
// Keep the original default export contract.
// Existing import paths do not need changes.
// =========================================================

export default ProjectFormModal;
