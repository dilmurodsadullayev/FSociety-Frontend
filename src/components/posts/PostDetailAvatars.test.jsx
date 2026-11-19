/* eslint-disable testing-library/no-node-access, testing-library/no-container -- Verify decorative frames, nested link structure, and absence of anonymized identity in the DOM. */
import React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { configureStore } from "@reduxjs/toolkit";
import { Provider, useSelector } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import postReducer, { buildPostCommentTree } from "../../features/posts";
import PostDetailHero from "./postDetail/PostDetailHero";
import PostDetailSidebar from "./postDetail/PostDetailSidebar";
import PostCommentItem from "./comments/PostCommentItem";
import PostCommentForm from "./comments/PostCommentForm";
import PostService from "../../services/post";

jest.mock("react-router-dom", () => {
  global.TextEncoder = require("util").TextEncoder;
  global.TextDecoder = require("util").TextDecoder;
  // CRA's Jest 27 resolver cannot resolve react-router-dom 7's exports-only
  // entry. These same real Link/MemoryRouter exports have a resolvable CJS main.
  return jest.requireActual("react-router");
}, { virtual: true });
jest.mock("../../services/config", () => ({
  API_URL: "https://backend.test/api",
  BACKEND_URL: "https://backend.test",
}));
jest.mock("../ui/AuthToast", () => ({
  siteToast: Object.fromEntries(["warning", "loading", "success", "error", "dismiss"].map((name) => [name, jest.fn()])),
}));
jest.mock("../../services/post", () => ({
  togglePostCommentLike: jest.fn(),
  updatePostComment: jest.fn(),
  deletePostComment: jest.fn(),
}));

const alice = { id: 1, username: "alice", first_name: "Alice", image: { url: "/media/alice.jpg" } };
const bob = { id: 2, username: "bob", first_name: "Bob", avatar: { url: "/media/bob.jpg" } };
const post = { id: 100, user: alice, title: "Frame integration", content: "Existing content", likes_count: 3 };
const comment = (id, user, parent = null) => ({
  id, user, parent, post: 100, message: `Comment ${id}`, likes_count: 0,
});
const frameResponse = () => ({
  ok: true,
  status: 200,
  json: async () => ({ equipped_frame: { code: "golden-root", name: "Golden Root", image: { url: "/media/golden.png" } } }),
});
const flush = async () => act(async () => { await Promise.resolve(); });
const originalFetch = global.fetch;
beforeEach(() => {
  jest.clearAllMocks();
  window.dispatchEvent(new Event("fsociety:frame-updated"));
  global.fetch = jest.fn().mockResolvedValue(frameResponse());
});
afterAll(() => { global.fetch = originalFetch; });

function renderThread(comments, props = {}) {
  const store = configureStore({
    reducer: { post: postReducer },
    preloadedState: { post: { ...postReducer(undefined, { type: "init" }), postDetail: post, comments } },
  });
  function Thread() {
    const items = useSelector((state) => state.post.comments);
    return buildPostCommentTree(items).map((item) => (
      <PostCommentItem key={item.id} comment={item} postAuthorUsername="alice" currentUser={alice} isLoggedIn {...props} />
    ));
  }
  return { ...render(<Provider store={store}><MemoryRouter><Thread /></MemoryRouter></Provider>), store };
}

test("hero and sidebar share the author's frame and preserve links/actions/content", async () => {
  const onCopy = jest.fn();
  const onLike = jest.fn();
  const { container } = render(<MemoryRouter>
    <PostDetailHero postData={post} onCopy={onCopy} />
    <PostDetailSidebar postData={post} onLike={onLike} />
  </MemoryRouter>);
  await flush();
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(container.querySelectorAll('img[aria-hidden="true"]')).toHaveLength(2);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(post.title);
  screen.getAllByRole("link").forEach((link) => expect(link).toHaveAttribute("href", "/alice/profile/"));
  expect(container.querySelector("a a")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Post havolasini nusxalash" }));
  expect(onCopy).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByRole("button", { name: /Like/i }));
  expect(onLike).toHaveBeenCalledTimes(1);
});

test("root, reply and deep replies use their own author with deduplicated requests", async () => {
  const items = [comment(1, alice), comment(2, bob, 1), comment(3, alice, 2), comment(4, bob, 3), comment(5, alice, 4)];
  const { container } = renderThread(items);
  await flush();
  expect(screen.queryByText("Comment 2")).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: /ta javobni ko‘rish/ })).toHaveAttribute("aria-expanded", "false");
  expect(fetch).toHaveBeenCalledTimes(1);
  for (let id = 2; id <= 5; id += 1) {
    fireEvent.click(screen.getByRole("button", { name: /ta javobni ko‘rish/ }));
    expect(screen.getByText(`Comment ${id}`)).toBeInTheDocument();
    expect(screen.queryByText(`Comment ${id + 1}`)).not.toBeInTheDocument();
  }
  await flush();
  expect(fetch).toHaveBeenCalledTimes(2);
  expect(container.querySelectorAll('img[aria-hidden="true"]')).toHaveLength(5);
  expect(screen.getAllByRole("img", { name: "Alice avatari" })).toHaveLength(3);
  expect(screen.getAllByRole("img", { name: "Bob avatari" })).toHaveLength(2);
  const bobAvatar = screen.getAllByRole("img", { name: "Bob avatari" })[0];
  expect(bobAvatar.querySelector("img")).toHaveAttribute("src", "https://backend.test/media/bob.jpg");
  expect(screen.getByText("Comment 5")).toBeInTheDocument();
  fireEvent.click(screen.getAllByRole("button", { name: "Javoblarni yashirish" })[0]);
  expect(screen.queryByText("Comment 5")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /ta javobni ko‘rish/ }));
  await flush();
  expect(screen.getByText("Comment 2")).toBeInTheDocument();
  expect(screen.queryByText("Comment 3")).not.toBeInTheDocument();
  expect(screen.queryByText("Comment 5")).not.toBeInTheDocument();
  expect(fetch).toHaveBeenCalledTimes(2);
});

