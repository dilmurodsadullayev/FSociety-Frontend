
 // src/services/profileFrames.js
// FSociety — Profile Frames HTTP client.
// Reuses the application's shared Axios client (JWT/CSRF/refresh).

import api from "./api";

const BASE = "/profile-frames";

const requireFrameId = (value) => {
  const id =
    typeof value === "string" && /^\d+$/.test(value.trim())
      ? Number(value.trim())
      : value;

  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new TypeError("Ramka identifikatori noto'g'ri.");
  }

  return id;
};

const positiveInteger = (value, fallback) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  const number = Number(value);
  return Number.isSafeInteger(number) && number > 0
    ? number
    : fallback;
};

const listParams = ({
  page = 1,
  pageSize,
  rarity,
  search,
  ordering,
} = {}) => {
  const params = { page: positiveInteger(page, 1) };

  if (pageSize !== undefined && pageSize !== null) {
    params.page_size = Math.min(100, positiveInteger(pageSize, 12));
  }

  if (typeof rarity === "string" && rarity.trim()) {
    params.rarity = rarity.trim();
  }

  if (typeof search === "string" && search.trim()) {
    params.search = search.trim();
  }

  if (typeof ordering === "string" && ordering.trim()) {
    params.ordering = ordering.trim();
  }

  return params;
};

const ProfileFrameService = {
  // GET /api/profile-frames/shop/
  async getShopFrames(options = {}) {
    const { signal, ...filters } = options;
    const { data } = await api.get(`${BASE}/shop/`, {
      params: listParams(filters),
      signal,
    });
    return data;
  },

  // GET /api/profile-frames/shop/:frameId/
  async getFrameDetail(frameId, { signal } = {}) {
    const id = requireFrameId(frameId);
    const { data } = await api.get(`${BASE}/shop/${id}/`, { signal });
    return data;
  },

  // GET /api/profile-frames/my/
  async getMyFrames({ page = 1, pageSize, signal } = {}) {
    const { data } = await api.get(`${BASE}/my/`, {
      params: listParams({ page, pageSize }),
      signal,
    });
    return data;
  },

  // GET /api/profile-frames/stats/
  async getStats({ signal } = {}) {
    const { data } = await api.get(`${BASE}/stats/`, { signal });
    return data;
  },

  // POST /api/profile-frames/purchase/
  // Price and user identity must NEVER be sent from the frontend.
  async purchaseFrame(frameId) {
    const { data } = await api.post(`${BASE}/purchase/`, {
      frame_id: requireFrameId(frameId),
    });
    return data;
  },

  // POST /api/profile-frames/equip/
  async equipFrame(frameId) {
    const { data } = await api.post(`${BASE}/equip/`, {
      frame_id: requireFrameId(frameId),
    });
    return data;
  },

  // POST /api/profile-frames/unequip/
  async unequipFrame() {
    const { data } = await api.post(`${BASE}/unequip/`, {});
    return data;
  },
};

export default ProfileFrameService;
