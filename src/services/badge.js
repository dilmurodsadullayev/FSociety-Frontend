import axios from './api'

const BadgeService = {
    async getUserBadges(username, { signal, ...params } = {}) {
        try {
            const { data } = await axios.get(`/users/${encodeURIComponent(username)}/badges/`, { signal, params });
            return data; // API dan kelayotgan { username, total_badges, badges: [] }
        } catch (error) {
            if (signal?.aborted || error.code === "ERR_CANCELED") throw error;
            console.error("Nishonlarni olishda xato:", error.response || error.message);
            throw error;
        }
    },
}

export default BadgeService;
