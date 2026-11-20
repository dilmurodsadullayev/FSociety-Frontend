import React, { memo, useState } from "react";
import { Award } from "lucide-react";
import { getBadgeImage } from "../badges/badgeHelpers";
import { badgeImagePresentation, getAchievementStyle, showcaseSizes } from "./achievementStyles";

export function AchievementImage({ badge, className = showcaseSizes.card.image, rarity, variant = "card" }) {
    const src = getBadgeImage(badge?.image);
    const [failedSrc, setFailedSrc] = useState(null);
    const tone = getAchievementStyle(rarity);
    const presentation = badgeImagePresentation[src?.split("?")[0].split("/").pop()];
    const scale = variant === "recent" ? presentation?.recentScale : presentation?.scale;
    const offsetY = variant === "recent" ? presentation?.recentOffsetY : presentation?.offsetY;

    if (src && failedSrc !== src) {
        return (
            <span className={`${className} relative z-10 block ${presentation ? "overflow-hidden" : ""}`}>
                <span className="absolute inset-0" style={presentation ? { transform: `scale(${scale}) translateY(${offsetY})` } : undefined}>
                    <img
                        src={src}
                        alt={badge.name}
                        loading="lazy"
                        decoding="async"
                        onError={() => setFailedSrc(src)}
                        className="h-full w-full object-contain transition-transform duration-300 motion-safe:group-hover:scale-105 motion-reduce:transition-none"
                    />
                </span>
            </span>
        );
    }

    return (
        <span
            role="img"
            aria-label={`${badge?.name || "Yutuq"} belgisi`}
            className={`${className} relative z-10 flex items-center justify-center overflow-hidden rounded-2xl border bg-gradient-to-br from-white to-slate-100 dark:from-slate-800 dark:to-slate-950 ${tone.border} ${tone.color}`}
        >
            <span aria-hidden="true" className={`absolute inset-[15%] rounded-full opacity-50 blur-xl ${tone.spotlight}`} />
            <span aria-hidden="true" className="absolute inset-[20%] rotate-12 rounded-[25%] border border-current opacity-15" />
            <Award aria-hidden="true" className="relative h-[64%] w-[64%]" strokeWidth={1.25} />
        </span>
    );
}

const corners = ["left-3 top-3 border-l border-t", "right-3 top-3 border-r border-t", "bottom-3 left-3 border-b border-l", "bottom-3 right-3 border-b border-r"];

function AchievementShowcase({ badge, rarity, variant = "card" }) {
    const size = showcaseSizes[variant];
    const tone = getAchievementStyle(rarity);
    return (
        <div className={`${size.frame} relative isolate flex w-full items-center justify-center overflow-hidden bg-slate-50 px-4 dark:bg-[#080e17]`}>
            <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 text-slate-700 opacity-[0.04] dark:text-slate-200 dark:opacity-[0.05]"
                style={{
                    backgroundImage: "linear-gradient(to right,currentColor 1px,transparent 1px),linear-gradient(to bottom,currentColor 1px,transparent 1px)",
                    backgroundSize: "28px 28px",
                }}
            />
            <span aria-hidden="true" className={`pointer-events-none absolute h-3/4 w-3/4 max-w-64 rounded-full opacity-65 blur-2xl transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none ${tone.spotlight}`} />
            {corners.map(corner => <span key={corner} aria-hidden="true" className={`pointer-events-none absolute h-3 w-3 opacity-70 ${corner} ${tone.border}`} />)}
            <AchievementImage badge={badge} rarity={rarity} variant={variant} className={size.image} />
            <span aria-hidden="true" className={`pointer-events-none absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent to-transparent ${tone.highlight}`} />
        </div>
    );
}

export default memo(AchievementShowcase);
