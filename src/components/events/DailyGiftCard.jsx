import React, { memo } from "react";
import useDailyGift from "../../hooks/events/useDailyGift";
import { supportsGift } from "../../utils/eventGift";
import GiftPanel from "./GiftPanel";

function DailyGiftCard({ event, eventSlug, ...props }) {
    const supported = supportsGift(event, "daily");
    const gift = useDailyGift(eventSlug ?? event?.slug, { enabled: supported, autoFetchHistory: true });
    if (!supported) return null;
    return <GiftPanel {...props} event={event} gift={gift} kind="daily" />;
}
export default memo(DailyGiftCard);
