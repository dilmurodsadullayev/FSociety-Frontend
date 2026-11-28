import { useEffect, useMemo, useState } from "react";

const monotonicNow = () => typeof performance === "undefined" ? Date.now() : performance.now();

export default function useEventCountdown(targetTime, serverTime, receivedAtMs) {
    const target = Date.parse(targetTime ?? "");
    const server = Date.parse(serverTime ?? "");
    const anchor = useMemo(() => ({
        time: Number.isFinite(server) && Number.isFinite(receivedAtMs)
            ? server + Math.max(0, Date.now() - receivedAtMs) : Date.now(),
        monotonic: monotonicNow(),
    }), [server, receivedAtMs]);
    const [, setTick] = useState(0);
    useEffect(() => {
        if (!Number.isFinite(target)) return undefined;
        const update = () => setTick((value) => value + 1);
        const timer = window.setInterval(update, 1000);
        window.addEventListener("focus", update);
        return () => { window.clearInterval(timer); window.removeEventListener("focus", update); };
    }, [target]);
    // Elapsed time comes from a monotonic clock, independent of wall-clock changes.
    if (!Number.isFinite(target)) return null;
    const remaining = Math.max(0, Math.ceil((target - anchor.time - (monotonicNow() - anchor.monotonic)) / 1000));
    const pad = (n) => String(n).padStart(2, "0");
    const days = Math.floor(remaining / 86400);
    return {
        remaining, expired: remaining === 0,
        text: `${days ? `${days} kun ` : ""}${pad(Math.floor(remaining % 86400 / 3600))}:${pad(Math.floor(remaining % 3600 / 60))}:${pad(remaining % 60)}`,
    };
}
