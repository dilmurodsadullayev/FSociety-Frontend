
import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import { useNavigate } from "react-router-dom";

import ProblemResponseService from "../../services/problemResponse";

import { siteToast } from "../ui/AuthToast";

import {
    getSolutionUpdateErrorMessage,
    getSolutionUpdateLanguageName,
    getSolutionUpdatePrismLanguage,
    validateSolutionUpdate,
} from "./problemSolutionUpdateHelpers";

// =========================================================
// FSOCIETY — SOLUTION UPDATE CONTROLLER
// =========================================================

const INITIAL_FORM = {
    answer: "",
    description: "",
    code: "",
    languageName: "JavaScript",
};

const useProblemSolutionUpdate = ({
    problemId,
    solutionId,
}) => {
    const navigate = useNavigate();

    // =====================================================
    // FORM
    // =====================================================

    const [form, setForm] = useState(INITIAL_FORM);
    const [formError, setFormError] = useState("");

    // =====================================================
    // REQUEST STATE
    // =====================================================

    const [loadState, setLoadState] = useState({
        key: String(solutionId ?? ""),
        loading: true,
        error: "",
        loaded: false,
    });

    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] =
        useState(false);

    // =====================================================
    // REFS
    // =====================================================

    const mountedRef = useRef(false);
    const fetchVersionRef = useRef(0);
    const updateLockRef = useRef(false);
    const deleteLockRef = useRef(false);

    // =====================================================
    // ROUTE
    // =====================================================

    const solutionKey = String(solutionId ?? "");

    const problemUrl =
        problemId !== null &&
        problemId !== undefined &&
        String(problemId).trim() !== ""
            ? `/problem/${encodeURIComponent(problemId)}/detail`
            : null;

    const goToProblem = useCallback(() => {
        if (problemUrl) {
            navigate(problemUrl);
        } else {
            navigate(-1);
        }
    }, [navigate, problemUrl]);

    // =====================================================
    // CURRENT LOAD STATE
    // =====================================================

    const currentLoad =
        loadState.key === solutionKey
            ? loadState
            : {
                key: solutionKey,
                loading: true,
                error: "",
                loaded: false,
            };

    const loading =
        currentLoad.loading ||
        !currentLoad.loaded;

    const error = currentLoad.error;

    // =====================================================
    // EDITOR LANGUAGE
    // =====================================================

    const prismLanguageName = useMemo(
        () => getSolutionUpdatePrismLanguage(
            form.languageName
        ),
        [form.languageName]
    );

    // =====================================================
    // FETCH SOLUTION
    // =====================================================

    const fetchSolution = useCallback(async () => {
        const version = ++fetchVersionRef.current;

        setLoadState({
            key: solutionKey,
            loading: true,
            error: "",
            loaded: false,
        });

        if (!solutionKey.trim()) {
            setLoadState({
                key: solutionKey,
                loading: false,
                error: "Yechim ID topilmadi.",
                loaded: true,
            });
            return;
        }

        try {
            const data =
                await ProblemResponseService.getSolutionById(
                    solutionId
                );

            if (
                !mountedRef.current ||
                version !== fetchVersionRef.current
            ) {
                return;
            }

            if (!data || typeof data !== "object") {
                throw new Error(
                    "Yechim ma’lumotlari topilmadi."
                );
            }

            setForm({
                answer: String(data.answer ?? ""),
                description: String(data.description ?? ""),
                code: String(data.code ?? ""),
                languageName:
                    getSolutionUpdateLanguageName(data),
            });

            setFormError("");

            setLoadState({
                key: solutionKey,
                loading: false,
                error: "",
                loaded: true,
            });
        } catch (requestError) {
            if (
                !mountedRef.current ||
                version !== fetchVersionRef.current
            ) {
                return;
            }

            console.error(
                "Yechimni yuklashda xatolik:",
                requestError
            );

            setLoadState({
                key: solutionKey,
                loading: false,
                error: getSolutionUpdateErrorMessage(
                    requestError,
                    "Yechimni yuklashda xatolik yuz berdi."
                ),
                loaded: true,
            });
        }
    }, [solutionId, solutionKey]);

    // =====================================================
    // LIFECYCLE
    // =====================================================

    useEffect(() => {
        mountedRef.current = true;

        fetchSolution();

        return () => {
            mountedRef.current = false;
            fetchVersionRef.current += 1;
        };
    }, [fetchSolution]);

    // =====================================================
    // FORM CHANGE
    // =====================================================

    const updateField = useCallback((field, value) => {
        if (
            !["answer", "description", "code"].includes(field)
        ) {
            return;
        }

        if (
            updateLockRef.current ||
            deleteLockRef.current
        ) {
            return;
        }

        setForm((previous) => ({
            ...previous,
            [field]: value,
        }));

        setFormError("");
    }, []);

    // =====================================================
    // UPDATE SOLUTION
    // =====================================================

    const handleUpdate = useCallback(async (event) => {
        event?.preventDefault();

        if (
            updateLockRef.current ||
            deleteLockRef.current ||
            isUpdating ||
            isDeleting
        ) {
            return;
        }

        setFormError("");

        const validationError = validateSolutionUpdate(form);

        if (validationError) {
            setFormError(validationError);

            siteToast.warning(validationError, {
                title: "Yechimni tekshiring",
                duration: 4000,
            });

            return;
        }

        if (!solutionKey.trim()) {
            setFormError("Yechim ID topilmadi.");

            siteToast.error("Yechim ID topilmadi.", {
                title: "Yangilash bajarilmadi",
            });

            return;
        }

        updateLockRef.current = true;
        setIsUpdating(true);

        const toastId = siteToast.loading(
            "Yechimdagi o‘zgarishlar saqlanmoqda...",
            { title: "Yechim yangilanmoqda" }
        );

        try {
            await ProblemResponseService.updateSolution(
                solutionId,
                {
                    answer: form.answer.trim(),
                    description: form.description.trim(),
                    code: form.code.trim(),
                }
            );

            if (!mountedRef.current) return;

            siteToast.success(
                "Yechim muvaffaqiyatli yangilandi.",
                {
                    id: toastId,
                    title: "O‘zgarishlar saqlandi",
                    duration: 3000,
                }
            );

            goToProblem();
        } catch (requestError) {
            if (!mountedRef.current) return;

            console.error(
                "Yechimni yangilashda xatolik:",
                requestError
            );

            const message = getSolutionUpdateErrorMessage(
                requestError,
                "Yechimni yangilashda xatolik yuz berdi."
            );

            setFormError(message);

            siteToast.error(message, {
                id: toastId,
                title: "Yechim yangilanmadi",
                duration: 5000,
            });
        } finally {
            updateLockRef.current = false;

            if (mountedRef.current) {
                setIsUpdating(false);
            }
        }
    }, [
        form,
        goToProblem,
        isDeleting,
        isUpdating,
        solutionId,
        solutionKey,
    ]);

    // =====================================================
    // DELETE MODAL
    // =====================================================

    const handleOpenDeleteModal = useCallback(() => {
        if (
            updateLockRef.current ||
            deleteLockRef.current
        ) {
            return;
        }

        setIsDeleteModalOpen(true);
    }, []);

    const handleCloseDeleteModal = useCallback(() => {
        if (!deleteLockRef.current) {
            setIsDeleteModalOpen(false);
        }
    }, []);

    // =====================================================
    // DELETE SOLUTION
    // =====================================================

    const handleDeleteConfirm = useCallback(async () => {
        if (
            updateLockRef.current ||
            deleteLockRef.current ||
            isDeleting ||
            isUpdating
        ) {
            return;
        }

        if (!solutionKey.trim()) {
            siteToast.error("Yechim ID topilmadi.", {
                title: "O‘chirish bajarilmadi",
            });
            return;
        }

        deleteLockRef.current = true;
        setIsDeleting(true);

        const toastId = siteToast.loading(
            "Yechim o‘chirilmoqda...",
            { title: "Yechim o‘chirilmoqda" }
        );

        try {
            await ProblemResponseService.deleteSolution(
                solutionId
            );

            if (!mountedRef.current) return;

            setIsDeleteModalOpen(false);

            siteToast.success(
                "Yechim muvaffaqiyatli o‘chirildi.",
                {
                    id: toastId,
                    title: "Yechim o‘chirildi",
                    duration: 3000,
                }
            );

            goToProblem();
        } catch (requestError) {
            if (!mountedRef.current) return;

            console.error(
                "Yechimni o‘chirishda xatolik:",
                requestError
            );

            siteToast.error(
                getSolutionUpdateErrorMessage(
                    requestError,
                    "Yechimni o‘chirishda xatolik yuz berdi."
                ),
                {
                    id: toastId,
                    title: "Yechim o‘chirilmadi",
                    duration: 5000,
                }
            );
        } finally {
            deleteLockRef.current = false;

            if (mountedRef.current) {
                setIsDeleting(false);
            }
        }
    }, [
        goToProblem,
        isDeleting,
        isUpdating,
        solutionId,
        solutionKey,
    ]);

    // =====================================================
    // CANCEL
    // =====================================================

    const handleCancel = useCallback(() => {
        if (
            updateLockRef.current ||
            deleteLockRef.current
        ) {
            return;
        }

        goToProblem();
    }, [goToProblem]);

    // =====================================================
    // RETURN
    // =====================================================

    return {
        form,
        formError,

        loading,
        error,

        isUpdating,
        isDeleting,
        isDeleteModalOpen,

        prismLanguageName,
        problemUrl,

        fetchSolution,
        updateField,

        handleUpdate,
        handleCancel,

        handleOpenDeleteModal,
        handleCloseDeleteModal,
        handleDeleteConfirm,
    };
};

export default useProblemSolutionUpdate;
