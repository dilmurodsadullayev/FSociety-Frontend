
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { createPortal } from "react-dom";

import { AlertTriangle } from "lucide-react";

import { siteToast } from "../ui/AuthToast";

import PostCreateHeader from "./create/PostCreateHeader";

import PostCreateTypeSelector, {
  POST_TYPES,
} from "./create/PostCreateTypeSelector";

import PostCreateFields from "./create/PostCreateFields";

import PostCreatePreview from "./create/PostCreatePreview";

import PostCreateFooter from "./create/PostCreateFooter";

// =========================================================
// FSOCIETY — CREATE / EDIT POST MODAL
// =========================================================
//
// Existing props:
// - isOpen
// - onClose
// - onSubmit
// - isSubmitting
// - initialData
//
// Features:
// - Create and Edit modes
// - Light / Dark Mode
// - Responsive 320px+
// - Mobile full-screen modal
// - Sticky header and footer
// - Scrollable form and preview
// - Focus trap
// - Escape / backdrop closing
// - Body scroll locking
// - Duplicate submission prevention
// - Session-safe async handling
// - Form validation
// - HTML-aware content validation
// - DRF error parsing
// - Live post preview
// - Accessible validation messages
//
// Backend payload stays unchanged.
// =========================================================

// =========================================================
// CONSTANTS
// =========================================================

const EMPTY_FORM = {
  post_type: "TEX",
  title: "",
  content: "",
};

const TITLE_MIN_LENGTH = 3;
const TITLE_MAX_LENGTH = 150;

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'textarea:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

const ERROR_FIELD_LABELS = {
  post_type: "Post turi",
  title: "Sarlavha",
  content: "Kontent",
  non_field_errors: "Xatolik",
};

// =========================================================
// INITIAL DATA
// =========================================================

const getInitialFormData = (initialData) => {
  if (!initialData) {
    return { ...EMPTY_FORM };
  }

  return {
    post_type:
      typeof initialData.post_type === "string"
        ? initialData.post_type
        : "TEX",

    title:
      typeof initialData.title === "string"
        ? initialData.title
        : "",

    content:
      typeof initialData.content === "string"
        ? initialData.content
        : "",
  };
};

// =========================================================
// ERROR PARSER
// =========================================================

const parseErrorValue = (
  value,
  depth = 0
) => {
  if (
    value === null ||
    value === undefined ||
    depth > 5
  ) {
    return "";
  }

  if (typeof value === "string") {
    const message = value.trim();

    if (!message) {
      return "";
    }

    if (
      (message.startsWith("{") &&
        message.endsWith("}")) ||
      (message.startsWith("[") &&
        message.endsWith("]"))
    ) {
      try {
        return parseErrorValue(
          JSON.parse(message),
          depth + 1
        );
      } catch {
        return message;
      }
    }

    return message === "[object Object]"
      ? ""
      : message;
  }

  if (
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value
      .map((item) =>
        parseErrorValue(item, depth + 1)
      )
      .filter(Boolean)
      .join("; ");
  }

  if (typeof value === "object") {
    for (const key of [
      "detail",
      "message",
      "error",
      "non_field_errors",
    ]) {
      if (value[key]) {
        const message = parseErrorValue(
          value[key],
          depth + 1
        );

        if (message) {
          return message;
        }
      }
    }

    return Object.entries(value)
      .filter(
        ([key]) =>
          ![
            "request",
            "response",
            "config",
            "stack",
          ].includes(key)
      )
      .map(([field, fieldError]) => {
        const message = parseErrorValue(
          fieldError,
          depth + 1
        );

        if (!message) {
          return "";
        }

        return `${
          ERROR_FIELD_LABELS[field] || field
        }: ${message}`;
      })
      .filter(Boolean)
      .join("; ");
  }

  return "";
};

const getErrorMessage = (
  error,
  fallback =
    "Postni saqlashda kutilmagan xatolik yuz berdi."
) => {
  if (!error) {
    return fallback;
  }

  const serverData =
    error?.serverData ??
    error?.response?.data;

  return (
    parseErrorValue(serverData) ||
    parseErrorValue(error?.message) ||
    fallback
  );
};

