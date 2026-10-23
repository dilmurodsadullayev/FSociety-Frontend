
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
  clearAuthError,
  signUserFailure,
  signUserSuccess,
} from "../../../features/auth/Auth";

import AuthService from "../../../services/auth";

import { authToast } from "../../ui/AuthToast";

import {
  extractLoginErrors,
  LOGIN_FIELDS,
} from "./loginErrorParser";

// =========================================================
// FSOCIETY — LOGIN FORM CONTROLLER
// =========================================================
//
// Location:
// src/components/auth/login/useLoginForm.js
//
// Responsibilities:
// - Controlled username/password inputs
// - Client-side validation
// - Backend validation errors
// - Invalid credentials handling
// - Local loading state
// - Duplicate request protection
// - JWT cookie login
// - Redux synchronization
// - Universal authToast
// - Field focus
// - Google / GitHub redirect
//
// Existing endpoint:
// POST /users/login/
//
// =========================================================

// =========================================================
// CONSTANTS
// =========================================================

const INITIAL_VALUES = {
  username: "",
  password: "",
};

const DEFAULT_LOGIN_ERROR =
  "Tizimga kirishda xatolik yuz berdi. " +
  "Qayta urinib ko‘ring.";

// =========================================================
// VALIDATION
// =========================================================

export const validateLoginForm = (values = {}) => {
  const errors = {};

  const username =
    typeof values.username === "string"
      ? values.username.trim()
      : "";

  const password =
    typeof values.password === "string"
      ? values.password
      : "";

  if (!username) {
    errors.username =
      "Tizimga kirish uchun username kiriting.";
  }

  if (!password) {
    errors.password =
      "Tizimga kirish uchun parolingizni kiriting.";
  }

  return errors;
};

const isLoginField = (name) =>
  LOGIN_FIELDS.includes(name);

const getFirstInvalidField = (errors) =>
  LOGIN_FIELDS.find(
    (field) => Boolean(errors?.[field])
  ) || null;

const getValidatedUser = (response) => {
  const candidate =
    response?.user ??
    response?.data?.user ??
    response;

  if (
    !candidate ||
    typeof candidate !== "object" ||
    Array.isArray(candidate)
  ) {
    return null;
  }

  if (
    candidate.id === undefined ||
    candidate.id === null ||
    candidate.id === ""
  ) {
    return null;
  }

  return candidate;
};

// =========================================================
// MAIN HOOK
// =========================================================

