import React, { StrictMode } from "react";
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import api from "../../services/api";
import AuthService from "../../services/auth";
import { rootReducer, eventsListenerMiddleware } from "../../store";
import { checkAuthSuccess, logoutUser } from "../../features/auth/Auth";
import { getProfileSuccess } from "../../features/profile";
import { dailyGift } from "../../features/events/dailyGiftSlice";
import { seasonalGift } from "../../features/events/seasonalGiftSlice";
import { getEventGiftMode, getGiftReward } from "../../utils/eventGift";
import { formatEventDate } from "../../utils/formatEventDate";
import EventCard from "./EventCard";
import DailyGiftCard from "./DailyGiftCard";
import SeasonalGiftCard from "./SeasonalGiftCard";
import GiftRevealModal from "./GiftRevealModal";
import NavbarEventGiftButton, { chooseNavbarGiftEvent } from "../navbar/NavbarEventGiftButton";
import { normalizeDailyGiftClaim, normalizeDailyGiftStatus } from "../../services/events/dailyGiftApi";
import { normalizeSeasonalGiftClaim, normalizeSeasonalGiftStatus } from "../../services/events/seasonalGiftApi";

jest.mock("../../services/api", () => ({ __esModule: true, default: {
    defaults: { baseURL: "/api/" }, get: jest.fn(), post: jest.fn(),
} }));
jest.mock("../../services/auth", () => ({ __esModule: true, default: { getUser: jest.fn() } }));
// CRA's Jest 27 resolver cannot load React Router 7's export map.
jest.mock("react-router-dom", () => ({
    Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>,
    MemoryRouter: ({ children }) => <>{children}</>,
}), { virtual: true });

const event = { slug: "holiday", name: "FSociety 2027", gift_mode: "both", timezone: "Asia/Tashkent", event_status: "active", is_enabled: true };
const user = { id: 1, username: "alice", coins: 100 };
const reward = { reward_type: "coin", awarded_reward_type: "coin", awarded_coins: 37, reward_name: "Server reward", rarity: "rare", is_compensation: false, item: null };
const greeting = { title: "Yangi yilingiz muborak, alice!", message: "<img src=x onerror=alert(1)>" };
const now = "2026-12-20T18:59:59Z";
let store;
let claims;
let day;
const kindOf = (path) => path.includes("daily-gift") ? "daily" : "seasonal";
const status = (kind, claimed = Boolean(claims[kind])) => ({
    event_slug: "holiday", event_status: "active", can_claim: !claimed, reason: claimed ? "already_claimed" : "available",
    ...(kind === "daily" ? { claimed_today: claimed, claim_date: day, next_claim_at: "2026-12-20T19:00:00Z", timezone: "Asia/Tashkent" } : { already_claimed: claimed, opens_at: "2026-12-19T00:00:00Z", ends_at: "2027-01-08T00:00:00Z" }),
    server_time: now,
});
const claimRecord = (kind) => ({ claim_id: kind === "daily" ? 1 : 2, claim_date: day, claimed_at: now, timezone: "Asia/Tashkent", created: true, already_claimed: false, reward, greeting });
const response = (data) => ({ data, status: 200 });
const deferred = () => { let resolve; const promise = new Promise((r) => { resolve = r; }); return { promise, resolve }; };
const makeStore = (listeners = true) => configureStore({
    reducer: rootReducer,
    middleware: (getDefault) => listeners ? getDefault().prepend(eventsListenerMiddleware.middleware) : getDefault(),
});
const mount = (element) => render(<StrictMode><Provider store={store}><MemoryRouter>{element}</MemoryRouter></Provider></StrictMode>);
const flush = async () => act(async () => { await Promise.resolve(); });

