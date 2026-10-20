
import React from "react";

import {
  ShieldCheck,
} from "lucide-react";

/**
 * FSociety — Project Promotion Empty Active
 *
 * Responsibilities:
 * - Show when no active campaign exists
 * - Explain how to start a promotion
 * - Light / Dark Mode
 * - Responsive layout
 * - Accessible empty state
 *
 * This component is presentational.
 *
 * The parent determines whether
 * an active campaign exists.
 */

const ProjectPromotionEmptyActive = ({
  title = "Aktiv promotion yo'q",

  description =
    "Pastdagi rejalardan birini tanlab reklama kampaniyasini boshlashingiz mumkin.",

  className = "",
}) => {
  return (
    <div
      role="status"
      className={`
        flex
        w-full
        min-w-0
        items-start
        gap-3
        rounded-2xl
        border
        border-dashed
        border-slate-300
        bg-slate-50/80
        p-4

        dark:border-white/[0.09]
        dark:bg-white/[0.02]

        ${className}
      `}
    >
      {/* ICON */}

      <div
        className="
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-xl
          border
          border-slate-200
          bg-white
          text-slate-500

          dark:border-white/[0.07]
          dark:bg-white/[0.035]
          dark:text-slate-400
        "
      >
        <ShieldCheck
          size={19}
          strokeWidth={1.8}
          aria-hidden="true"
        />
      </div>

      {/* CONTENT */}

      <div className="min-w-0 flex-1">
        <div
          className="
            flex
            min-w-0
            flex-wrap
            items-center
            gap-2
          "
        >
          <h3
            className="
              min-w-0
              break-words
              text-xs
              font-black
              leading-5
              text-slate-800

              dark:text-slate-200
            "
          >
            {title}
          </h3>

          {/* STATUS BADGE */}

          <span
            className="
              inline-flex
              shrink-0
              items-center
              gap-1.5
              rounded-full
              border
              border-slate-200
              bg-white
              px-2
              py-0.5
              text-[9px]
              font-bold
              text-slate-500

              dark:border-white/[0.07]
              dark:bg-white/[0.035]
              dark:text-slate-400
            "
          >
            <span
              aria-hidden="true"
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-slate-400

                dark:bg-slate-500
              "
            />

            Inactive
          </span>
        </div>

        <p
          className="
            mt-1.5
            max-w-lg
            whitespace-pre-wrap
            break-words
            [overflow-wrap:anywhere]
            text-[11px]
            font-medium
            leading-[1.7]
            text-slate-600

            dark:text-slate-400
          "
        >
          {description}
        </p>
      </div>
    </div>
  );
};

export default React.memo(ProjectPromotionEmptyActive);
