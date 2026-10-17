
import React, { memo, useId } from "react";

/**
 * FSociety — Shared Futuristic Page Background
 *
 * Props:
 * - showMonogram: boolean
 * - showCubes: boolean
 * - className: string
 *
 * Features:
 * - Light / Dark Mode
 * - Continuous blueprint grid
 * - Micro dots and scanlines
 * - Developer network / constellation
 * - Illuminated nodes
 * - Three isometric glass cubes
 * - FS brand watermark
 * - PCB corner traces
 * - Orbital geometry
 * - Ambient cyan / indigo / violet lighting
 * - Responsive layout
 * - React.memo optimization
 * - Unique SVG gradient IDs
 *
 * This is a decorative component.
 * It does not intercept clicks or touches.
 */

// =========================================================
// 1. BACKGROUND TEXTURES
//
// Defined outside components so references remain stable.
// =========================================================

const LIGHT_GRID = {
    backgroundImage: [
        "linear-gradient(to right, rgba(91, 122, 180, 0.075) 1px, transparent 1px)",
        "linear-gradient(to bottom, rgba(91, 122, 180, 0.075) 1px, transparent 1px)",
    ].join(", "),
    backgroundSize: "44px 44px",
    backgroundPosition: "center top",
};

const DARK_GRID = {
    backgroundImage: [
        "linear-gradient(to right, rgba(106, 150, 224, 0.073) 1px, transparent 1px)",
        "linear-gradient(to bottom, rgba(106, 150, 224, 0.073) 1px, transparent 1px)",
    ].join(", "),
    backgroundSize: "44px 44px",
    backgroundPosition: "center top",
};

const LIGHT_DOTS = {
    backgroundImage:
        "radial-gradient(circle, rgba(67, 121, 218, 0.34) 1px, transparent 1.5px)",
    backgroundSize: "88px 88px",
    backgroundPosition: "20px 14px",
};

const DARK_DOTS = {
    backgroundImage:
        "radial-gradient(circle, rgba(72, 171, 255, 0.36) 1px, transparent 1.5px)",
    backgroundSize: "88px 88px",
    backgroundPosition: "20px 14px",
};

const SCAN_LINES = {
    backgroundImage:
        "repeating-linear-gradient(to bottom, transparent 0px, transparent 7px, rgba(120, 163, 255, 0.08) 8px)",
    backgroundSize: "100% 8px",
};

// Important: stable object for React.memo.
const MIRRORED_NETWORK_STYLE = {
    transform: "scaleX(-1)",
};

// =========================================================
// 2. NETWORK GEOMETRY
//
// These are static values.
// useMemo is unnecessary because they are created once
// when this JavaScript module is loaded.
// =========================================================

const NETWORK_POINTS = [
    [32, 153, 3],
    [106, 88, 4],
    [194, 159, 2.5],
    [280, 106, 3],
    [366, 158, 3.5],
    [456, 88, 3],
    [548, 152, 3],
    [625, 102, 2.5],
    [742, 168, 4],
    [860, 90, 2.5],

    [46, 410, 3],
    [125, 330, 3.5],
    [225, 382, 3],
    [305, 302, 2.5],
    [406, 362, 3],
    [512, 298, 4],
    [603, 352, 3],
    [727, 281, 3.5],
    [842, 366, 3],

    [188, 253, 2],
    [362, 250, 2.5],
    [556, 236, 2],
    [784, 258, 2.5],
    [325, 466, 2.5],
    [672, 464, 3],
];

const MAIN_NETWORK_PATHS = [
    "M32 153L106 88L194 159L280 106L366 158L456 88L548 152L625 102L742 168L860 90",
    "M46 410L125 330L225 382L305 302L406 362L512 298L603 352L727 281L842 366",

    "M106 88L125 330",
    "M194 159L188 253L225 382",
    "M280 106L305 302",
    "M366 158L362 250L406 362",
    "M456 88L512 298",
    "M548 152L556 236L603 352",
    "M625 102L727 281",
    "M742 168L784 258L842 366",

    "M125 330L188 253L305 302",
    "M305 302L362 250L512 298",
    "M512 298L556 236L727 281",
    "M727 281L784 258L860 90",

    "M225 382L325 466L406 362",
    "M603 352L672 464L842 366",

    "M0 260L106 88",
    "M0 490L46 410",
    "M842 366L900 440",
];