beforeAll(() => {
    window.matchMedia = (query) => ({ matches: query.includes("reduced-motion"), media: query, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} });
});
beforeEach(() => {
    claims = {};
    day = "2026-12-20";
    api.get.mockReset().mockImplementation(async (path) => {
        const kind = kindOf(path);
        if (path.endsWith("status/")) return response(status(kind));
        if (path.endsWith("history/")) return response({ count: claims[kind] ? 1 : 0, next: null, previous: null, results: claims[kind] ? [claims[kind]] : [] });
        throw new Error(`Unexpected GET ${path}`);
    });
    api.post.mockReset().mockImplementation(async (path) => {
        const kind = kindOf(path);
        const existing = claims[kind];
        claims[kind] = existing ?? claimRecord(kind);
        return response({ ...claims[kind], created: !existing, already_claimed: Boolean(existing), status: status(kind) });
    });
    AuthService.getUser.mockReset().mockResolvedValue({ ...user, coins: 137 });
    store = makeStore();
    store.dispatch(checkAuthSuccess(user));
});

test.each(["daily", "seasonal", "both"])("gift_mode %s displays only its own interfaces", async (mode) => {
    mount(<EventCard event={{ ...event, gift_mode: mode }} defaultGiftOpen />);
    expect(Boolean(screen.queryByRole("region", { name: "Kunlik sovg‘a" }))).toBe(mode !== "seasonal");
    expect(Boolean(screen.queryByRole("region", { name: "Bayram sovg‘asi" }))).toBe(mode !== "daily");
    await flush();
    const kinds = api.get.mock.calls.map(([path]) => kindOf(path));
    const expected = mode === "both" ? ["daily", "seasonal"] : [mode];
    expect([...new Set(kinds)].sort()).toEqual(expected.sort());
});

test.each([undefined, "invalid", "DAILY", " daily "])("unknown mode %p never falls back to support flags or name", async (mode) => {
    const invalid = { ...event, gift_mode: mode, supports_daily_gift: true, supports_seasonal_gift: true };
    expect(getEventGiftMode(invalid)).toBeNull();
    mount(<EventCard event={invalid} defaultGiftOpen />);
    expect(screen.queryByRole("region", { name: "Kunlik sovg‘a" })).not.toBeInTheDocument();
    expect(api.get).not.toHaveBeenCalled();
});

test("guest sees login links, no private requests or history", async () => {
    store.dispatch(logoutUser());
    mount(<><DailyGiftCard event={event} /><SeasonalGiftCard event={event} /></>);
    expect(screen.getAllByRole("link", { name: /Tizimga kirish/ })).toHaveLength(2);
    expect(screen.queryByText("Kunlik sovg‘alar tarixi")).not.toBeInTheDocument();
    expect(api.get).not.toHaveBeenCalled();
});

test.each([dailyGift, seasonalGift])("$name protects a pending POST and subsequent duplicate clicks", async (gift) => {
    store = makeStore(false);
    store.dispatch(checkAuthSuccess(user));
    await store.dispatch(gift.fetchStatus("holiday"));
    const pending = deferred();
    api.post.mockReturnValueOnce(pending.promise);
    const first = store.dispatch(gift.claim("holiday"));
    await store.dispatch(gift.claim("holiday"));
    expect(api.post).toHaveBeenCalledTimes(1);
    const kind = gift === dailyGift ? "daily" : "seasonal";
    pending.resolve(response({ ...claimRecord(kind), status: status(kind, true) }));
    await first;
    await store.dispatch(gift.claim("holiday"));
    expect(api.post).toHaveBeenCalledTimes(1);
});

test("both claims are independent and balance is read from the server", async () => {
    store.dispatch(getProfileSuccess({ username: "alice", coins: 100 }));
    await store.dispatch(dailyGift.fetchStatus("holiday"));
    await store.dispatch(seasonalGift.fetchStatus("holiday"));
    await store.dispatch(dailyGift.claim("holiday"));
    expect(seasonalGift.canClaim(store.getState(), "holiday")).toBe(true);
    await store.dispatch(seasonalGift.claim("holiday"));
    await waitFor(() => expect(store.getState().auth.user.coins).toBe(137));
    expect(store.getState().coin.balance).toBe(137);
    expect(store.getState().profile.profile.coins).toBe(137);
    expect(api.post).toHaveBeenCalledTimes(2);
    expect(api.post.mock.calls.every(([, body]) => JSON.stringify(body) === "{}")).toBe(true);
});

