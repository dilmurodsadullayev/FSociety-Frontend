
import React, { useState } from "react";

import { FolderKanban } from "lucide-react";

import {
    getProjectImageUrl,
} from "./spotlightUtils";

// =========================================================
// FALLBACK
// =========================================================

const ThumbnailFallback = () => (
    <span
        role="img"
        aria-label="Project rasmi mavjud emas"
        className="
            grid
            h-11
            w-11
            shrink-0
            place-items-center
            rounded-xl
            border
            border-indigo-400/20
            bg-indigo-500/[0.08]
            text-indigo-600
            dark:text-indigo-300/60
        "
    >
        <FolderKanban
            size={18}
            strokeWidth={2}
            aria-hidden="true"
        />
    </span>
);

// =========================================================
// PROJECT THUMBNAIL
// =========================================================

const ProjectThumbnail = ({ project }) => {
    const [failedSource, setFailedSource] =
        useState(null);

    const firstImage = Array.isArray(project?.images)
        ? project.images[0]
        : null;

    const imageUrl = getProjectImageUrl(
        firstImage?.image ||
        firstImage?.url ||
        firstImage ||
        project?.thumbnail ||
        project?.image
    );

    // A new image URL automatically gets another chance,
    // without needing to reset state inside an effect.
    if (!imageUrl || failedSource === imageUrl) {
        return <ThumbnailFallback />;
    }

    return (
        <img
            src={imageUrl}
            alt={project?.name || "Project"}
            loading="lazy"
            decoding="async"
            draggable={false}
            onError={() => setFailedSource(imageUrl)}
            className="
                h-11
                w-11
                shrink-0
                rounded-xl
                border
                border-[#dce4f0]
                bg-[#eaf0f8]
                object-cover
                dark:border-white/10
                dark:bg-[#090c11]
            "
        />
    );
};

export default React.memo(ProjectThumbnail);
