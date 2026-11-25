
 // src/features/badge.test.js

import { configureStore } from "@reduxjs/toolkit";

import reducer, {
    fetchProfileAchievements,
    cancelAchievementRequest,
    normalizeAchievementResponse,
} from "./badge";

import BadgeService from "../services/badge";

import {
    claimSeasonalGiftForEvent,
} from "./events/seasonalGiftSlice";

import {
    logoutUser,
    checkAuthSuccess,
} from "./auth/Auth";

// =========================================================
// FSOCIETY — BADGE & ACHIEVEMENT TESTS
// =========================================================
//
// Coverage:
//
// - Legacy response normalization
// - Pagination
// - Search
// - Invalid API responses
// - Stale request protection
// - Request cancellation
// - Event Gift reward invalidation
// - Account ownership isolation
// - Logout cleanup
//
// IMPORTANT:
//
// Daily Gift has been removed.
//
// Seasonal Gift:
// One claim per user per holiday event.
//
// =========================================================


// =========================================================
// MOCKS
// =========================================================

jest.mock("../services/badge", () => ({
    __esModule: true,
    default: {
        getUserBadges: jest.fn(),
    },
}));


// =========================================================
// TEST DATA
// =========================================================

const args = {
    username: "alice",
    page: 1,
    search: "",
    filter: "",
};

const OWNER_ID = "1";

const NEW_YEAR_SLUG = "new-year-2027";
const NAVROZ_SLUG = "navroz-2027";
const RAMADAN_SLUG = "ramadan-2027";

const reward = {
    id: 1,
    badge: {
        name: "First award",
        code: "first-award",
    },
    awarded_at: "2026-11-20T10:00:00Z",
};

const payload = {
    results: [reward],
    recent_badges: [reward],
    count: 1,
    total_badges: 1,
};

// =========================================================
// HELPERS
// =========================================================

const createStore = () =>
    configureStore({
        reducer: {
            badge: reducer,
        },
    });

const createSeasonalClaimAction = ({
    slug = NEW_YEAR_SLUG,
    ownerId = OWNER_ID,
    reward: giftReward = {
        type: "achievement",
    },
    requestId = "seasonal-claim",
} = {}) =>
    claimSeasonalGiftForEvent.fulfilled(
        {
            slug,
            ownerId,
            claim: {
                reward: giftReward,
            },
            claimedAt: Date.now(),
        },
        requestId,
        slug
    );

beforeEach(() => {
    BadgeService.getUserBadges.mockReset();
});


// =========================================================
// LEGACY RESPONSE NORMALIZATION
// =========================================================

test(
    "legacy response is normalized without inventing ownership IDs or metadata",
    () => {
        const badges = Array.from(
            { length: 15 },
            (_, index) => ({
                badge: {
                    name: `Badge ${index}`,
                    code: `badge-${index}`,
                    description: `Milestone ${index}`,
                },
                awarded_at: new Date(
                    Date.UTC(
                        2026,
                        10,
                        index + 1
                    )
                ).toISOString(),
            })
        );

        const data = {
            badges,
            total_badges: 15,
        };

        const first =
            normalizeAchievementResponse(
                data
            );

        const second =
            normalizeAchievementResponse(
                data,
                { page: 2 }
            );

        expect(first.results).toHaveLength(12);

        expect(second.results).toHaveLength(3);

        expect(
            second.recent_badges.map(
                (item) => item.badge.code
            )
        ).toEqual([
            "badge-14",
            "badge-13",
            "badge-12",
        ]);

        expect(first.supportsFilters).toBe(false);

        expect(
            first.results[0].id
        ).toBeUndefined();

        expect(
            first.results[0].rarity
        ).toBeUndefined();

        for (const search of [
            "Badge 0",
            "Milestone 0",
            "badge-0",
        ]) {
            const found =
                normalizeAchievementResponse(
                    data,
                    { search }
                );

            expect(found.count).toBe(1);

            expect(
                found.total_badges
            ).toBe(15);

            expect(
                found.results[0].badge.code
            ).toBe("badge-0");

            expect(
                found.recent_badges
            ).toEqual(first.recent_badges);
        }
    }
);


// =========================================================
// EMPTY LEGACY RESPONSE
// =========================================================

