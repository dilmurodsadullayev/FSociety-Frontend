
import React from "react";

// =========================================================
// FSOCIETY — SHARED BACKGROUND
//
// Global Winter Background is managed in App.jsx.
//
// This page uses the global background only.
// No additional PageGridBackground or WinterBackground
// instance is created locally.
//
// The page surface remains transparent so the global
// Light / Dark Winter Background stays visible.
// =========================================================


// =========================================================
// USERS PAGE COMPONENTS
// =========================================================

import UsersHeader from "./users/UsersHeader";
import UsersToolbar from "./users/UsersToolbar";
import UsersPagination from "./users/UsersPagination";

import {
    UsersEmptyState,
    UsersErrorState,
} from "./users/UsersStates";

import UserCard from "./users/users-card/UserCard";


// =========================================================
// USERS HOOK AND HELPERS
// =========================================================

import useUsersDirectory from "./users/useUsersDirectory";

import {
    USERS_PER_PAGE,
} from "./users/usersHelpers";


// =========================================================
// FSOCIETY — USERS DIRECTORY
//
// Existing functionality preserved:
//
// - Django REST API / Redux
// - Search with debounce
// - Reyting / Yangi / Faol
// - User cards
// - Rating and compact FCoin
// - Profile navigation
// - Pagination
// - Loading skeletons
// - API error and retry
// - Empty state
//
// Background:
// - Global Winter Background managed in App.jsx
// - No local background instance
// - Transparent page surface
// - Light / Dark Mode
// =========================================================


const Users = () => {

    // =====================================================
    // DIRECTORY CONTROLLER
    // =====================================================

    const {
        searchTerm,
        filter,
        currentPage,
        totalPages,

        users,
        totalUsersCount,
        next,
        previous,
        isLoading,
        error,

        handleSearchChange,
        handleFilterChange,

        goToPage,
        previousPage,
        nextPage,
        retry,
    } = useUsersDirectory();


    // =====================================================
    // SAFE DATA
    // =====================================================

    const safeUsers = Array.isArray(users)
        ? users
        : [];


    // =====================================================
    // VIEW STATE
    // =====================================================

    const hasUsers =
        safeUsers.length > 0;

    const hasSearch =
        Boolean(searchTerm.trim());

    const showLoading =
        Boolean(isLoading);

    const showError =
        !isLoading &&
        Boolean(error);

    const showEmpty =
        !isLoading &&
        !error &&
        !hasUsers;

    const showUsers =
        !isLoading &&
        !error &&
        hasUsers;

    const showPagination =
        showUsers &&
        Number(totalPages) > 1;


    // =====================================================
    // JSX
    // =====================================================

    return (
        <main
            id="users-directory"

            className="
                relative
                isolate
                z-10

                min-h-screen

                w-full
                min-w-0

                overflow-x-clip

                bg-transparent
                text-slate-900

                px-3
                py-9

                sm:px-5
                sm:py-12

                lg:px-8
                lg:py-14

                dark:bg-transparent
                dark:text-white
            "

            style={{
                background: "transparent",
                backgroundColor: "transparent",
                backgroundImage: "none",
            }}
        >

            {/* ======================================
                GLOBAL WINTER BACKGROUND

                Winter Background is rendered globally
                inside App.jsx.

                This page must not create another
                WinterBackground instance.

                No opaque background color or gradient
                should cover the global winter image.

                Light / Dark image switching is handled
                by the global ThemeProvider and
                WinterBackground component.
            ====================================== */}


            {/* ======================================
                PAGE CONTENT

                Relative z-10 keeps cards,
                links and buttons above the
                global Winter Background.

                All page content stays above
                the global background layer.
            ====================================== */}

            <div
                className="
                    relative
                    z-10

                    mx-auto

                    w-full
                    min-w-0
                    max-w-[1440px]
                "
            >

                {/* ==================================
                    COMMUNITY HEADER
                ================================== */}

                <UsersHeader
                    totalUsersCount={totalUsersCount}
                    isLoading={isLoading}
                />


                {/* ==================================
                    SEARCH AND FILTERS
                ================================== */}

                <UsersToolbar
                    searchTerm={searchTerm}

                    filter={filter}

                    currentPage={currentPage}

                    totalPages={totalPages}

                    visibleCount={safeUsers.length}

                    totalUsersCount={totalUsersCount}

                    isLoading={isLoading}

                    onSearchChange={handleSearchChange}

                    onFilterChange={handleFilterChange}
                />


                {/* ==================================
                    USERS LIST
                ================================== */}

                <section
                    aria-label="Hamjamiyat foydalanuvchilari"

                    aria-busy={isLoading}

                    className="
                        relative
                        z-10

                        min-w-0
                    "
                >

                    {/* ==========================
                        LOADING SKELETON
                    ========================== */}

                    {showLoading && (
                        <div
                            className="
                                grid
                                grid-cols-1

                                items-stretch

                                gap-5

                                sm:grid-cols-2

                                lg:grid-cols-3

                                xl:grid-cols-4
                                xl:gap-6
                            "
                        >
                            {Array.from({
                                length: USERS_PER_PAGE,
                            }).map((_, index) => (
                                <UserCard
                                    key={`user-skeleton-${index}`}

                                    isLoading

                                    index={index}
                                />
                            ))}
                        </div>
                    )}


                    {/* ==========================
                        API ERROR / RETRY
                    ========================== */}

                    {showError && (
                        <UsersErrorState
                            error={error}
                            onRetry={retry}
                        />
                    )}


                    {/* ==========================
                        EMPTY STATE
                    ========================== */}

                    {showEmpty && (
                        <UsersEmptyState
                            hasSearch={hasSearch}

                            onClear={() =>
                                handleSearchChange("")
                            }
                        />
                    )}


                    {/* ==========================
                        USER CARDS
                    ========================== */}

                    {showUsers && (
                        <div
                            className="
                                grid
                                grid-cols-1

                                items-stretch

                                gap-5

                                sm:grid-cols-2

                                lg:grid-cols-3

                                xl:grid-cols-4
                                xl:gap-6
                            "
                        >
                            {safeUsers.map(
                                (profileUser, index) => (
                                    <UserCard
                                        key={
                                            profileUser?.id ??
                                            profileUser?.username ??
                                            `user-${index}`
                                        }

                                        user={profileUser}

                                        isLoading={false}

                                        index={
                                            (
                                                (currentPage - 1) *
                                                USERS_PER_PAGE
                                            ) + index
                                        }
                                    />
                                )
                            )}
                        </div>
                    )}

                </section>


                {/* ==================================
                    PAGINATION
                ================================== */}

                {showPagination && (
                    <div
                        className="
                            relative
                            z-20

                            mt-8

                            w-full
                            min-w-0

                            sm:mt-10
                        "
                    >
                        <UsersPagination
                            currentPage={currentPage}

                            totalPages={totalPages}

                            hasPrevious={Boolean(previous)}

                            hasNext={Boolean(next)}

                            onPageChange={goToPage}

                            onPrevious={previousPage}

                            onNext={nextPage}
                        />
                    </div>
                )}

            </div>

        </main>
    );
};


// =========================================================
// EXPORT
// =========================================================

export default Users;