test("no optimistic balance and a failed account refresh can be retried by status GET", async () => {
    AuthService.getUser.mockRejectedValue(new Error("offline"));
    await store.dispatch(dailyGift.fetchStatus("holiday"));
    await store.dispatch(dailyGift.claim("holiday"));
    await waitFor(() => expect(store.getState().eventsDailyGift.accountSyncError).toBe(true));
    expect(store.getState().auth.user.coins).toBe(100);
    AuthService.getUser.mockResolvedValue({ ...user, coins: 137 });
    await store.dispatch(dailyGift.fetchStatus("holiday"));
    await waitFor(() => expect(store.getState().auth.user.coins).toBe(137));
});

test.each([dailyGift, seasonalGift])("$name timeout reconciles with GET status and history, never another POST", async (gift) => {
    await store.dispatch(gift.fetchStatus("holiday"));
    const historyRead = deferred();
    api.post.mockRejectedValueOnce({ code: "ECONNABORTED" });
    api.get.mockImplementation((path) => path.endsWith("history/") ? historyRead.promise : Promise.resolve(response(status(gift === dailyGift ? "daily" : "seasonal", false))));
    await store.dispatch(gift.claim("holiday"));
    await flush();
    expect(gift.select(store.getState()).needsReconciliationByEvent.holiday).toBe(true);
    await store.dispatch(gift.claim("holiday"));
    expect(api.post).toHaveBeenCalledTimes(1);
    historyRead.resolve(response({ results: [], count: 0, next: null, previous: null }));
    await waitFor(() => expect(gift.select(store.getState()).needsReconciliationByEvent.holiday).toBe(false));
    expect(api.post).toHaveBeenCalledTimes(1);
});

test("daily opens on a new day only after backend can_claim, seasonal remains claimed", async () => {
    store = makeStore(false); store.dispatch(checkAuthSuccess(user));
    await store.dispatch(dailyGift.fetchStatus("holiday"));
    await store.dispatch(dailyGift.claim("holiday"));
    day = "2026-12-21";
    expect(dailyGift.canClaim(store.getState(), "holiday")).toBe(false);
    claims.daily = null;
    await store.dispatch(dailyGift.fetchStatus("holiday"));
    expect(dailyGift.canClaim(store.getState(), "holiday")).toBe(true);
    await store.dispatch(dailyGift.claim("holiday"));
    expect(api.post).toHaveBeenCalledTimes(2);
});

test("late private response is ignored through logout and A → B → A", async () => {
    const pending = deferred();
    api.get.mockReturnValueOnce(pending.promise);
    const read = store.dispatch(dailyGift.fetchHistory("holiday"));
    store.dispatch(logoutUser());
    store.dispatch(checkAuthSuccess({ id: 2, username: "bob" }));
    store.dispatch(checkAuthSuccess(user));
    pending.resolve(response({ count: 1, results: [claimRecord("daily")] }));
    await read;
    expect(store.getState().eventsDailyGift.historyByEvent).toEqual({});
});

test("multiple mounts share GETs and a successful claim updates both and navbar", async () => {
    mount(<><DailyGiftCard event={event} /><DailyGiftCard event={event} /><SeasonalGiftCard event={event} /></>);
    await waitFor(() => expect(screen.getAllByRole("button", { name: "Bugungi sovg‘ani ochish" })[0]).toBeEnabled());
    const statusReads = api.get.mock.calls.filter(([p]) => p.includes("daily-gift/status"));
    expect(statusReads).toHaveLength(1);
    fireEvent.click(screen.getAllByRole("button", { name: "Bugungi sovg‘ani ochish" })[0]);
    await waitFor(() => expect(screen.getAllByText("Bugungi sovg‘a olindi")).toHaveLength(2));
    expect(screen.getByRole("button", { name: "Bayram sovg‘asini ochish" })).toBeEnabled();
    expect(await screen.findByRole("dialog")).toHaveTextContent("+37 FCoin");
    expect(screen.getByRole("dialog")).toHaveTextContent(greeting.title);
});

test("refresh recovers existing seasonal reward and greeting without claiming", async () => {
    claims.seasonal = claimRecord("seasonal");
    mount(<SeasonalGiftCard event={event} />);
    fireEvent.click(await screen.findByRole("button", { name: "Bayram sovg‘asi natijasini ko‘rish" }));
    expect(screen.getByRole("dialog")).toHaveTextContent(greeting.title);
    expect(api.post).not.toHaveBeenCalled();
    act(() => store.dispatch(logoutUser()));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(screen.queryByText("Server reward")).not.toBeInTheDocument();
});