test(
    "empty legacy response and tied award dates remain safe and deterministic",
    () => {
        expect(
            normalizeAchievementResponse({
                badges: [],
                total_badges: 0,
            })
        ).toMatchObject({
            results: [],
            recent_badges: [],
            count: 0,
        });

        const first = {
            badge: {
                code: "a",
                name: "A",
            },
            awarded_at: reward.awarded_at,
        };

        const second = {
            badge: {
                code: "b",
                name: "B",
            },
            awarded_at: reward.awarded_at,
        };

        const ordered =
            normalizeAchievementResponse({
                badges: [first, second],
            });

        const reversed =
            normalizeAchievementResponse({
                badges: [second, first],
            });

        expect(ordered.results).toEqual(
            reversed.results
        );
    }
);


// =========================================================
// MALFORMED RESPONSE HANDLING
// =========================================================

test.each([
    null,
    {},
    { results: null },
    { badges: null },
    { badges: [null] },
    { badges: [{}] },
    {
        badges: [reward],
        total_badges: 20,
    },
    {
        ...payload,
        recent_badges: null,
    },
    {
        ...payload,
        total_badges: {},
    },
])(
    "malformed or incomplete response becomes a failed request: %j",
    async (data) => {
        BadgeService.getUserBadges
            .mockResolvedValueOnce(data);

        const store = createStore();

        await store.dispatch(
            fetchProfileAchievements(args)
        );

        const collection =
            store.getState().badge.collection;

        expect(
            collection.status
        ).toBe("failed");

        expect(
            collection.results
        ).toEqual([]);

        expect(
            collection.recent
        ).toEqual([]);
    }
);


// =========================================================
// STALE PROFILE / PAGE RESPONSES
// =========================================================

test(
    "ignores stale profile, page and canceled responses",
    () => {
        let state = reducer(
            undefined,
            fetchProfileAchievements.pending(
                "first",
                args
            )
        );

        state = reducer(
            state,
            fetchProfileAchievements.pending(
                "second",
                {
                    ...args,
                    username: "bob",
                }
            )
        );

        state = reducer(
            state,
            fetchProfileAchievements.fulfilled(
                payload,
                "first",
                args
            )
        );

        expect(
            state.collection.username
        ).toBe("bob");

        expect(
            state.collection.results
        ).toEqual([]);

        state = reducer(
            state,
            cancelAchievementRequest("second")
        );

        state = reducer(
            state,
            fetchProfileAchievements.fulfilled(
                payload,
                "second",
                args
            )
        );

        expect(
            state.collection.results
        ).toEqual([]);
    }
);


// =========================================================
// DUPLICATE REQUEST PROTECTION
// =========================================================

test(
    "duplicate in-flight requests are suppressed and cancellation releases the slot",
    async () => {
        BadgeService.getUserBadges.mockImplementation(
            () => new Promise(() => {})
        );

        const store = createStore();

        const first = store.dispatch(
            fetchProfileAchievements(args)
        );

        const second = await store.dispatch(
            fetchProfileAchievements(args)
        );

        expect(
            second.meta.condition
        ).toBe(true);

        expect(
            BadgeService.getUserBadges
        ).toHaveBeenCalledTimes(1);

        first.abort();

        store.dispatch(
            cancelAchievementRequest(
                first.requestId
            )
        );

        await first;

        expect(
            store.getState()
                .badge.collection.status
        ).toBe("idle");
    }
);


// =========================================================
// SEASONAL GIFT REWARD INVALIDATION
// =========================================================
//
// Three different events are used here.
//
// This does NOT represent repeatedly
// claiming the same holiday gift.
//
// Any successful event gift may require
// refreshing badge ownership.
//
// =========================================================

test(
    "seasonal event rewards invalidate achievements without synthesizing owned items",
    () => {
        let state = reducer(
            undefined,
            checkAuthSuccess({
                id: Number(OWNER_ID),
            })
        );

        state = reducer(
            state,
            fetchProfileAchievements.pending(
                "first",
                args
            )
        );

        state = reducer(
            state,
            fetchProfileAchievements.fulfilled(
                payload,
                "first",
                args
            )
        );

        const claims = [
            {
                slug: NEW_YEAR_SLUG,
                reward: {
                    type: "achievement",
                },
            },
            {
                slug: NAVROZ_SLUG,
                reward: {
                    type: "coin",
                    is_compensation: true,
                },
            },
            {
                slug: RAMADAN_SLUG,
                reward: {
                    type: "frame",
                },
            },
        ];

        for (const [index, claim] of
            claims.entries()) {
            const oldRevision =
                state.revision;

            state = reducer(
                state,
                createSeasonalClaimAction({
                    ...claim,
                    requestId: `claim-${index}`,
                })
            );

            expect(
                state.revision
            ).toBe(oldRevision + 1);

            // Owned badges are not created
            // locally from reward previews.

            expect(
                state.collection.results
            ).toEqual(payload.results);

            expect(
                state.collection.status
            ).toBe("idle");

            expect(
                state.collection.recentRevision
            ).toBe(-1);
        }
    }
);


