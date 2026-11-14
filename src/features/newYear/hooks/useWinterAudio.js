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
// - Play / Pause
// - Automatic next track
// - Previous / Next track selection
// - Track switching
// - Playback progress
// - Audio duration
// - Volume control
// - Mute-compatible volume
// - Loading state (mobile-safe)
// - Audio error handling & recovery
// - NewYearContext integration
//
// IMPORTANT:
//
// - One audio instance only.
// - No automatic initial playback.
// - Music starts after user interaction.
// - Music settings persist in localStorage.
// - Audio survives sidebar closing.
// - Disabling music stops playback.
//
// =========================================================


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

  const playbackIntentRef = useRef(false);

  const musicEnabledRef = useRef(
    settings.musicEnabled
  );

  const volumeRef = useRef(
    normalizeVolume(settings.volume)
  );

  const tracksRef = useRef([]);

  const currentTrackRef = useRef(null);


  // Keep current settings available
  // inside native audio event handlers.

  musicEnabledRef.current =
    settings.musicEnabled;

  volumeRef.current =
    normalizeVolume(settings.volume);


  // =======================================================
  // LOCAL AUDIO STATE
  // =======================================================

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(false);

  const [currentTime, setCurrentTime] =
    useState(0);

  const [duration, setDuration] =
    useState(0);

  const [error, setError] =
    useState(null);


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
    // PLAY EVENT
    // =====================================================

    const handlePlay = () => {

      setIsPlaying(true);

      setError(null);

    };


    // =====================================================
    // PLAYING EVENT (ACTIVE PLAYBACK CONFIRMED)
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

      setIsPlaying(false);

      setIsLoading(false);

    };


    // =====================================================
    // WAITING EVENT (BUFFERING DURING PLAYBACK)
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

      setCurrentTime(
        Number.isFinite(audio.currentTime)
          ? audio.currentTime
          : 0
      );

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
    // SUSPEND EVENT (MOBILE SAFARI IDLE PRELOAD STOP)
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
    // 1. Check whether playback was intended.
    // 2. Check whether music is enabled.
    // 3. Select the next available track.
    // 4. Resume playback through track effect.
    //
    // =====================================================

    const handleEnded = () => {

      setIsPlaying(false);

      setIsLoading(false);

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


      // A new selected track triggers
      // the source management effect.
      //
      // playbackIntentRef remains TRUE
      // so the next track can start automatically.

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

      setIsPlaying(false);

      setIsLoading(false);

      setError(
        "Audio faylini yuklab bo‘lmadi. MP3 fayl mavjudligini tekshiring."
      );

    };


    // =====================================================
    // REGISTER EVENTS
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
    // CLEANUP
    // =====================================================

    return () => {

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

      audio.removeAttribute("src");

      audio.load();

      if (audioRef.current === audio) {
        audioRef.current = null;
      }

    };

  }, [
    setSetting,
  ]);


  // =======================================================
  // TRACK SOURCE MANAGEMENT
  // =======================================================
  //
  // This effect handles:
  //
  // - Track selection
  // - Loading a new audio source
  // - Resuming previously active playback
  // - Avoiding unintended autoplay
  //
  // =======================================================

  useEffect(() => {

    const audio = audioRef.current;

    if (!audio || !currentTrack) {
      return undefined;
    }

    const shouldResume =
      playbackIntentRef.current &&
      musicEnabledRef.current;


    // Cancel previous playback.

    audio.pause();

    setCurrentTime(0);

    setDuration(0);

    setError(null);

    setIsLoading(shouldResume);

    setIsPlaying(false);


    // Set new source.

    audio.src = currentTrack.audioSrc;


    // Track whether this effect was cancelled.

    let cancelled = false;


    // =====================================================
    // RESUME PLAYBACK
    // =====================================================

    const resumePlayback = () => {

      if (
        cancelled ||
        !shouldResume ||
        !playbackIntentRef.current ||
        !musicEnabledRef.current
      ) {
        return;
      }

      audio.play().catch((err) => {

        if (
          cancelled ||
          err?.name === "AbortError"
        ) {
          return;
        }

        playbackIntentRef.current = false;

        setIsPlaying(false);

        setIsLoading(false);

        setError(
          "Musiqani davom ettirib bo‘lmadi."
        );

      });

    };


    // Attach the listener before loading
    // to avoid missing the canplay event.

    if (shouldResume) {

      audio.addEventListener(
        "canplay",
        resumePlayback,
        { once: true }
      );

    }

    audio.load();


    return () => {

      cancelled = true;

      audio.removeEventListener(
        "canplay",
        resumePlayback
      );

    };

  }, [
    currentTrack?.id,
    currentTrack?.audioSrc,
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

      // Stop all playback intentions.

      playbackIntentRef.current = false;

      if (audio) {
        audio.pause();
      }

      setIsPlaying(false);

      setIsLoading(false);

      setError(null);

    }

  }, [
    settings.musicEnabled,
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

    setError(null);


    // Enable music when user explicitly
    // presses the Play button.

    setSetting(
      "musicEnabled",
      true
    );


    // Recover cleanly if previous load failed or src was missing.

    if (audio.error || !audio.src) {
      setIsLoading(true);
      audio.src = track.audioSrc;
      audio.load();
    }


    try {

      await audio.play();

      return true;

    } catch (err) {

      if (err?.name === "AbortError") {
        return false;
      }

      playbackIntentRef.current = false;

      setIsPlaying(false);

      setIsLoading(false);

      setError(
        "Musiqani ijro etib bo‘lmadi. Audio faylini tekshiring."
      );

      return false;

    }

  }, [
    setSetting,
  ]);


  // =======================================================
  // PAUSE
  // =======================================================

  const pause = useCallback(() => {

    playbackIntentRef.current = false;

    const audio = audioRef.current;

    if (audio) {
      audio.pause();
    }

    setIsPlaying(false);

    setIsLoading(false);

  }, []);


  // =======================================================
  // TOGGLE PLAYBACK
  // =======================================================

  const togglePlay = useCallback(() => {

    const audio = audioRef.current;

    if (
      playbackIntentRef.current ||
      (audio && !audio.paused)
    ) {

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

        setCurrentTime(normalizedTime);

        return true;

      } catch {

        return false;

      }

    },
    []
  );


  // =======================================================
  // RESTART
  // =======================================================

  const restart = useCallback(() => {

    const audio = audioRef.current;

    if (!audio || audio.readyState < 1) {
      return false;
    }

    try {

      audio.currentTime = 0;

      setCurrentTime(0);

      return true;

    } catch {

      return false;

    }

  }, []);


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