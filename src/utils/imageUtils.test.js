import { DefaultUserImage, getUserAvatarUrl } from "./imageUtils";

jest.mock("../services/config", () => ({ BACKEND_URL: "https://backend.test" }));

test.each([
  [{ image: "/media/a.jpg" }, "https://backend.test/media/a.jpg"],
  [{ image: { url: "/media/a.jpg" } }, "https://backend.test/media/a.jpg"],
  [{ avatar: { url: "https://cdn.test/a.jpg" } }, "https://cdn.test/a.jpg"],
  [{ image_url: " //cdn.test/a.jpg " }, `${window.location.protocol}//cdn.test/a.jpg`],
  [{ image: {}, avatar: { url: " /media/a.jpg " } }, "https://backend.test/media/a.jpg"],
  [{ image: "  ", image_url: "/media/a.jpg" }, "https://backend.test/media/a.jpg"],
  [{ image: 42 }, DefaultUserImage],
  [{ image: { url: {} } }, DefaultUserImage],
  [{ image: DefaultUserImage }, DefaultUserImage],
  [{ avatar: "data:image/png;base64,abc" }, "data:image/png;base64,abc"],
  [{ photo: "blob:local" }, "blob:local"],
  [null, DefaultUserImage],
  ["invalid-user", DefaultUserImage],
])("normalizes avatar data %p", (user, expected) => {
  expect(getUserAvatarUrl(user)).toBe(expected);
});

test("a caller's empty fallback is preserved for initials avatars", () => {
  expect(getUserAvatarUrl({ image: {} }, "")).toBe("");
});