// =========================================================
// OWNER ISOLATION
// =========================================================

test(
    "a different account's seasonal claim cannot invalidate the current owner's badges",
    () => {
        let state = reducer(
            undefined,
            checkAuthSuccess({
                id: Number(OWNER_ID),
            })
        );

        state = reducer(
            state,
            fetchProfileAchievements.pending(
                "owner-request",
                args
            )
        );

        state = reducer(
            state,
            fetchProfileAchievements.fulfilled(
                payload,
                "owner-request",
                args
            )
        );

        const oldRevision =
            state.revision;

        state = reducer(
            state,
            createSeasonalClaimAction({
                ownerId: "999",
                reward: {
                    type: "achievement",
                },
            })
        );

        expect(
            state.revision
        ).toBe(oldRevision);

        expect(
            state.collection.status
        ).toBe("success");

        expect(
            state.collection.results
        ).toEqual(payload.results);
    }
);


// =========================================================
// FAILED CLAIM DOES NOT INVALIDATE BADGES
// =========================================================

test(
    "a rejected seasonal gift claim does not fabricate badge ownership",
    () => {
        let state = reducer(
            undefined,
            checkAuthSuccess({
                id: Number(OWNER_ID),
            })
        );

        const oldRevision =
            state.revision;

        state = reducer(
            state,
            claimSeasonalGiftForEvent.rejected(
                new Error("Request failed"),
                "failed-seasonal-claim",
                NEW_YEAR_SLUG
            )
        );

        expect(
            state.revision
        ).toBe(oldRevision);

        expect(
            state.collection.results
        ).toEqual([]);
    }
);


// =========================================================
// LOGOUT / ACCOUNT SWITCH
// =========================================================

test(
    "logout and auth account switch clear state and reject late responses",
    () => {
        let state = reducer(
            undefined,
            fetchProfileAchievements.pending(
                "old",
                args
            )
        );

        state = reducer(
            state,
            logoutUser()
        );

        state = reducer(
            state,
            fetchProfileAchievements.fulfilled(
                payload,
                "old",
                args
            )
        );

        expect(
            state.collection.username
        ).toBeNull();

        state = reducer(
            state,
            fetchProfileAchievements.pending(
                "new",
                args
            )
        );

        state = reducer(
            state,
            checkAuthSuccess({
                id: 2,
            })
        );

        state = reducer(
            state,
            fetchProfileAchievements.fulfilled(
                payload,
                "new",
                args
            )
        );

        expect(
            state.collection.results
        ).toEqual([]);
    }
);


// =========================================================
// SERVER FILTERS
// =========================================================

test(
    "search and supported filters are passed to server with cancellation",
    async () => {
        BadgeService.getUserBadges
            .mockResolvedValue(payload);

        const store = createStore();

        await store.dispatch(
            fetchProfileAchievements({
                ...args,
                search: "milestone",
                filter: "secret",
            })
        );

        expect(
            BadgeService.getUserBadges
        ).toHaveBeenLastCalledWith(
            "alice",
            expect.objectContaining({
                search: "milestone",
                is_secret: "true",
                page_size: 12,
                include_recent: 1,
                signal: expect.anything(),
            })
        );
    }
);


// =========================================================
// RECENT ACHIEVEMENTS CACHE
// =========================================================

test(
    "pagination retains recent achievements without requesting them again",
    async () => {
        BadgeService.getUserBadges
            .mockResolvedValueOnce(payload)
            .mockResolvedValueOnce({
                ...payload,
                recent_badges: undefined,
            });

        const store = createStore();

        await store.dispatch(
            fetchProfileAchievements(args)
        );

        await store.dispatch(
            fetchProfileAchievements({
                ...args,
                page: 2,
            })
        );

        expect(
            BadgeService.getUserBadges
        ).toHaveBeenLastCalledWith(
            "alice",
            expect.objectContaining({
                page: 2,
                include_recent: undefined,
            })
        );

        expect(
            store.getState()
                .badge.collection.recent
        ).toEqual(payload.recent_badges);
    }
);
