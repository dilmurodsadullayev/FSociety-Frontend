
// src/services/events/eventsApi.test.js

import api from "../api";

import {
    getEventsBasePath,
    getEventDetailPath,
    normalizeEventSlug,
    unwrapEventsResponse,
    normalizePublicEvent,
    normalizeEventsResponse,
    normalizeEventDetailResponse,
    getPublicEvents,
    getPublicEventDetail,
    normalizeEventsApiError,
} from "./eventsApi";

// =========================================================
// FSOCIETY — EVENTS API TESTS
// =========================================================
//
// - Django serializer compatibility
// - Date / status / timezone aliases
// - DRF pagination
// - Event detail
// - Axios requests
// - AbortController
// - Invalid responses
// - Safe error messages
//
// =========================================================


// =========================================================
// AXIOS MOCK
// =========================================================

jest.mock("../api", () => ({
    __esModule: true,

    default: {
        defaults: {
            baseURL:
                "http://127.0.0.1:8000/api/",
        },

        get: jest.fn(),

        post: jest.fn(),
    },
}));


// =========================================================
// REAL BACKEND RESPONSE SHAPE
// =========================================================

const newYear = {
    id: 1,

    slug: "new-year-2027",

    name: "FSociety New Year 2027",

    description: "Yangi yil tadbiri",

    timezone: "Asia/Tashkent",

    opens_at: "2026-12-20T00:00:00+05:00",

    ends_at: "2027-01-08T00:00:00+05:00",

    is_enabled: true,

    event_status: "scheduled",
};

const disabledEvent = {
    id: 4,

    slug: "navruz-code-festival-2027",

    name: "Navro‘z tadbiri",

    timezone: "Asia/Tashkent",

    opens_at: "2027-03-20T00:00:00+05:00",

    ends_at: "2027-03-27T00:00:00+05:00",

    is_enabled: false,

    event_status: "disabled",
};


// =========================================================
// SETUP
// =========================================================

beforeEach(() => {
    api.get.mockReset();

    api.post.mockReset();

    api.defaults.baseURL =
        "http://127.0.0.1:8000/api/";
});


// =========================================================
// BASE URL
// =========================================================

test(
    "Axios baseURL /api bo‘lsa events yo‘lini ikki marta qo‘shmaydi",
    () => {
        expect(
            getEventsBasePath()
        ).toBe("events/");

        expect(
            getEventDetailPath(
                "new-year-2027"
            )
        ).toBe(
            "events/new-year-2027/"
        );

        api.defaults.baseURL =
            "http://127.0.0.1:8000/";

        expect(
            getEventsBasePath()
        ).toBe("api/events/");
    }
);


// =========================================================
// SLUG VALIDATION
// =========================================================

test(
    "noto‘g‘ri event slug rad etiladi",
    () => {
        expect(
            normalizeEventSlug(
                " new-year-2027 "
            )
        ).toBe("new-year-2027");

        expect(
            () => normalizeEventSlug("../admin")
        ).toThrow(TypeError);

        expect(
            () => normalizeEventSlug("")
        ).toThrow(TypeError);
    }
);


// =========================================================
// SEASONAL EVENT SERIALIZER MAPPING
// =========================================================

test(
    "DRF Seasonal Gift maydonlari UI uchun moslashtiriladi",
    () => {
        const normalized =
            normalizePublicEvent(
                newYear
            );

        expect(
            normalized.opens_at
        ).toBe(newYear.opens_at);

        expect(
            normalized.gift_opens_at
        ).toBe(newYear.opens_at);

        expect(
            normalized.starts_at
        ).toBe(newYear.opens_at);

        expect(
            normalized.event_status
        ).toBe("scheduled");

        expect(
            normalized.status
        ).toBe("scheduled");

        expect(
            normalized.timezone_name
        ).toBe("Asia/Tashkent");

        // Preserve backend response fields.

        expect(
            normalized.slug
        ).toBe(newYear.slug);

        expect(
            normalized.description
        ).toBe(newYear.description);

        expect(
            normalized.ends_at
        ).toBe(newYear.ends_at);

        expect(
            normalized.is_enabled
        ).toBe(true);

        // The source must not be mutated.

        expect(
            newYear
        ).not.toHaveProperty("status");
    }
);


// =========================================================
// DISABLED EVENT
// =========================================================

test(
    "o‘chirilgan tadbir server holatini saqlab qoladi",
    () => {
        const event = normalizePublicEvent(
            disabledEvent
        );

        expect(
            event.status
        ).toBe("disabled");

        expect(
            event.is_enabled
        ).toBe(false);
    }
);


// =========================================================
// NO INVENTED DATES
// =========================================================

test(
    "sanasi yo‘q tadbirga soxta ochilish sanasi yozilmaydi",
    () => {
        const event = normalizePublicEvent({
            id: 9,
            slug: "without-date",
            name: "Sanasi belgilanmagan",
            is_enabled: true,
        });

        expect(
            event.gift_opens_at
        ).toBeUndefined();

        expect(
            event.starts_at
        ).toBeUndefined();

        expect(
            event.status
        ).toBeUndefined();
    }
);


