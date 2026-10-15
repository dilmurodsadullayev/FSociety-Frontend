
import {
    getErrorMessage,
} from "../projectDetail/projectDetailHelpers";

// =========================================================
// FSOCIETY — COLLABORATION CONFIG
//
// Responsibilities:
// - Collaboration roles
// - Role labels
// - Safe API lists
// - Redux action error detection
// - Duplicate collaborator filtering
//
// No React components.
// No Redux hooks.
// No API requests.
// =========================================================

// =========================================================
// COLLABORATION ROLES
//
// IMPORTANT:
// Backend ROLE_CHOICES values are preserved.
// =========================================================

export const COLLABORATION_ROLES = [
    {
        value: "backend",
        label: "Backend Developer",
    },
    {
        value: "api_developer",
        label: "API Developer",
    },
    {
        value: "database_admin",
        label: "Database Administrator",
    },
    {
        value: "devops",
        label: "DevOps Engineer",
    },
    {
        value: "frontend",
        label: "Frontend Developer",
    },
    {
        value: "react_dev",
        label: "React Developer",
    },
    {
        value: "vue_dev",
        label: "Vue Developer",
    },
    {
        value: "angular_dev",
        label: "Angular Developer",
    },
    {
        value: "fullstack",
        label: "Fullstack Developer",
    },
    {
        value: "uiux",
        label: "UI/UX Designer",
    },
    {
        value: "graphic_designer",
        label: "Graphic Designer",
    },
    {
        value: "android_dev",
        label: "Android Developer",
    },
    {
        value: "ios_dev",
        label: "iOS Developer",
    },
    {
        value: "flutter_dev",
        label: "Flutter Developer",
    },
    {
        value: "ml_engineer",
        label: "Machine Learning Engineer",
    },
    {
        value: "data_scientist",
        label: "Data Scientist",
    },
    {
        value: "ai_researcher",
        label: "AI Researcher",
    },
    {
        value: "cybersecurity",
        label: "Cybersecurity Specialist",
    },
    {
        value: "pentester",
        label: "Penetration Tester",
    },
    {
        value: "game_dev",
        label: "Game Developer",
    },
    {
        value: "software_architect",
        label: "Software Architect",
    },
    {
        value: "qa_tester",
        label: "QA Tester / Software Tester",
    },
    {
        value: "project_manager",
        label: "Project Manager",
    },
    {
        value: "mentor",
        label: "Mentor / Instructor",
    },
    {
        value: "researcher",
        label: "Researcher",
    },
    {
        value: "tech_writer",
        label: "Technical Writer",
    },
];

// =========================================================
// CONSTANTS
// =========================================================

export const EMPTY_COLLABORATION_LIST =
    Object.freeze([]);

// =========================================================
// GET ROLE LABEL
//
// Examples:
//
// "backend"     -> "Backend Developer"
// "react_dev"   -> "React Developer"
// Unknown role -> Original value
// =========================================================

export const getCollaborationRoleLabel = (value) => {
    if (typeof value !== "string") {
        return "Hamkor";
    }

    const roleValue = value.trim();

    if (!roleValue) {
        return "Hamkor";
    }

    const role = COLLABORATION_ROLES.find(
        (item) => item.value === roleValue
    );

    return role?.label || roleValue;
};

// =========================================================
// SAFE LIST
//
// Supports:
//
// 1. Array
// 2. Django REST Framework paginated results
// 3. Empty / invalid responses
// =========================================================

export const getSafeCollaborationList = (value) => {
    if (Array.isArray(value)) {
        return value;
    }

    if (Array.isArray(value?.results)) {
        return value.results;
    }

    return EMPTY_COLLABORATION_LIST;
};

// =========================================================
// REDUX ACTION RESULT VALIDATION
//
// Supports:
// - Promise rejection
// - Redux Toolkit rejected actions
// - Classic failure actions
// - Explicit unsuccessful results
//
// Note:
// Classic thunks should throw errors instead of
// silently swallowing failed API requests.
// =========================================================

export const assertCollaborationActionSucceeded = (
    result
) => {
    if (result instanceof Error) {
        throw result;
    }

    const requestRejected =
        result?.meta?.requestStatus === "rejected";

    const failureAction =
        typeof result?.type === "string" &&
        /(?:failure|failed|rejected)$/i.test(
            result.type
        );

    const explicitFailure =
        result === false ||
        result?.success === false ||
        result?.payload?.success === false;

    const hasActionError =
        Boolean(result?.error);

    if (
        !requestRejected &&
        !failureAction &&
        !explicitFailure &&
        !hasActionError
    ) {
        return result;
    }

    const errorSource =
        result?.payload?.error ||
        result?.payload ||
        result?.error ||
        result;

    throw new Error(
        getErrorMessage(
            errorSource,
            "Hamkorlik amalini bajarib bo‘lmadi."
        )
    );
};

// =========================================================
// GET DISPLAYED COLLABORATORS
//
// Features:
//
// - Only active collaborators
// - Excludes project owner
// - Removes duplicate users
// - Preserves original collaborator objects
//
// Important:
// Owner is displayed separately by the UI.
// =========================================================

export const getDisplayedCollaborators = (
    collaborators,
    projectOwner
) => {
    const source = getSafeCollaborationList(
        collaborators
    );

    const seen = new Set();

    const ownerId =
        projectOwner?.id != null
            ? String(projectOwner.id)
            : null;

    const ownerUsername =
        projectOwner?.username
            ? String(projectOwner.username)
                .trim()
                .toLowerCase()
            : null;

    return source.filter((collaborator) => {
        // ================================================
        // INVALID / INACTIVE COLLABORATOR
        // ================================================

        if (
            !collaborator ||
            collaborator.is_active === false
        ) {
            return false;
        }

        const member = collaborator.user;

        if (!member || typeof member !== "object") {
            return false;
        }

        // ================================================
        // MEMBER IDENTIFIERS
        // ================================================

        const memberId =
            member.id != null
                ? String(member.id)
                : null;

        const memberUsername =
            typeof member.username === "string"
                ? member.username
                    .trim()
                    .toLowerCase()
                : null;

        // ================================================
        // EXCLUDE PROJECT OWNER
        // ================================================

        if (
            ownerId &&
            memberId &&
            ownerId === memberId
        ) {
            return false;
        }

        if (
            ownerUsername &&
            memberUsername &&
            ownerUsername === memberUsername
        ) {
            return false;
        }

        // ================================================
        // DEDUPLICATION
        // ================================================

        const uniqueKey = memberId
            ? `id:${memberId}`
            : memberUsername
                ? `username:${memberUsername}`
                : collaborator.id != null
                    ? `collaboration:${collaborator.id}`
                    : null;

        if (!uniqueKey) {
            return false;
        }

        if (seen.has(uniqueKey)) {
            return false;
        }

        seen.add(uniqueKey);

        return true;
    });
};

// =========================================================
// GET TEAM MEMBER COUNT
//
// Project owner counts as one member.
// =========================================================

export const getTeamMemberCount = (
    collaborators,
    projectOwner
) => {
    const members = getDisplayedCollaborators(
        collaborators,
        projectOwner
    );

    return members.length + 1;
};