const SECONDARY_NETWORK_PATHS = [
    "M188 253L280 106L362 250L188 253",
    "M366 158L456 88L556 236L366 158",
    "M406 362L512 298L603 352L406 362",
    "M625 102L742 168L727 281L625 102",
    "M46 410L125 330L225 382L46 410",
    "M603 352L727 281L842 366L672 464L603 352",
];

// =========================================================
// 3. SVG ID HELPER
//
// React 18 useId() generates unique IDs.
//
// Sanitize them for reliable SVG url(#id) usage.
// =========================================================

const safeSvgId = (reactId) => {
    return reactId.replace(
        /[^a-zA-Z0-9_-]/g,
        "-"
    );
};

// =========================================================
// 4. ISOMETRIC GLASS CUBE
//
// Memoized because its props are primitive values.
// =========================================================

const IsoCube = memo(function IsoCube({
    transform,
    gradientPrefix,
    opacity = 0.8,
    showBrand = false,
}) {
    return (
        <g
            transform={transform}
            opacity={opacity}
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeOpacity="0.65"
            strokeLinejoin="round"
        >
            {/* Shadow */}

            <path
                d="M0 78L48 105L96 78L48 113Z"
                fill="#6366f1"
                fillOpacity="0.10"
                stroke="none"
            />

            {/* Top face */}

            <polygon
                points="0,23 48,-4 96,23 48,50"
                fill={`url(#${gradientPrefix}-cube-top)`}
            />

            {/* Left face */}

            <polygon
                points="0,23 48,50 48,105 0,78"
                fill={`url(#${gradientPrefix}-cube-left)`}
            />

            {/* Right face */}

            <polygon
                points="48,50 96,23 96,78 48,105"
                fill={`url(#${gradientPrefix}-cube-right)`}
            />

            {/* Internal glass edges */}

            <path
                d="M48 50V105M0 23L48 50L96 23"
                fill="none"
                stroke="#ffffff"
                strokeOpacity="0.55"
            />

            {/* Reflective highlight */}

            <path
                d="M16 24L48 6L80 24"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
                strokeOpacity="0.52"
            />

            {/* FS branding only on featured cubes */}

            {showBrand ? (
                <text
                    x="48"
                    y="31"
                    textAnchor="middle"
                    fontSize="22"
                    fontWeight="900"
                    fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
                    letterSpacing="-2"
                    stroke="none"
                    fill="#ffffff"
                    fillOpacity="0.88"
                >
                    FS
                </text>
            ) : (
                <circle
                    cx="48"
                    cy="47"
                    r="3"
                    fill="#ffffff"
                    stroke="none"
                    opacity="0.8"
                />
            )}
        </g>
    );
});

// =========================================================
// 5. DEVELOPER NETWORK ARTWORK
//
// useId:
// Prevents collisions between multiple SVG instances.
//
// memo:
// Prevents rendering again when props are unchanged.
// =========================================================