// =========================================================
// HTML TO PLAIN TEXT
// =========================================================
//
// Used only for:
// - Validation
// - Word count
// - Live preview
//
// This is NOT an HTML sanitizer.
// Article display uses DOMPurify separately.
// =========================================================

const stripHtml = (value = "") => {
  return String(value ?? "")
    .replace(
      /<(script|style|noscript)\b[^>]*>[\s\S]*?<\/\1\s*>/gi,
      " "
    )
    .replace(
      /<!--[\s\S]*?-->/g,
      " "
    )
    .replace(
      /<\/(?:p|div|li|h[1-6]|blockquote|pre)>/gi,
      " "
    )
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;|&#xA0;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#039;|&#39;|&apos;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
};

// =========================================================
// MEANINGFUL CONTENT VALIDATION
// =========================================================

const hasMeaningfulContent = (content) => {
  const rawContent = String(
    content ?? ""
  ).trim();

  if (!rawContent) {
    return false;
  }

  // Reject HTML that contains only
  // formatting tags or whitespace.

  if (stripHtml(rawContent)) {
    return true;
  }

  // Preserve legitimate image-only posts.
  // HTML security is handled separately
  // during rendering and on the backend.

  return /<img\b[^>]*\bsrc\s*=\s*(?:"[^"]+"|'[^']+'|[^\s>]+)/i.test(
    rawContent
  );
};

// =========================================================
// FORM VALIDATION
// =========================================================

const validatePostForm = (formData) => {
  const postType = formData.post_type;

  const title = String(
    formData.title ?? ""
  ).trim();

  const content = String(
    formData.content ?? ""
  ).trim();

  // CATEGORY

  const validCategory = POST_TYPES.some(
    (item) => item.value === postType
  );

  if (!validCategory) {
    return "Post turini to‘g‘ri tanlang.";
  }

  // TITLE

  if (!title) {
    return "Post sarlavhasini kiriting.";
  }

  if (title.length < TITLE_MIN_LENGTH) {
    return (
      "Sarlavha kamida 3 ta belgidan " +
      "iborat bo‘lishi kerak."
    );
  }

  if (title.length > TITLE_MAX_LENGTH) {
    return (
      "Sarlavha 150 ta belgidan " +
      "oshmasligi kerak."
    );
  }

  // CONTENT

  if (!hasMeaningfulContent(content)) {
    return (
      "Post mazmunini kiriting. " +
      "Faqat bo‘sh HTML teglaridan " +
      "iborat kontent yuborib bo‘lmaydi."
    );
  }

  return null;
};

// =========================================================
// BACKEND PAYLOAD
// =========================================================
//
// DO NOT change these keys.
// They match the existing Django API.
// =========================================================

const buildPostPayload = (formData) => ({
  post_type: formData.post_type,
  title: String(formData.title).trim(),
  content: String(formData.content).trim(),
});

// =========================================================
// MAIN COMPONENT
// =========================================================

