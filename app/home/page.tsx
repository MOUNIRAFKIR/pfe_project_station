'use client'

import { useEffect, useMemo, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import type * as LeafletNS from "leaflet";


type Station = {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    totalSpots: number;
    availableSpots: number;
    pricePerHour: number;
};

const STATIONS: Station[] = [];

const MAP_CENTER: [number, number] = [31.6295, -7.9811];
const MAP_ZOOM = 13;
const MARRAKECH_BOUNDS: [[number, number], [number, number]] = [
    [31.34, -8.26],
    [31.86, -7.58],
];

const ACCENT = "#ff6600";
const IOS_BLUE = "#0a84ff";
const MATERIAL = "rgba(255, 255, 255, 0.82)";
const MATERIAL_BORDER = "rgba(255, 255, 255, 0.65)";
const SF =
    "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'Segoe UI', system-ui, sans-serif";

export default function HomePage() {
    const mapEl = useRef<HTMLDivElement | null>(null);
    const mapInstance = useRef<LeafletNS.Map | null>(null);
    const markersRef = useRef<LeafletNS.LayerGroup | null>(null);
    const leafletRef = useRef<typeof LeafletNS | null>(null);

    const [query, setQuery] = useState("");
    const [onlyAvailable, setOnlyAvailable] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [mapReady, setMapReady] = useState(false);
    const [expanded, setExpanded] = useState(true);

    const filtered = useMemo(() => {
        return STATIONS.filter((station) => {
            const matchesQuery =
                query.trim().length === 0 ||
                `${station.name} ${station.address}`.toLowerCase().includes(query.toLowerCase());
            const matchesAvailability = !onlyAvailable || station.availableSpots > 0;
            return matchesQuery && matchesAvailability;
        });
    }, [query, onlyAvailable]);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            const mod = await import("leaflet");
            const L = ((mod as unknown as { default?: typeof LeafletNS }).default ??
                (mod as unknown as typeof LeafletNS)) as typeof LeafletNS;

            if (cancelled || !mapEl.current || mapInstance.current) return;

            const map = L.map(mapEl.current, {
                center: MAP_CENTER,
                zoom: MAP_ZOOM,
                zoomControl: false,
                attributionControl: false,
                minZoom: 12,
                maxZoom: 18,
                maxBounds: MARRAKECH_BOUNDS,
                maxBoundsViscosity: 1.0,
            });

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 19,
                attribution: '&copy; OpenStreetMap contributors',
            }).addTo(map);

            L.control
                .attribution({ position: "bottomleft", prefix: false })
                .addAttribution('&copy; OpenStreetMap')
                .addTo(map);

            leafletRef.current = L;
            mapInstance.current = map;
            markersRef.current = L.layerGroup().addTo(map);
            setMapReady(true);

            setTimeout(() => map.invalidateSize(), 200);
        })();

        return () => {
            cancelled = true;
            mapInstance.current?.remove();
            mapInstance.current = null;
            markersRef.current = null;
            leafletRef.current = null;
        };
    }, []);

    useEffect(() => {
        const L = leafletRef.current;
        const map = mapInstance.current;
        const group = markersRef.current;
        if (!L || !map || !group) return;

        group.clearLayers();

        for (const station of filtered) {
            const icon = L.divIcon({
                className: "flux-marker",
                html:
                    `<div style="position:relative;width:34px;height:34px;display:flex;align-items:center;justify-content:center;border-radius:50%;background:${ACCENT};border:3px solid #fff;box-shadow:0 6px 16px -4px rgba(0,0,0,0.35)">`
                    + `<span style="color:#fff;font-size:12px;font-weight:800;font-family:${SF}">${station.availableSpots}</span></div>`,
                iconSize: [34, 34],
                iconAnchor: [17, 17],
                popupAnchor: [0, -18],
            });

            L.marker([station.latitude, station.longitude], { icon })
                .addTo(group)
                .bindPopup(
                    `<div style="font-family:${SF};min-width:190px">`
                        + `<div style="font-weight:700;font-size:15px;color:#1c1c1e">${station.name}</div>`
                        + `<div style="font-size:12px;color:#8e8e93;margin:2px 0 10px">${station.address}</div>`
                        + `<div style="display:flex;justify-content:space-between;font-size:13px;color:#3a3a3c">`
                        + `<span>${station.availableSpots}/${station.totalSpots} free</span>`
                        + `<span style="color:${ACCENT};font-weight:700">${station.pricePerHour.toFixed(2)} /h</span>`
                        + `</div></div>`,
                );
        }

        if (filtered.length > 0) {
            const bounds = L.latLngBounds(filtered.map((s) => [s.latitude, s.longitude] as [number, number]));
            map.fitBounds(bounds.pad(0.3));
        }
    }, [mapReady, filtered]);

    function focusStation(station: Station) {
        setSelectedId(station.id);
        const map = mapInstance.current;
        if (!map) return;
        map.flyTo([station.latitude, station.longitude], 15, { duration: 0.8 });
    }

    function locateMe() {
        const map = mapInstance.current;
        if (!map || typeof navigator === "undefined" || !navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            (pos) => map.flyTo([pos.coords.latitude, pos.coords.longitude], 15, { duration: 0.8 }),
            () => undefined,
            { enableHighAccuracy: true, timeout: 8000 },
        );
    }

    const controlsBottom = expanded ? 336 : 168;

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                height: "100dvh",
                overflow: "hidden",
                fontFamily: SF,
                color: "#1c1c1e",
                background: "#e9e5df",
            }}
        >
            <style>{`
                .leaflet-container { font-family: ${SF}; background: #e9e5df; }
                .leaflet-tile-pane { filter: saturate(0.62) contrast(0.94) brightness(1.06); }
                .leaflet-control-attribution { font-size: 10px; background: rgba(255,255,255,0.6) !important; border-radius: 8px; padding: 2px 6px; margin: 0 0 8px 8px; color: #8e8e93; }
                .leaflet-control-attribution a { color: #8e8e93; }
                .leaflet-popup-content-wrapper { border-radius: 14px; box-shadow: 0 12px 34px -12px rgba(0,0,0,0.4); }
                .leaflet-popup-content { margin: 14px 16px; }
                .flux-marker { background: transparent; border: 0; }
            `}</style>

            <div ref={mapEl} style={{ position: "absolute", inset: 0, zIndex: 0 }} />

            <div
                style={{
                    position: "absolute",
                    top: "calc(env(safe-area-inset-top, 0px) + 12px)",
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    display: "flex",
                    justifyContent: "center",
                    padding: "0 14px",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", maxWidth: "560px" }}>
                    <div
                        style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            height: "50px",
                            padding: "0 14px",
                            borderRadius: "14px",
                            background: MATERIAL,
                            border: `1px solid ${MATERIAL_BORDER}`,
                            boxShadow: "0 10px 30px -12px rgba(0,0,0,0.45)",
                            backdropFilter: "blur(24px) saturate(180%)",
                            WebkitBackdropFilter: "blur(24px) saturate(180%)",
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8e8e93" strokeWidth="2.2" strokeLinecap="round">
                            <circle cx="11" cy="11" r="7" />
                            <path d="M16.5 16.5 21 21" />
                        </svg>
                        <input
                            type="search"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Search stations in Marrakech"
                            style={{
                                flex: 1,
                                minWidth: 0,
                                border: "none",
                                outline: "none",
                                background: "transparent",
                                fontSize: "16px",
                                color: "#1c1c1e",
                                fontFamily: SF,
                            }}
                        />
                        {query.length > 0 && (
                            <button
                                type="button"
                                onClick={() => setQuery("")}
                                aria-label="Clear search"
                                style={{
                                    border: "none",
                                    background: "rgba(118,118,128,0.18)",
                                    color: "#8e8e93",
                                    width: "20px",
                                    height: "20px",
                                    borderRadius: "50%",
                                    cursor: "pointer",
                                    fontSize: "12px",
                                    lineHeight: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    <button
                        type="button"
                        aria-label="Account"
                        style={{
                            width: "50px",
                            height: "50px",
                            flex: "0 0 auto",
                            borderRadius: "14px",
                            background: MATERIAL,
                            border: `1px solid ${MATERIAL_BORDER}`,
                            boxShadow: "0 10px 30px -12px rgba(0,0,0,0.45)",
                            backdropFilter: "blur(24px) saturate(180%)",
                            WebkitBackdropFilter: "blur(24px) saturate(180%)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill={IOS_BLUE}>
                            <circle cx="12" cy="8" r="4" />
                            <path d="M4 20c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
                        </svg>
                    </button>
                </div>
            </div>

            <div
                style={{
                    position: "absolute",
                    right: "14px",
                    bottom: `calc(env(safe-area-inset-bottom, 0px) + ${controlsBottom}px)`,
                    zIndex: 1000,
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    transition: "bottom 0.28s ease",
                }}
            >
                <MapButton label="Zoom in" onClick={() => mapInstance.current?.zoomIn()}>
                    <path d="M12 5v14M5 12h14" />
                </MapButton>
                <MapButton label="Zoom out" onClick={() => mapInstance.current?.zoomOut()}>
                    <path d="M5 12h14" />
                </MapButton>
                <MapButton label="My location" onClick={locateMe} accent={IOS_BLUE}>
                    <path d="M12 3 4 21l8-4 8 4-8-18Z" fill={IOS_BLUE} stroke={IOS_BLUE} />
                </MapButton>
            </div>

            <div
                style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 1000,
                    display: "flex",
                    justifyContent: "center",
                    padding: "0 12px calc(env(safe-area-inset-bottom, 0px) + 12px)",
                }}
            >
                <div
                    style={{
                        width: "100%",
                        maxWidth: "560px",
                        background: MATERIAL,
                        border: `1px solid ${MATERIAL_BORDER}`,
                        borderRadius: "22px",
                        boxShadow: "0 -8px 40px -16px rgba(0,0,0,0.35)",
                        backdropFilter: "blur(28px) saturate(180%)",
                        WebkitBackdropFilter: "blur(28px) saturate(180%)",
                        overflow: "hidden",
                    }}
                >
                    <button
                        type="button"
                        onClick={() => setExpanded((value) => !value)}
                        aria-label={expanded ? "Collapse" : "Expand"}
                        style={{
                            width: "100%",
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                            padding: "8px 0 2px",
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <span
                            style={{
                                width: "38px",
                                height: "5px",
                                borderRadius: "3px",
                                background: "rgba(60,60,67,0.3)",
                            }}
                        />
                    </button>

                    <div style={{ padding: "4px 18px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                            <div>
                                <div style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "-0.02em" }}>
                                    Nearby
                                </div>
                                <div style={{ fontSize: "12px", color: "#8e8e93", marginTop: "1px" }}>
                                    {filtered.length} station{filtered.length === 1 ? "" : "s"} · Marrakech
                                </div>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    padding: "2px",
                                    borderRadius: "9px",
                                    background: "rgba(118,118,128,0.16)",
                                    gap: "2px",
                                }}
                            >
                                <Segment active={!onlyAvailable} onClick={() => setOnlyAvailable(false)}>
                                    All
                                </Segment>
                                <Segment active={onlyAvailable} onClick={() => setOnlyAvailable(true)}>
                                    Free
                                </Segment>
                            </div>
                        </div>

                        {expanded && (
                            <div
                                style={{
                                    marginTop: "14px",
                                    maxHeight: "min(38vh, 300px)",
                                    overflowY: "auto",
                                }}
                            >
                                {filtered.length === 0 ? (
                                    <div style={{ textAlign: "center", padding: "26px 12px 14px", color: "#8e8e93" }}>
                                        <div
                                            style={{
                                                width: "46px",
                                                height: "46px",
                                                margin: "0 auto 10px",
                                                borderRadius: "50%",
                                                background: "rgba(255,102,0,0.12)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2">
                                                <path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11Z" />
                                                <circle cx="12" cy="10" r="2.6" />
                                            </svg>
                                        </div>
                                        <div style={{ fontSize: "15px", fontWeight: 600, color: "#3a3a3c" }}>
                                            No stations yet
                                        </div>
                                        <div style={{ fontSize: "13px", marginTop: "3px" }}>
                                            Stations and their spots will appear here.
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                        {filtered.map((station) => (
                                            <button
                                                key={station.id}
                                                type="button"
                                                onClick={() => focusStation(station)}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "12px",
                                                    width: "100%",
                                                    textAlign: "left",
                                                    padding: "10px 12px",
                                                    borderRadius: "14px",
                                                    cursor: "pointer",
                                                    background:
                                                        selectedId === station.id
                                                            ? "rgba(255,102,0,0.10)"
                                                            : "rgba(255,255,255,0.6)",
                                                    border:
                                                        "1px solid " +
                                                        (selectedId === station.id
                                                            ? "rgba(255,102,0,0.5)"
                                                            : "rgba(60,60,67,0.08)"),
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: "38px",
                                                        height: "38px",
                                                        flex: "0 0 auto",
                                                        borderRadius: "10px",
                                                        background: ACCENT,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                    }}
                                                >
                                                    <span style={{ color: "#fff", fontWeight: 800, fontSize: "13px" }}>
                                                        P
                                                    </span>
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div
                                                        style={{
                                                            fontSize: "15px",
                                                            fontWeight: 600,
                                                            color: "#1c1c1e",
                                                            whiteSpace: "nowrap",
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                        }}
                                                    >
                                                        {station.name}
                                                    </div>
                                                    <div
                                                        style={{
                                                            fontSize: "12px",
                                                            color: "#8e8e93",
                                                            whiteSpace: "nowrap",
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                        }}
                                                    >
                                                        {station.address}
                                                    </div>
                                                </div>
                                                <div style={{ textAlign: "right", flex: "0 0 auto" }}>
                                                    <div style={{ fontSize: "13px", fontWeight: 700, color: "#16a34a" }}>
                                                        {station.availableSpots} free
                                                    </div>
                                                    <div style={{ fontSize: "11px", color: "#8e8e93" }}>
                                                        {station.pricePerHour.toFixed(2)}/h
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function MapButton({
    children,
    label,
    onClick,
    accent,
}: {
    children: React.ReactNode;
    label: string;
    onClick: () => void;
    accent?: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={label}
            style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: MATERIAL,
                border: `1px solid ${MATERIAL_BORDER}`,
                boxShadow: "0 8px 24px -10px rgba(0,0,0,0.4)",
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke={accent ?? "#3a3a3c"}
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                {children}
            </svg>
        </button>
    );
}

function Segment({
    children,
    active,
    onClick,
}: {
    children: React.ReactNode;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            style={{
                border: "none",
                cursor: "pointer",
                padding: "6px 12px",
                borderRadius: "7px",
                fontSize: "13px",
                fontWeight: 600,
                fontFamily: SF,
                color: active ? "#1c1c1e" : "#3a3a3c",
                background: active ? "#ffffff" : "transparent",
                boxShadow: active ? "0 1px 3px rgba(0,0,0,0.16)" : "none",
            }}
        >
            {children}
        </button>
    );
}
