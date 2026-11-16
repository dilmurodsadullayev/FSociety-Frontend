import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    useNewYear,
} from "../context/NewYearContext";

import {
    DEFAULT_WINTER_TRACK_ID,
    getWinterTrackById,
    getAvailableWinterTracks,
} from "../data/winterTracks";

// =========================================================
// FSOCIETY — WINTER AUDIO HOOK
// =========================================================
//
// Location:
//
// src/features/newYear/hooks/useWinterAudio.js
//
// Responsibilities:
//
// - Single HTMLAudioElement
// - Automatic initial playback
// - Browser autoplay recovery
// - Play / Pause
// - Automatic next track
// - Previous / Next track selection
// - Track switching
// - Playback progress
// - Audio duration
// - Volume control
// - Loading state
// - Audio error handling & recovery
// - Playback position persistence
// - Last track restoration
// - NewYearContext integration
//
// IMPORTANT:
//
// - One audio instance only.
// - Audio playback is controlled externally.
// - Music settings persist in localStorage.
// - Playback survives sidebar closing when this hook
//   remains mounted in a persistent component.
// - Disabling music stops playback.
// - Browser autoplay restrictions are respected.
//
// =========================================================


// =========================================================
// CONSTANTS
// =========================================================

const PLAYBACK_STORAGE_KEY =
    "fsociety-winter-playback-v1";

const PLAYBACK_SAVE_INTERVAL = 4000;


// =========================================================
// HELPERS
// =========================================================

const normalizeVolume = (volume) => {
    const value = Number(volume);

    if (!Number.isFinite(value)) {
        return 0.7;
    }

    return Math.min(
        1,
        Math.max(0, value)
    );
};


// =========================================================
// LOAD SAVED PLAYBACK
// =========================================================

const loadSavedPlayback = () => {
    if (typeof window === "undefined") {
        return null;
    }

    try {
        const saved = window.localStorage.getItem(
            PLAYBACK_STORAGE_KEY
        );

        if (!saved) {
            return null;
        }

        const parsed = JSON.parse(saved);

        if (
            !parsed ||
            typeof parsed !== "object" ||
            typeof parsed.trackId !== "string"
        ) {
            return null;
        }

        const currentTime = Number(
            parsed.currentTime
        );

        return {
            trackId: parsed.trackId,

            currentTime:
                Number.isFinite(currentTime) &&
                currentTime >= 0
                    ? currentTime
                    : 0,
        };
    } catch {
        return null;
    }
};


// =========================================================
// SAVE PLAYBACK
// =========================================================

const savePlayback = (
    trackId,
    currentTime
) => {
    if (
        typeof window === "undefined" ||
        typeof trackId !== "string" ||
        !trackId.trim()
    ) {
        return;
    }

    const safeTime =
        Number.isFinite(currentTime) &&
        currentTime >= 0
            ? currentTime
            : 0;

    try {
        window.localStorage.setItem(
            PLAYBACK_STORAGE_KEY,
            JSON.stringify({
                trackId,
                currentTime: safeTime,
                savedAt: Date.now(),
            })
        );
    } catch {
        // Ignore localStorage errors.
        // Playback must continue working in memory.
    }
};


// =========================================================
// MAIN HOOK
// =========================================================