// =========================================================
// DRF PAGINATION
// =========================================================

test(
    "DRF pagination va event maydonlarini normalizatsiya qiladi",
    () => {
        const data = normalizeEventsResponse({
            count: 6,

            next: null,

            previous: null,

            results: [
                newYear,
                disabledEvent,
            ],
        });

        expect(
            data.count
        ).toBe(6);

        expect(
            data.next
        ).toBeNull();

        expect(
            data.items
        ).toHaveLength(2);

        expect(
            data.items[0].status
        ).toBe("scheduled");

        expect(
            data.items[0].gift_opens_at
        ).toBe(newYear.opens_at);

        expect(
            data.items[1].status
        ).toBe("disabled");
    }
);


// =========================================================
// LEGACY RESPONSE FORMATS
// =========================================================

test(
    "array va oldingi API formatlari ham ishlaydi",
    () => {
        const formats = [
            [newYear],

            {
                events: [newYear],
            },

            {
                data: [newYear],
            },

            {
                data: {
                    results: [newYear],
                },
            },
        ];

        for (const payload of formats) {
            const data =
                normalizeEventsResponse(
                    payload
                );

            expect(
                data.items
            ).toHaveLength(1);

            expect(
                data.items[0].status
            ).toBe("scheduled");
        }
    }
);


// =========================================================
// INVALID API RESPONSE
// =========================================================

test(
    "buzilgan API javobini bo‘sh tadbir deb yashirmaydi",
    () => {
        expect(
            () => normalizeEventsResponse({})
        ).toThrow(TypeError);

        expect(
            () => normalizeEventsResponse(null)
        ).toThrow(TypeError);

        expect(
            () => normalizeEventsResponse({
                results: [null],
            })
        ).toThrow(TypeError);
    }
);


// =========================================================
// EVENT DETAIL
// =========================================================

test(
    "event detail ham ro‘yxat bilan bir xil formatga keltiriladi",
    () => {
        const event =
            normalizeEventDetailResponse({
                data: {
                    event: newYear,
                },
            });

        expect(
            event.slug
        ).toBe("new-year-2027");

        expect(
            event.status
        ).toBe("scheduled");

        expect(
            event.starts_at
        ).toBe(newYear.opens_at);
    }
);


// =========================================================
// AXIOS RESPONSE
// =========================================================

test(
    "Axios javobi va custom data payload ajratiladi",
    () => {
        expect(
            unwrapEventsResponse({
                data: {
                    results: [newYear],
                },

                status: 200,
            })
        ).toEqual({
            results: [newYear],
        });

        const businessData = {
            data: [newYear],
        };

        expect(
            unwrapEventsResponse(businessData)
        ).toBe(businessData);
    }
);


// =========================================================
// FETCH PUBLIC EVENTS
// =========================================================

test(
    "GET public events params va AbortSignal ni saqlaydi",
    async () => {
        const controller =
            new AbortController();

        api.get.mockResolvedValueOnce({
            data: {
                results: [newYear],
            },

            status: 200,
        });

        const result =
            await getPublicEvents({
                params: {
                    page: 2,
                },

                signal:
                    controller.signal,
            });

        expect(
            api.get
        ).toHaveBeenCalledWith(
            "events/",
            {
                params: {
                    page: 2,
                },

                signal:
                    controller.signal,
            }
        );

        expect(
            result.results
        ).toHaveLength(1);
    }
);


// =========================================================
// FETCH PUBLIC EVENT DETAIL
// =========================================================

test(
    "event detail GET to‘g‘ri URL ga so‘rov yuboradi",
    async () => {
        api.get.mockResolvedValueOnce({
            data: newYear,

            status: 200,
        });

        const result =
            await getPublicEventDetail(
                "new-year-2027"
            );

        expect(
            api.get
        ).toHaveBeenCalledWith(
            "events/new-year-2027/",
            {}
        );

        expect(
            result
        ).toEqual(newYear);
    }
);


// =========================================================
// SAFE 503 ERROR HANDLING
// =========================================================

test(
    "503 xato foydalanuvchiga xavfsiz shaklda uzatiladi",
    () => {
        const error =
            normalizeEventsApiError({
                response: {
                    status: 503,

                    data: {
                        detail:
                            "internal postgres information",
                    },
                },
            });

        expect(
            error.status
        ).toBe(503);

        expect(
            error.code
        ).toBe("HTTP_503");

        expect(
            error.message
        ).toBe(
            "Xizmat vaqtincha mavjud emas."
        );

        expect(
            JSON.stringify(error)
        ).not.toContain("postgres");
    }
);


// =========================================================
// CANCELED REQUEST
// =========================================================

test(
    "bekor qilingan so‘rov qayta xato sifatida ko‘rsatilmaydi",
    () => {
        expect(
            normalizeEventsApiError({
                name: "AbortError",
            })
        ).toMatchObject({
            canceled: true,
            code: "REQUEST_CANCELED",
        });
    }
);