export default function useLoginForm() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  // =====================================================
  // FIELD REFS
  // =====================================================

  const usernameRef = useRef(null);

  const passwordRef = useRef(null);

  const fieldRefs = useMemo(
    () => ({
      username: usernameRef,
      password: passwordRef,
    }),
    []
  );

  // =====================================================
  // LIFECYCLE / REQUEST GUARDS
  // =====================================================

  const mountedRef = useRef(false);

  const submittingRef = useRef(false);

  const valuesRef = useRef(INITIAL_VALUES);

  // =====================================================
  // FORM STATE
  // =====================================================

  const [values, setValues] = useState(
    INITIAL_VALUES
  );

  const [formErrors, setFormErrors] =
    useState({});

  const [globalError, setGlobalError] =
    useState("");

  const [touched, setTouched] =
    useState({});

  const [submitted, setSubmitted] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  // =====================================================
  // INITIALIZATION
  // =====================================================

  useEffect(() => {
    mountedRef.current = true;

    dispatch(clearAuthError());

    // Preserve old username autofocus,
    // but don't force mobile keyboard open.
    const timer = window.setTimeout(() => {
      const isSmallScreen =
        window.matchMedia?.(
          "(max-width: 639px)"
        )?.matches ?? false;

      if (
        mountedRef.current &&
        !isSmallScreen
      ) {
        usernameRef.current?.focus({
          preventScroll: true,
        });
      }
    }, 100);

    return () => {
      mountedRef.current = false;

      window.clearTimeout(timer);
    };
  }, [dispatch]);

  // =====================================================
  // FOCUS FIELD
  // =====================================================

  const focusField = useCallback(
    (fieldName, selectText = false) => {
      if (!isLoginField(fieldName)) {
        return;
      }

      window.requestAnimationFrame(() => {
        if (!mountedRef.current) {
          return;
        }

        const input =
          fieldRefs[fieldName]?.current;

        if (!input) {
          return;
        }

        input.focus({
          preventScroll: true,
        });

        if (selectText) {
          input.select?.();
        }

        const reduceMotion =
          window.matchMedia?.(
            "(prefers-reduced-motion: reduce)"
          )?.matches ?? false;

        input.scrollIntoView?.({
          behavior: reduceMotion
            ? "auto"
            : "smooth",
          block: "center",
        });
      });
    },
    [fieldRefs]
  );

  // =====================================================
  // CLEAR ERRORS
  // =====================================================

  const clearErrors = useCallback(() => {
    setFormErrors({});
    setGlobalError("");

    dispatch(clearAuthError());
  }, [dispatch]);

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = useCallback(
    (event) => {
      const { name, value } = event.target;

      if (
        !isLoginField(name) ||
        submittingRef.current
      ) {
        return;
      }

      const nextValues = {
        ...valuesRef.current,
        [name]: value,
      };

      valuesRef.current = nextValues;

      setValues(nextValues);
      setGlobalError("");

      dispatch(clearAuthError());

      const validation =
        validateLoginForm(nextValues);

      setFormErrors((previous) => {
        const next = { ...previous };

        // The previous server error no longer
        // applies once this field changes.
        delete next[name];

        // Show local errors after blur
        // or after an attempted submit.
        if (touched[name] || submitted) {
          if (validation[name]) {
            next[name] = validation[name];
          }
        }

        return next;
      });
    },
    [dispatch, touched, submitted]
  );

  // =====================================================
  // INPUT BLUR
  // =====================================================

  const handleBlur = useCallback(
    (event) => {
      const field = event.target.name;

      if (
        !isLoginField(field) ||
        submittingRef.current
      ) {
        return;
      }

      setTouched((previous) => ({
        ...previous,
        [field]: true,
      }));

      const localError =
        validateLoginForm(
          valuesRef.current
        )[field];

      setFormErrors((previous) => {
        const next = { ...previous };

        if (localError) {
          next[field] = localError;
        } else if (!previous[field]) {
          delete next[field];
        }

        // Preserve explicit backend errors
        // until the user changes the value.
        return next;
      });
    },
    []
  );

  // =====================================================
  // ENTER KEY NAVIGATION
  // =====================================================

  const handleUsernameKeyDown = useCallback(
    (event) => {
      if (
        event.key !== "Enter" ||
        event.isComposing
      ) {
        return;
      }

      event.preventDefault();

      const username =
        valuesRef.current.username.trim();

      if (!username) {
        const message =
          "Avval username kiriting.";

        setTouched((previous) => ({
          ...previous,
          username: true,
        }));

        setFormErrors((previous) => ({
          ...previous,
          username: message,
        }));

        authToast.warning(message, {
          id: "login-username-required",
          title: "Username kerak",
        });

        focusField("username");
        return;
      }

      focusField("password");
    },
    [focusField]
  );

  // =====================================================
  // LOGIN SUBMIT
  // =====================================================

  const handleSubmit = useCallback(
    async (event) => {
      event?.preventDefault();

      if (submittingRef.current) {
        return;
      }

      const currentValues =
        valuesRef.current;

      const cleanedValues = {
        username:
          currentValues.username.trim(),

        // Never trim or modify a password.
        password:
          currentValues.password,
      };

      setSubmitted(true);

      setTouched({
        username: true,
        password: true,
      });

      // ===============================================
      // CLIENT VALIDATION
      // ===============================================

      const clientErrors =
        validateLoginForm(
          cleanedValues
        );

      const firstInvalidField =
        getFirstInvalidField(
          clientErrors
        );

      if (firstInvalidField) {
        const message =
          clientErrors[firstInvalidField];

        setFormErrors(clientErrors);

        setGlobalError(
          "Iltimos, qizil maydonlarni tekshiring."
        );

        authToast.warning(message, {
          id: "login-validation-warning",
          title: "Formani tekshiring",
        });

        focusField(firstInvalidField);
        return;
      }

      // ===============================================
      // BEGIN REQUEST
      // ===============================================

      submittingRef.current = true;

      setIsSubmitting(true);
      setFormErrors({});
      setGlobalError("");

      dispatch(clearAuthError());

      try {
        // =============================================
        // LOGIN API
        // =============================================

        const response =
          await AuthService.userLogin({
            username:
              cleanedValues.username,

            password:
              cleanedValues.password,
          });

        if (!mountedRef.current) {
          return;
        }

        // =============================================
        // RESOLVE USER
        //
        // Existing backend normally returns
        // the user in the login response.
        //
        // If only cookie/token information
        // is returned, fetch current user.
        // =============================================

        let loggedUser =
          getValidatedUser(response);

        if (!loggedUser) {
          const currentUser =
            await AuthService.getUser();

          if (!mountedRef.current) {
            return;
          }

          loggedUser =
            getValidatedUser(currentUser);
        }

        if (!loggedUser) {
          throw new Error(
            "Login javobi olindi, ammo " +
            "foydalanuvchi ma’lumotlarini " +
            "tasdiqlab bo‘lmadi."
          );
        }

        // =============================================
        // REDUX SUCCESS
        // =============================================

        dispatch(
          signUserSuccess(loggedUser)
        );

        // =============================================
        // SUCCESS TOAST
        // =============================================

        authToast.success(
          `Xush kelibsiz, ${
            loggedUser.username ||
            cleanedValues.username
          }!`,
          {
            id: "login-success",
            title: "Tizimga kirildi",
            duration: 3000,
          }
        );

        // Global AuthToast is rendered by App,
        // so it remains visible after routing.
        navigate("/", {
          replace: true,
        });
      } catch (error) {
        if (!mountedRef.current) {
          return;
        }

        // =============================================
        // SERVER ERROR PARSER
        // =============================================

        const parsed =
          extractLoginErrors(error);

        const nextErrors =
          parsed.fieldErrors || {};

        const message =
          parsed.globalError ||
          DEFAULT_LOGIN_ERROR;

        setFormErrors(nextErrors);
        setGlobalError(message);

        // This is a real login request failure,
        // not a local input validation error.
        dispatch(
          signUserFailure(message)
        );

        authToast.error(message, {
          id: "login-server-error",
          title: "Kirish amalga oshmadi",
          duration: 5000,
        });

        // If the server identifies a field,
        // focus that field.
        //
        // For generic invalid credentials,
        // focus password without falsely
        // marking it as the wrong field.
        const invalidField =
          parsed.firstField ||
          "password";

        focusField(
          invalidField,
          invalidField === "password"
        );
      } finally {
        submittingRef.current = false;

        if (mountedRef.current) {
          setIsSubmitting(false);
        }
      }
    },
    [dispatch, navigate, focusField]
  );

  // =====================================================
  // SOCIAL LOGIN
  // =====================================================

  const handleSocialLogin = useCallback(
    (url) => {
      if (submittingRef.current) {
        return;
      }

      if (
        typeof url !== "string" ||
        !url.trim()
      ) {
        const message =
          "Social login manzili topilmadi.";

        setGlobalError(message);

        authToast.error(message, {
          id: "login-oauth-error",
          title: "Social login xatosi",
        });

        return;
      }

      try {
        const destination = new URL(
          url,
          window.location.origin
        );

        if (
          !["http:", "https:"].includes(
            destination.protocol
          )
        ) {
          throw new Error(
            "Unsupported protocol"
          );
        }

        window.location.assign(
          destination.href
        );
      } catch {
        const message =
          "Social login manzili noto‘g‘ri sozlangan.";

        setGlobalError(message);

        authToast.error(message, {
          id: "login-oauth-error",
          title: "Social login xatosi",
        });
      }
    },
    []
  );

  // =====================================================
  // PUBLIC CONTROLLER API
  // =====================================================

  return {
    values,
    formData: values,

    formErrors,
    globalError,

    touched,
    submitted,

    isSubmitting,

    fieldRefs,
    usernameRef,
    passwordRef,

    handleChange,
    handleBlur,
    handleUsernameKeyDown,
    handleSubmit,

    handleSocialLogin,

    focusField,
    clearErrors,
  };
}
