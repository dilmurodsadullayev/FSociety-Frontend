/* =========================================================
   FSOCIETY — WINTER MUSIC TRACKS
   =========================================================

   Location:
   src/features/newYear/data/winterTracks.js

   Responsibilities:
   - Centralized winter music playlist
   - Track metadata
   - Audio file paths
   - Track categories
   - Safe track lookup helpers

   Audio location:
   public/music/winter/

   Public URL:
   /music/winter/filename.mp3
   ========================================================= */


// =========================================================
// WINTER TRACKS
// =========================================================

export const WINTER_TRACKS = Object.freeze([

  // =======================================================
  // 1. LET IT SNOW
  // =======================================================

  Object.freeze({
    id: "let-it-snow",

    title: "Let It Snow!",

    artist: "Frank Sinatra",

    description: "Qishki kayfiyat bag‘ishlovchi klassik tarona.",

    fileName: "let-it-snow.mp3",

    audioSrc: "/music/winter/let-it-snow.mp3",

    category: "classic",

    icon: "snowflake",

    enabled: true,
  }),


  // =======================================================
  // 2. JINGLE BELL ROCK
  // =======================================================

  Object.freeze({
    id: "jingle-bell-rock",

    title: "Jingle Bell Rock",

    artist: "Bobby Helms",

    description: "Quvnoq Yangi yil rok klassikasi.",

    fileName: "jingle-bell-rock.mp3",

    audioSrc: "/music/winter/jingle-bell-rock.mp3",

    category: "christmas",

    icon: "bell",

    enabled: true,
  }),


  // =======================================================
  // 3. JINGLE BELLS
  // =======================================================

  Object.freeze({
    id: "jingle-bells",

    title: "Jingle Bells",

    artist: "Frank Sinatra",

    description: "Bayramona va iliq Yangi yil ohangi.",

    fileName: "jingle-bells.mp3",

    audioSrc: "/music/winter/jingle-bells.mp3",

    category: "christmas",

    icon: "bell",

    enabled: true,
  }),


  // =======================================================
  // 4. SNOWMAN
  // =======================================================

  Object.freeze({
    id: "snowman",

    title: "Snowman",

    artist: "Sia",

    description: "Mayin va ta’sirchan qishki melodiya.",

    fileName: "snowman.mp3",

    audioSrc: "/music/winter/snowman.mp3",

    category: "peaceful",

    icon: "snowflake",

    enabled: true,
  }),


  // =======================================================
  // 5. LAST CHRISTMAS
  // =======================================================

  Object.freeze({
    id: "last-christmas",

    title: "Last Christmas",

    artist: "Wham!",

    description: "Afsonaviy Yangi yil pop taronasi.",

    fileName: "last-christmas.mp3",

    audioSrc: "/music/winter/last-christmas.mp3",

    category: "christmas",

    icon: "gift",

    enabled: true,
  }),


  // =======================================================
  // 6. ALL I WANT FOR CHRISTMAS IS YOU
  // =======================================================

  Object.freeze({
    id: "all-i-want-for-christmas",

    title: "All I Want for Christmas Is You",

    artist: "Mariah Carey",

    description: "Bayramona va jo‘shqin Yangi yil xiti.",

    fileName: "all-i-want-for-christmas.mp3",

    audioSrc: "/music/winter/all-i-want-for-christmas.mp3",

    category: "christmas",

    icon: "heart",

    enabled: true,
  }),


  // =======================================================
  // 7. YANGI YIL
  // =======================================================

  Object.freeze({
    id: "yangi-yil",

    title: "Yangi Yil",

    artist: "Yulduzlar",

    description: "Maxsus o‘zbekcha Yangi yil taronasi.",

    fileName: "yangi-yil.mp3",

    audioSrc: "/music/winter/yangi-yil.mp3",

    category: "uzbek",

    icon: "music",

    enabled: true,
  }),

]);


// =========================================================
// AVAILABLE TRACKS CACHE
// =========================================================

const AVAILABLE_WINTER_TRACKS = Object.freeze(
  WINTER_TRACKS.filter((track) => track.enabled)
);


// =========================================================
// DEFAULT TRACK
// =========================================================

export const DEFAULT_WINTER_TRACK_ID = "let-it-snow";


// =========================================================
// GET TRACK BY ID
// =========================================================

export const getWinterTrackById = (trackId) => {
  if (typeof trackId !== "string" || !trackId.trim()) {
    return null;
  }

  return (
    AVAILABLE_WINTER_TRACKS.find(
      (track) => track.id === trackId
    ) ?? null
  );
};


// =========================================================
// GET AVAILABLE TRACKS
// =========================================================

export const getAvailableWinterTracks = () => {
  return AVAILABLE_WINTER_TRACKS;
};


// =========================================================
// GET TRACK CATEGORIES
// =========================================================

export const WINTER_TRACK_CATEGORIES = Object.freeze({

  CLASSIC: "classic",

  CHRISTMAS: "christmas",

  PEACEFUL: "peaceful",

  UZBEK: "uzbek",

});


// =========================================================
// DEFAULT EXPORT
// =========================================================

export default WINTER_TRACKS;