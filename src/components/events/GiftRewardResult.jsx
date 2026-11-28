import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Award, Coins, Frame, Gift, Trophy } from "lucide-react";
import { getGiftReward } from "../../utils/eventGift";
import PublicFramedAvatar from "../ui/PublicFramedAvatar";

const LABELS = { coin: "FCoin", badge: "Badge", achievement: "Achievement", frame: "Avatar ramkasi" };
const ICONS = { coin: Coins, badge: Award, achievement: Trophy, frame: Frame };

export default function GiftRewardResult({ claim, compact = false }) {
    const reward = getGiftReward(claim);
    const user = useSelector((s) => s.auth?.user);
    const [failedImage, setFailedImage] = useState(null);
    const Icon = ICONS[reward.type] ?? Gift;
    const image = reward.image !== failedImage ? reward.image : null;
    const showCoins = reward.type === "coin" || reward.compensation;
    return (
        <div className={`flex min-w-0 items-center gap-4 ${compact ? "" : "flex-col text-center"}`}>
            {!compact && (
                <div className="relative flex h-28 w-28 items-center justify-center rounded-3xl bg-violet-500/10">
                    {image && reward.type === "frame" && user ? (
                        <>
                            <PublicFramedAvatar avatarUrl={user.avatar_url ?? user.avatar ?? user.profile_image}
                                displayName={user.username} showFrame={false} className="h-16 w-16" plainClassName="rounded-full" />
                            <img src={image} alt={reward.name} onError={() => setFailedImage(image)} className="pointer-events-none absolute inset-0 h-full w-full object-contain" />
                        </>
                    ) : image ? <img src={image} alt={reward.name} onError={() => setFailedImage(image)} className="h-24 w-24 object-contain" />
                        : <Icon size={48} className="text-violet-600 dark:text-violet-300" />}
                </div>
            )}
            <div className="min-w-0">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    {reward.compensation ? "Takroriy mukofot kompensatsiyasi" : LABELS[reward.type] ?? "Mukofot"}
                    {reward.rarity && ` · ${reward.rarity}`}
                </p>
                <p className={`break-words font-extrabold ${compact ? "text-sm" : "mt-2 text-xl"}`}>{reward.name}</p>
                {showCoins && reward.coins !== null && (
                    <p className={`mt-1 font-black text-amber-600 dark:text-amber-300 ${compact ? "text-sm" : "text-3xl"}`}>
                        +{new Intl.NumberFormat("en-US").format(reward.coins)} FCoin
                    </p>
                )}
                {reward.compensation && !compact && <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Kolleksiyangizdagi mukofot o‘rniga FCoin berildi.</p>}
            </div>
        </div>
    );
}
