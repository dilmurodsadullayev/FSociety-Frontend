/* eslint-disable testing-library/no-node-access, testing-library/no-container -- Decorative overlay geometry and fallback images have no accessible role of their own. */
import React, { StrictMode } from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import PublicFramedAvatar from "./PublicFramedAvatar";
import { DefaultUserImage } from "../../utils/imageUtils";

jest.mock("../../services/config", () => ({
  API_URL: "https://backend.test/api/",
  BACKEND_URL: "https://backend.test",
}));

const equipped = {
  code: "fs-winter-royal-2027",
  name: "Winter Royal",
  image_url: "/media/winter.png",
  rarity: "legendary",
};
const response = (frame = null, status = 200) => ({
  ok: status < 400,
  status,
  json: async () => ({ equipped_frame: frame }),
});
const refresh = () => act(() => {
  window.dispatchEvent(new Event("fsociety:frame-updated"));
});
const frameImage = (container) => container.querySelector('img[aria-hidden="true"]');
const flush = async () => act(async () => { await Promise.resolve(); });

let originalFetch;
beforeAll(() => { originalFetch = global.fetch; });
beforeEach(() => {
  refresh();
  global.fetch = jest.fn().mockResolvedValue(response());
});
afterAll(() => { global.fetch = originalFetch; });

test("15 avatars and StrictMode share one normalized pending request and cache", async () => {
  const props = { username: "  Alice  ", avatarUrl: "/media/alice.jpg" };
  const view = render(<StrictMode>{Array.from({ length: 15 }, (_, id) => (
    <PublicFramedAvatar key={id} {...props} />
  ))}</StrictMode>);
  await flush();
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith("https://backend.test/api/users/Alice/equipped-frame/", expect.objectContaining({ credentials: "omit" }));
  view.rerender(<PublicFramedAvatar {...props} username="alice" />);
  await flush();
  expect(fetch).toHaveBeenCalledTimes(1);
});

test.each([undefined, null, "", "   ", 42])("missing username %p makes no request", async (username) => {
  render(<PublicFramedAvatar username={username} />);
  await flush();
  expect(fetch).not.toHaveBeenCalled();
});

test("disabled frame makes no request", async () => {
  render(<PublicFramedAvatar username="alice" showFrame={false} />);
  await flush();
  expect(fetch).not.toHaveBeenCalled();
});

test.each([200, 404, 500])("no frame or HTTP %i keeps the plain avatar", async (status) => {
  fetch.mockResolvedValue(response(null, status));
  const { container } = render(<PublicFramedAvatar username="alice" avatarUrl="/media/a.jpg" />);
  await flush();
  expect(frameImage(container)).toBeNull();
  expect(container.querySelector("img")).toHaveAttribute("src", "https://backend.test/media/a.jpg");
  expect(container.querySelector("img").parentElement).toHaveClass("rounded-xl");
});

test("network failure falls back and caches errors", async () => {
  fetch.mockRejectedValue(new Error("offline"));
  const view = render(<PublicFramedAvatar username="alice" />);
  await flush();
  view.unmount();
  const { container } = render(<PublicFramedAvatar username="alice" />);
  await flush();
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(frameImage(container)).toBeNull();
});

test("PNG load applies existing Winter alignment without rotation", async () => {
  fetch.mockResolvedValue(response(equipped));
  const { container } = render(<PublicFramedAvatar username="alice" />);
  await waitFor(() => expect(frameImage(container)).not.toBeNull());
  const overlay = frameImage(container);
  const avatar = container.querySelector('span[aria-hidden="true"]');
  expect(avatar).toHaveStyle({ width: "100%", left: "50%" });
  fireEvent.load(overlay);
  expect(avatar).toHaveStyle({ width: "81%", left: "44.75%" });
  expect(parseFloat(avatar.style.top)).toBeCloseTo(45.8);
  expect(overlay).toHaveStyle({ width: "150%", transform: "translate(-50%, -50%)" });
  expect(screen.getByRole("img")).toHaveAccessibleName("alice avatari — Winter Royal");
});

test("broken PNG preserves the full plain avatar", async () => {
  fetch.mockResolvedValue(response(equipped));
  const { container } = render(<PublicFramedAvatar username="alice" />);
  await waitFor(() => expect(frameImage(container)).not.toBeNull());
  fireEvent.error(frameImage(container));
  expect(frameImage(container)).toBeNull();
  expect(container.querySelector('span[aria-hidden="true"]')).toHaveStyle({ width: "100%" });
});

