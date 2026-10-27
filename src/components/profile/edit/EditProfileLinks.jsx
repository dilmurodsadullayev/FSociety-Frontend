
import React, { memo } from "react";

import {
    ExternalLink,
    Github,
    Globe2,
    Link2,
    ShieldCheck,
} from "lucide-react";

import EditProfileField from "./EditProfileField";
import EditProfileSection from "./EditProfileSection";

// ============================================================
// PROFILE LINKS
// ============================================================

const EditProfileLinks = memo(function EditProfileLinks({
    formData = {},
    onChange,
    onBlur,
    loading = false,
    fieldErrors = {},
}) {
    // ========================================================
    // FIELD VALUES
    // ========================================================

    const websiteUrl =
        formData.website_url ?? "";

    const githubUrl =
        formData.github_url ?? "";

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <EditProfileSection
            Icon={Link2}
            code="DEVELOPER / CONNECTIONS"
            title="Havolalar"
            description={
                "Portfolio va GitHub profilingiz orqali " +
                "boshqa dasturchilarga o‘zingizni taniting."
            }
            columns={2}
        >
            {/* ==============================================
                WEBSITE
            =============================================== */}

            <EditProfileField
                name="website_url"
                label="Shaxsiy veb-sayt"
                Icon={Globe2}
                type="text"
                value={websiteUrl}
                onChange={onChange}
                onBlur={onBlur}
                disabled={loading}
                error={fieldErrors.website_url}
                placeholder="https://example.com"
                inputMode="url"
                autoComplete="url"
                hint={
                    "Portfolio yoki shaxsiy veb-saytingiz " +
                    "manzilini kiriting."
                }
            />

            {/* ==============================================
                GITHUB
            =============================================== */}

            <EditProfileField
                name="github_url"
                label="GitHub"
                Icon={Github}
                type="text"
                value={githubUrl}
                onChange={onChange}
                onBlur={onBlur}
                disabled={loading}
                error={fieldErrors.github_url}
                placeholder="github.com/username"
                inputMode="url"
                autoComplete="off"
                hint={
                    "GitHub username yoki profilingizning " +
                    "to‘liq havolasini kiriting."
                }
            />

            {/* ==============================================
                SECURITY / INFO NOTE
            =============================================== */}

            <div
                className="
                    flex min-w-0 items-start gap-3
                    rounded-2xl
                    border border-indigo-200/80
                    bg-indigo-50/70
                    p-3.5 sm:p-4

                    md:col-span-2

                    dark:border-indigo-400/15
                    dark:bg-indigo-500/[0.045]
                "
            >
                <div
                    aria-hidden="true"
                    className="
                        flex h-9 w-9 shrink-0
                        items-center justify-center
                        rounded-xl
                        border border-indigo-200
                        bg-white
                        text-indigo-600

                        dark:border-indigo-400/15
                        dark:bg-indigo-400/[0.08]
                        dark:text-indigo-300
                    "
                >
                    <ShieldCheck size={17} />
                </div>

                <div className="min-w-0 flex-1">
                    <div
                        className="
                            flex flex-wrap
                            items-center gap-2
                        "
                    >
                        <h4
                            className="
                                text-xs font-bold
                                text-slate-900

                                dark:text-slate-100
                            "
                        >
                            Ochiq profil havolalari
                        </h4>

                        <ExternalLink
                            size={13}
                            aria-hidden="true"
                            className="
                                text-indigo-500
                                dark:text-indigo-300
                            "
                        />
                    </div>

                    <p
                        className="
                            mt-1 text-xs
                            leading-5
                            text-slate-600

                            dark:text-slate-400
                        "
                    >
                        Ushbu havolalar profilingizga
                        tashrif buyurgan boshqa
                        foydalanuvchilarga ko‘rinishi mumkin.
                        Faqat o‘zingizga tegishli
                        havolalarni kiriting.
                    </p>
                </div>
            </div>
        </EditProfileSection>
    );
});

export default EditProfileLinks;
