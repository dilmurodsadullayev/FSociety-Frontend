import React, { memo } from "react";
import useSeasonalGift from "../../hooks/events/useSeasonalGift";
import { supportsGift } from "../../utils/eventGift";
import GiftPanel from "./GiftPanel";

function SeasonalGiftCard({ event, eventSlug, ...props }) {
    const supported = supportsGift(event, "seasonal");
    const gift = useSeasonalGift(eventSlug ?? event?.slug, { enabled: supported, autoFetchHistory: true });
    if (!supported) return null;
    return <GiftPanel {...props} event={event} gift={gift} kind="seasonal" />;
}
export default memo(SeasonalGiftCard);