test("daily history pagination uses page params and event timezone dates", async () => {
    claims.daily = claimRecord("daily");
    api.get.mockImplementation(async (path, options) => path.endsWith("status/") ? response(status("daily")) : response({
        results: [{ ...claimRecord("daily"), claim_id: options?.params?.page ?? 1 }], count: 6,
        next: options?.params?.page === 2 ? null : "https://server/history/?page=2", previous: options?.params?.page === 2 ? "?page=1" : null,
    }));
    mount(<DailyGiftCard event={event} />);
    fireEvent.click(screen.getByRole("button", { name: "Kunlik sovg‘alar tarixi" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Keyingi" })).toBeEnabled());
    fireEvent.click(screen.getByRole("button", { name: "Keyingi" }));
    await screen.findByText("2-sahifa");
    expect(api.get).toHaveBeenCalledWith("events/holiday/daily-gift/history/", expect.objectContaining({ params: { page: 2, page_size: 5 } }));
    expect(screen.getAllByText("20-dekabr 2026, 23:59").length).toBeGreaterThan(0);
});

test("focus refreshes status without sending a claim", async () => {
    mount(<DailyGiftCard event={event} />);
    await waitFor(() => expect(screen.getByRole("button", { name: "Bugungi sovg‘ani ochish" })).toBeEnabled());
    const reads = api.get.mock.calls.length;
    fireEvent.focus(window);
    await waitFor(() => expect(api.get.mock.calls.length).toBeGreaterThan(reads));
    expect(api.post).not.toHaveBeenCalled();
});

test.each(["badge", "achievement", "frame", "coin"])("reveal renders exact %s result and text-only greeting with keyboard control", async (type) => {
    const close = jest.fn();
    const claim = { ...claimRecord("seasonal"), reward: { ...reward, awarded_reward_type: type, item: type === "coin" ? null : { name: `${type} name`, image_url: ["javascript", "alert(1)"].join(":") } } };
    const view = mount(<GiftRevealModal open claim={claim} eventName="FSociety" onClose={close} />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveTextContent(type === "coin" ? "+37 FCoin" : `${type} name`);
    expect(within(dialog).getByText(greeting.message)).toBeInTheDocument();
    expect(within(dialog).queryByRole("img")).not.toBeInTheDocument();
    const closeButton = within(dialog).getByRole("button", { name: "Mukofot oynasini yopish" });
    expect(closeButton).toHaveFocus();
    fireEvent.keyDown(closeButton, { key: "Tab", shiftKey: true });
    expect(within(dialog).getByRole("button", { name: "Ajoyib, rahmat!" })).toHaveFocus();
    fireEvent.keyDown(dialog, { key: "Escape" });
    expect(close).toHaveBeenCalledTimes(1);
    view.unmount();
});

test("duplicate compensation displays the exact backend amount, null never becomes zero", () => {
    const claim = { reward: { ...reward, awarded_coins: 93, is_compensation: true } };
    mount(<GiftRevealModal open claim={claim} onClose={() => {}} />);
    expect(screen.getByRole("dialog")).toHaveTextContent("+93 FCoin");
    expect(screen.getByText(/Takroriy mukofot kompensatsiyasi/)).toBeInTheDocument();
    expect(getGiftReward({ reward: { awarded_coins: null } }).coins).toBeNull();
});

test("navbar respects mode and does not call seasonal status for daily event", async () => {
    const daily = { ...event, gift_mode: "daily" };
    const invalid = { ...event, slug: "fake", gift_mode: "unknown", is_featured: true };
    expect(chooseNavbarGiftEvent([invalid, daily])).toBe(daily);
    const state = store.getState();
    store = configureStore({ reducer: rootReducer, preloadedState: { ...state, events: { ...state.events, items: [daily] } } });
    mount(<NavbarEventGiftButton isLoggedIn />);
    await waitFor(() => expect(screen.getByRole("link")).toHaveAccessibleName(/Kunlik sovg‘a tayyor/));
    expect(api.get.mock.calls.some(([path]) => path.includes("seasonal-gift"))).toBe(false);
});

test("event formatter is explicit Uzbek and respects timezone across midnight", () => {
    expect(formatEventDate("2026-12-19T19:00:00Z", "Asia/Tashkent")).toBe("20-dekabr 2026, 00:00");
    expect(formatEventDate("2026-12-19T19:00:00Z", "America/New_York")).toBe("19-dekabr 2026, 14:00");
    expect(formatEventDate("invalid")).toBe("Sana belgilanmagan");
});

test("malformed API responses cannot enable claims or invent rewards", () => {
    expect(() => normalizeDailyGiftStatus({ can_claim: true })).toThrow();
    expect(() => normalizeSeasonalGiftStatus({ can_claim: true })).toThrow();
    expect(() => normalizeDailyGiftClaim({ created: true })).toThrow();
    expect(() => normalizeSeasonalGiftClaim({ created: true })).toThrow();
});

test("network error shows a safe error and keeps the claim disabled", async () => {
    api.get.mockRejectedValue({ response: { status: 500, data: { message: "Traceback SECRET" } } });
    mount(<SeasonalGiftCard event={event} />);
    const errors = await screen.findAllByRole("alert");
    expect(errors[0]).not.toHaveTextContent("SECRET");
    expect(screen.getByRole("button", { name: "Sovg‘a hozir yopiq" })).toBeDisabled();
    expect(api.post).not.toHaveBeenCalled();
});

test.each([dailyGift, seasonalGift])("$name accepts backend duplicate response as the existing reward", async (gift) => {
    store = makeStore(false); store.dispatch(checkAuthSuccess(user));
    await store.dispatch(gift.fetchStatus("holiday"));
    const kind = gift === dailyGift ? "daily" : "seasonal";
    api.post.mockResolvedValueOnce(response({ ...claimRecord(kind), created: false, already_claimed: true, status: status(kind, true) }));
    await store.dispatch(gift.claim("holiday"));
    expect(gift.select(store.getState()).claimByEvent.holiday.already_claimed).toBe(true);
    expect(gift.canClaim(store.getState(), "holiday")).toBe(false);
});

test("daily midnight triggers GET and leaves eligibility to the backend", async () => {
    jest.useFakeTimers("modern");
    const reference = Date.now();
    const readStatus = { ...status("daily", true), server_time: new Date(reference).toISOString(), next_claim_at: new Date(reference + 1000).toISOString() };
    api.get.mockImplementation(async (path) => path.endsWith("status/") ? response(readStatus) : response({ results: [], count: 0 }));
    const view = mount(<DailyGiftCard event={event} />);
    await flush();
    const reads = api.get.mock.calls.filter(([path]) => path.endsWith("status/")).length;
    await act(async () => { jest.advanceTimersByTime(1500); });
    expect(api.get.mock.calls.filter(([path]) => path.endsWith("status/")).length).toBeGreaterThan(reads);
    expect(screen.getByText("Bugungi sovg‘a olindi")).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
    view.unmount();
    jest.useRealTimers();
});

test("failed refresh cannot reuse a previously available status", async () => {
    await store.dispatch(dailyGift.fetchStatus("holiday"));
    expect(dailyGift.canClaim(store.getState(), "holiday")).toBe(true);
    api.get.mockRejectedValueOnce(new Error("offline"));
    await store.dispatch(dailyGift.fetchStatus("holiday"));
    expect(dailyGift.canClaim(store.getState(), "holiday")).toBe(false);
});

test("finished event keeps existing seasonal history accessible with no new claim", async () => {
    claims.seasonal = claimRecord("seasonal");
    api.get.mockImplementation(async (path) => path.endsWith("status/")
        ? response({ ...status("seasonal", true), event_status: "finished" })
        : response({ results: [claims.seasonal], count: 1 }));
    mount(<EventCard event={{ ...event, gift_mode: "seasonal", event_status: "finished" }} defaultGiftOpen />);
    expect(await screen.findByRole("button", { name: "Bayram sovg‘asi natijasini ko‘rish" })).toBeEnabled();
    expect(api.post).not.toHaveBeenCalled();
});
