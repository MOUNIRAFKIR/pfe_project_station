// components/ParkingMap.jsx
import React from "react";

export default function ParkingMap({ spotStatuses = {} }) {
    // Enforce the 4 exact color possibilities
    const COLOR_MAP = {
        red: "#FEE2E2",    // Occupied (Red)
        green: "#DCFCE7",  // Available (Green)
        orange: "#FFEDD5", // Reserved (Orange)
        yellow: "#FEF9C3", // Selected/Temporary (Yellow)
    };

    // Default to white (#ffffff) if no valid status is provided
    const getSpotColor = (id) => {
        const status = spotStatuses[id];
        return COLOR_MAP[status] || "#ffffff";
    };

    return (
        <svg
            width="100%"
            height="100%"
            viewBox="0 0 850 650"
            style={{ width: "min(500px, calc(100% - 2rem))", height: "auto", display: "block" }}
        >
            <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#8a94a6" />
                </marker>
            </defs>

            {/* Lane & Roadway boundaries */}
            <path d="M 150 460 H 220 A 40 40 0 0 0 260 500 H 635 A 40 40 0 0 0 675 460 V 430" fill="none" stroke="#d0d8e2" strokeWidth="2.5" opacity="0.7" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 708 190 V 170 A 30 30 0 0 1 738 140 H 830" fill="none" stroke="#d0d8e2" strokeWidth="2.5" opacity="0.7" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 708 350 V 600" fill="none" stroke="#d0d8e2" strokeWidth="2.5" opacity="0.7" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 150 80 V 630" fill="none" stroke="#d0d8e2" strokeWidth="2.5" opacity="0.7" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 680 160 H 260 A 40 40 0 0 1 220 120 V 100" fill="none" stroke="#d0d8e2" strokeWidth="2" opacity="0.7" strokeLinecap="round" strokeLinejoin="round" />

            {/* TOP SECTION: U1 to U5 */}
            <g transform="translate(265, 75)">
                <rect fill="none" stroke="#dcdfe4" strokeWidth="2" x="0" y="0" width="325" height="85" rx="12" style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.03))" }} />
                {/* Individual Spot Backgrounds */}
                <rect fill={getSpotColor("U1")} x="1.5" y="1.5" width="62" height="82" rx="10" />
                <rect fill={getSpotColor("U2")} x="66" y="1.5" width="62" height="82" rx="4" />
                <rect fill={getSpotColor("U3")} x="131" y="1.5" width="62" height="82" rx="4" />
                <rect fill={getSpotColor("U4")} x="196" y="1.5" width="62" height="82" rx="4" />
                <rect fill={getSpotColor("U5")} x="261" y="1.5" width="62.5" height="82" rx="10" />
                {/* Grid dividing Lines */}
                <line stroke="#e6ebf1" strokeWidth="1.5" x1="65" y1="0" x2="65" y2="85" />
                <line stroke="#e6ebf1" strokeWidth="1.5" x1="130" y1="0" x2="130" y2="85" />
                <line stroke="#e6ebf1" strokeWidth="1.5" x1="195" y1="0" x2="195" y2="85" />
                <line stroke="#e6ebf1" strokeWidth="1.5" x1="260" y1="0" x2="260" y2="85" />
                {/* Labels */}
                <text fill="#4b525d" fontSize="14px" fontWeight="600" textAnchor="middle" dominantBaseline="central" x="32.5" y="42.5">U1</text>
                <text fill="#4b525d" fontSize="14px" fontWeight="600" textAnchor="middle" dominantBaseline="central" x="97.5" y="42.5">U2</text>
                <text fill="#4b525d" fontSize="14px" fontWeight="600" textAnchor="middle" dominantBaseline="central" x="162.5" y="42.5">U3</text>
                <text fill="#4b525d" fontSize="14px" fontWeight="600" textAnchor="middle" dominantBaseline="central" x="227.5" y="42.5">U4</text>
                <text fill="#4b525d" fontSize="14px" fontWeight="600" textAnchor="middle" dominantBaseline="central" x="292.5" y="42.5">U5</text>
            </g>

            {/* LEFT SECTION: L1 to L4 */}
            <g transform="translate(60, 200)">
                <rect fill="none" stroke="#dcdfe4" strokeWidth="2" x="0" y="0" width="85" height="230" rx="12" style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.03))" }} />
                {/* Individual Spot Backgrounds */}
                <rect fill={getSpotColor("L1")} x="1.5" y="1.5" width="82" height="54" rx="10" />
                <rect fill={getSpotColor("L2")} x="1.5" y="59" width="82" height="55" rx="4" />
                <rect fill={getSpotColor("L3")} x="1.5" y="116.5" width="82" height="55" rx="4" />
                <rect fill={getSpotColor("L4")} x="1.5" y="174" width="82" height="54.5" rx="10" />
                {/* Lines */}
                <line stroke="#e6ebf1" strokeWidth="1.5" x1="0" y1="57.5" x2="85" y2="57.5" />
                <line stroke="#e6ebf1" strokeWidth="1.5" x1="0" y1="115" x2="85" y2="115" />
                <line stroke="#e6ebf1" strokeWidth="1.5" x1="0" y1="172.5" x2="85" y2="172.5" />
                {/* Labels */}
                <text fill="#4b525d" fontSize="14px" fontWeight="600" textAnchor="middle" dominantBaseline="central" x="42.5" y="28.75">L1</text>
                <text fill="#4b525d" fontSize="14px" fontWeight="600" textAnchor="middle" dominantBaseline="central" x="42.5" y="86.25">L2</text>
                <text fill="#4b525d" fontSize="14px" fontWeight="600" textAnchor="middle" dominantBaseline="central" x="42.5" y="143.75">L3</text>
                <text fill="#4b525d" fontSize="14px" fontWeight="600" textAnchor="middle" dominantBaseline="central" x="42.5" y="201.25">L4</text>
            </g>

            {/* CENTER DOUBLE ROW SECTION */}
            <g transform="translate(225, 235)">
                <rect fill="none" stroke="#dcdfe4" strokeWidth="2" x="0" y="0" width="410" height="130" rx="12" style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.03))" }} />
                {/* Row 1 Spot Backgrounds */}
                <rect fill={getSpotColor("C1")} x="1.5" y="1.5" width="65.3" height="62" rx="10" />
                <rect fill={getSpotColor("C2")} x="69.8" y="1.5" width="65.3" height="62" rx="4" />
                <rect fill={getSpotColor("C3")} x="138.1" y="1.5" width="65.3" height="62" rx="4" />
                <rect fill={getSpotColor("C4")} x="206.4" y="1.5" width="65.3" height="62" rx="4" />
                <rect fill={getSpotColor("C5")} x="274.7" y="1.5" width="65.3" height="62" rx="4" />
                <rect fill={getSpotColor("C6")} x="343" y="1.5" width="65.5" height="62" rx="10" />
                {/* Row 2 Spot Backgrounds */}
                <rect fill={getSpotColor("C12")} x="1.5" y="66.5" width="65.3" height="62" rx="10" />
                <rect fill={getSpotColor("C11")} x="69.8" y="66.5" width="65.3" height="62" rx="4" />
                <rect fill={getSpotColor("C10")} x="138.1" y="66.5" width="65.3" height="62" rx="4" />
                <rect fill={getSpotColor("C9")} x="206.4" y="66.5" width="65.3" height="62" rx="4" />
                <rect fill={getSpotColor("C8")} x="274.7" y="66.5" width="65.3" height="62" rx="4" />
                <rect fill={getSpotColor("C7")} x="343" y="66.5" width="65.5" height="62" rx="10" />
                {/* Dividing Lines */}
                <line stroke="#e6ebf1" strokeWidth="1.5" x1="0" y1="65" x2="410" y2="65" />
                <line stroke="#e6ebf1" strokeWidth="1.5" x1="68.3" y1="0" x2="68.3" y2="130" />
                <line stroke="#e6ebf1" strokeWidth="1.5" x1="136.6" y1="0" x2="136.6" y2="130" />
                <line stroke="#e6ebf1" strokeWidth="1.5" x1="204.9" y1="0" x2="204.9" y2="130" />
                <line stroke="#e6ebf1" strokeWidth="1.5" x1="273.2" y1="0" x2="273.2" y2="130" />
                <line stroke="#e6ebf1" strokeWidth="1.5" x1="341.5" y1="0" x2="341.5" y2="130" />
                {/* C1 to C6 labels */}
                <text fill="#4b525d" fontSize="14px" fontWeight="600" textAnchor="middle" dominantBaseline="central" x="34.1" y="32.5">C1</text>
                <text fill="#4b525d" fontSize="14px" fontWeight="600" textAnchor="middle" dominantBaseline="central" x="102.4" y="32.5">C2</text>
                <text fill="#4b525d" fontSize="14px" fontWeight="600" textAnchor="middle" dominantBaseline="central" x="170.7" y="32.5">C3</text>
                <text fill="#4b525d" fontSize="14px" fontWeight="600" textAnchor="middle" dominantBaseline="central" x="239" y="32.5">C4</text>
                <text fill="#4b525d" fontSize="14px" fontWeight="600" textAnchor="middle" dominantBaseline="central" x="307.3" y="32.5">C5</text>
                <text fill="#4b525d" fontSize="14px" fontWeight="600" textAnchor="middle" dominantBaseline="central" x="375.6" y="32.5">C6</text>
                {/* C12 to C7 labels */}
                <text fill="#4b525d" fontSize="14px" fontWeight="600" textAnchor="middle" dominantBaseline="central" x="34.1" y="97.5">C12</text>
                <text fill="#4b525d" fontSize="14px" fontWeight="600" textAnchor="middle" dominantBaseline="central" x="102.4" y="97.5">C11</text>
                <text fill="#4b525d" fontSize="14px" fontWeight="600" textAnchor="middle" dominantBaseline="central" x="170.7" y="97.5">C10</text>
                <text fill="#4b525d" fontSize="14px" fontWeight="600" textAnchor="middle" dominantBaseline="central" x="239" y="97.5">C9</text>
                <text fill="#4b525d" fontSize="14px" fontWeight="600" textAnchor="middle" dominantBaseline="central" x="307.3" y="97.5">C8</text>
                <text fill="#4b525d" fontSize="14px" fontWeight="600" textAnchor="middle" dominantBaseline="central" x="375.6" y="97.5">C7</text>
            </g>

            {/* RIGHT SECTION: R1 to R4 */}
            <g transform="translate(710, 190)">
                <rect fill="none" stroke="#dcdfe4" strokeWidth="2" x="0" y="0" width="85" height="230" rx="12" style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.03))" }} />
                {/* Individual Spot Backgrounds */}
                <rect fill={getSpotColor("R1")} x="1.5" y="1.5" width="82" height="54" rx="10" />
                <rect fill={getSpotColor("R2")} x="1.5" y="59" width="82" height="55" rx="4" />
                <rect fill={getSpotColor("R3")} x="1.5" y="116.5" width="82" height="55" rx="4" />
                <rect fill={getSpotColor("R4")} x="1.5" y="174" width="82" height="54.5" rx="10" />
                {/* Dividing Lines */}
                <line stroke="#e6ebf1" strokeWidth="1.5" x1="0" y1="57.5" x2="85" y2="57.5" />
                <line stroke="#e6ebf1" strokeWidth="1.5" x1="0" y1="115" x2="85" y2="115" />
                <line stroke="#e6ebf1" strokeWidth="1.5" x1="0" y1="172.5" x2="85" y2="172.5" />
                {/* Labels */}
                <text fill="#4b525d" fontSize="14px" fontWeight="600" textAnchor="middle" dominantBaseline="central" x="42.5" y="28.75">R1</text>
                <text fill="#4b525d" fontSize="14px" fontWeight="600" textAnchor="middle" dominantBaseline="central" x="42.5" y="86.25">R2</text>
                <text fill="#4b525d" fontSize="14px" fontWeight="600" textAnchor="middle" dominantBaseline="central" x="42.5" y="143.75">R3</text>
                <text fill="#4b525d" fontSize="14px" fontWeight="600" textAnchor="middle" dominantBaseline="central" x="42.5" y="201.25">R4</text>
            </g>

            {/* BOTTOM SECTION: D1 to D5 */}
            <g transform="translate(270, 450)">
                <rect fill="none" stroke="#dcdfe4" strokeWidth="2" x="0" y="0" width="325" height="85" rx="12" style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.03))" }} />
                {/* Individual Spot Backgrounds */}
                <rect fill={getSpotColor("D1")} x="1.5" y="1.5" width="62" height="82" rx="10" />
                <rect fill={getSpotColor("D2")} x="66" y="1.5" width="62" height="82" rx="4" />
                <rect fill={getSpotColor("D3")} x="131" y="1.5" width="62" height="82" rx="4" />
                <rect fill={getSpotColor("D4")} x="196" y="1.5" width="62" height="82" rx="4" />
                <rect fill={getSpotColor("D5")} x="261" y="1.5" width="62.5" height="82" rx="10" />
                {/* Dividing Lines */}
                <line stroke="#e6ebf1" strokeWidth="1.5" x1="65" y1="0" x2="65" y2="85" />
                <line stroke="#e6ebf1" strokeWidth="1.5" x1="130" y1="0" x2="130" y2="85" />
                <line stroke="#e6ebf1" strokeWidth="1.5" x1="195" y1="0" x2="195" y2="85" />
                <line stroke="#e6ebf1" strokeWidth="1.5" x1="260" y1="0" x2="260" y2="85" />
                {/* Labels */}
                <text fill="#4b525d" fontSize="14px" fontWeight="600" textAnchor="middle" dominantBaseline="central" x="32.5" y="42.5">D1</text>
                <text fill="#4b525d" fontSize="14px" fontWeight="600" textAnchor="middle" dominantBaseline="central" x="97.5" y="42.5">D2</text>
                <text fill="#4b525d" fontSize="14px" fontWeight="600" textAnchor="middle" dominantBaseline="central" x="162.5" y="42.5">D3</text>
                <text fill="#4b525d" fontSize="14px" fontWeight="600" textAnchor="middle" dominantBaseline="central" x="227.5" y="42.5">D4</text>
                <text fill="#4b525d" fontSize="14px" fontWeight="600" textAnchor="middle" dominantBaseline="central" x="292.5" y="42.5">D5</text>
            </g>

            {/* DIRECTIONAL AND LANE FLOW ARROWS */}
            <line fill="none" stroke="#8a94a6" strokeWidth="1.75" strokeLinecap="round" x1="180" y1="120" x2="180" y2="75" markerStart="url(#arrow)" />
            <line fill="none" stroke="#8a94a6" strokeWidth="1.75" strokeLinecap="round" x1="210" y1="75" x2="210" y2="120" markerEnd="url(#arrow)" />

            <line fill="none" stroke="#8a94a6" strokeWidth="1.75" strokeLinecap="round" x1="190" y1="230" x2="190" y2="190" markerEnd="url(#arrow)" />
            <line fill="none" stroke="#8a94a6" strokeWidth="1.75" strokeLinecap="round" x1="190" y1="365" x2="190" y2="325" markerEnd="url(#arrow)" />
            <line fill="none" stroke="#8a94a6" strokeWidth="1.75" strokeLinecap="round" x1="190" y1="510" x2="190" y2="470" markerEnd="url(#arrow)" />

            <line fill="none" stroke="#8a94a6" strokeWidth="1.75" strokeLinecap="round" x1="320" y1="190" x2="380" y2="190" markerEnd="url(#arrow)" />
            <line fill="none" stroke="#8a94a6" strokeWidth="1.75" strokeLinecap="round" x1="460" y1="190" x2="520" y2="190" markerEnd="url(#arrow)" />
            <line fill="none" stroke="#8a94a6" strokeWidth="1.75" strokeLinecap="round" x1="600" y1="190" x2="660" y2="190" markerEnd="url(#arrow)" />

            <line fill="none" stroke="#8a94a6" strokeWidth="1.75" strokeLinecap="round" x1="675" y1="280" x2="675" y2="330" markerEnd="url(#arrow)" />

            <line fill="none" stroke="#8a94a6" strokeWidth="1.75" strokeLinecap="round" x1="725" y1="460" x2="725" y2="505" markerEnd="url(#arrow)" />
            <line fill="none" stroke="#8a94a6" strokeWidth="1.75" strokeLinecap="round" x1="755" y1="505" x2="755" y2="460" markerEnd="url(#arrow)" />

            <line fill="none" stroke="#8a94a6" strokeWidth="1.75" strokeLinecap="round" x1="675" y1="410" x2="625" y2="410" markerEnd="url(#arrow)" />
            <line fill="none" stroke="#8a94a6" strokeWidth="1.75" strokeLinecap="round" x1="550" y1="410" x2="500" y2="410" markerEnd="url(#arrow)" />
            <line fill="none" stroke="#8a94a6" strokeWidth="1.75" strokeLinecap="round" x1="430" y1="410" x2="380" y2="410" markerEnd="url(#arrow)" />
            <line fill="none" stroke="#8a94a6" strokeWidth="1.75" strokeLinecap="round" x1="310" y1="410" x2="260" y2="410" markerEnd="url(#arrow)" />
        </svg>
    );
}