const CircuitArtwork = memo(function CircuitArtwork({
    className = "",
    style,
    showCubes = true,
}) {
    const id = safeSvgId(useId());

    const prefix = `fsociety-network-${id}`;

    const wireId = `${prefix}-wire`;
    const glowId = `${prefix}-glow`;

    return (
        <svg
            viewBox="0 0 900 560"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
            focusable="false"
            className={className}
            style={style}
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                {/* Network gradient */}

                <linearGradient
                    id={wireId}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="60%"
                >
                    <stop
                        offset="0%"
                        stopColor="#22d3ee"
                        stopOpacity="0.17"
                    />
                    <stop
                        offset="45%"
                        stopColor="#3b82f6"
                        stopOpacity="0.65"
                    />
                    <stop
                        offset="80%"
                        stopColor="#818cf8"
                        stopOpacity="0.46"
                    />
                    <stop
                        offset="100%"
                        stopColor="#a78bfa"
                        stopOpacity="0.13"
                    />
                </linearGradient>

                {/* Node glow */}

                <radialGradient id={glowId}>
                    <stop
                        offset="0%"
                        stopColor="#38bdf8"
                        stopOpacity="0.30"
                    />
                    <stop
                        offset="55%"
                        stopColor="#6366f1"
                        stopOpacity="0.12"
                    />
                    <stop
                        offset="100%"
                        stopColor="#6366f1"
                        stopOpacity="0"
                    />
                </radialGradient>

                {/* Cube gradients.
                    Avoid unnecessary gradient nodes
                    when showCubes is false. */}

                {showCubes && (
                    <>
                        <linearGradient
                            id={`${prefix}-cube-top`}
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                        >
                            <stop
                                offset="0%"
                                stopColor="#f0f9ff"
                                stopOpacity="0.96"
                            />
                            <stop
                                offset="55%"
                                stopColor="#a5b4fc"
                                stopOpacity="0.83"
                            />
                            <stop
                                offset="100%"
                                stopColor="#67e8f9"
                                stopOpacity="0.80"
                            />
                        </linearGradient>

                        <linearGradient
                            id={`${prefix}-cube-left`}
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                        >
                            <stop
                                offset="0%"
                                stopColor="#93c5fd"
                                stopOpacity="0.78"
                            />
                            <stop
                                offset="100%"
                                stopColor="#4f46e5"
                                stopOpacity="0.58"
                            />
                        </linearGradient>

                        <linearGradient
                            id={`${prefix}-cube-right`}
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                        >
                            <stop
                                offset="0%"
                                stopColor="#67e8f9"
                                stopOpacity="0.76"
                            />
                            <stop
                                offset="100%"
                                stopColor="#8b5cf6"
                                stopOpacity="0.52"
                            />
                        </linearGradient>
                    </>
                )}
            </defs>

            {/* Ambient lighting */}

            <circle
                cx="660"
                cy="208"
                r="150"
                fill={`url(#${glowId})`}
            />

            <circle
                cx="220"
                cy="390"
                r="105"
                fill={`url(#${glowId})`}
            />

            {/* Primary connections */}

            <g
                fill="none"
                stroke={`url(#${wireId})`}
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                {MAIN_NETWORK_PATHS.map((d, index) => (
                    <path
                        key={`main-${index}`}
                        d={d}
                    />
                ))}
            </g>

            {/* Secondary connections */}

            <g
                fill="none"
                stroke="#93c5fd"
                strokeWidth="0.8"
                strokeOpacity="0.3"
            >
                {SECONDARY_NETWORK_PATHS.map(
                    (d, index) => (
                        <path
                            key={`secondary-${index}`}
                            d={d}
                        />
                    )
                )}
            </g>

            {/* Dashed circuit lines */}

            <g
                fill="none"
                stroke="#22d3ee"
                strokeOpacity="0.35"
                strokeWidth="1.2"
                strokeDasharray="3 10"
            >
                <path d="M194 159L366 158" />
                <path d="M406 362L603 352" />
                <path d="M625 102L742 168" />
            </g>

            {/* Illuminated network nodes */}

            {NETWORK_POINTS.map(
                ([x, y, radius], index) => (
                    <g key={`node-${index}`}>
                        <circle
                            cx={x}
                            cy={y}
                            r={radius * 4.2}
                            fill="#38bdf8"
                            opacity="0.06"
                        />

                        <circle
                            cx={x}
                            cy={y}
                            r={radius * 1.7}
                            fill="none"
                            stroke="#60a5fa"
                            strokeWidth="0.65"
                            strokeOpacity={
                                index % 4 === 0
                                    ? 0.42
                                    : 0.1
                            }
                        />

                        <circle
                            cx={x}
                            cy={y}
                            r={radius}
                            fill={
                                index % 3 === 0
                                    ? "#22d3ee"
                                    : index % 3 === 1
                                        ? "#4f8cf7"
                                        : "#a78bfa"
                            }
                            opacity="0.90"
                        />

                        <circle
                            cx={x - 0.65}
                            cy={y - 0.65}
                            r={radius * 0.32}
                            fill="#ffffff"
                            opacity="0.90"
                        />
                    </g>
                )
            )}

            {/* Isometric floating cubes */}

            {showCubes && (
                <g>
                    <IsoCube
                        transform="translate(630 175) rotate(-7)"
                        gradientPrefix={prefix}
                        opacity={0.84}
                        showBrand
                    />

                    <IsoCube
                        transform="translate(212 302) scale(0.6) rotate(8)"
                        gradientPrefix={prefix}
                        opacity={0.65}
                    />

                    <IsoCube
                        transform="translate(465 102) scale(0.42) rotate(-8)"
                        gradientPrefix={prefix}
                        opacity={0.7}
                    />
                </g>
            )}

            {/* Tiny optical highlights */}

            <g fill="#ffffff" opacity="0.82">
                <circle cx="510" cy="150" r="1.6" />
                <circle cx="760" cy="304" r="1.5" />
                <circle cx="165" cy="450" r="1.5" />
                <circle cx="574" cy="420" r="1.2" />
            </g>

            {/* Developer icon fragment */}

            <g
                transform="translate(76 208)"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeOpacity="0.43"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path
                    d="M9 0L2 7L9 14M17 0L24 7L17 14M15 -2L11 16"
                />
            </g>
        </svg>
    );
});

