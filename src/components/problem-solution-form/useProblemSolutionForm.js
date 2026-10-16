
import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import ProblemResponseService from "../../services/problemResponse";
import ProblemService from "../../services/problems";

import { siteToast } from "../ui/AuthToast";

import {
    DEFAULT_CODE,
    getProblemSolutionFormStatus,
    getSolutionEditorFileName,
    getSolutionFormErrorMessage,
    getSolutionPrismLanguage,
    hasSolutionFormId,
    normalizeSolutionLanguages,
    validateProblemSolutionForm,
} from "./problemSolutionFormHelpers";

// =========================================================
// FSOCIETY — PROBLEM SOLUTION FORM HOOK
//
// - Form fields
// - Languages API
// - Auto language selection
// - Language search
// - Prism language mapping
// - Progress and validation
// - Submit
// - POST / refresh error separation
// =========================================================

const useProblemSolutionForm = ({
    id,
    onSuccess,
    problemLanguages = [],
}) => {
    // =====================================================
    // FORM STATE
    // =====================================================

    const [shortInfo, setShortInfo] = useState("");
    const [description, setDescription] = useState("");
    const [code, setCode] = useState(DEFAULT_CODE);

    // =====================================================
    // LANGUAGE STATE
    // =====================================================

    const [languageOptions, setLanguageOptions] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const [languageSearch, setLanguageSearch] = useState("");
    const [isLanguagesLoading, setIsLanguagesLoading] =
        useState(true);
    const [languageError, setLanguageError] = useState("");

    // =====================================================
    // SUBMIT STATE
    // =====================================================

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState("");

    // =====================================================
    // REQUEST GUARDS
    // =====================================================

    const mountedRef = useRef(false);
    const languageRequestRef = useRef(0);
    const submitLockRef = useRef(false);

    // =====================================================
    // EDITOR LANGUAGE
    // =====================================================

    const editorLanguage = useMemo(
        () =>
            getSolutionPrismLanguage(
                selectedLanguage?.name
            ),
        [selectedLanguage?.name]
    );

    const editorFileName = useMemo(
        () => getSolutionEditorFileName(editorLanguage),
        [editorLanguage]
    );

    // =====================================================
    // FETCH LANGUAGE OPTIONS
    // =====================================================

    const fetchLanguages = useCallback(async () => {
        const requestId = ++languageRequestRef.current;

        setIsLanguagesLoading(true);
        setLanguageError("");

        try {
            const response =
                await ProblemService.getLanguagesList();

            if (
                !mountedRef.current ||
                requestId !== languageRequestRef.current
            ) {
                return;
            }

            const normalized = normalizeSolutionLanguages(
                response
            );

            setLanguageOptions(normalized);
        } catch (error) {
            if (
                !mountedRef.current ||
                requestId !== languageRequestRef.current
            ) {
                return;
            }

            console.error(
                "Tillarni olishda xatolik:",
                error
            );

            const message = getSolutionFormErrorMessage(
                error,
                "Dasturlash tillarini yuklab bo‘lmadi."
            );

            setLanguageError(message);

            siteToast.error(message, {
                title: "Tillar yuklanmadi",
                duration: 4500,
            });
        } finally {
            if (
                mountedRef.current &&
                requestId === languageRequestRef.current
            ) {
                setIsLanguagesLoading(false);
            }
        }
    }, []);

    // =====================================================
    // MOUNT / UNMOUNT
    // =====================================================

    useEffect(() => {
        mountedRef.current = true;

        fetchLanguages();

        return () => {
            mountedRef.current = false;
            languageRequestRef.current += 1;
        };
    }, [fetchLanguages]);

    // =====================================================
    // AUTO SELECT FIRST PROBLEM LANGUAGE
    // =====================================================

    useEffect(() => {
        if (
            selectedLanguage ||
            languageOptions.length === 0 ||
            !Array.isArray(problemLanguages) ||
            problemLanguages.length === 0
        ) {
            return;
        }

        const first = problemLanguages[0];

        const firstId =
            first && typeof first === "object"
                ? first.id
                : null;

        const firstName =
            typeof first === "string"
                ? first
                : first?.name;

        const match = languageOptions.find((language) => {
            if (
                hasSolutionFormId(firstId) &&
                hasSolutionFormId(language?.id) &&
                String(firstId) === String(language.id)
            ) {
                return true;
            }

            return Boolean(
                firstName &&
                language?.name &&
                String(firstName).trim().toLowerCase() ===
                    String(language.name).trim().toLowerCase()
            );
        });

        if (match) {
            setSelectedLanguage(match);
        }
    }, [
        languageOptions,
        problemLanguages,
        selectedLanguage,
    ]);

    // =====================================================
    // SEARCH
    // =====================================================

    const filteredLanguages = useMemo(() => {
        const search = languageSearch.trim().toLowerCase();

        if (!search) return languageOptions;

        return languageOptions.filter((language) =>
            String(language?.name ?? "")
                .toLowerCase()
                .includes(search)
        );
    }, [languageOptions, languageSearch]);

    // =====================================================
    // PROGRESS
    // =====================================================

    const formStatus = useMemo(
        () =>
            getProblemSolutionFormStatus({
                shortInfo,
                description,
                code,
                selectedLanguage,
            }),
        [
            shortInfo,
            description,
            code,
            selectedLanguage,
        ]
    );

    // =====================================================
    // FIELD CHANGE
    // =====================================================

    const handleFieldChange = useCallback((field, value) => {
        if (submitLockRef.current) return;

        const nextValue = String(value ?? "");

        switch (field) {
            case "shortInfo":
                setShortInfo(nextValue);
                break;

            case "description":
                setDescription(nextValue);
                break;

            case "code":
                setCode(nextValue);
                break;

            default:
                return;
        }

        setFormError("");
    }, []);

    // =====================================================
    // SEARCH CHANGE
    // =====================================================

    const handleLanguageSearch = useCallback((value) => {
        setLanguageSearch(String(value ?? ""));
    }, []);

    // =====================================================
    // SELECT LANGUAGE
    // =====================================================

    const handleLanguageSelect = useCallback((language) => {
        if (submitLockRef.current || !language) return;

        setSelectedLanguage(language);
        setFormError("");
    }, []);

    // =====================================================
    // CLEAR CODE
    // =====================================================

    const handleClearCode = useCallback(() => {
        if (submitLockRef.current || !code.trim()) {
            return;
        }

        setCode("");
        setFormError("");

        siteToast.info("Kod maydoni tozalandi.", {
            title: "Kod tozalandi",
            duration: 1800,
        });
    }, [code]);

    // =====================================================
    // RESET AFTER SUCCESS
    //
    // Keep selected language.
    // =====================================================

    const resetForm = useCallback(() => {
        setShortInfo("");
        setDescription("");
        setCode(DEFAULT_CODE);
        setFormError("");
    }, []);

    // =====================================================
    // SUBMIT SOLUTION
    // =====================================================

    const handleSubmit = useCallback(async (event) => {
        event.preventDefault();

        if (submitLockRef.current) return;

        const validationError =
            validateProblemSolutionForm({
                shortInfo,
                description,
                selectedLanguage,
            });

        if (validationError) {
            setFormError(validationError);

            siteToast.warning(validationError, {
                title: "Yechimni tekshiring",
                duration: 4000,
            });

            return;
        }

        if (!hasSolutionFormId(id)) {
            const message = "Muammo ID topilmadi.";

            setFormError(message);

            siteToast.error(message, {
                title: "Yechim yuborilmadi",
            });

            return;
        }

        const solutionData = {
            answer: shortInfo.trim(),
            description: description.trim(),
            code: code.trim(),
            language: selectedLanguage.id,
            language_name: selectedLanguage.name,
        };

        // Immediate lock prevents duplicate POSTs.
        submitLockRef.current = true;
        setIsSubmitting(true);
        setFormError("");

        const toastId = siteToast.loading(
            `${selectedLanguage.name} yechimingiz yuborilmoqda...`,
            { title: "Yechim yuborilmoqda" }
        );

        let createdSolution;

        // =================================================
        // 1. CREATE SOLUTION
        // =================================================

        try {
            createdSolution =
                await ProblemResponseService.postSolution(
                    id,
                    solutionData
                );
        } catch (error) {
            console.error(
                "Yechim yuborishda xatolik:",
                error
            );

            if (mountedRef.current) {
                const message =
                    getSolutionFormErrorMessage(error);

                setFormError(message);

                siteToast.error(message, {
                    id: toastId,
                    title: "Yechim yuborilmadi",
                    duration: 5000,
                });
            }

            submitLockRef.current = false;

            if (mountedRef.current) {
                setIsSubmitting(false);
            }

            return;
        }

        // POST succeeded. Parent refresh failure must
        // never be reported as a failed POST.
        if (mountedRef.current) {
            resetForm();

            siteToast.success(
                "Yechimingiz muvaffaqiyatli yuborildi.",
                {
                    id: toastId,
                    title: "Yechim yuborildi",
                    duration: 3500,
                }
            );
        }

        // =================================================
        // 2. REFRESH PARENT DATA
        // =================================================

        try {
            if (
                mountedRef.current &&
                typeof onSuccess === "function"
            ) {
                await onSuccess(createdSolution);
            }
        } catch (refreshError) {
            console.error(
                "Yechim yaratildi, ammo ro‘yxatni yangilashda xato:",
                refreshError
            );

            if (mountedRef.current) {
                siteToast.warning(
                    "Yechim saqlandi, lekin ro‘yxatni avtomatik yangilashda muammo yuz berdi.",
                    {
                        title: "Ro‘yxat yangilanmadi",
                        duration: 4000,
                    }
                );
            }
        } finally {
            submitLockRef.current = false;

            if (mountedRef.current) {
                setIsSubmitting(false);
            }
        }
    }, [
        id,
        shortInfo,
        description,
        code,
        selectedLanguage,
        onSuccess,
        resetForm,
    ]);

    // =====================================================
    // PUBLIC API
    // =====================================================

    return {
        shortInfo,
        description,
        code,

        languageOptions,
        selectedLanguage,
        languageSearch,
        filteredLanguages,
        isLanguagesLoading,
        languageError,

        editorLanguage,
        editorFileName,

        formStatus,
        formError,
        isSubmitting,

        fetchLanguages,
        handleFieldChange,
        handleLanguageSearch,
        handleLanguageSelect,
        handleClearCode,
        handleSubmit,
    };
};

export default useProblemSolutionForm;
