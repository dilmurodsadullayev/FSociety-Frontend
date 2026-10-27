
import React, { memo } from "react";

import {
    BriefcaseBusiness,
    Building2,
    Code2,
    Layers3,
    Terminal,
} from "lucide-react";

import EditProfileField from "./EditProfileField";
import EditProfileSection from "./EditProfileSection";

// ============================================================
// SKILL LEVEL OPTIONS
// ============================================================

export const SKILL_LEVELS = [
    {
        value: "beginner",
        label: "Boshlang‘ich",
    },
    {
        value: "junior",
        label: "Junior (Kichik mutaxassis)",
    },
    {
        value: "intermediate",
        label: "O‘rta (Intermediate)",
    },
    {
        value: "advanced",
        label: "Kengaytirilgan (Advanced)",
    },
    {
        value: "senior",
        label: "Senior (Katta mutaxassis)",
    },
    {
        value: "lead",
        label: "Lead / Tech Lead (Yetakchi)",
    },
    {
        value: "expert",
        label: "Expert / Architect (Ekspert)",
    },
];

// ============================================================
// PROFESSIONAL INFORMATION
// ============================================================

const EditProfileProfessional = memo(
    function EditProfileProfessional({
        formData = {},
        onChange,
        onBlur,
        loading = false,
        fieldErrors = {},
    }) {
        // ====================================================
        // FIELD VALUES
        // ====================================================

        const skillLevel =
            formData.skill_level ?? "beginner";

        const company =
            formData.company ?? "";

        const position =
            formData.position ?? "";

        const skills =
            formData.skills ?? "";

        // ====================================================
        // RENDER
        // ====================================================

        return (
            <EditProfileSection
                Icon={Code2}
                code="DEVELOPER / EXPERIENCE"
                title="Kasbiy ma’lumotlar"
                description={
                    "Tajriba darajangiz, ish faoliyatingiz " +
                    "va texnik ko‘nikmalaringizni yangilang."
                }
                columns={2}
            >
                {/* ==========================================
                    SKILL LEVEL
                =========================================== */}

                <EditProfileField
                    name="skill_level"
                    label="Tajriba darajasi"
                    Icon={Layers3}
                    control="select"
                    value={skillLevel}
                    onChange={onChange}
                    onBlur={onBlur}
                    disabled={loading}
                    error={fieldErrors.skill_level}
                    options={SKILL_LEVELS}
                    optional={false}
                    required
                    hint={
                        "Hozirgi bilim va tajribangizga " +
                        "eng mos darajani tanlang."
                    }
                />

                {/* ==========================================
                    COMPANY
                =========================================== */}

                <EditProfileField
                    name="company"
                    label="Kompaniya"
                    Icon={Building2}
                    type="text"
                    value={company}
                    onChange={onChange}
                    onBlur={onBlur}
                    disabled={loading}
                    error={fieldErrors.company}
                    placeholder="Masalan: Google, Meta, FSociety"
                    autoComplete="organization"
                    hint={
                        "Ishlayotgan kompaniyangiz yoki " +
                        "tashkilotingiz nomi."
                    }
                />

                {/* ==========================================
                    POSITION
                =========================================== */}

                <EditProfileField
                    name="position"
                    label="Lavozim"
                    Icon={BriefcaseBusiness}
                    type="text"
                    value={position}
                    onChange={onChange}
                    onBlur={onBlur}
                    disabled={loading}
                    error={fieldErrors.position}
                    placeholder="Backend Developer"
                    autoComplete="organization-title"
                    hint={
                        "Masalan: Python Developer, " +
                        "Frontend Developer, Software Engineer."
                    }
                />

                {/* ==========================================
                    SKILLS
                =========================================== */}

                <EditProfileField
                    name="skills"
                    label="Texnik ko‘nikmalar"
                    Icon={Terminal}
                    type="text"
                    value={skills}
                    onChange={onChange}
                    onBlur={onBlur}
                    disabled={loading}
                    error={fieldErrors.skills}
                    placeholder="Python, Django, React, Docker"
                    autoComplete="off"
                    hint={
                        "Ko‘nikmalarni vergul bilan ajrating. " +
                        "Masalan: Python, PostgreSQL, Docker."
                    }
                />
            </EditProfileSection>
        );
    }
);

export default EditProfileProfessional;