// =========================================================
// 6. FS BRAND WATERMARK
//
// Separate SVG with its own unique gradient ID.
// =========================================================

const FSBrandWatermark = memo(
    function FSBrandWatermark({
        className = "",
    }) {
        const gradientId = `fs-watermark-${safeSvgId(
            useId()
        )}`;

        return (
            <svg
                viewBox="0 0 540 320"
                fill="none"
                aria-hidden="true"
                focusable="false"
                className={className}
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <linearGradient
                        id={gradientId}
                        x1="12%"
                        y1="18%"
                        x2="94%"
                        y2="78%"
                    >
                        <stop
                            offset="0%"
                            stopColor="#06b6d4"
                        />
                        <stop
                            offset="52%"
                            stopColor="#3b82f6"
                        />
                        <stop
                            offset="100%"
                            stopColor="#8b5cf6"
                        />
                    </linearGradient>
                </defs>

                {/* Optical brackets */}

                <g
                    stroke={`url(#${gradientId})`}
                    strokeWidth="5"
                    strokeLinecap="square"
                    opacity="0.30"
                >
                    <path
                        d="M55 83H24V237H55"
                    />
                    <path
                        d="M484 83H516V237H484"
                    />
                </g>

                {/* FS letters */}

                <text
                    x="270"
                    y="229"
                    textAnchor="middle"
                    fontSize="225"
                    fontWeight="900"
                    fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
                    letterSpacing="-15"
                    fill={`url(#${gradientId})`}
                >
                    FS
                </text>

                {/* Digital corner highlights */}

                <g
                    stroke={`url(#${gradientId})`}
                    strokeWidth="2"
                    opacity="0.40"
                >
                    <path
                        d="M74 54H124M74 54V87"
                    />
                    <path
                        d="M466 266H416M466 266V233"
                    />
                </g>
            </svg>
        );
    }
);

// =========================================================
// 7. CORNER CIRCUIT
//
// Stateless + memoized.
// =========================================================

const CornerCircuit = memo(
    function CornerCircuit({
        className = "",
    }) {
        return (
            <svg
                viewBox="0 0 420 250"
                fill="none"
                className={className}
                aria-hidden="true"
                focusable="false"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Primary traces */}

                <g
                    stroke="#38bdf8"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.68"
                >
                    <path
                        d="M0 24H80L126 70H203L233 100H420"
                    />

                    <path
                        d="M0 49H70L116 95H190L232 137H332L376 181H420"
                    />

                    <path
                        d="M0 84H50L109 143H203L246 186H420"
                    />

                    <path
                        d="M0 132H62L112 182H175L212 219H420"
                    />
                </g>

                {/* Active dots */}

                <g fill="#22d3ee">
                    <circle
                        cx="126"
                        cy="70"
                        r="3.5"
                    />

                    <circle
                        cx="232"
                        cy="137"
                        r="3"
                    />

                    <circle
                        cx="109"
                        cy="143"
                        r="3.5"
                    />

                    <circle
                        cx="212"
                        cy="219"
                        r="2.5"
                    />
                </g>

                {/* Secondary traces */}

                <g
                    stroke="#6366f1"
                    strokeWidth="1"
                    strokeOpacity="0.40"
                >
                    <path
                        d="M0 16H82M0 64H38M330 147H420M300 195H420"
                    />
                </g>
            </svg>
        );
    }
);