test("missing and broken avatar fall back, including a failed default image", () => {
  const { container, rerender } = render(<PublicFramedAvatar displayName="Alice" />);
  expect(container.querySelector("img")).toHaveAttribute("src", DefaultUserImage);
  rerender(<PublicFramedAvatar displayName="Alice" avatarUrl={{ url: "/broken.jpg" }} />);
  fireEvent.error(container.querySelector("img"));
  expect(container.querySelector("img")).toHaveAttribute("src", DefaultUserImage);
  fireEvent.error(container.querySelector("img"));
  expect(container.querySelector("img")).toBeNull();
  expect(screen.getByText("A")).toBeInTheDocument();
});

test("username changes cannot display a previous user's late frame", async () => {
  let resolveAlice;
  fetch.mockImplementationOnce(() => new Promise((resolve) => { resolveAlice = resolve; }));
  const { container, rerender } = render(<PublicFramedAvatar username="alice" />);
  rerender(<PublicFramedAvatar username="bob" />);
  await flush();
  await act(async () => resolveAlice(response(equipped)));
  expect(frameImage(container)).toBeNull();
  expect(screen.getByRole("img")).toHaveAccessibleName("bob avatari");
});

test("equip/unequip refreshes all mounted avatars with one request", async () => {
  const view = render(<><PublicFramedAvatar username="alice" /><PublicFramedAvatar username="alice" /></>);
  await flush();
  fetch.mockResolvedValue(response(equipped));
  refresh();
  await waitFor(() => expect(view.container.querySelectorAll('img[aria-hidden="true"]')).toHaveLength(2));
  expect(fetch).toHaveBeenCalledTimes(2);
  fetch.mockResolvedValue(response());
  refresh();
  await waitFor(() => expect(frameImage(view.container)).toBeNull());
  expect(fetch).toHaveBeenCalledTimes(3);
});

test("an update rejects stale pending responses and unmount removes the listener", async () => {
  let resolveOld;
  fetch.mockImplementationOnce(() => new Promise((resolve) => { resolveOld = resolve; }));
  const removeListener = jest.spyOn(window, "removeEventListener");
  const view = render(<PublicFramedAvatar username="alice" />);
  refresh();
  await flush();
  await act(async () => resolveOld(response(equipped)));
  expect(frameImage(view.container)).toBeNull();
  view.unmount();
  expect(removeListener).toHaveBeenCalledWith("fsociety:frame-updated", expect.any(Function));
  refresh();
  render(<PublicFramedAvatar username="bob" />).unmount();
  await flush();
  removeListener.mockRestore();
});

test("equipped-frame cache expires after five minutes", async () => {
  const now = jest.spyOn(Date, "now").mockReturnValue(1000);
  fetch.mockResolvedValue(response(equipped));
  try {
    const { unmount: unmountFirst } = render(<PublicFramedAvatar username="alice" />);
    await flush();
    unmountFirst();
    now.mockReturnValue(2000);
    const { unmount: unmountSecond } = render(<PublicFramedAvatar username="alice" />);
    await flush();
    expect(fetch).toHaveBeenCalledTimes(1);
    unmountSecond();
    now.mockReturnValue(302000);
    render(<PublicFramedAvatar username="alice" />);
    await flush();
    expect(fetch).toHaveBeenCalledTimes(2);
  } finally {
    now.mockRestore();
  }
});

test("a stalled frame request aborts after ten seconds and leaves the avatar usable", async () => {
  jest.useFakeTimers();
  fetch.mockImplementation((url, { signal }) => new Promise((resolve, reject) => {
    signal.addEventListener("abort", () => reject(new Error("aborted")), { once: true });
  }));
  try {
    const { container } = render(<PublicFramedAvatar username="alice" avatarUrl="/media/a.jpg" />);
    await act(async () => { jest.advanceTimersByTime(10000); });
    expect(fetch.mock.calls[0][1].signal.aborted).toBe(true);
    expect(frameImage(container)).toBeNull();
    expect(container.querySelector("img")).toHaveAttribute("src", "https://backend.test/media/a.jpg");
  } finally {
    jest.useRealTimers();
  }
});
