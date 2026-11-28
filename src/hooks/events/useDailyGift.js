import useGift from "./useGift";
import { dailyGift } from "../../features/events/dailyGiftSlice";

export default function useDailyGift(slug, options) {
    return useGift(dailyGift, slug, options);
}
