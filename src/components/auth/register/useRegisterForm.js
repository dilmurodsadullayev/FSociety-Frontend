
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
  clearRegisterError,
  registerRequestStart,
  registerRequestSuccess,
  registerRequestFailure,
  signUserSuccess,
} from "../../../features/auth/Auth";

import AuthService from "../../../services/auth";

import { authToast } from "../../ui/AuthToast";

import {
  REGISTER_FIELDS,
  validateRegisterField,
  validateRegisterForm,
} from "./registerValidation";

import {
  extractServerErrors,
} from "./registerErrorParser";

// =========================================================
// FSOCIETY — REGISTER FORM CONTROLLER
// =========================================================
//
// Location:
// src/components/auth/register/useRegisterForm.js
//
// Responsibilities:
// - Controlled form
// - Username / email validation
// - Password and confirmation validation
// - Backend field errors
// - Duplicate username/email handling
// - First invalid field focus
// - Registration API
// - Separate Redux register loading
// - Universal authToast
// - OAuth redirect
// - Session verification
//
// Existing endpoints:
// POST /users/register/
// GET  /users/user/
//
// =========================================================

// =========================================================
// CONSTANTS
// =========================================================

const INITIAL_VALUES = {
  username: "",
  email: "",
  password: "",
  password2: "",
};

const REGISTER_ERROR_MESSAGE =
  "Ro‘yxatdan o‘tishda xatolik yuz berdi. " +
  "Qayta urinib ko‘ring.";

// =========================================================
// HELPERS
// =========================================================

const isRegisterField = (field) =>
  REGISTER_FIELDS.includes(field);

const getFirstInvalidField = (errors) =>
  REGISTER_FIELDS.find(
    (field) => Boolean(errors?.[field])
  ) || null;

const getCleanedValues = (values) => ({
  username: values.username.trim(),

  email: values.email
    .trim()
    .toLowerCase(),

  password: values.password,

  password2: values.password2,
});

const markAllTouched = () =>
  REGISTER_FIELDS.reduce(
    (result, field) => {
      result[field] = true;
      return result;
    },
    {}
  );

// =========================================================
// VALID USER HELPER
// =========================================================

const getAuthenticatedUser = (response) => {
  const candidate =
    response?.user ?? response;

  if (
    !candidate ||
    typeof candidate !== "object" ||
    Array.isArray(candidate)
  ) {
    return null;
  }

  const hasValidId =
    candidate.id !== null &&
    candidate.id !== undefined &&
    candidate.id !== "";

  return hasValidId
    ? candidate
    : null;
};

// =========================================================
// MAIN HOOK
// =========================================================