// =========================================================
// 8. MAIN SHARED BACKGROUND
//
// React.memo:
// - Avoids re-render when props are unchanged.
//
// No useEffect:
// - Nothing to subscribe to or clean up.
//
// No useCallback:
// - No event handlers.
//
// No useMemo:
// - Expensive/static data is already at module scope.
// =========================================================

const PageGridBackground = memo(
    function PageGridBackground({
        showMonogram = true,
        showCubes = true,
        className = "",
    }) {
        return (
            <div
                aria-hidden="true"
                className={`
                    pointer-events-none
                    absolute
                    inset-0
                    z-0
                    isolate
                    select-none
                    overflow-hidden

                    ${className}
                `}
            >
                {/* ======================================
                    BASE BACKGROUND
                ====================================== */}

                <div
                    className="
                        absolute
                        inset-0

                        bg-gradient-to-br

                        from-[#f7faff]
                        via-[#eef5ff]
                        to-[#f7f7ff]

                        dark:from-[#050a14]
                        dark:via-[#091324]
                        dark:to-[#090c1a]
                    "
                />

                {/* ======================================
                    GRID
                ====================================== */}

                <div
                    className="
                        absolute
                        inset-0
                        opacity-90
                        dark:hidden
                    "
                    style={LIGHT_GRID}
                />

                <div
                    className="
                        absolute
                        inset-0
                        hidden
                        opacity-80
                        dark:block
                    "
                    style={DARK_GRID}
                />

                {/* ======================================
                    MICRO DOTS
                ====================================== */}

                <div
                    className="
                        absolute
                        inset-0
                        opacity-25
                        dark:hidden
                    "
                    style={LIGHT_DOTS}
                />

                <div
                    className="
                        absolute
                        inset-0
                        hidden
                        opacity-30
                        dark:block
                    "
                    style={DARK_DOTS}
                />

                {/* ======================================
                    DARK SCANLINES
                ====================================== */}

                <div
                    className="
                        absolute
                        inset-0
                        hidden
                        opacity-[0.12]
                        dark:block
                    "
                    style={SCAN_LINES}
                />

                {/* ======================================
                    AMBIENT LIGHTS
                ====================================== */}

                <div
                    className="
                        absolute
                        -left-40
                        top-14

                        h-[420px]
                        w-[420px]

                        rounded-full

                        bg-cyan-300/25
                        blur-[115px]

                        dark:bg-cyan-500/[0.09]
                    "
                />

                <div
                    className="
                        absolute
                        -right-40
                        top-[5%]

                        h-[520px]
                        w-[520px]

                        rounded-full

                        bg-indigo-300/25
                        blur-[120px]

                        dark:bg-indigo-500/[0.10]
                    "
                />

                <div
                    className="
                        absolute
                        left-[14%]
                        top-[41%]

                        h-[420px]
                        w-[420px]

                        rounded-full

                        bg-violet-300/15
                        blur-[120px]

                        dark:bg-violet-500/[0.07]
                    "
                />

                <div
                    className="
                        absolute
                        -right-32
                        bottom-[8%]

                        h-[440px]
                        w-[440px]

                        rounded-full

                        bg-blue-300/20
                        blur-[110px]

                        dark:bg-sky-500/[0.065]
                    "
                />

                {/* ======================================
                    ORBITAL GEOMETRY
                ====================================== */}

                <div
                    className="
                        absolute
                        -right-40
                        top-[9%]

                        h-[520px]
                        w-[520px]

                        rounded-full

                        border
                        border-blue-300/20

                        dark:border-cyan-400/[0.08]
                    "
                />

                <div
                    className="
                        absolute
                        -right-24
                        top-[12%]

                        h-[410px]
                        w-[410px]

                        rounded-full

                        border
                        border-indigo-300/20

                        dark:border-indigo-400/[0.08]
                    "
                />

                <div
                    className="
                        absolute
                        -left-48
                        bottom-[10%]

                        h-[450px]
                        w-[450px]

                        rounded-full

                        border
                        border-violet-300/15

                        dark:border-violet-400/[0.06]
                    "
                />

                {/* ======================================
                    NETWORK #1

                    Shown on desktop and mobile.
                ====================================== */}

                <CircuitArtwork
                    showCubes={showCubes}
                    className="
                        absolute
                        -right-64
                        top-0

                        w-[850px]
                        max-w-none

                        opacity-60

                        sm:-right-32
                        sm:w-[970px]

                        lg:-right-[5%]
                        lg:w-[1050px]

                        dark:opacity-[0.45]
                    "
                />

                {/* ======================================
                    NETWORK #2

                    Mirrored network.

                    Stable style reference means this
                    memoized child doesn't re-render
                    merely because the parent rendered.
                ====================================== */}

                <CircuitArtwork
                    showCubes={showCubes}
                    style={MIRRORED_NETWORK_STYLE}
                    className="
                        absolute
                        -left-72
                        top-[32%]

                        hidden

                        w-[850px]
                        max-w-none

                        opacity-[0.45]

                        sm:block
                        sm:-left-56
                        sm:w-[980px]

                        dark:opacity-30
                    "
                />

                {/* ======================================
                    NETWORK #3
                ====================================== */}

                <CircuitArtwork
                    showCubes={showCubes}
                    className="
                        absolute
                        -right-64
                        bottom-0

                        hidden

                        w-[900px]
                        max-w-none

                        opacity-40

                        sm:block
                        sm:-right-40
                        sm:w-[1050px]

                        dark:opacity-[0.28]
                    "
                />

                {/* ======================================
                    PCB CORNER DETAILS
                ====================================== */}

                <CornerCircuit
                    className="
                        absolute
                        -left-12
                        top-0

                        hidden
                        w-[340px]

                        opacity-25

                        md:block

                        dark:opacity-40
                    "
                />

                <CornerCircuit
                    className="
                        absolute
                        -right-16
                        bottom-0

                        hidden
                        w-[420px]

                        rotate-180

                        opacity-20

                        md:block

                        dark:opacity-[0.35]
                    "
                />

                {/* ======================================
                    FS BRAND WATERMARKS
                ====================================== */}

                {showMonogram && (
                    <>
                        <FSBrandWatermark
                            className="
                                absolute
                                -right-24
                                top-[16%]

                                w-[350px]
                                max-w-none

                                opacity-[0.11]

                                sm:-right-12
                                sm:w-[440px]

                                lg:right-[1%]
                                lg:w-[510px]

                                dark:opacity-[0.095]
                            "
                        />

                        <FSBrandWatermark
                            className="
                                absolute
                                -left-24
                                top-[63%]

                                hidden

                                w-[320px]

                                -rotate-12

                                opacity-[0.06]

                                lg:block

                                dark:opacity-[0.05]
                            "
                        />
                    </>
                )}

                {/* ======================================
                    TECHNICAL DETAILS
                ====================================== */}

                <div
                    className="
                        absolute
                        right-[10%]
                        top-[5%]

                        hidden

                        font-mono
                        text-[10px]
                        font-bold
                        tracking-[0.28em]

                        text-sky-700/20

                        lg:block

                        dark:text-cyan-300/25
                    "
                >
                    BUILD / SHARE / SOLVE
                </div>

                <div
                    className="
                        absolute
                        bottom-[17%]
                        left-[3%]

                        hidden

                        font-mono
                        text-[10px]
                        font-bold
                        tracking-[0.24em]

                        text-indigo-600/15

                        lg:block

                        dark:text-indigo-300/20
                    "
                >
                    FSOCIETY://CONNECTED
                </div>

                {/* Code symbol */}

                <div
                    className="
                        absolute
                        left-[9%]
                        top-[25%]

                        hidden

                        font-mono
                        text-2xl
                        font-light

                        text-sky-500/15

                        xl:block

                        dark:text-cyan-400/15
                    "
                >
                    {"</>"}
                </div>

                {/* Curly brackets */}

                <div
                    className="
                        absolute
                        right-[8%]
                        bottom-[27%]

                        hidden

                        font-mono
                        text-2xl
                        font-light

                        text-violet-500/15

                        xl:block

                        dark:text-violet-400/15
                    "
                >
                    {"{ }"}
                </div>

                {/* ======================================
                    TOP EDGE FADE
                ====================================== */}

                <div
                    className="
                        absolute
                        inset-x-0
                        top-0

                        h-48

                        bg-gradient-to-b

                        from-white/25
                        to-transparent

                        dark:from-indigo-400/[0.02]
                    "
                />
            </div>
        );
    }
);

// =========================================================
// EXPORT
// =========================================================

export default PageGridBackground;
