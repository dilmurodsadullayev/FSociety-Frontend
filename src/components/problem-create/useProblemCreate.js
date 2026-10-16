
import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
    getLanguagesStart,
    getLanguagesSuccess,
    getProblemDetailSuccess,
} from "../../features/problems/Problems";

import ProblemService from "../../services/problems";

import {
    buildProblemPayload,
    createEmptyProblemForm,
    formatProblemBackendError,
    getProblemPrismLanguage,
    hasId,
    mapProblemToForm,
    normalizeOptions,
    sameId,
    validateProblemForm,
} from "./problemCreateHelpers";

const useProblemCreate = ({ id }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isEdit = hasId(id);
    const modeKey = isEdit ? `edit:${id}` : "create";

    const emptyForm = useMemo(createEmptyProblemForm, []);

    const [formState, setFormState] = useState(() => ({
        key: modeKey,
        values: createEmptyProblemForm(),
    }));

    const form =
        formState.key === modeKey
            ? formState.values
            : emptyForm;

    const [languageOptions, setLanguageOptions] = useState([]);
    const [technologyOptions, setTechnologyOptions] = useState([]);

    const [languagesLoading, setLanguagesLoading] = useState(true);
    const [technologiesLoading, setTechnologiesLoading] = useState(true);

    const [languagesError, setLanguagesError] = useState("");
    const [technologiesError, setTechnologiesError] = useState("");

    const [detailState, setDetailState] = useState({
        key: modeKey,
        loading: isEdit,
        error: "",
    });

    const [original, setOriginal] = useState({
        key: modeKey,
        record: null,
        deadline: "",
    });

    const [submissionError, setSubmissionError] = useState("");
    const [siteAlert, setSiteAlert] = useState(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] =
        useState(false);

    const mountedRef = useRef(false);
    const routeKeyRef = useRef(modeKey);

    const languageRequestRef = useRef(0);
    const technologyRequestRef = useRef(0);
    const detailRequestRef = useRef(0);

    const submitLockRef = useRef(false);
    const deleteLockRef = useRef(false);
    const navigationTimerRef = useRef(null);
    const alertSequenceRef = useRef(0);

    routeKeyRef.current = modeKey;

    // =====================================================
    // LIFECYCLE
    // =====================================================

    useEffect(() => {
        mountedRef.current = true;

        return () => {
            mountedRef.current = false;
            languageRequestRef.current += 1;
            technologyRequestRef.current += 1;
            detailRequestRef.current += 1;

            if (navigationTimerRef.current !== null) {
                clearTimeout(navigationTimerRef.current);
            }
        };
    }, []);

    // =====================================================
    // ALERTS
    // =====================================================

    const showAlert = useCallback((options = {}) => {
        alertSequenceRef.current += 1;

        setSiteAlert({
            id: `${Date.now()}-${alertSequenceRef.current}`,
            type: options.type || "info",
            title: options.title || "FSociety",
            message: options.message || "",
            code: options.code,
            duration: options.duration ?? 3500,
        });
    }, []);

    const closeAlert = useCallback(() => {
        setSiteAlert(null);
    }, []);

    // =====================================================
    // REDIRECT
    // =====================================================

    const scheduleNavigation = useCallback(
        (delay = 900) => {
            if (navigationTimerRef.current !== null) {
                clearTimeout(navigationTimerRef.current);
            }

            navigationTimerRef.current = setTimeout(() => {
                navigationTimerRef.current = null;

                if (mountedRef.current) {
                    navigate("/problems");
                }
            }, delay);
        },
        [navigate]
    );

    // =====================================================
    // LANGUAGES API
    // =====================================================

    const fetchLanguages = useCallback(async () => {
        const requestId = ++languageRequestRef.current;

        setLanguagesLoading(true);
        setLanguagesError("");

        dispatch(getLanguagesStart());

        try {
            const response =
                await ProblemService.getLanguagesList();

            if (
                !mountedRef.current ||
                requestId !== languageRequestRef.current
            ) {
                return;
            }

            const items = normalizeOptions(response);

            setLanguageOptions(items);
            dispatch(getLanguagesSuccess(items));
        } catch (error) {
            if (
                !mountedRef.current ||
                requestId !== languageRequestRef.current
            ) {
                return;
            }

            console.error("Language loading failed:", error);

            const message = formatProblemBackendError(
                error,
                "Dasturlash tillarini yuklab bo‘lmadi."
            );

            setLanguagesError(message);

            // Clear the original Redux loading state even
            // when the language request fails.
            dispatch(getLanguagesSuccess([]));

            showAlert({
                type: "error",
                title: "Tillar yuklanmadi",
                message,
                code: "LANGUAGE_FETCH_FAILED",
            });
        } finally {
            if (
                mountedRef.current &&
                requestId === languageRequestRef.current
            ) {
                setLanguagesLoading(false);
            }
        }
    }, [dispatch, showAlert]);

    // =====================================================
    // TECHNOLOGIES API
    // =====================================================

    const fetchTechnologies = useCallback(async () => {
        const requestId = ++technologyRequestRef.current;

        setTechnologiesLoading(true);
        setTechnologiesError("");

        try {
            const response =
                await ProblemService.getTechnologiesList();

            if (
                !mountedRef.current ||
                requestId !== technologyRequestRef.current
            ) {
                return;
            }

            setTechnologyOptions(normalizeOptions(response));
        } catch (error) {
            if (
                !mountedRef.current ||
                requestId !== technologyRequestRef.current
            ) {
                return;
            }

            console.error("Technology loading failed:", error);

            const message = formatProblemBackendError(
                error,
                "Texnologiyalarni yuklab bo‘lmadi."
            );

            setTechnologiesError(message);

            showAlert({
                type: "error",
                title: "Texnologiyalar yuklanmadi",
                message,
                code: "TECHNOLOGY_FETCH_FAILED",
            });
        } finally {
            if (
                mountedRef.current &&
                requestId === technologyRequestRef.current
            ) {
                setTechnologiesLoading(false);
            }
        }
    }, [showAlert]);

    useEffect(() => {
        fetchLanguages();
        fetchTechnologies();
    }, [fetchLanguages, fetchTechnologies]);

    // =====================================================
    // FORM UPDATE
    // =====================================================

    const updateForm = useCallback(
        (changes) => {
            if (
                submitLockRef.current ||
                deleteLockRef.current
            ) {
                return;
            }

            setFormState((previous) => ({
                key: modeKey,
                values: {
                    ...(
                        previous.key === modeKey
                            ? previous.values
                            : createEmptyProblemForm()
                    ),
                    ...changes,
                },
            }));

            setSubmissionError("");
        },
        [modeKey]
    );

    const handleFieldChange = useCallback(
        (field, value) => {
            const allowed = [
                "problemTitle",
                "description",
                "codeSnippet",
                "deadline",
                "offeredCoins",
            ];

            if (!allowed.includes(field)) return;

            updateForm({ [field]: value });
        },
        [updateForm]
    );

    const handleUrgentChange = useCallback(
        (checked) => {
            updateForm(
                checked
                    ? { isUrgent: true }
                    : {
                        isUrgent: false,
                        deadline: "",
                        offeredCoins: "",
                    }
            );
        },
        [updateForm]
    );

    // =====================================================
    // TOGGLE LANGUAGE
    // =====================================================

    const toggleLanguage = useCallback(
        (language) => {
            if (
                !hasId(language?.id) ||
                submitLockRef.current ||
                deleteLockRef.current
            ) {
                return;
            }

            setFormState((previousState) => {
                const previous =
                    previousState.key === modeKey
                        ? previousState.values
                        : createEmptyProblemForm();

                const exists = previous.selectedLanguages.some(
                    (item) => sameId(item.id, language.id)
                );

                return {
                    key: modeKey,
                    values: {
                        ...previous,
                        selectedLanguages: exists
                            ? previous.selectedLanguages.filter(
                                (item) =>
                                    !sameId(item.id, language.id)
                            )
                            : [...previous.selectedLanguages, language],
                        codeLanguageId:
                            exists &&
                            sameId(previous.codeLanguageId, language.id)
                                ? ""
                                : previous.codeLanguageId,
                    },
                };
            });

            setSubmissionError("");
        },
        [modeKey]
    );

    // =====================================================
    // TOGGLE TECHNOLOGY
    // =====================================================

    const toggleTechnology = useCallback(
        (technology) => {
            if (
                !hasId(technology?.id) ||
                submitLockRef.current ||
                deleteLockRef.current
            ) {
                return;
            }

            setFormState((previousState) => {
                const previous =
                    previousState.key === modeKey
                        ? previousState.values
                        : createEmptyProblemForm();

                const exists = previous.selectedTechnologies.some(
                    (item) => sameId(item.id, technology.id)
                );

                return {
                    key: modeKey,
                    values: {
                        ...previous,
                        selectedTechnologies: exists
                            ? previous.selectedTechnologies.filter(
                                (item) =>
                                    !sameId(item.id, technology.id)
                            )
                            : [...previous.selectedTechnologies, technology],
                    },
                };
            });

            setSubmissionError("");
        },
        [modeKey]
    );

    // =====================================================
    // EDITOR LANGUAGE
    // =====================================================

    const handleCodeLanguageChange = useCallback(
        (value) => {
            if (
                submitLockRef.current ||
                deleteLockRef.current
            ) {
                return;
            }

            const language = languageOptions.find(
                (item) => sameId(item.id, value)
            );

            setFormState((previousState) => {
                const previous =
                    previousState.key === modeKey
                        ? previousState.values
                        : createEmptyProblemForm();

                const exists = previous.selectedLanguages.some(
                    (item) => sameId(item.id, value)
                );

                return {
                    key: modeKey,
                    values: {
                        ...previous,
                        codeLanguageId: String(value ?? ""),
                        selectedLanguages:
                            language && !exists
                                ? [...previous.selectedLanguages, language]
                                : previous.selectedLanguages,
                    },
                };
            });

            setSubmissionError("");
        },
        [languageOptions, modeKey]
    );

    // =====================================================
    // FETCH EDIT DATA
    // =====================================================

    const fetchProblemDetail = useCallback(async () => {
        if (!isEdit) return;

        const requestId = ++detailRequestRef.current;

        setDetailState({
            key: modeKey,
            loading: true,
            error: "",
        });

        try {
            const response =
                await ProblemService.getProblemDetail(id);

            if (
                !mountedRef.current ||
                requestId !== detailRequestRef.current ||
                routeKeyRef.current !== modeKey
            ) {
                return;
            }

            const record =
                response?.data?.id != null
                    ? response.data
                    : response;

            if (!record || typeof record !== "object") {
                throw new Error("Muammo ma’lumotlari topilmadi.");
            }

            const values = mapProblemToForm(record);

            setFormState({
                key: modeKey,
                values,
            });

            setOriginal({
                key: modeKey,
                record,
                deadline: values.deadline,
            });

            setSubmissionError("");

            dispatch(getProblemDetailSuccess(record));

            setDetailState({
                key: modeKey,
                loading: false,
                error: "",
            });
        } catch (error) {
            if (
                !mountedRef.current ||
                requestId !== detailRequestRef.current ||
                routeKeyRef.current !== modeKey
            ) {
                return;
            }

            console.error("Problem detail loading failed:", error);

            const message = formatProblemBackendError(
                error,
                "Muammo ma’lumotlarini yuklab bo‘lmadi."
            );

            setDetailState({
                key: modeKey,
                loading: false,
                error: message,
            });

            showAlert({
                type: "error",
                title: "Muammo yuklanmadi",
                message,
                code: "PROBLEM_DETAIL_FAILED",
            });
        }
    }, [dispatch, id, isEdit, modeKey, showAlert]);

    useEffect(() => {
        if (isEdit) {
            fetchProblemDetail();
        } else {
            detailRequestRef.current += 1;

            setFormState({
                key: modeKey,
                values: createEmptyProblemForm(),
            });

            setOriginal({
                key: modeKey,
                record: null,
                deadline: "",
            });

            setSubmissionError("");

            setDetailState({
                key: modeKey,
                loading: false,
                error: "",
            });
        }

        return () => {
            detailRequestRef.current += 1;
        };
    }, [isEdit, modeKey, fetchProblemDetail]);

    // =====================================================
    // SELECTED EDITOR LANGUAGE
    // =====================================================

    const selectedCodeLanguage = useMemo(() => {
        if (!hasId(form.codeLanguageId)) return null;

        return (
            languageOptions.find((item) =>
                sameId(item.id, form.codeLanguageId)
            ) ||
            form.selectedLanguages.find((item) =>
                sameId(item.id, form.codeLanguageId)
            ) ||
            null
        );
    }, [
        form.codeLanguageId,
        form.selectedLanguages,
        languageOptions,
    ]);

    const editorLanguage = useMemo(
        () => getProblemPrismLanguage(selectedCodeLanguage),
        [selectedCodeLanguage]
    );

    // =====================================================
    // ROUTE-SCOPED ORIGINAL DATA
    // =====================================================

    const currentOriginal =
        original.key === modeKey
            ? original
            : { record: null, deadline: "" };

    const detailLoading =
        isEdit &&
        (
            detailState.key !== modeKey ||
            detailState.loading
        );

    const detailError =
        detailState.key === modeKey
            ? detailState.error
            : "";

    // =====================================================
    // VALIDATION AND SUBMIT
    // =====================================================

    const handleSubmit = useCallback(
        async (event) => {
            event?.preventDefault();

            if (
                submitLockRef.current ||
                deleteLockRef.current ||
                detailLoading ||
                detailError
            ) {
                return;
            }

            setSubmissionError("");

            const error = validateProblemForm({
                form,
                isEdit,
                originalDeadline: currentOriginal.deadline,
            });

            if (error) {
                setSubmissionError(error.message);

                showAlert({
                    type: "warning",
                    title: "Forma ma’lumotlarini tekshiring",
                    message: error.message,
                    code: error.code,
                });

                return;
            }

            submitLockRef.current = true;
            setIsSubmitting(true);

            const payload = buildProblemPayload(form);
            let completed = false;

            try {
                if (isEdit) {
                    await ProblemService.putProblem(id, payload);
                } else {
                    await ProblemService.postProblem(payload);
                }

                if (!mountedRef.current) return;

                completed = true;

                showAlert({
                    type: "success",
                    title: isEdit
                        ? "Muammo yangilandi"
                        : "Muammo qo‘shildi",
                    message: isEdit
                        ? "Muammo muvaffaqiyatli yangilandi."
                        : "Yangi muammo FSociety bazasiga qo‘shildi.",
                    code: isEdit
                        ? "PROBLEM_UPDATED"
                        : "PROBLEM_CREATED",
                    duration: 3000,
                });

                if (!isEdit) {
                    setFormState({
                        key: modeKey,
                        values: createEmptyProblemForm(),
                    });
                }

                scheduleNavigation(900);
            } catch (error) {
                if (!mountedRef.current) return;

                console.error("Problem save failed:", error);

                const message = formatProblemBackendError(
                    error,
                    isEdit
                        ? "Muammoni yangilab bo‘lmadi."
                        : "Muammoni yaratib bo‘lmadi."
                );

                setSubmissionError(message);

                showAlert({
                    type: "error",
                    title: isEdit
                        ? "Yangilashda xatolik"
                        : "Yaratishda xatolik",
                    message,
                    code: isEdit ? "UPDATE_FAILED" : "CREATE_FAILED",
                    duration: 6000,
                });
            } finally {
                // On success keep the form locked until redirect.
                if (!completed) {
                    submitLockRef.current = false;

                    if (mountedRef.current) {
                        setIsSubmitting(false);
                    }
                }
            }
        },
        [
            currentOriginal.deadline,
            detailError,
            detailLoading,
            form,
            id,
            isEdit,
            modeKey,
            scheduleNavigation,
            showAlert,
        ]
    );

    // =====================================================
    // DELETE
    // =====================================================

    const openDeleteModal = useCallback(() => {
        if (
            !isEdit ||
            submitLockRef.current ||
            deleteLockRef.current
        ) {
            return;
        }

        setIsDeleteModalOpen(true);
    }, [isEdit]);

    const closeDeleteModal = useCallback(() => {
        if (!deleteLockRef.current) {
            setIsDeleteModalOpen(false);
        }
    }, []);

    const handleDeleteConfirm = useCallback(async () => {
        if (
            !isEdit ||
            submitLockRef.current ||
            deleteLockRef.current
        ) {
            return;
        }

        deleteLockRef.current = true;
        setIsDeleting(true);

        let completed = false;

        try {
            await ProblemService.deleteProblem(id);

            if (!mountedRef.current) return;

            completed = true;
            setIsDeleteModalOpen(false);

            showAlert({
                type: "success",
                title: "Muammo o‘chirildi",
                message: "Muammo muvaffaqiyatli o‘chirildi.",
                code: "PROBLEM_DELETED",
                duration: 3000,
            });

            scheduleNavigation(900);
        } catch (error) {
            if (!mountedRef.current) return;

            console.error("Problem deletion failed:", error);

            showAlert({
                type: "error",
                title: "O‘chirishda xatolik",
                message: formatProblemBackendError(
                    error,
                    "Muammoni o‘chirib bo‘lmadi."
                ),
                code: "DELETE_FAILED",
                duration: 5000,
            });
        } finally {
            if (!completed) {
                deleteLockRef.current = false;

                if (mountedRef.current) {
                    setIsDeleting(false);
                }
            }
        }
    }, [id, isEdit, scheduleNavigation, showAlert]);

    // =====================================================
    // CANCEL
    // =====================================================

    const handleCancel = useCallback(() => {
        if (
            submitLockRef.current ||
            deleteLockRef.current
        ) {
            return;
        }

        setFormState({
            key: modeKey,
            values:
                isEdit && currentOriginal.record
                    ? mapProblemToForm(currentOriginal.record)
                    : createEmptyProblemForm(),
        });

        setSubmissionError("");

        showAlert({
            type: "info",
            title: "Bekor qilindi",
            message: "Forma o‘zgarishlari bekor qilindi.",
            code: "FORM_CANCELLED",
            duration: 2500,
        });

        scheduleNavigation(700);
    }, [
        currentOriginal.record,
        isEdit,
        modeKey,
        scheduleNavigation,
        showAlert,
    ]);

    // =====================================================
    // RETURN
    // =====================================================

    return {
        isEdit,
        form,
        originalProblem: currentOriginal.record,

        languageOptions,
        technologyOptions,
        languagesLoading,
        technologiesLoading,
        languagesError,
        technologiesError,

        selectedCodeLanguage,
        editorLanguage,

        detailLoading,
        detailError,
        fetchProblemDetail,

        submissionError,
        siteAlert,
        closeAlert,

        isSubmitting,
        isDeleting,
        isDeleteModalOpen,

        fetchLanguages,
        fetchTechnologies,

        handleFieldChange,
        handleUrgentChange,
        toggleLanguage,
        toggleTechnology,
        handleCodeLanguageChange,

        handleSubmit,
        handleCancel,
        openDeleteModal,
        closeDeleteModal,
        handleDeleteConfirm,
    };
};

export default useProblemCreate;