test("page remount resets opened replies to the collapsed default", async () => {
  const items = [comment(1, alice), comment(2, bob, 1)];
  const { unmount } = renderThread(items);
  fireEvent.click(screen.getByRole("button", { name: /ta javobni ko‘rish/ }));
  expect(screen.getByText("Comment 2")).toBeInTheDocument();
  await flush();
  unmount();
  renderThread(items);
  await flush();
  expect(screen.queryByText("Comment 2")).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: /ta javobni ko‘rish/ })).toHaveAttribute("aria-expanded", "false");
});

test("deleted parents reveal no author/frame/profile while keeping replies", async () => {
  const secret = { id: 9, username: "private-user", first_name: "Secret", image: "/secret.jpg" };
  const { container } = renderThread([
    { ...comment(1, secret), is_deleted: true },
    comment(2, bob, 1),
  ]);
  await flush();
  expect(screen.queryByText("Comment 2")).not.toBeInTheDocument();
  expect(fetch).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: /ta javobni ko‘rish/ }));
  await flush();
  const deleted = container.querySelector("#post-comment-1");
  expect(deleted.querySelector(':scope > div a[href*="private-user"]')).toBeNull();
  expect(container.innerHTML).not.toContain("private-user");
  expect(container.innerHTML).not.toContain("secret.jpg");
  expect(screen.queryByText("Secret")).not.toBeInTheDocument();
  expect(screen.getByText("Comment 2")).toBeInTheDocument();
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch.mock.calls[0][0]).toContain("/bob/equipped-frame/");
});

test("a whitespace username keeps the normalized image without a fake profile or request", async () => {
  const { container } = renderThread([comment(1, { username: "   ", image_url: "/media/a.jpg" })]);
  await flush();
  expect(fetch).not.toHaveBeenCalled();
  expect(container.querySelector("a")).toBeNull();
  expect(container.querySelector("img")).toHaveAttribute("src", "https://backend.test/media/a.jpg");
});

test("logged-out composer ignores stale currentUser and blocks submission", async () => {
  const onSubmit = jest.fn();
  const { container } = render(<PostCommentForm currentUser={alice} isLoggedIn={false} onSubmit={onSubmit} />);
  fireEvent.click(screen.getByRole("button", { name: /fikringizni/ }));
  await flush();
  expect(fetch).not.toHaveBeenCalled();
  expect(container.querySelector("img")).toBeNull();
  expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  expect(onSubmit).not.toHaveBeenCalled();
});

test("composer keeps drafts, 255 limit and duplicate lock, clearing only after success", async () => {
  let finishSubmit;
  const onSubmit = jest.fn().mockResolvedValueOnce(false).mockImplementationOnce(() => new Promise((resolve) => { finishSubmit = resolve; }));
  render(<PostCommentForm currentUser={alice} isLoggedIn onSubmit={onSubmit} />);
  await flush();
  fireEvent.click(screen.getByRole("button", { name: /fikringizni/ }));
  let input = screen.getByRole("textbox");
  expect(input).toHaveAttribute("maxLength", "255");
  expect(input).toHaveFocus();
  fireEvent.change(input, { target: { value: "Saved draft" } });
  fireEvent.keyDown(input, { key: "Escape" });
  fireEvent.click(screen.getByRole("button", { name: /Saved draft/ }));
  input = screen.getByRole("textbox");
  expect(input).toHaveValue("Saved draft");
  fireEvent.keyDown(input, { key: "Enter", ctrlKey: true });
  await waitFor(() => expect(screen.getByRole("textbox")).not.toBeDisabled());
  expect(input).toHaveValue("Saved draft");
  fireEvent.keyDown(input, { key: "Enter", metaKey: true });
  fireEvent.submit(input.closest("form"));
  expect(onSubmit).toHaveBeenCalledTimes(2);
  await act(async () => finishSubmit(true));
  expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  expect(fetch).toHaveBeenCalledTimes(1);
});

