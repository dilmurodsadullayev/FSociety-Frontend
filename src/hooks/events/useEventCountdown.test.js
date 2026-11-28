import { act, renderHook } from "@testing-library/react";
import useEventCountdown from "./useEventCountdown";

afterEach(() => { jest.restoreAllMocks(); jest.useRealTimers(); });

test("server clock wins over browser date and wall-clock drift", () => {
    jest.useFakeTimers("modern");
    jest.setSystemTime(new Date("2030-01-01T00:00:00Z"));
    let elapsed = 0;
    jest.spyOn(performance, "now").mockImplementation(() => elapsed);
    const { result } = renderHook(() => useEventCountdown("2026-12-20T19:00:00Z", "2026-12-20T18:59:50Z", Date.parse("2030-01-01T00:00:00Z")));
    expect(result.current.text).toBe("00:00:10");
    jest.setSystemTime(new Date("2040-01-01T00:00:00Z"));
    elapsed = 5000;
    act(() => jest.advanceTimersByTime(1000));
    expect(result.current.text).toBe("00:00:05");
    elapsed = 11000;
    act(() => jest.advanceTimersByTime(1000));
    expect(result.current.expired).toBe(true);
    expect(result.current.text).toBe("00:00:00");
});

test("invalid and past timestamps never create negative countdowns", () => {
    const { result, rerender } = renderHook(({ target }) => useEventCountdown(target, "2026-12-20T19:00:01Z", Date.now()), { initialProps: { target: "bad" } });
    expect(result.current).toBeNull();
    rerender({ target: "2026-12-20T19:00:00Z" });
    expect(result.current.remaining).toBe(0);
});
