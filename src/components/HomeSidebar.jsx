
import React, {
    useCallback,
    useEffect,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

// =========================================================
// SERVICES
// =========================================================

import UserService from "../services/user";

// =========================================================
// REDUX ACTIONS
// =========================================================

import {
    getBirthdayUsersFailure,
    getBirthdayUsersStart,
    getBirthdayUsersSuccess,
} from "../features/users";

// =========================================================
// COMPONENTS
// =========================================================

import WelcomeCard from "./home/sidebar/WelcomeCard";

import BirthdayUsersCard from "./home/sidebar/BirthdayUsersCard";

import HomePromotionSpotlight from "./promotions/HomePromotionSpotlight";

// =========================================================
// FSOCIETY — HOME SIDEBAR
//
// Responsibilities:
// - Fetch monthly birthday users
// - Read Redux state
// - Handle API errors
// - Pass data to child components
//
// Dark / Light Mode:
// Managed through Tailwind dark: classes.
// =========================================================

const HomeSidebar = ({
    isLoggedIn,
    user,
}) => {

    // =====================================================
    // REDUX
    // =====================================================

    const dispatch = useDispatch();

    const {
        birthdayUsersLoading = false,
        birthdayUsers = [],
        birthdayUsersError = null,
        birthdayUsersCount = 0,
    } = useSelector(
        (state) => state.user || {}
    );

    // =====================================================
    // FETCH BIRTHDAY USERS
    // =====================================================

    const fetchBirthdayUsers = useCallback(
        async () => {

            dispatch(
                getBirthdayUsersStart()
            );

            try {

                const response =
                    await UserService.getMonthlyBirthdayUsers({
                        limit: 5,
                        excludeMe: true,
                        upcomingOnly: false,
                    });

                dispatch(
                    getBirthdayUsersSuccess(response)
                );

            } catch (error) {

                const detail =
                    error?.response?.data?.detail;

                const errorMessage =
                    typeof detail === "string"
                        ? detail
                        : error?.message ||
                          "Tug‘ilgan kunlarni yuklashda xatolik yuz berdi.";

                dispatch(
                    getBirthdayUsersFailure(
                        errorMessage
                    )
                );
            }

        },
        [dispatch]
    );

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {
        fetchBirthdayUsers();
    }, [fetchBirthdayUsers]);

    // =====================================================
    // JSX
    // =====================================================

    return (
        <aside
            aria-label="Bosh sahifa yon paneli"

            className="
                w-full
                min-w-0

                lg:sticky
                lg:top-24
                lg:h-fit
            "
        >

            <div className="space-y-5">

                {/* ======================================
                    WELCOME CARD
                ====================================== */}

                <WelcomeCard
                    isLoggedIn={isLoggedIn}
                    user={user}
                />

                {/* ======================================
                    PROMOTION SPOTLIGHT

                    Existing component remains unchanged.
                ====================================== */}

                <HomePromotionSpotlight />

                {/* ======================================
                    BIRTHDAY USERS
                ====================================== */}

                <BirthdayUsersCard

                    users={birthdayUsers}

                    count={birthdayUsersCount}

                    loading={birthdayUsersLoading}

                    error={birthdayUsersError}

                    onRetry={fetchBirthdayUsers}

                />

            </div>

        </aside>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default HomeSidebar;