const CreatePostModal = ({
  isOpen = false,
  onClose,
  onSubmit,
  isSubmitting = false,
  initialData = null,
}) => {
  // =======================================================
  // MODE
  // =======================================================

  const isEditMode = Boolean(initialData);

  // =======================================================
  // STABLE FORM IDENTITY
  // =======================================================
  //
  // Important:
  //
  // Do NOT use title/content as reset
  // dependencies. Parent re-renders must
  // not overwrite the user's edits.
  //
  // Use id or slug to distinguish posts.
  // =======================================================

  const formIdentity = isEditMode
    ? `edit:${
        initialData?.id ??
        initialData?.slug ??
        "current-post"
      }`
    : "create:new";

  // Always keep the newest initialData
  // without triggering a form reset.

  const initialDataRef = useRef(initialData);
  initialDataRef.current = initialData;

  // =======================================================
  // FORM STATE
  // =======================================================

  const [formData, setFormData] = useState(
    () => getInitialFormData(initialData)
  );

  const [error, setError] = useState("");

  const [
    isProcessing,
    setIsProcessing,
  ] = useState(false);

  // =======================================================
  // REFS
  // =======================================================

  const modalRef = useRef(null);
  const contentScrollRef = useRef(null);

  const previousFocusedElementRef =
    useRef(null);

  const mountedRef = useRef(false);

  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;

  const sessionRef = useRef(0);

  const activeSubmissionRef = useRef(null);

  const handleCloseRef = useRef(null);

  // =======================================================
  // BUSY STATE
  // =======================================================

  const busy =
    Boolean(isSubmitting) ||
    isProcessing ||
    Boolean(activeSubmissionRef.current);

  // =======================================================
  // COMPONENT LIFECYCLE
  // =======================================================

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      sessionRef.current += 1;
    };
  }, []);

  // =======================================================
  // RESET FORM ON OPEN / POST CHANGE
  // =======================================================
  //
  // Form reset happens only when:
  //
  // - Modal opens
  // - Create/Edit mode changes
  // - Another post is selected
  //
  // NOT when title/content props change.
  // =======================================================

  useEffect(() => {
    sessionRef.current += 1;

    if (!isOpen) {
      return undefined;
    }

    setFormData(
      getInitialFormData(
        initialDataRef.current
      )
    );

    setError("");

    if (contentScrollRef.current) {
      contentScrollRef.current.scrollTop = 0;
    }

    return () => {
      sessionRef.current += 1;
    };
  }, [
    isOpen,
    formIdentity,
  ]);

  // =======================================================
  // BODY SCROLL LOCK
  // =======================================================

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [isOpen]);

  // =======================================================
  // CLOSE HANDLER
  // =======================================================

  const handleClose = useCallback(() => {
    if (
      isSubmitting ||
      isProcessing ||
      activeSubmissionRef.current
    ) {
      return;
    }

    setError("");

    if (typeof onClose === "function") {
      onClose();
    }
  }, [
    isSubmitting,
    isProcessing,
    onClose,
  ]);

  handleCloseRef.current = handleClose;

  // =======================================================
  // FOCUS RESTORATION
  // =======================================================

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    previousFocusedElementRef.current =
      document.activeElement;

    const frameId =
      window.requestAnimationFrame(() => {
        modalRef.current?.focus({
          preventScroll: true,
        });
      });

    return () => {
      window.cancelAnimationFrame(frameId);

      const previous =
        previousFocusedElementRef.current;

      if (
        previous?.isConnected &&
        typeof previous.focus === "function"
      ) {
        previous.focus({
          preventScroll: true,
        });
      }
    };
  }, [isOpen]);

  // =======================================================
  // ESCAPE AND FOCUS TRAP
  // =======================================================

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      // ESCAPE

      if (event.key === "Escape") {
        event.preventDefault();

        handleCloseRef.current?.();

        return;
      }

      // TAB

      if (
        event.key !== "Tab" ||
        !modalRef.current
      ) {
        return;
      }

      const focusable = Array.from(
        modalRef.current.querySelectorAll(
          FOCUSABLE_SELECTOR
        )
      ).filter(
        (element) =>
          element.getClientRects().length > 0 &&
          element.getAttribute("aria-hidden") !==
            "true"
      );

      if (!focusable.length) {
        event.preventDefault();
        modalRef.current.focus();

        return;
      }

      const first = focusable[0];
      const last =
        focusable[focusable.length - 1];

      const active =
        document.activeElement;

      if (
        active === modalRef.current ||
        !modalRef.current.contains(active)
      ) {
        event.preventDefault();

        (
          event.shiftKey
            ? last
            : first
        ).focus();

        return;
      }

      if (
        event.shiftKey &&
        active === first
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        active === last
      ) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [isOpen]);

  // =======================================================
  // SELECTED CATEGORY
  // =======================================================

  const selectedType = useMemo(
    () =>
      POST_TYPES.find(
        (item) =>
          item.value === formData.post_type
      ) || POST_TYPES[0],
    [formData.post_type]
  );

  // =======================================================
  // PREVIEW AND WORD COUNT
  // =======================================================

  const cleanPreviewContent = useMemo(
    () => stripHtml(formData.content),
    [formData.content]
  );

  const wordCount = useMemo(() => {
    if (!cleanPreviewContent) {
      return 0;
    }

    return cleanPreviewContent
      .split(/\s+/)
      .filter(Boolean)
      .length;
  }, [cleanPreviewContent]);

  // =======================================================
  // INPUT CHANGE
  // =======================================================

  const handleChange = useCallback(
    (event) => {
      if (
        isSubmitting ||
        activeSubmissionRef.current
      ) {
        return;
      }

      const { name, value } = event.target;

      if (
        name !== "title" &&
        name !== "content"
      ) {
        return;
      }

      setFormData((previous) => ({
        ...previous,
        [name]: value,
      }));

      setError("");
    },
    [isSubmitting]
  );

  // =======================================================
  // CATEGORY CHANGE
  // =======================================================

  const handleCategoryChange = useCallback(
    (value) => {
      if (
        isSubmitting ||
        activeSubmissionRef.current
      ) {
        return;
      }

      const valid = POST_TYPES.some(
        (item) => item.value === value
      );

      if (!valid) {
        return;
      }

      setFormData((previous) => ({
        ...previous,
        post_type: value,
      }));

      setError("");
    },
    [isSubmitting]
  );

  // =======================================================
  // BACKDROP CLOSE
  // =======================================================

  const handleBackdropClick = (event) => {
    if (
      event.target === event.currentTarget
    ) {
      handleClose();
    }
  };

  // =======================================================
  // SCROLL TO ERROR
  // =======================================================

  const scrollToFormTop = useCallback(() => {
    const element =
      contentScrollRef.current;

    if (!element) {
      return;
    }

    element.scrollTo({
      top: 0,
      behavior: "auto",
    });
  }, []);

  // =======================================================
  // SUBMIT
  // =======================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    // =====================================
    // SUBMIT GUARD
    // =====================================

    if (
      !isOpenRef.current ||
      isSubmitting ||
      activeSubmissionRef.current
    ) {
      return;
    }

    setError("");

    // =====================================
    // CALLBACK VALIDATION
    // =====================================

    if (typeof onSubmit !== "function") {
      setError(
        "Postni saqlash funksiyasi mavjud emas."
      );

      scrollToFormTop();

      return;
    }

    // =====================================
    // FORM VALIDATION
    // =====================================

    const validationError =
      validatePostForm(formData);

    if (validationError) {
      setError(validationError);

      siteToast.warning(
        validationError,
        {
          title:
            "Post ma’lumotlarini tekshiring",
          duration: 4000,
        }
      );

      scrollToFormTop();

      return;
    }

    // =====================================
    // SNAPSHOT
    // =====================================

    const request = {
      session: sessionRef.current,
      isEditMode,
      payload: buildPostPayload(formData),
    };

    // =====================================
    // SYNCHRONOUS LOCK
    // =====================================

    activeSubmissionRef.current =
      request;

    setIsProcessing(true);

    // =====================================
    // CREATE TOAST
    // =====================================

    let loadingToastId = null;

    if (!isEditMode) {
      loadingToastId =
        siteToast.loading(
          "Yangi post serverga yuborilmoqda...",
          {
            title: "Post yaratilmoqda",
          }
        );
    }

    // =====================================
    // SESSION VALIDATION
    // =====================================

    const isCurrentSession = () =>
      mountedRef.current &&
      isOpenRef.current &&
      sessionRef.current ===
        request.session &&
      activeSubmissionRef.current ===
        request;

    const dismissCreateToast = () => {
      if (
        loadingToastId !== null &&
        loadingToastId !== undefined
      ) {
        siteToast.dismiss(
          loadingToastId
        );
      }
    };

    try {
      // ===================================
      // PARENT API
      // ===================================

      const result = await onSubmit(
        request.payload
      );

      // ===================================
      // STALE RESPONSE
      // ===================================

      if (!isCurrentSession()) {
        dismissCreateToast();
        return;
      }

      // ===================================
      // PARENT RETURNED FALSE
      // ===================================

      if (result === false) {
        dismissCreateToast();

        setError(
          "Postni saqlash yakunlanmadi. " +
          "Ma’lumotlaringiz saqlandi, " +
          "holatni tekshirib qayta urinishingiz mumkin."
        );

        scrollToFormTop();

        return;
      }

      // ===================================
      // CREATE SUCCESS
      // ===================================

      if (!request.isEditMode) {
        siteToast.success(
          "Yangi postingiz muvaffaqiyatli chop etildi.",
          {
            id: loadingToastId,
            title: "Post chop etildi",
            duration: 3800,
          }
        );

        // Parent handles closing.
        // Do not reset here; on the next
        // open the form will initialize.

        setError("");
      }

      // ===================================
      // EDIT SUCCESS
      // ===================================

      // Parent handles:
      // - Redux update
      // - Success toast
      // - Closing
      // - Slug navigation

    } catch (submitError) {
      // ===================================
      // STALE ERROR
      // ===================================

      if (!isCurrentSession()) {
        dismissCreateToast();
        return;
      }

      // ===================================
      // API ERROR
      // ===================================

      const message = getErrorMessage(
        submitError,
        request.isEditMode
          ? "Postni tahrirlashda xato yuz berdi."
          : "Post yaratishda xato yuz berdi."
      );

      setError(message);

      scrollToFormTop();

      // ===================================
      // CREATE FAILURE TOAST
      // ===================================

      // Edit errors are toasted by the
      // PostDetail parent.

      if (!request.isEditMode) {
        siteToast.error(
          message,
          {
            id: loadingToastId,
            title: "Post yaratilmadi",
            duration: 5000,
          }
        );
      }

    } finally {
      // ===================================
      // UNLOCK REQUEST
      // ===================================

      if (
        activeSubmissionRef.current ===
        request
      ) {
        activeSubmissionRef.current =
          null;

        // The processing flag belongs
        // only to this request. No newer
        // request could start while its
        // synchronous lock was active.

        if (mountedRef.current) {
          setIsProcessing(false);
        }
      }
    }
  };

  // =======================================================
  // CLOSED MODAL
  // =======================================================

  if (
    !isOpen ||
    typeof document === "undefined"
  ) {
    return null;
  }

  // =======================================================
  // PORTAL
  // =======================================================

  return createPortal(
    <div
      onMouseDown={handleBackdropClick}
      className="
        fixed
        inset-0
        z-[99999]

        flex
        items-stretch
        justify-center

        overflow-hidden
        bg-slate-950/75

        p-0
        backdrop-blur-md

        sm:items-center
        sm:p-5

        dark:bg-black/80

        lg:p-8
      "
    >
      {/* =====================================
          BACKGROUND GLOW
      ===================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/4
          h-80
          w-80
          -translate-x-1/2

          rounded-full
          bg-indigo-500/10
          blur-[110px]

          dark:bg-indigo-500/[0.12]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -bottom-20
          right-0
          h-64
          w-64

          rounded-full
          bg-purple-500/10
          blur-[100px]

          dark:bg-purple-500/[0.10]
        "
      />

      {/* =====================================
          MAIN PANEL
      ===================================== */}

      <div
        ref={modalRef}

        role="dialog"
        aria-modal="true"

        aria-labelledby="post-create-modal-title"
        aria-describedby="post-create-modal-description"

        tabIndex={-1}

        className="
          relative
          isolate

          flex
          h-screen
          h-[100dvh]
          max-h-[100dvh]

          w-full
          min-w-0
          max-w-6xl

          flex-col
          overflow-hidden

          rounded-none
          border-0

          bg-white
          font-sans
          text-slate-900

          shadow-[0_30px_100px_rgba(15,23,42,0.25)]
          outline-none

          sm:h-[min(780px,calc(100dvh-40px))]
          sm:max-h-[calc(100dvh-40px)]
          sm:rounded-[26px]
          sm:border
          sm:border-slate-200

          lg:rounded-[32px]

          dark:bg-[#0a0d14]
          dark:text-white
          dark:shadow-[0_35px_100px_rgba(0,0,0,0.70)]
          dark:sm:border-white/[0.08]
        "
        style={{
          fontFamily:
            "var(--font-sans, 'Space Grotesk', sans-serif)",
        }}
      >
        {/* =================================
            DECORATIVE TOP GLOW
        ================================= */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            left-1/2
            top-0

            h-36
            w-[70%]
            -translate-x-1/2
            -translate-y-1/2

            rounded-full
            bg-indigo-500/[0.10]
            blur-[75px]
          "
        />

        {/* =================================
            HEADER
        ================================= */}

        <PostCreateHeader
          isEditMode={isEditMode}
          isSubmitting={busy}
          onClose={handleClose}
        />

        {/* =================================
            FORM
        ================================= */}

        <form
          onSubmit={handleSubmit}
          noValidate
          className="
            relative
            z-10

            flex
            min-h-0
            min-w-0
            flex-1
            flex-col

            overflow-hidden
          "
        >
          {/* =============================
              SCROLLABLE CONTENT
          ============================= */}

          <div
            ref={contentScrollRef}
            className="
              min-h-0
              min-w-0
              flex-1

              overflow-x-hidden
              overflow-y-auto
              overscroll-contain
              touch-pan-y

              [scrollbar-gutter:stable]
            "
          >
            {/* =========================
                RESPONSIVE GRID
            ========================= */}

            <div
              className="
                grid
                w-full
                min-w-0
                grid-cols-1
                items-start

                lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]
              "
            >
              {/* =====================
                  LEFT — FIELDS
              ===================== */}

              <div
                className="
                  w-full
                  min-w-0
                  space-y-5
                  p-3

                  min-[380px]:p-4

                  sm:space-y-6
                  sm:p-6

                  lg:space-y-7
                  lg:border-r
                  lg:border-slate-200
                  lg:p-7

                  dark:lg:border-white/[0.07]
                "
              >
                {/* ERROR MESSAGE */}

                {error && (
                  <div
                    role="alert"
                    className="
                      flex
                      min-w-0
                      items-start
                      gap-3

                      rounded-2xl
                      border
                      border-red-200
                      bg-red-50

                      p-3

                      sm:p-4

                      dark:border-red-400/20
                      dark:bg-red-500/[0.08]
                    "
                  >
                    <span
                      aria-hidden="true"
                      className="
                        grid
                        h-9
                        w-9
                        shrink-0
                        place-items-center

                        rounded-xl
                        bg-red-100
                        text-red-600

                        dark:bg-red-500/10
                        dark:text-red-300
                      "
                    >
                      <AlertTriangle
                        size={17}
                      />
                    </span>

                    <div className="min-w-0 flex-1">
                      <p
                        className="
                          text-xs
                          font-black
                          uppercase
                          tracking-wide
                          text-red-700

                          dark:text-red-300
                        "
                      >
                        Xatolik
                      </p>

                      <p
                        className="
                          mt-1
                          break-words
                          [overflow-wrap:anywhere]

                          text-sm
                          font-medium
                          leading-6
                          text-red-700

                          dark:text-red-200
                        "
                      >
                        {error}
                      </p>
                    </div>
                  </div>
                )}

                {/* POST TYPE */}

                <PostCreateTypeSelector
                  value={selectedType.value}
                  onChange={handleCategoryChange}
                  disabled={busy}
                />

                {/* POST FIELDS */}

                <PostCreateFields
                  formData={formData}
                  onChange={handleChange}
                  wordCount={wordCount}
                  disabled={busy}
                />
              </div>

              {/* =====================
                  RIGHT — PREVIEW
              ===================== */}

              <div
                className="
                  w-full
                  min-w-0
                  overflow-hidden
                "
              >
                <PostCreatePreview
                  formData={formData}
                  cleanPreviewContent={
                    cleanPreviewContent
                  }
                />
              </div>
            </div>
          </div>

          {/* =============================
              FOOTER
          ============================= */}

          <PostCreateFooter
            isEditMode={isEditMode}
            isSubmitting={busy}
            onClose={handleClose}
          />
        </form>
      </div>
    </div>,
    document.body
  );
};

export default CreatePostModal;
