
import React, { useId } from "react";

import {
    AlertCircle,
    Loader2,
    RefreshCw,
    Users,
} from "lucide-react";

// =========================================================
// COMPONENTS
// =========================================================

import CollaborationModalFrame from "./CollaborationModalFrame";

import {
    CollaborationRequestCard,
    CollaborationCollaboratorRow,
} from "./CollaborationCards";

// =========================================================
// CONFIG
// =========================================================

import {
    getSafeCollaborationList,
} from "./collaborationConfig";

// =========================================================
// HELPERS
// =========================================================

import {
    getErrorMessage,
} from "../projectDetail/projectDetailHelpers";

// =========================================================
// FSOCIETY — MANAGE COLLABORATORS MODAL
//
// Responsibilities:
// - Pending collaboration requests
// - Active collaborators list
// - Accept / reject callbacks
// - Refresh callback
// - Loading / error / empty states
// - Accessible keyboard tabs
// - Dark / Light Mode
// - Responsive design
//
// No direct Redux or API calls.
//
// Existing props are preserved.
// =========================================================

const ManageCollaboratorsModal = ({
    isOpen = false,
    onClose,

    activeTab = "requests",
    onTabChange,

    requests = [],
    collaborators = [],

    requestsLoading = false,
    collaboratorsLoading = false,

    requestError = null,

    isActionLoading = false,
    managingRequestId = null,

    onAccept,
    onReject,
    onRefresh,

    // Optional future integration:
    // Requires a real backend remove endpoint.
    onRemoveCollaborator,
}) => {
    // =====================================================
    // IDS
    // =====================================================

    const generatedId = useId();

    const titleId = `${generatedId}-title`;
    const requestsTabId = `${generatedId}-requests-tab`;
    const collaboratorsTabId = `${generatedId}-collaborators-tab`;

    const requestsPanelId = `${generatedId}-requests-panel`;
    const collaboratorsPanelId = `${generatedId}-collaborators-panel`;

    // =====================================================
    // SAFE LISTS
    // =====================================================

    const safeRequests =
        getSafeCollaborationList(requests);

    const safeCollaborators =
        getSafeCollaborationList(collaborators);

    const activeCollaborators = safeCollaborators.filter(
        (item) => item && item.is_active !== false
    );

    // =====================================================
    // VIEW STATE
    // =====================================================

    const isBusy = Boolean(
        isActionLoading ||
        managingRequestId != null
    );

    const isRequestsTab =
        activeTab !== "collaborators";

    const errorMessage = requestError
        ? getErrorMessage(
            requestError,
            "Hamkorlik so‘rovlarini yuklab bo‘lmadi."
        )
        : "";

    // =====================================================
    // TAB CHANGE
    // =====================================================

    const handleTabChange = (tab) => {
        if (
            typeof onTabChange !== "function" ||
            isBusy
        ) {
            return;
        }

        if (
            tab !== "requests" &&
            tab !== "collaborators"
        ) {
            return;
        }

        onTabChange(tab);
    };

    // =====================================================
    // KEYBOARD TABS
    // =====================================================

    const handleTabKeyDown = (event) => {
        if (
            isBusy ||
            ![
                "ArrowLeft",
                "ArrowRight",
                "Home",
                "End",
            ].includes(event.key)
        ) {
            return;
        }

        event.preventDefault();

        const nextTab =
            event.key === "Home"
                ? "requests"
                : event.key === "End"
                    ? "collaborators"
                    : isRequestsTab
                        ? "collaborators"
                        : "requests";

        handleTabChange(nextTab);

        const targetId =
            nextTab === "requests"
                ? requestsTabId
                : collaboratorsTabId;

        const target =
            document.getElementById(targetId);

        target?.focus();
    };

    // =====================================================
    // REFRESH
    // =====================================================

    const canRefresh =
        !isBusy &&
        typeof onRefresh === "function";

    // =====================================================
    // JSX
    // =====================================================

    return (
        <CollaborationModalFrame
            isOpen={isOpen}
            title="Hamkorlarni boshqarish"
            subtitle="Kelgan so‘rovlar va loyiha jamoasini boshqaring."
            titleId={titleId}
            onClose={onClose}
            busy={isBusy}
            wide
        >
            <div className="w-full min-w-0">

                {/* ==================================
                    TAB NAVIGATION
                ================================== */}

                <div
                    role="tablist"
                    aria-label="Hamkorlik boshqaruvi"

                    onKeyDown={handleTabKeyDown}

                    className="
                        flex
                        min-w-0
                        flex-wrap
                        items-center
                        gap-2

                        border-b
                        border-[#e7ebf2]

                        pb-3

                        dark:border-white/[0.08]
                    "
                >
                    {/* REQUESTS TAB */}

                    <button
                        id={requestsTabId}
                        type="button"
                        role="tab"

                        aria-selected={isRequestsTab}
                        aria-controls={requestsPanelId}

                        tabIndex={isRequestsTab ? 0 : -1}

                        disabled={isBusy}

                        onClick={() =>
                            handleTabChange("requests")
                        }

                        className={`
                            inline-flex
                            min-h-10

                            items-center
                            justify-center
                            gap-2

                            rounded-xl
                            border

                            px-3
                            py-2.5

                            text-[11px]
                            font-bold

                            transition-colors

                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-indigo-500

                            disabled:cursor-not-allowed
                            disabled:opacity-50

                            ${
                                isRequestsTab
                                    ? `
                                        border-indigo-600
                                        bg-indigo-600
                                        text-white
                                    `
                                    : `
                                        border-[#dce5f0]
                                        bg-white
                                        text-slate-600

                                        hover:bg-indigo-500/[0.06]

                                        dark:border-white/[0.09]
                                        dark:bg-white/[0.035]
                                        dark:text-gray-400

                                        dark:hover:bg-white/[0.07]
                                    `
                            }
                        `}
                    >
                        So‘rovlar

                        <span
                            className="
                                rounded-md
                                bg-black/[0.07]
                                px-1.5
                                py-0.5

                                font-mono
                                text-[10px]

                                dark:bg-white/[0.08]
                            "
                        >
                            {requestsLoading
                                ? "..."
                                : safeRequests.length}
                        </span>
                    </button>

                    {/* COLLABORATORS TAB */}

                    <button
                        id={collaboratorsTabId}
                        type="button"
                        role="tab"

                        aria-selected={!isRequestsTab}
                        aria-controls={collaboratorsPanelId}

                        tabIndex={!isRequestsTab ? 0 : -1}

                        disabled={isBusy}

                        onClick={() =>
                            handleTabChange("collaborators")
                        }

                        className={`
                            inline-flex
                            min-h-10

                            items-center
                            justify-center
                            gap-2

                            rounded-xl
                            border

                            px-3
                            py-2.5

                            text-[11px]
                            font-bold

                            transition-colors

                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-indigo-500

                            disabled:cursor-not-allowed
                            disabled:opacity-50

                            ${
                                !isRequestsTab
                                    ? `
                                        border-indigo-600
                                        bg-indigo-600
                                        text-white
                                    `
                                    : `
                                        border-[#dce5f0]
                                        bg-white
                                        text-slate-600

                                        hover:bg-indigo-500/[0.06]

                                        dark:border-white/[0.09]
                                        dark:bg-white/[0.035]
                                        dark:text-gray-400

                                        dark:hover:bg-white/[0.07]
                                    `
                            }
                        `}
                    >
                        Hamkorlar

                        <span
                            className="
                                rounded-md
                                bg-black/[0.07]
                                px-1.5
                                py-0.5

                                font-mono
                                text-[10px]

                                dark:bg-white/[0.08]
                            "
                        >
                            {collaboratorsLoading
                                ? "..."
                                : activeCollaborators.length}
                        </span>
                    </button>

                    {/* REFRESH */}

                    <button
                        type="button"

                        onClick={() => {
                            if (canRefresh) {
                                onRefresh();
                            }
                        }}

                        disabled={!canRefresh}

                        aria-label="Hamkorlik ma’lumotlarini yangilash"
                        title="Yangilash"

                        className="
                            ml-auto

                            grid
                            h-10
                            w-10

                            place-items-center

                            rounded-xl
                            border
                            border-[#dce5f0]

                            bg-white

                            text-slate-600

                            transition-colors

                            hover:bg-indigo-500/[0.06]
                            hover:text-indigo-700

                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-indigo-500

                            disabled:cursor-not-allowed
                            disabled:opacity-50

                            dark:border-white/[0.09]
                            dark:bg-white/[0.035]
                            dark:text-gray-400

                            dark:hover:bg-white/[0.07]
                            dark:hover:text-indigo-300
                        "
                    >
                        <RefreshCw
                            size={16}
                            aria-hidden="true"
                        />
                    </button>
                </div>

                {/* ==================================
                    REQUESTS PANEL
                ================================== */}

                <div
                    id={requestsPanelId}
                    role="tabpanel"
                    aria-labelledby={requestsTabId}

                    hidden={!isRequestsTab}

                    aria-busy={Boolean(requestsLoading)}

                    className="mt-4 min-w-0"
                >
                    {requestsLoading ? (
                        <div
                            role="status"

                            className="
                                flex
                                items-center
                                justify-center
                                gap-2

                                py-10

                                text-[12px]
                                font-semibold

                                text-indigo-700

                                dark:text-indigo-300
                            "
                        >
                            <Loader2
                                size={17}
                                aria-hidden="true"

                                className="
                                    animate-spin
                                    motion-reduce:animate-none
                                "
                            />

                            So‘rovlar yuklanmoqda...
                        </div>
                    ) : errorMessage ? (
                        <div
                            role="alert"

                            className="
                                flex
                                items-start
                                gap-2.5

                                rounded-xl
                                border
                                border-red-200

                                bg-red-50

                                p-4

                                text-[12px]
                                leading-6

                                text-red-700

                                dark:border-red-400/20
                                dark:bg-red-500/[0.07]
                                dark:text-red-300
                            "
                        >
                            <AlertCircle
                                size={17}
                                aria-hidden="true"

                                className="mt-1 shrink-0"
                            />

                            <p
                                className="
                                    min-w-0
                                    break-words
                                    [overflow-wrap:anywhere]
                                "
                            >
                                {errorMessage}
                            </p>
                        </div>
                    ) : safeRequests.length === 0 ? (
                        <div
                            className="
                                rounded-2xl
                                border
                                border-dashed
                                border-[#dce5f0]

                                bg-[#f8faff]

                                px-4
                                py-10

                                text-center

                                dark:border-white/[0.08]
                                dark:bg-white/[0.025]
                            "
                        >
                            <Users
                                size={26}

                                className="
                                    mx-auto
                                    text-indigo-500

                                    dark:text-indigo-300
                                "
                            />

                            <p
                                className="
                                    mt-3

                                    text-[12px]
                                    font-semibold

                                    text-slate-600

                                    dark:text-gray-400
                                "
                            >
                                Hozircha yangi hamkorlik
                                so‘rovlari yo‘q.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {safeRequests.map((request, index) => (
                                <CollaborationRequestCard
                                    key={
                                        request?.id ??
                                        `request-${index}`
                                    }

                                    request={request}

                                    isBusy={isBusy}

                                    onAccept={onAccept}

                                    onReject={onReject}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* ==================================
                    COLLABORATORS PANEL
                ================================== */}

                <div
                    id={collaboratorsPanelId}
                    role="tabpanel"
                    aria-labelledby={collaboratorsTabId}

                    hidden={isRequestsTab}

                    aria-busy={Boolean(collaboratorsLoading)}

                    className="mt-4 min-w-0"
                >
                    {collaboratorsLoading ? (
                        <div
                            role="status"

                            className="
                                flex
                                items-center
                                justify-center
                                gap-2

                                py-10

                                text-[12px]
                                font-semibold

                                text-indigo-700

                                dark:text-indigo-300
                            "
                        >
                            <Loader2
                                size={17}
                                aria-hidden="true"

                                className="
                                    animate-spin
                                    motion-reduce:animate-none
                                "
                            />

                            Hamkorlar yuklanmoqda...
                        </div>
                    ) : activeCollaborators.length === 0 ? (
                        <div
                            className="
                                rounded-2xl
                                border
                                border-dashed
                                border-[#dce5f0]

                                bg-[#f8faff]

                                px-4
                                py-10

                                text-center

                                dark:border-white/[0.08]
                                dark:bg-white/[0.025]
                            "
                        >
                            <Users
                                size={26}

                                className="
                                    mx-auto
                                    text-indigo-500

                                    dark:text-indigo-300
                                "
                            />

                            <p
                                className="
                                    mt-3

                                    text-[12px]
                                    font-semibold

                                    text-slate-600

                                    dark:text-gray-400
                                "
                            >
                                Hozircha loyiha hamkorlari yo‘q.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {activeCollaborators.map(
                                (collaborator, index) => (
                                    <CollaborationCollaboratorRow
                                        key={
                                            collaborator?.id ??
                                            `collaborator-${index}`
                                        }

                                        collaborator={collaborator}

                                        onRemove={
                                            onRemoveCollaborator
                                        }

                                        isBusy={isBusy}
                                    />
                                )
                            )}
                        </div>
                    )}
                </div>

                {/* ==================================
                    FOOTER
                ================================== */}

                <div
                    className="
                        mt-5

                        flex
                        justify-end

                        border-t
                        border-[#e7ebf2]

                        pt-4

                        dark:border-white/[0.08]
                    "
                >
                    <button
                        type="button"

                        onClick={onClose}

                        disabled={
                            isBusy ||
                            typeof onClose !== "function"
                        }

                        className="
                            inline-flex
                            min-h-10
                            items-center
                            justify-center

                            rounded-xl
                            border
                            border-[#dce5f0]

                            bg-white

                            px-4
                            py-2.5

                            text-[12px]
                            font-bold

                            text-slate-700

                            transition-colors

                            hover:bg-slate-50
                            hover:text-indigo-700

                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-indigo-500

                            disabled:cursor-not-allowed
                            disabled:opacity-50

                            dark:border-white/[0.10]
                            dark:bg-white/[0.04]
                            dark:text-gray-300

                            dark:hover:bg-white/[0.07]
                        "
                    >
                        Yopish
                    </button>
                </div>
            </div>
        </CollaborationModalFrame>
    );
};

export default React.memo(ManageCollaboratorsModal);
