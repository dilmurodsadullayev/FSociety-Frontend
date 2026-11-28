import useGift from "./useGift";
import { seasonalGift } from "../../features/events/seasonalGiftSlice";

export default function useSeasonalGift(slug, options) {
    return useGift(seasonalGift, slug, options);
}
