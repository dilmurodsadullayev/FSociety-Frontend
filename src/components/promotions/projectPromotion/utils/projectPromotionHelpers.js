
/**
 * FSociety — Project Promotion Helpers
 *
 * Promotion komponentlari uchun umumiy
 * yordamchi funksiyalar.
 *
 * Bu faylda API request yoki Redux state yo'q.
 */

/**
 * Backend yoki network xatoliklaridan
 * foydalanuvchiga ko'rsatiladigan xabarni oladi.
 */
export const getErrorMessage = (
  error,
  fallback = "Promotion bilan ishlashda xatolik yuz berdi."
) => {
  const data =
    error?.serverData ??
    error?.response?.data;

  if (
    typeof data === "string" &&
    data.trim()
  ) {
    return data;
  }

  if (
    typeof data?.detail === "string" &&
    data.detail.trim()
  ) {
    return data.detail;
  }

  if (
    Array.isArray(data?.detail) &&
    data.detail.length > 0
  ) {
    return String(data.detail[0]);
  }

  if (
    typeof data?.message === "string" &&
    data.message.trim()
  ) {
    return data.message;
  }

  if (
    typeof data?.error === "string" &&
    data.error.trim()
  ) {
    return data.error;
  }

  if (
    data &&
    typeof data === "object"
  ) {
    const firstValue = Object.values(data)[0];

    if (
      Array.isArray(firstValue) &&
      firstValue.length > 0
    ) {
      return String(firstValue[0]);
    }

    if (
      typeof firstValue === "string" &&
      firstValue.trim()
    ) {
      return firstValue;
    }
  }

  return error?.message || fallback;
};

/**
 * AbortController yoki Axios orqali
 * bekor qilingan requestlarni aniqlaydi.
 */
export const isCanceledRequest = (error) => {
  return (
    error?.code === "ERR_CANCELED" ||
    error?.name === "CanceledError" ||
    error?.name === "AbortError"
  );
};

/**
 * Promotion plan identifikatorini oladi.
 *
 * Mavjud frontend kontrakti:
 * plan.code ?? plan.id
 *
 * Plan kodlarini bu yerda yaratmaymiz.
 */
export const getPromotionPlanIdentifier = (plan) => {
  if (!plan || typeof plan !== "object") {
    return null;
  }

  return plan.code ?? plan.id ?? null;
};

/**
 * Ikkita plan identifikatorini
 * bir xil formatda taqqoslaydi.
 */
export const isSamePromotionPlan = (
  first,
  second
) => {
  if (
    first === null ||
    first === undefined ||
    second === null ||
    second === undefined
  ) {
    return false;
  }

  return String(first) === String(second);
};
