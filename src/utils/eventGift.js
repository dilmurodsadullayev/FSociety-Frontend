// Gift type comes exclusively from the backend contract, never event artwork.
export const getEventGiftMode = (event) =>
    ["daily", "seasonal", "both"].includes(event?.gift_mode)
        ? event.gift_mode
        : null;

export const supportsGift = (event, kind) =>
    [kind, "both"].includes(getEventGiftMode(event));

export const safeEventImage = (value) => {
    if (typeof value !== "string") return null;
    const url = value.trim();
    if (url.includes("\\") || [...url].some((char) => char.charCodeAt(0) < 32)) return null;
    return /^(https?:\/\/|\/(?!\/))/i.test(url) ? url : null;
};

const text = (value) => typeof value === "string" && value.trim() ? value : null;

export const getGiftReward = (claim) => {
    const reward = claim?.reward ?? {};
    const coins = reward.awarded_coins;
    return {
        type: reward.awarded_reward_type,
        name: text(reward.item?.name) ?? text(reward.reward_name) ?? "Mukofot",
        rarity: typeof reward.rarity === "string" ? reward.rarity : null,
        coins: Number.isSafeInteger(coins) && coins >= 0 ? coins : null,
        compensation: reward.is_compensation === true,
        image: reward.is_compensation ? null : safeEventImage(reward.item?.image_url),
        // Current backend item schema exposes id/name/image_url only.
        // Do not infer achievement descriptions or secret metadata.
    };
};