export function useWinterAudio() {

    // =======================================================
    // NEW YEAR CONTEXT
    // =======================================================

    const {
        settings,
        setSetting,
    } = useNewYear();


    // =======================================================
    // AUDIO REF
    // =======================================================

    const audioRef = useRef(null);


    // =======================================================
    // PLAYBACK REFS
    // =======================================================

    const playbackIntentRef = useRef(
        Boolean(settings.musicEnabled)
    );

    const musicEnabledRef = useRef(
        settings.musicEnabled
    );

    const volumeRef = useRef(
        normalizeVolume(settings.volume)
    );

    const tracksRef = useRef([]);

    const currentTrackRef = useRef(null);


    // =======================================================
    // PLAYBACK RESTORATION REFS
    // =======================================================

    const savedPlaybackRef = useRef(undefined);

    if (savedPlaybackRef.current === undefined) {
        savedPlaybackRef.current = loadSavedPlayback();
    }

    const restoreInitializedRef = useRef(false);

    const pendingRestoreRef = useRef(null);

    const loadedTrackIdRef = useRef(null);


    // =======================================================
    // PERSISTENCE REFS
    // =======================================================

    const currentTimeRef = useRef(0);

    const lastSavedAtRef = useRef(0);


    // =======================================================
    // KEEP CURRENT SETTINGS AVAILABLE
    // =======================================================

    musicEnabledRef.current =
        settings.musicEnabled;

    volumeRef.current =
        normalizeVolume(settings.volume);


    // =======================================================
    // LOCAL AUDIO STATE
    // =======================================================

    const [
        isPlaying,
        setIsPlaying,
    ] = useState(false);

    const [
        isLoading,
        setIsLoading,
    ] = useState(false);

    const [
        currentTime,
        setCurrentTime,
    ] = useState(0);

    const [
        duration,
        setDuration,
    ] = useState(0);

    const [
        error,
        setError,
    ] = useState(null);


    // =======================================================
    // AVAILABLE TRACKS
    // =======================================================

    const tracks = useMemo(
        () => getAvailableWinterTracks(),
        []
    );

    tracksRef.current = tracks;


    // =======================================================
    // CURRENT TRACK
    // =======================================================

    const currentTrack = useMemo(() => {
        const selectedTrack =
            getWinterTrackById(
                settings.selectedTrackId
            );

        if (selectedTrack?.enabled) {
            return selectedTrack;
        }

        return (
            getWinterTrackById(
                DEFAULT_WINTER_TRACK_ID
            ) ??
            tracks[0] ??
            null
        );
    }, [
        settings.selectedTrackId,
        tracks,
    ]);

    currentTrackRef.current = currentTrack;


    // =======================================================
    // PERSIST CURRENT PLAYBACK
    // =======================================================

    const persistPlayback = useCallback(
        (trackId, time) => {
            savePlayback(trackId, time);

            lastSavedAtRef.current = Date.now();
        },
        []
    );


    const persistCurrentPlayback = useCallback(() => {
        const audio = audioRef.current;

        const trackId = loadedTrackIdRef.current;

        if (!trackId) {
            return;
        }

        const time =
            audio &&
            Number.isFinite(audio.currentTime)
                ? audio.currentTime
                : currentTimeRef.current;

        persistPlayback(trackId, time);
    }, [
        persistPlayback,
    ]);


    // =======================================================
    // ATTEMPT PLAYBACK
    // =======================================================
    //
    // This function is shared by:
    //
    // - Initial automatic playback
    // - Browser autoplay recovery
    // - Play button
    // - Music enable
    //
    // NotAllowedError is treated specially.
    // The playback intention remains active so that
    // a later user interaction can start the music.
    //
    // =======================================================

    const attemptPlayback = useCallback(
        async (audio = audioRef.current) => {

            if (
                !audio ||
                !audio.src ||
                !musicEnabledRef.current ||
                !playbackIntentRef.current
            ) {
                return false;
            }

            try {
                setError(null);

                const playPromise = audio.play();

                if (
                    playPromise &&
                    typeof playPromise.then === "function"
                ) {
                    await playPromise;
                }

                return true;

            } catch (err) {
                if (err?.name === "AbortError") {
                    return false;
                }

                setIsPlaying(false);

                setIsLoading(false);

                if (err?.name === "NotAllowedError") {

                    // Browser requires user interaction.
                    // Keep playback intention active.

                    setError(
                        "Musiqani boshlash uchun sahifada bir marta bosing."
                    );

                    return false;
                }

                setError(
                    "Musiqani ijro etib bo‘lmadi. Audio faylini tekshiring."
                );

                return false;
            }
        },
        []
    );


    // =======================================================
    // AUDIO INITIALIZATION
    // =======================================================

    useEffect(() => {
        if (
            typeof window === "undefined" ||
            typeof window.Audio !== "function"
        ) {
            return undefined;
        }

        const audio = new Audio();

        audio.preload = "metadata";

        audio.volume = volumeRef.current;

        audio.loop = false;

        audioRef.current = audio;


        // =====================================================
        // INITIAL PLAYBACK INTENTION
        // =====================================================

        if (musicEnabledRef.current) {
            playbackIntentRef.current = true;
        }


        // =====================================================
        // PLAY EVENT
        // =====================================================

        const handlePlay = () => {
            setIsPlaying(true);

            setError(null);
        };


        // =====================================================
        // PLAYING EVENT
        // =====================================================

        const handlePlaying = () => {
            setIsPlaying(true);

            setIsLoading(false);

            setError(null);
        };


        // =====================================================
        // PAUSE EVENT
        // =====================================================

        const handlePause = () => {
            persistCurrentPlayback();

            setIsPlaying(false);

            setIsLoading(false);
        };


        // =====================================================
        // WAITING EVENT
        // =====================================================

        const handleWaiting = () => {
            if (playbackIntentRef.current) {
                setIsLoading(true);
            }
        };


        // =====================================================
        // TIME UPDATE
        // =====================================================

        const handleTimeUpdate = () => {
            const nextTime =
                Number.isFinite(audio.currentTime)
                    ? audio.currentTime
                    : 0;

            currentTimeRef.current = nextTime;

            setCurrentTime(nextTime);

            // Avoid writing to localStorage on every
            // single audio timeupdate event.

            const now = Date.now();

            if (
                now - lastSavedAtRef.current >=
                PLAYBACK_SAVE_INTERVAL
            ) {
                persistCurrentPlayback();
            }
        };


        // =====================================================
        // METADATA LOADED
        // =====================================================

        const handleLoadedMetadata = () => {
            setDuration(
                Number.isFinite(audio.duration)
                    ? audio.duration
                    : 0
            );

            setIsLoading(false);
        };


        // =====================================================
        // DURATION CHANGE
        // =====================================================

        const handleDurationChange = () => {
            setDuration(
                Number.isFinite(audio.duration)
                    ? audio.duration
                    : 0
            );
        };


        // =====================================================
        // CAN PLAY
        // =====================================================

        const handleCanPlay = () => {
            setIsLoading(false);
        };


        // =====================================================
        // LOAD START
        // =====================================================

        const handleLoadStart = () => {
            if (playbackIntentRef.current) {
                setIsLoading(true);
            }
        };


        // =====================================================
        // SUSPEND EVENT
        // =====================================================

        const handleSuspend = () => {
            if (audio.paused) {
                setIsLoading(false);
            }
        };


        // =====================================================
        // ENDED EVENT
        // =====================================================
        //
        // When a track finishes:
        //
        // 1. Check playback intention.
        // 2. Check whether music is enabled.
        // 3. Select next available track.
        // 4. Source effect starts the next track.
        //
        // =====================================================

        const handleEnded = () => {
            persistCurrentPlayback();

            setIsPlaying(false);

            setIsLoading(false);

            currentTimeRef.current = 0;

            setCurrentTime(0);

            if (
                !playbackIntentRef.current ||
                !musicEnabledRef.current
            ) {
                playbackIntentRef.current = false;

                return;
            }

            const availableTracks =
                tracksRef.current;

            const activeTrack =
                currentTrackRef.current;

            if (!availableTracks.length) {
                playbackIntentRef.current = false;

                return;
            }


            // FIND CURRENT TRACK

            const currentIndex =
                availableTracks.findIndex(
                    (track) =>
                        track.id === activeTrack?.id
                );


            // SELECT NEXT TRACK

            const nextIndex =
                currentIndex < 0 ||
                currentIndex >= availableTracks.length - 1
                    ? 0
                    : currentIndex + 1;

            const nextTrack =
                availableTracks[nextIndex];

            if (!nextTrack) {
                playbackIntentRef.current = false;

                return;
            }


            // Continue automatically.

            setSetting(
                "selectedTrackId",
                nextTrack.id
            );
        };


        // =====================================================
        // AUDIO ERROR
        // =====================================================

        const handleError = () => {
            playbackIntentRef.current = false;

            persistCurrentPlayback();

            setIsPlaying(false);

            setIsLoading(false);

            setError(
                "Audio faylini yuklab bo‘lmadi. MP3 fayl mavjudligini tekshiring."
            );
        };


        // =====================================================
        // USER INTERACTION — AUTOPLAY RECOVERY
        // =====================================================
        //
        // If automatic playback was blocked by the browser,
        // the first user click attempts playback again.
        //
        // The listener is attached to document in bubble
        // phase, allowing React button handlers to run first.
        //
        // =====================================================

        const handleFirstUserInteraction = () => {
            if (
                !musicEnabledRef.current ||
                !playbackIntentRef.current
            ) {
                return;
            }

            const activeAudio = audioRef.current;

            if (
                !activeAudio ||
                !activeAudio.src ||
                !activeAudio.paused
            ) {
                return;
            }

            attemptPlayback(activeAudio);
        };


        // =====================================================
        // PAGE HIDE — SAVE PLAYBACK POSITION
        // =====================================================

        const handlePageHide = () => {
            persistCurrentPlayback();
        };


        // =====================================================
        // REGISTER AUDIO EVENTS
        // =====================================================

        audio.addEventListener(
            "play",
            handlePlay
        );

        audio.addEventListener(
            "playing",
            handlePlaying
        );

        audio.addEventListener(
            "pause",
            handlePause
        );

        audio.addEventListener(
            "waiting",
            handleWaiting
        );

        audio.addEventListener(
            "timeupdate",
            handleTimeUpdate
        );

        audio.addEventListener(
            "loadedmetadata",
            handleLoadedMetadata
        );

        audio.addEventListener(
            "durationchange",
            handleDurationChange
        );

        audio.addEventListener(
            "canplay",
            handleCanPlay
        );

        audio.addEventListener(
            "loadstart",
            handleLoadStart
        );

        audio.addEventListener(
            "suspend",
            handleSuspend
        );

        audio.addEventListener(
            "ended",
            handleEnded
        );

        audio.addEventListener(
            "error",
            handleError
        );


        // =====================================================
        // REGISTER GLOBAL EVENTS
        // =====================================================

        document.addEventListener(
            "click",
            handleFirstUserInteraction
        );

        window.addEventListener(
            "pagehide",
            handlePageHide
        );


        // =====================================================
        // CLEANUP
        // =====================================================

        return () => {
            persistCurrentPlayback();

            playbackIntentRef.current = false;

            audio.pause();

            audio.removeEventListener(
                "play",
                handlePlay
            );

            audio.removeEventListener(
                "playing",
                handlePlaying
            );

            audio.removeEventListener(
                "pause",
                handlePause
            );

            audio.removeEventListener(
                "waiting",
                handleWaiting
            );

            audio.removeEventListener(
                "timeupdate",
                handleTimeUpdate
            );

            audio.removeEventListener(
                "loadedmetadata",
                handleLoadedMetadata
            );

            audio.removeEventListener(
                "durationchange",
                handleDurationChange
            );

            audio.removeEventListener(
                "canplay",
                handleCanPlay
            );

            audio.removeEventListener(
                "loadstart",
                handleLoadStart
            );

            audio.removeEventListener(
                "suspend",
                handleSuspend
            );

            audio.removeEventListener(
                "ended",
                handleEnded
            );

            audio.removeEventListener(
                "error",
                handleError
            );

            document.removeEventListener(
                "click",
                handleFirstUserInteraction
            );

            window.removeEventListener(
                "pagehide",
                handlePageHide
            );

            audio.removeAttribute("src");

            audio.load();

            if (audioRef.current === audio) {
                audioRef.current = null;
            }
        };

    }, [
        attemptPlayback,
        persistCurrentPlayback,
        setSetting,
    ]);


    // =======================================================
    // TRACK SOURCE MANAGEMENT
    // =======================================================
    //
    // This effect handles:
    //
    // - Track selection
    // - Restoring the previous track
    // - Loading a new audio source
    // - Restoring playback position
    // - Resuming active playback
    // - Avoiding unintended track switching
    //
    // =======================================================

    useEffect(() => {
        const audio = audioRef.current;

        if (!audio || !currentTrack) {
            return undefined;
        }


        // =====================================================
        // INITIAL PLAYBACK RESTORATION
        // =====================================================

        if (!restoreInitializedRef.current) {
            restoreInitializedRef.current = true;

            const savedPlayback =
                savedPlaybackRef.current;

            const savedTrack =
                savedPlayback
                    ? getWinterTrackById(
                        savedPlayback.trackId
                    )
                    : null;

            if (savedTrack) {
                pendingRestoreRef.current = {
                    trackId: savedTrack.id,

                    currentTime:
                        savedPlayback.currentTime,
                };

                // Restore the previous track before
                // loading the initial default track.

                if (savedTrack.id !== currentTrack.id) {
                    setSetting(
                        "selectedTrackId",
                        savedTrack.id
                    );

                    return undefined;
                }
            }
        }


        // =====================================================
        // PLAYBACK INTENTION
        // =====================================================

        const shouldResume =
            playbackIntentRef.current &&
            musicEnabledRef.current;


        // =====================================================
        // SAVE PREVIOUS TRACK POSITION
        // =====================================================

        persistCurrentPlayback();


        // =====================================================
        // STOP PREVIOUS SOURCE
        // =====================================================

        audio.pause();

        setCurrentTime(0);

        currentTimeRef.current = 0;

        setDuration(0);

        setError(null);

        setIsLoading(shouldResume);

        setIsPlaying(false);


        // =====================================================
        // SET ACTIVE TRACK
        // =====================================================

        loadedTrackIdRef.current =
            currentTrack.id;


        // =====================================================
        // RESTORE POSITION FOR CURRENT TRACK
        // =====================================================

        const pendingRestore =
            pendingRestoreRef.current;

        if (
            pendingRestore?.trackId === currentTrack.id
        ) {
            persistPlayback(
                currentTrack.id,
                pendingRestore.currentTime
            );
        } else {
            persistPlayback(
                currentTrack.id,
                0
            );
        }


        // =====================================================
        // SET AUDIO SOURCE
        // =====================================================

        audio.src = currentTrack.audioSrc;


        // =====================================================
        // EFFECT CANCELLATION
        // =====================================================

        let cancelled = false;


        // =====================================================
        // RESTORE PLAYBACK POSITION
        // =====================================================

        const restorePosition = () => {
            const saved = pendingRestoreRef.current;

            if (
                !saved ||
                saved.trackId !== currentTrack.id ||
                !Number.isFinite(audio.duration) ||
                audio.duration <= 0
            ) {
                return;
            }

            let targetTime = Math.min(
                saved.currentTime,
                audio.duration
            );

            // If the saved position is practically at
            // the end, restart the track instead.

            if (targetTime >= audio.duration - 2) {
                targetTime = 0;
            }

            try {
                audio.currentTime = targetTime;

                currentTimeRef.current = targetTime;

                setCurrentTime(targetTime);

                pendingRestoreRef.current = null;

                persistPlayback(
                    currentTrack.id,
                    targetTime
                );
            } catch {
                // Keep the restoration pending.
                // A later canplay event can retry.
            }
        };


        // =====================================================
        // RESUME PLAYBACK
        // =====================================================

        const resumePlayback = async () => {
            if (cancelled) {
                return;
            }

            restorePosition();

            if (
                !shouldResume ||
                !playbackIntentRef.current ||
                !musicEnabledRef.current
            ) {
                setIsLoading(false);

                return;
            }

            await attemptPlayback(audio);
        };


        // =====================================================
        // CAN PLAY HANDLER
        // =====================================================

        const handleTrackCanPlay = () => {
            resumePlayback();
        };


        audio.addEventListener(
            "canplay",
            handleTrackCanPlay
        );


        // =====================================================
        // LOAD TRACK
        // =====================================================

        audio.load();


        // Handle a source that is already ready.

        if (audio.readyState >= 3) {
            resumePlayback();
        }


        // =====================================================
        // CLEANUP
        // =====================================================

        return () => {
            cancelled = true;

            persistCurrentPlayback();

            audio.removeEventListener(
                "canplay",
                handleTrackCanPlay
            );
        };

    }, [
        currentTrack?.id,
        currentTrack?.audioSrc,
        attemptPlayback,
        persistPlayback,
        persistCurrentPlayback,
        setSetting,
    ]);


    // =======================================================
    // VOLUME SYNCHRONIZATION
    // =======================================================

    useEffect(() => {
        const audio = audioRef.current;

        if (!audio) {
            return;
        }

        audio.volume = normalizeVolume(
            settings.volume
        );

    }, [
        settings.volume,
    ]);


    // =======================================================
    // MUSIC ENABLE / DISABLE
    // =======================================================

    useEffect(() => {
        const audio = audioRef.current;

        if (!settings.musicEnabled) {

            // Save current playback before stopping.

            persistCurrentPlayback();

            // Stop all playback intentions.

            playbackIntentRef.current = false;

            if (audio) {
                audio.pause();
            }

            setIsPlaying(false);

            setIsLoading(false);

            setError(null);

            return;
        }


        // Music has been enabled.

        musicEnabledRef.current = true;

        playbackIntentRef.current = true;


        // If the audio source is already ready,
        // attempt playback immediately.

        if (
            audio &&
            audio.src &&
            audio.paused &&
            audio.readyState >= 2
        ) {
            attemptPlayback(audio);
        }

    }, [
        settings.musicEnabled,
        attemptPlayback,
        persistCurrentPlayback,
    ]);


    // =======================================================
    // PLAY
    // =======================================================

    const play = useCallback(async () => {
        const audio = audioRef.current;

        const track = currentTrackRef.current;

        if (
            !audio ||
            !track
        ) {
            return false;
        }

        playbackIntentRef.current = true;

        musicEnabledRef.current = true;

        setError(null);


        // Enable music when the user explicitly
        // presses the Play button.

        setSetting(
            "musicEnabled",
            true
        );


        // Recover if the previous source was missing.

        if (
            audio.error ||
            !audio.src
        ) {
            setIsLoading(true);

            audio.src = track.audioSrc;

            loadedTrackIdRef.current = track.id;

            audio.load();
        }


        return attemptPlayback(audio);

    }, [
        setSetting,
        attemptPlayback,
    ]);


    // =======================================================
    // PAUSE
    // =======================================================

    const pause = useCallback(() => {
        persistCurrentPlayback();

        playbackIntentRef.current = false;

        const audio = audioRef.current;

        if (audio) {
            audio.pause();
        }

        setIsPlaying(false);

        setIsLoading(false);

    }, [
        persistCurrentPlayback,
    ]);


    // =======================================================
    // TOGGLE PLAYBACK
    // =======================================================

    const togglePlay = useCallback(() => {
        const audio = audioRef.current;

        // Use the actual audio state.
        // A pending autoplay intention does not mean
        // the audio is already playing.

        if (audio && !audio.paused) {
            pause();

            return;
        }

        play();

    }, [
        play,
        pause,
    ]);


    // =======================================================
    // SELECT TRACK
    // =======================================================

    const selectTrack = useCallback(
        (trackId) => {
            const selectedTrack =
                tracksRef.current.find(
                    (track) => track.id === trackId
                );

            if (!selectedTrack) {
                return false;
            }

            setSetting(
                "selectedTrackId",
                selectedTrack.id
            );

            return true;
        },
        [
            setSetting,
        ]
    );


    // =======================================================
    // NEXT TRACK
    // =======================================================

    const nextTrack = useCallback(() => {
        const availableTracks =
            tracksRef.current;

        if (availableTracks.length <= 1) {
            return;
        }

        const currentIndex =
            availableTracks.findIndex(
                (track) =>
                    track.id === currentTrackRef.current?.id
            );

        const nextIndex =
            currentIndex < 0 ||
            currentIndex >= availableTracks.length - 1
                ? 0
                : currentIndex + 1;

        const track =
            availableTracks[nextIndex];

        if (track) {
            selectTrack(track.id);
        }

    }, [
        selectTrack,
    ]);


    // =======================================================
    // PREVIOUS TRACK
    // =======================================================

    const previousTrack = useCallback(() => {
        const availableTracks =
            tracksRef.current;

        if (availableTracks.length <= 1) {
            return;
        }

        const currentIndex =
            availableTracks.findIndex(
                (track) =>
                    track.id === currentTrackRef.current?.id
            );

        const previousIndex =
            currentIndex <= 0
                ? availableTracks.length - 1
                : currentIndex - 1;

        const track =
            availableTracks[previousIndex];

        if (track) {
            selectTrack(track.id);
        }

    }, [
        selectTrack,
    ]);


    // =======================================================
    // VOLUME CONTROL
    // =======================================================

    const setVolume = useCallback(
        (volume) => {
            const normalizedVolume =
                normalizeVolume(volume);

            setSetting(
                "volume",
                normalizedVolume
            );

            return normalizedVolume;
        },
        [
            setSetting,
        ]
    );


    // =======================================================
    // SEEK
    // =======================================================

    const seek = useCallback(
        (time) => {
            const audio = audioRef.current;

            if (
                !audio ||
                !Number.isFinite(audio.duration) ||
                audio.readyState < 1
            ) {
                return false;
            }

            const normalizedTime = Math.min(
                audio.duration,
                Math.max(0, Number(time) || 0)
            );

            try {
                audio.currentTime = normalizedTime;

                currentTimeRef.current =
                    normalizedTime;

                setCurrentTime(normalizedTime);

                persistCurrentPlayback();

                return true;

            } catch {
                return false;
            }
        },
        [
            persistCurrentPlayback,
        ]
    );


    // =======================================================
    // RESTART
    // =======================================================

    const restart = useCallback(() => {
        const audio = audioRef.current;

        if (
            !audio ||
            audio.readyState < 1
        ) {
            return false;
        }

        try {
            audio.currentTime = 0;

            currentTimeRef.current = 0;

            setCurrentTime(0);

            persistPlayback(
                loadedTrackIdRef.current,
                0
            );

            return true;

        } catch {
            return false;
        }

    }, [
        persistPlayback,
    ]);


    // =======================================================
    // RETURN API
    // =======================================================

    return {

        // TRACKS

        tracks,

        currentTrack,

        selectedTrackId:
            currentTrack?.id ?? null,


        // PLAYBACK STATE

        isPlaying,

        isLoading,

        musicEnabled: settings.musicEnabled,


        // TIME

        currentTime,

        duration,


        // VOLUME

        volume: settings.volume,


        // ERRORS

        error,


        // CONTROLS

        play,

        pause,

        togglePlay,

        selectTrack,

        nextTrack,

        previousTrack,

        setVolume,

        seek,

        restart,

    };
}


// =========================================================
// DEFAULT EXPORT
// =========================================================

export default useWinterAudio;