export default function useRegisterForm() {
  // =====================================================
  // REDUX / ROUTER
  // =====================================================

  const dispatch = useDispatch();

  const navigate = useNavigate();

  // =====================================================
  // FIELD REFS
  // =====================================================

  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const password2Ref = useRef(null);

  const fieldRefs = useMemo(
    () => ({
      username: usernameRef,
      email: emailRef,
      password: passwordRef,
      password2: password2Ref,
    }),
    []
  );

  // =====================================================
  // LIFECYCLE / REQUEST GUARDS
  // =====================================================

  const mountedRef = useRef(false);

  const submittingRef = useRef(false);

  // Holds the latest input values even if
  // React hasn't committed a render yet.
  const valuesRef = useRef(INITIAL_VALUES);

  // =====================================================
  // FORM VALUES
  // =====================================================

  const [values, setValues] = useState(
    INITIAL_VALUES
  );

  // =====================================================
  // VALIDATION STATE
  // =====================================================

  const [formErrors, setFormErrors] =
    useState({});

  const [globalError, setGlobalError] =
    useState("");

  const [touched, setTouched] =
    useState({});

  const [submitted, setSubmitted] =
    useState(false);

  // =====================================================
  // LOCAL SUBMITTING STATE
  // =====================================================

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  // =====================================================
  // INITIALIZATION
  // =====================================================

  useEffect(() => {
    mountedRef.current = true;

    dispatch(clearAuthError());
    dispatch(clearRegisterError());

    return () => {
      mountedRef.current = false;
    };
  }, [dispatch]);

  // =====================================================
  // FOCUS FIELD
  // =====================================================

  const focusField = useCallback(
    (fieldName) => {
      if (!isRegisterField(fieldName)) {
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

        const reducedMotion =
          window.matchMedia?.(
            "(prefers-reduced-motion: reduce)"
          )?.matches ?? false;

        input.scrollIntoView?.({
          behavior: reducedMotion
            ? "auto"
            : "smooth",
          block: "center",
        });
      });
    },
    [fieldRefs]
  );

  // =====================================================
  // CLEAR FORM ERRORS
  // =====================================================

  const clearErrors = useCallback(() => {
    setFormErrors({});
    setGlobalError("");

    dispatch(clearRegisterError());
  }, [dispatch]);

  // =====================================================
  // FIELD CHANGE
  // =====================================================

  const handleChange = useCallback(
    (event) => {
      const { name, value } = event.target;

      if (
        !isRegisterField(name) ||
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

      dispatch(clearRegisterError());

      const nextValidation =
        validateRegisterForm(nextValues);

      setFormErrors((previous) => {
        const next = {
          ...previous,
        };

        // The previously received backend
        // error no longer applies to an
        // edited value.
        delete next[name];

        // Show current local validation for
        // touched/submitted fields.
        if (touched[name] || submitted) {
          if (nextValidation[name]) {
            next[name] =
              nextValidation[name];
          }
        }

        // Username influences password
        // similarity validation.
        if (
          name === "username" &&
          (touched.password || submitted)
        ) {
          if (nextValidation.password) {
            next.password =
              nextValidation.password;
          } else {
            delete next.password;
          }
        }

        // Password influences confirmation.
        if (
          name === "password" &&
          (touched.password2 || submitted)
        ) {
          if (nextValidation.password2) {
            next.password2 =
              nextValidation.password2;
          } else {
            delete next.password2;
          }
        }

        return next;
      });
    },
    [
      dispatch,
      touched,
      submitted,
    ]
  );

  // =====================================================
  // FIELD BLUR
  // =====================================================

  const handleBlur = useCallback(
    (event) => {
      const field = event.target.name;

      if (
        !isRegisterField(field) ||
        submittingRef.current
      ) {
        return;
      }

      setTouched((previous) => ({
        ...previous,
        [field]: true,
      }));

      const message =
        validateRegisterField(
          field,
          valuesRef.current
        );

      setFormErrors((previous) => {
        const next = {
          ...previous,
        };

        // Preserve server error when the
        // value has not been edited.
        if (next[field] && !message) {
          return previous;
        }

        if (message) {
          next[field] = message;
        } else {
          delete next[field];
        }

        return next;
      });
    },
    []
  );

  // =====================================================
  // ENTER NAVIGATION
  // =====================================================

  const handleEnter = useCallback(
    (event, nextField) => {
      if (
        event.key !== "Enter" ||
        event.isComposing ||
        !isRegisterField(nextField)
      ) {
        return;
      }

      event.preventDefault();

      focusField(nextField);
    },
    [focusField]
  );

  // =====================================================
  // HANDLE REGISTRATION SUBMIT
  // =====================================================

  const handleSubmit = useCallback(
    async (event) => {
      event?.preventDefault();

      if (submittingRef.current) {
        return;
      }

      const cleanedValues =
        getCleanedValues(
          valuesRef.current
        );

      setSubmitted(true);
      setTouched(markAllTouched());

      // ===============================================
      // CLIENT VALIDATION
      // ===============================================

      const clientErrors =
        validateRegisterForm(
          cleanedValues
        );

      const firstInvalidField =
        getFirstInvalidField(
          clientErrors
        );

      if (firstInvalidField) {
        const firstMessage =
          clientErrors[firstInvalidField];

        setFormErrors(clientErrors);

        setGlobalError(
          "Qizil maydonlardagi " +
          "xatoliklarni to‘g‘rilang."
        );

        authToast.warning(
          firstMessage,
          {
            id: "register-client-validation",
            title: "Formani tekshiring",
          }
        );

        focusField(firstInvalidField);

        return;
      }

      // ===============================================
      // REQUEST START
      // ===============================================

      submittingRef.current = true;

      setIsSubmitting(true);
      setFormErrors({});
      setGlobalError("");

      // Dedicated Register Redux action.
      // Does not trigger PublicAuthPage loader.
      dispatch(registerRequestStart());

      try {
        // =============================================
        // REGISTER API
        // =============================================

        const response =
          await AuthService.userRegister(
            cleanedValues
          );

        if (!mountedRef.current) {
          return;
        }

        // =============================================
        // REGISTER SUCCESS
        // =============================================

        dispatch(
          registerRequestSuccess()
        );

        // =============================================
        // VERIFY COOKIE AUTH SESSION
        //
        // An account can be created without
        // the user being signed in.
        //
        // Do not infer authentication from
        // response.user alone.
        // =============================================

        let authenticatedUser = null;

        try {
          const currentUser =
            await AuthService.getUser();

          if (!mountedRef.current) {
            return;
          }

          authenticatedUser =
            getAuthenticatedUser(
              currentUser
            );
        } catch {
          // Registration already succeeded.
          // A failed session check does not
          // mean registration failed.
          authenticatedUser = null;
        }

        if (!mountedRef.current) {
          return;
        }

        // =============================================
        // AUTHENTICATED SUCCESS
        // =============================================

        if (authenticatedUser) {
          dispatch(
            signUserSuccess(
              authenticatedUser
            )
          );

          authToast.success(
            `Xush kelibsiz, ${
              authenticatedUser.username ||
              cleanedValues.username
            }!`,
            {
              id: "register-success",
              title: "Hisob yaratildi",
              duration: 3200,
            }
          );

          // Existing PublicAuthPage redirects
          // authenticated users to "/".
          // Explicit navigation is also safe.
          navigate("/", {
            replace: true,
          });

          return;
        }

        // =============================================
        // CREATED BUT NOT AUTHENTICATED
        // =============================================

        const registeredUsername =
          response?.user?.username ||
          response?.username ||
          cleanedValues.username;

        authToast.success(
          `${registeredUsername}, hisobingiz yaratildi. Endi tizimga kiring.`,
          {
            id: "register-success",
            title: "Hisob yaratildi",
            duration: 4500,
          }
        );

        navigate("/login", {
          replace: true,
        });
      } catch (error) {
        if (!mountedRef.current) {
          return;
        }

        // =============================================
        // BACKEND ERRORS
        // =============================================

        const {
          fieldErrors,
          globalError: serverError,
          firstField,
        } = extractServerErrors(error);

        const message =
          serverError ||
          REGISTER_ERROR_MESSAGE;

        const nextErrors =
          fieldErrors || {};

        setFormErrors(nextErrors);
        setGlobalError(message);

        dispatch(
          registerRequestFailure(message)
        );

        authToast.error(
          message,
          {
            id: "register-server-error",
            title: "Hisob yaratilmadi",
            duration: 5000,
          }
        );

        const invalidField =
          firstField ||
          getFirstInvalidField(
            nextErrors
          );

        if (invalidField) {
          focusField(invalidField);
        }
      } finally {
        submittingRef.current = false;

        if (mountedRef.current) {
          setIsSubmitting(false);
        }
      }
    },
    [
      dispatch,
      focusField,
      navigate,
    ]
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

        authToast.error(
          message,
          {
            id: "register-oauth-error",
            title: "Social login xatosi",
          }
        );

        return;
      }

      // Permit only HTTP(S) OAuth destinations.
      // Preserve full existing provider URL,
      // including callback/state parameters.

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
            "Unsupported OAuth protocol"
          );
        }

        window.location.assign(
          destination.href
        );
      } catch {
        const message =
          "Social login manzili noto‘g‘ri sozlangan.";

        setGlobalError(message);

        authToast.error(
          message,
          {
            id: "register-oauth-error",
            title: "Social login xatosi",
          }
        );
      }
    },
    []
  );

  // =====================================================
  // PUBLIC API
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
    emailRef,
    passwordRef,
    password2Ref,

    handleChange,
    handleBlur,
    handleEnter,
    handleSubmit,

    handleSocialLogin,

    focusField,
    clearErrors,
  };
}