test("composer replaces the current user's frame on account change/logout", async () => {
  const view = render(<PostCommentForm currentUser={alice} isLoggedIn />);
  await flush();
  expect(screen.getByRole("img", { name: "alice avatari" })).toBeInTheDocument();
  view.rerender(<PostCommentForm currentUser={bob} isLoggedIn />);
  expect(screen.queryByRole("img", { name: "alice avatari" })).not.toBeInTheDocument();
  await flush();
  expect(screen.getByRole("img", { name: "bob avatari" })).toBeInTheDocument();
  view.rerender(<PostCommentForm currentUser={bob} isLoggedIn={false} />);
  expect(screen.queryByRole("img")).not.toBeInTheDocument();
  expect(fetch).toHaveBeenCalledTimes(2);
});

test("comment like/unlike keeps the existing API and Redux behavior", async () => {
  PostService.togglePostCommentLike
    .mockResolvedValueOnce({ comment_id: 1, is_liked_by_user: true, likes_count: 1 })
    .mockResolvedValueOnce({ comment_id: 1, is_liked_by_user: false, likes_count: 0 });
  const { store } = renderThread([comment(1, bob)]);
  await flush();
  fireEvent.click(screen.getByRole("button", { name: "Sharhni yoqtirish" }));
  await waitFor(() => expect(screen.getByRole("button", { name: "Like'ni olib tashlash" })).not.toBeDisabled());
  expect(store.getState().post.comments[0].likes_count).toBe(1);
  fireEvent.click(screen.getByRole("button", { name: "Like'ni olib tashlash" }));
  await waitFor(() => expect(screen.getByRole("button", { name: "Sharhni yoqtirish" })).not.toBeDisabled());
  expect(store.getState().post.comments[0].likes_count).toBe(0);
  expect(PostService.togglePostCommentLike).toHaveBeenNthCalledWith(1, 1);
  expect(PostService.togglePostCommentLike).toHaveBeenNthCalledWith(2, 1);
});

test("reply targeting, draft preservation and owner edit controls remain available", async () => {
  const onReply = jest.fn().mockResolvedValueOnce(false).mockResolvedValueOnce(true);
  renderThread([comment(1, alice)], { onReply });
  await flush();
  fireEvent.click(screen.getByRole("button", { name: "Javob" }));
  const reply = screen.getByRole("textbox", { name: "Javob matni" });
  fireEvent.change(reply, { target: { value: "Reply draft" } });
  fireEvent.submit(reply.closest("form"));
  await flush();
  expect(reply).toHaveValue("Reply draft");
  fireEvent.submit(reply.closest("form"));
  await waitFor(() => expect(screen.queryByRole("textbox", { name: "Javob matni" })).not.toBeInTheDocument());
  expect(onReply).toHaveBeenNthCalledWith(1, "Reply draft", 1);
  fireEvent.click(screen.getByRole("button", { name: "Sharhni tahrirlash" }));
  expect(screen.getByRole("textbox")).toHaveValue("Comment 1");
  expect(screen.getByRole("button", { name: "Saqlash" })).toBeInTheDocument();
});

test("a non-owner cannot edit or delete another user's comment", async () => {
  renderThread([comment(1, bob)]);
  await flush();
  expect(screen.queryByRole("button", { name: "Sharhni tahrirlash" })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Sharhni o'chirish" })).not.toBeInTheDocument();
});

test("comment edit submits only message and updates Redux without losing the author", async () => {
  const original = comment(1, alice);
  PostService.updatePostComment.mockResolvedValue({ ...original, message: "Edited comment" });
  const { store } = renderThread([original]);
  await flush();
  fireEvent.click(screen.getByRole("button", { name: "Sharhni tahrirlash" }));
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "Edited comment" } });
  fireEvent.click(screen.getByRole("button", { name: "Saqlash" }));
  await waitFor(() => expect(screen.queryByRole("textbox")).not.toBeInTheDocument());
  expect(PostService.updatePostComment).toHaveBeenCalledWith(1, { message: "Edited comment" });
  expect(store.getState().post.comments[0].user).toEqual(alice);
  expect(screen.getByText("Edited comment")).toBeInTheDocument();
  expect(fetch).toHaveBeenCalledTimes(1);
});

test("delete modal soft-deletes the owner while preserving the child reply", async () => {
  PostService.deletePostComment.mockResolvedValue({ comment_id: 1, is_deleted: true });
  const { container, store } = renderThread([comment(1, alice), comment(2, bob, 1)]);
  await flush();
  fireEvent.click(screen.getByRole("button", { name: /ta javobni ko‘rish/ }));
  await flush();
  fireEvent.click(screen.getByRole("button", { name: "Sharhni o'chirish" }));
  fireEvent.click(await screen.findByRole("button", { name: "Ha, o‘chirish" }));
  await waitFor(() => expect(store.getState().post.comments[0].is_deleted).toBe(true));
  expect(PostService.deletePostComment).toHaveBeenCalledWith(1);
  expect(store.getState().post.comments[0].user).toBeNull();
  expect(screen.getByText("Comment 2")).toBeInTheDocument();
  expect(container.querySelector('a[href="/alice/profile/"]')).toBeNull();
  expect(fetch).toHaveBeenCalledTimes(2);
});
