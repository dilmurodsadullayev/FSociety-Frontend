import React from "react";
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Profile from "../Profile";
import badge from "../../features/badge";
import BadgeService from "../../services/badge";
import { claimDailyGift } from "../../features/dailyGift/dailyGiftThunks";

let mockUsername = "alice";
jest.mock("./useProfilePage", () => {
    const React = require("react");
    return { __esModule: true, default: function useProfilePageMock() {
        const [activeTab, setActiveTab] = React.useState("projects");
        return { username: mockUsername, profile: { username: mockUsername }, currentUser: {}, profileMatchesRoute: true,
            isOwner: mockUsername === "alice", activeTab, setActiveTab };
    } };
});
jest.mock("../../services/badge", () => ({ __esModule: true, default: { getUserBadges: jest.fn() } }));
jest.mock("./ProfileHero", () => () => <div>Profile hero</div>);
jest.mock("./ProfileError", () => () => <div>Profile error</div>);
jest.mock("./ProfileNotFound", () => () => <div>Profile not found</div>);
jest.mock("./EditProfileModal", () => () => null);
jest.mock("./CoverImageEditModal", () => () => null);
jest.mock("./sidebar/ProfileSidebarDetails", () => () => <div>Profile details</div>);
jest.mock("./sidebar/ProfileSidebarAbout", () => () => <div>About me</div>);
jest.mock("./sidebar/ProfileSidebarSkills", () => () => <div>Skills</div>);
jest.mock("./ProfileProjects", () => () => <div>Existing projects</div>);
jest.mock("./ProfilePosts", () => () => <div>Existing posts</div>);
jest.mock("./ProfileRoadmap", () => () => <div>Existing roadmap</div>);

const item = (id, name = `Award ${id}`) => ({ id, badge_id: id, badge: { name, code: `award-${id}`, description: `Description ${id}`, image: `/media/badges/${id}.png` }, awarded_at: "2026-11-20T10:00:00Z", rarity: null });
const response = (items, total = items.length) => ({ username: mockUsername, results: items, recent_badges: [item(15), item(14), item(13)], count: total, total_badges: total });
let store;
beforeAll(() => {
    HTMLElement.prototype.scrollIntoView = jest.fn();
    HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); };
    HTMLDialogElement.prototype.close = function () { this.removeAttribute("open"); };
});
beforeEach(() => {
    mockUsername = "alice";
    BadgeService.getUserBadges.mockReset();
    BadgeService.getUserBadges.mockResolvedValue(response([item(15), item(14), item(13)], 15));
    store = configureStore({ reducer: { badge } });
});
const page = () => <Provider store={store}><Profile /></Provider>;

test("sidebar displays the latest three and opens the shared tab without another request", async () => {
    render(page());
    const sidebar = screen.getByRole("region", { name: "So‘nggi yutuqlar" });
    await within(sidebar).findByText("Award 15");
    expect(within(sidebar).getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByText("Existing projects")).toBeVisible();
    fireEvent.click(screen.getByRole("tab", { name: "Postlar / Javoblar" }));
    expect(screen.getByText("Existing posts")).toBeVisible();
    fireEvent.click(screen.getByRole("tab", { name: "Yo‘l xaritasi" }));
    expect(screen.getByText("Existing roadmap")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Barcha yutuqlarni ko‘rish" }));
    expect(screen.getByRole("tab", { name: "Yutuqlar" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Yutuqlar kolleksiyasi")).toBeVisible();
    expect(HTMLElement.prototype.scrollIntoView).toHaveBeenCalledWith(expect.objectContaining({ behavior: "smooth" }));
    expect(BadgeService.getUserBadges).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("tab", { name: "Loyihalar" }));
    expect(screen.getByText("Existing projects")).toBeVisible();
});

test("legacy badges response renders cards, latest three, pagination and full collection search", async () => {
    const badges = Array.from({ length: 15 }, (_, index) => ({
        badge: item(index + 1).badge,
        awarded_at: new Date(Date.UTC(2026, 10, index + 1)).toISOString(),
    }));
    BadgeService.getUserBadges.mockResolvedValue({ username: "alice", badges, total_badges: 15 });
    render(page());
    const sidebar = screen.getByRole("region", { name: "So‘nggi yutuqlar" });
    await within(sidebar).findByText("Award 15");
    expect(within(sidebar).getAllByRole("listitem")).toHaveLength(3);
    fireEvent.click(screen.getByRole("button", { name: "Barcha yutuqlarni ko‘rish" }));
    expect(screen.getAllByRole("button", { name: /— batafsil$/ })).toHaveLength(12);
    expect(screen.queryByRole("combobox", { name: "Yutuqlar filtri" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "2-sahifa" }));
    await screen.findByRole("button", { name: "Award 1 — batafsil" });
    expect(screen.getAllByRole("button", { name: /— batafsil$/ })).toHaveLength(3);
    expect(within(sidebar).getByText("Award 15")).toBeVisible();
    fireEvent.change(screen.getByRole("searchbox", { name: "Yutuqlarni qidirish" }), { target: { value: "award-15" } });
    await screen.findByRole("button", { name: "Award 15 — batafsil" });
    expect(screen.getAllByRole("button", { name: /— batafsil$/ })).toHaveLength(1);
});

test.each([null, {}, { results: null }, { badges: null }])("malformed successful API response shows retry instead of crashing: %j", async data => {
    BadgeService.getUserBadges.mockResolvedValue(data);
    render(page());
    await screen.findByRole("alert");
    fireEvent.click(screen.getByRole("tab", { name: "Yutuqlar" }));
    expect(screen.getByText("Yutuqlar kolleksiyasi")).toBeVisible();
    expect(screen.getAllByRole("button", { name: "Qayta urinish" })).toHaveLength(2);
});

test("pagination and debounced search go to backend and keep sidebar independent", async () => {
    render(page());
    await screen.findByText("Award 15");
    fireEvent.click(screen.getByRole("tab", { name: "Yutuqlar" }));
    BadgeService.getUserBadges.mockResolvedValue(response([item(1)], 15));
    fireEvent.click(screen.getByRole("button", { name: "2-sahifa" }));
    await waitFor(() => expect(BadgeService.getUserBadges).toHaveBeenLastCalledWith("alice", expect.objectContaining({ page: 2 })));
    await screen.findByRole("button", { name: "Award 1 — batafsil" });
    const sidebar = screen.getByRole("region", { name: "So‘nggi yutuqlar" });
    expect(within(sidebar).getByText("Award 15")).toBeVisible();
    BadgeService.getUserBadges.mockResolvedValue(response([item(1)], 1));
    fireEvent.change(screen.getByRole("searchbox", { name: "Yutuqlarni qidirish" }), { target: { value: "Award 1" } });
    await waitFor(() => expect(BadgeService.getUserBadges).toHaveBeenLastCalledWith("alice", expect.objectContaining({ page: 1, search: "Award 1" })));
    fireEvent.change(screen.getByRole("combobox", { name: "Yutuqlar filtri" }), { target: { value: "secret" } });
    await waitFor(() => expect(BadgeService.getUserBadges).toHaveBeenLastCalledWith("alice", expect.objectContaining({ page: 1, is_secret: "true" })));
});

test("image fallback, modal dismissal and focus restoration", async () => {
    render(page());
    await screen.findByText("Award 15");
    fireEvent.click(screen.getByRole("tab", { name: "Yutuqlar" }));
    const card = screen.getByRole("button", { name: "Award 15 — batafsil" });
    fireEvent.error(within(card).getByRole("img"));
    expect(within(card).getByRole("img", { name: "Award 15 belgisi" })).toBeVisible();
    card.focus();
    fireEvent.click(card);
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("Description 15")).toBeVisible();
    fireEvent(dialog, new Event("cancel", { bubbles: false, cancelable: true }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(card).toHaveFocus();
    fireEvent.click(card);
    fireEvent.click(screen.getByRole("dialog"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

test("API failure can be retried and empty owner is rendered", async () => {
    BadgeService.getUserBadges.mockRejectedValueOnce(new Error("offline"));
    render(page());
    await screen.findByRole("alert");
    BadgeService.getUserBadges.mockResolvedValue({ results: [], recent_badges: [], count: 0, total_badges: 0 });
    fireEvent.click(screen.getByRole("button", { name: "Qayta urinish" }));
    await screen.findByText("Hozircha yutuqlar mavjud emas");
    expect(screen.getByText("Faol ishtirok eting va maxsus yutuqlarni qo‘lga kiriting.")).toBeVisible();
});

test("search failure does not replace the independently loaded empty sidebar", async () => {
    BadgeService.getUserBadges.mockResolvedValue({ results: [], recent_badges: [], count: 0, total_badges: 0 });
    render(page());
    await screen.findByText("Hozircha yutuqlar mavjud emas");
    fireEvent.click(screen.getByRole("tab", { name: "Yutuqlar" }));
    BadgeService.getUserBadges.mockRejectedValueOnce(new Error("search offline"));
    fireEvent.change(screen.getByRole("searchbox", { name: "Yutuqlarni qidirish" }), { target: { value: "unknown" } });
    await screen.findByRole("alert");
    const sidebar = screen.getByRole("region", { name: "So‘nggi yutuqlar" });
    expect(within(sidebar).getByText("Hozircha yutuqlar mavjud emas")).toBeVisible();
    expect(within(sidebar).queryByRole("alert")).not.toBeInTheDocument();
    expect(within(sidebar).queryByRole("status")).not.toBeInTheDocument();
});

test("profile switch aborts the old request and never shows its late data", async () => {
    let resolveOld;
    BadgeService.getUserBadges.mockImplementationOnce(() => new Promise(resolve => { resolveOld = resolve; }));
    const { rerender } = render(page());
    const signal = BadgeService.getUserBadges.mock.calls[0][1].signal;
    mockUsername = "bob";
    BadgeService.getUserBadges.mockResolvedValue({ results: [], recent_badges: [], count: 0, total_badges: 0 });
    rerender(page());
    await screen.findByText("Hozircha yutuqlar mavjud emas");
    expect(signal.aborted).toBe(true);
    expect(screen.getByText("Bu foydalanuvchi hali yutuqlarga ega emas.")).toBeVisible();
    await act(async () => resolveOld(response([item(99, "Old owner's reward")])));
    expect(screen.queryByText("Old owner's reward")).not.toBeInTheDocument();
    expect(BadgeService.getUserBadges).toHaveBeenLastCalledWith("bob", expect.anything());
});

test("StrictMode request cancellation recovers and keyboard navigation reaches achievements", async () => {
    render(<React.StrictMode>{page()}</React.StrictMode>);
    await screen.findByText("Award 15");
    fireEvent.keyDown(screen.getByRole("tab", { name: "Loyihalar" }), { key: "End" });
    expect(screen.getByRole("tab", { name: "Yutuqlar" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Yutuqlar kolleksiyasi")).toBeVisible();
    expect(store.getState().badge.collection.status).toBe("success");
});

test("Daily Gift grant and recovered compensation refresh authoritative list once", async () => {
    render(page());
    await screen.findByText("Award 15");
    BadgeService.getUserBadges.mockResolvedValue(response([item(16)], 16));
    act(() => store.dispatch(claimDailyGift.fulfilled({ data: { reward: { type: "achievement" } } }, "claim", {})));
    await screen.findByText("Award 15");
    await waitFor(() => expect(BadgeService.getUserBadges).toHaveBeenCalledTimes(2));
    fireEvent.click(screen.getByRole("tab", { name: "Yutuqlar" }));
    await screen.findByRole("button", { name: "Award 16 — batafsil" });
    act(() => store.dispatch(claimDailyGift.fulfilled({ data: { already_claimed: true, reward: { type: "coin", is_compensation: true } } }, "recovery", {})));
    await waitFor(() => expect(BadgeService.getUserBadges).toHaveBeenCalledTimes(3));
    await screen.findByRole("button", { name: "Award 16 — batafsil" });
    expect(store.getState().badge.collection.count).toBe(16);
});


test.each([
    ["2026-11-20T12:00:00Z", "20 noyabr 2026"],
    ["2026-10-22T12:00:00Z", "22 oktabr 2026"],
    ["2026-10-19T12:00:00Z", "19 oktabr 2026"],
    ["2026-10-02T12:00:00Z", "02 oktabr 2026"],
    [null, "Sana ko‘rsatilmagan"],
    ["invalid-date", "Sana ko‘rsatilmagan"],
])("awarded date is consistent in sidebar, card and modal: %s", async (awarded_at, expected) => {
    const earned = { ...item(1), awarded_at, badge: { ...item(1).badge, created_at: "2020-01-01" } };
    BadgeService.getUserBadges.mockResolvedValue({ results: [earned], recent_badges: [earned], count: 1, total_badges: 1 });
    render(page());
    const sidebar = screen.getByRole("region", { name: "So‘nggi yutuqlar" });
    await within(sidebar).findByText(expected);
    fireEvent.click(screen.getByRole("button", { name: "Barcha yutuqlarni ko‘rish" }));
    const card = screen.getByRole("button", { name: "Award 1 — batafsil" });
    expect(within(card).getByText(expected)).toBeVisible();
    fireEvent.click(card);
    expect(within(screen.getByRole("dialog")).getByText(expected)).toBeVisible();
    expect(screen.queryByText("Invalid Date")).not.toBeInTheDocument();
    expect(within(sidebar).getByText(expected).getAttribute("datetime")).toBe(
        expected === "Sana ko‘rsatilmagan" ? null : awarded_at
    );
});

test.each([1, 2])("sidebar shows only the %i actual awards with a missing-image fallback", async count => {
    const awards = Array.from({ length: count }, (_, index) => ({ ...item(index + 1), badge: { ...item(index + 1).badge, image: null } }));
    BadgeService.getUserBadges.mockResolvedValue({ results: awards, recent_badges: awards, count, total_badges: count });
    render(page());
    const sidebar = screen.getByRole("region", { name: "So‘nggi yutuqlar" });
    await within(sidebar).findByText("Award 1");
    expect(within(sidebar).getAllByRole("listitem")).toHaveLength(count);
    expect(within(sidebar).getByRole("img", { name: "Award 1 belgisi" })).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Barcha yutuqlarni ko‘rish" }));
    expect(within(screen.getByRole("button", { name: "Award 1 — batafsil" })).getByRole("img", { name: "Award 1 belgisi" })).toBeVisible();
});
