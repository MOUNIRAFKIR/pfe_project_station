'use client'
import { useState, useEffect, useRef } from "react";
import { Map, MapControls,MapMarker,MarkerContent,MarkerPopup, type MapRef} from "@/components/ui/map";
import Image from "next/image";
import { Navigation } from "lucide-react";
import { MapPin } from "lucide-react";
import carIcon from "@/pictures/icons8-car-96.png";
import {GetLocalisation} from "../actions/auth"
import ParkingMap from "../../components/ParkingMap";
//import { Card } from "../../components/ui/map";

const styles = {
    default: undefined,
    openstreetmap: "https://tiles.openfreemap.org/styles/bright",
    openstreetmap3d: "https://tiles.openfreemap.org/styles/liberty",
};
type StyleKey = keyof typeof styles;

type Parking = {
    id: string;
    name: string;
    address: string;
    totalSpots: number;
    pricePerHour: number;
    latitude: number | null;
    longitude: number | null;
};

export default function HomePage() {
    const mapRef = useRef<MapRef>(null);
    const [style, setStyle] = useState<StyleKey>("default");
    const selectedStyle = styles[style];
    const is3D = style === "openstreetmap3d";
    const [isisExpanded , setIsisExpanded] = useState(false);
    const [parkings, setParkings] = useState<Parking[]>([]);
    const [selectedParking,setSelectedParking] = useState<(typeof parkings)[number] | null>(null);

    const handleselectedParking = (parking: (typeof parkings)[number]) => {
        setSelectedParking(parking);
    }
    useEffect(() => {
        GetLocalisation()
            .then(setParkings)
            .catch((err) => console.error("Failed to load parkings", err));
    }, []);

    useEffect(() => {
        mapRef.current?.easeTo({ pitch: is3D ? 60 : 0, duration: 500 });
    }, [is3D]);

    const parkingStatuses = {
        // Top Rows
        U1: "red",     // Occupied
        U2: "green",   // Available
        U4: "orange",  // Reserved

        // Middle Rows
        C3: "yellow",  // Selected
        C5: "red",     // Occupied
        C12: "green",  // Available

        // Left & Right Block
        L1: "orange",  // Reserved
        L4: "green",   // Available
        R1: "red",     // Occupied
        R2: "yellow",  // Selected

        // Bottom Row
        D3: "green",   // Available
        D5: "red",     // Occupied
    };

    return (
        <div>
            <div style={{ position: "relative", height: "100vh", zIndex: 1 }}>
                <Map ref={mapRef}
                    center={[-7.978, 31.629]}
                    zoom={14}
                    styles={
                        selectedStyle
                            ? { light: selectedStyle, dark: selectedStyle }
                            : undefined
                }>
                    <MapControls
                        position="center-right"
                        showZoom
                        showCompass
                        showLocate
                        showFullscreen
                    />
                    {parkings.map((p) => p.latitude !== null && p.longitude !== null ? (
                        <MapMarker key={p.id} longitude={p.longitude} latitude={p.latitude}>
                            <MarkerContent>
                                <div style={{
                                        width: "20px",
                                        height: "20px",
                                        cursor: "pointer",
                                        borderRadius: "9999px",
                                        border: "2px solid #ffffff",
                                        background: "#ff6600",
                                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
                                        transition: "transform 150ms ease",
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.1)"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                                    onClick={()=>{
                                        setIsisExpanded(true)
                                        handleselectedParking(p);
                                    }}
                                />
                            </MarkerContent>
                            <MarkerPopup className="bg-transparent border-transparent p-0 shadow-none"
                                         // anchor="center"
                                         offset={0}>
                                <div className="cursor-move">
                                    <MapPin
                                        className="fill-red-700 stroke-white dark:fill-white"
                                        size={38}
                                    />
                                </div>
                            </MarkerPopup>
                        </MapMarker>
                    ) : null)}
                </Map>

                <div style={{
                        position: "absolute",
                        top: "1rem",
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 10,
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        width: "min(420px, calc(100% - 2rem))",
                        padding: "10px 14px",
                        borderRadius: "12px",
                        border: "1px solid rgba(255, 255, 255, 0.65)",
                        background: "rgba(255, 255, 255, 0.82)",
                        backdropFilter: "blur(20px) saturate(180%)",
                        WebkitBackdropFilter: "blur(20px) saturate(180%)",
                        boxShadow: "0 10px 30px -12px rgba(0, 0, 0, 0.45)",
                    }}>
                    <svg width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#8e8e93"
                        strokeWidth="2.2"
                        strokeLinecap="round">
                        <circle cx="11" cy="11" r="7" />
                        <path d="M16.5 16.5 21 21" />
                    </svg>
                    <input
                        type="search"
                        //value={query}
                        //onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search stations in Marrakech"
                        style={{
                            flex: 1,
                            minWidth: 0,
                            border: "none",
                            outline: "none",
                            background: "transparent",
                            fontSize: "16px",
                            color: "#1c1c1e",
                            //fontFamily: SF,
                        }}
                    />
                </div>
                <div style={{
                    position: "absolute",
                    bottom: "1rem",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 10,
                    ...(!isisExpanded && {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }),
                    gap: "8px",
                    width: isisExpanded ? "min(800px, calc(100% - 2rem))" : "150px",
                    height: isisExpanded ? "min(600px, calc(100% - 2rem))" : "40px",
                    transition: "width 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), height 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    padding: "10px 14px",
                    borderRadius: isisExpanded ? "15px":"12px",
                    boxSizing: "border-box",
                    overflow: "hidden",
                    border: "1px solid rgba(255, 255, 255, 0.65)",
                    background: "rgba(255, 255, 255, 0.82)",
                    backdropFilter: "blur(20px) saturate(180%)",
                    WebkitBackdropFilter: "blur(20px) saturate(180%)",
                    boxShadow: "0 10px 30px -12px rgba(0, 0, 0, 0.45)",
                }}>
                    <button
                        type="button"
                        onClick={() => {
                                setIsisExpanded(!isisExpanded);
                                setSelectedParking(null);
                            }
                        }
                        aria-label={isisExpanded ? "Collapse panel" : "Expand panel"}
                        style={{
                            position: "absolute",
                            ...(isisExpanded ? { top: "1rem", right: "1rem" } : {}),
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "28px",
                            height: "28px",
                            border: "none",
                            borderRadius: "8px",
                            ...(isisExpanded? {background: "rgba(118, 118, 128, 0.12)"}:{}),
                            color: "#1c1c1e",
                            fontSize: "16px",
                            lineHeight: 1,
                            cursor: "pointer",
                        }}>
                        {isisExpanded ? "×" : <Image src={carIcon} alt="Car" width={38} height={38} />}
                    </button>
                    {isisExpanded && (
                        <div style={{ display: "flex", height: "100%", minHeight: 0 }}>
                            {selectedParking ? (
                                <div style={{ display: "flex", gap: "16px", width: "100%", height: "100%", minHeight: 0 }}>
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "18px",
                                        flexShrink: 0,
                                        width: "300px",
                                        padding: "20px",
                                        boxSizing: "border-box",
                                        borderRadius: "16px",
                                        background: "linear-gradient(180deg, #ffffff 0%, #f7f8fa 100%)",
                                        border: "1px solid rgba(0, 0, 0, 0.04)",
                                        overflowY: "auto",
                                    }}>
                                        <span style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: "6px",
                                            alignSelf: "flex-start",
                                            padding: "4px 10px",
                                            borderRadius: "9999px",
                                            background: "rgba(34, 197, 94, 0.12)",
                                            color: "#15803d",
                                            fontSize: "11px",
                                            fontWeight: 700,
                                            letterSpacing: "0.04em",
                                            textTransform: "uppercase",
                                        }}>
                                            <span style={{ width: "6px", height: "6px", borderRadius: "9999px", background: "#22c55e" }} />
                                            Open now
                                        </span>

                                        <div>
                                            <h3 style={{ margin: 0, fontSize: "24px", lineHeight: 1.2, fontWeight: 700, letterSpacing: "-0.02em", color: "#1c1c1e" }}>
                                                {selectedParking.name}
                                            </h3>
                                            <p style={{ display: "flex", alignItems: "center", gap: "6px", margin: "8px 0 0", color: "var(--color-muted-foreground)", fontSize: "14px" }}>
                                                <MapPin style={{ width: "14px", height: "14px", flexShrink: 0 }} />
                                                {selectedParking.address}
                                            </p>
                                        </div>

                                        <div style={{ display: "flex", gap: "10px" }}>
                                            <div style={{ flex: 1, padding: "12px", borderRadius: "12px", background: "#ffffff", border: "1px solid #ececf1" }}>
                                                <p style={{ margin: 0, fontSize: "11px", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: "#8e8e93" }}>Capacity</p>
                                                <p style={{ margin: "4px 0 0", fontSize: "20px", fontWeight: 700, color: "#1c1c1e" }}>
                                                    {selectedParking.totalSpots}
                                                    <span style={{ marginLeft: "4px", fontSize: "12px", fontWeight: 500, color: "#8e8e93" }}>places</span>
                                                </p>
                                            </div>
                                            <div style={{ flex: 1, padding: "12px", borderRadius: "12px", background: "#ffffff", border: "1px solid #ececf1" }}>
                                                <p style={{ margin: 0, fontSize: "11px", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: "#8e8e93" }}>Price</p>
                                                <p style={{ margin: "4px 0 0", fontSize: "20px", fontWeight: 700, color: "#1c1c1e" }}>
                                                    {selectedParking.pricePerHour}
                                                    <span style={{ marginLeft: "4px", fontSize: "12px", fontWeight: 500, color: "#8e8e93" }}>DH/h</span>
                                                </p>
                                            </div>
                                        </div>

                                        <a href={`https://www.google.com/maps/dir/?api=1&destination=${selectedParking.latitude},${selectedParking.longitude}`}
                                           target="_blank" rel="noopener noreferrer"
                                           style={{
                                               marginTop: "auto",
                                               display: "flex",
                                               alignItems: "center",
                                               justifyContent: "center",
                                               gap: "8px",
                                               padding: "12px 16px",
                                               borderRadius: "12px",
                                               background: "#0a84ff",
                                               color: "#ffffff",
                                               fontSize: "14px",
                                               fontWeight: 600,
                                               textDecoration: "none",
                                               boxShadow: "0 10px 24px -10px rgba(10, 132, 255, 0.8)",
                                           }}>
                                            <Navigation style={{ width: "16px", height: "16px" }} />
                                            Get directions
                                        </a>
                                    </div>

                                    <div style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "12px",
                                        flex: 1,
                                        minWidth: 0,
                                        minHeight: 0,
                                        padding: "16px",
                                        boxSizing: "border-box",
                                        borderRadius: "16px",
                                        background: "#f2f4f7",
                                        border: "1px solid rgba(0, 0, 0, 0.04)",
                                    }}>
                                        <div style={{ paddingRight: "36px" }}>
                                            <p style={{ margin: 0, fontSize: "11px", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "#8e8e93" }}>Live occupancy</p>
                                            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "8px" }}>
                                                {[
                                                    ["#22c55e", "Available"],
                                                    ["#ff6600", "Reserved"],
                                                    ["#ef4444", "Occupied"],
                                                    ["#eab308", "Selected"],
                                                ].map(([color, label]) => (
                                                    <span key={label} style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#6b7280" }}>
                                                        <span style={{ width: "8px", height: "8px", borderRadius: "9999px", background: color }} />
                                                        {label}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div style={{ display: "flex", flex: 1, minHeight: 0, alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                                            <ParkingMap spotStatuses={parkingStatuses} />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "10px",
                                    width: "100%",
                                    height: "100%",
                                    textAlign: "center",
                                    color: "var(--color-muted-foreground)",
                                }}>
                                    <MapPin style={{ width: "28px", height: "28px", color: "#ff6600" }} />
                                    <p style={{ margin: 0, fontSize: "15px", fontWeight: 600, color: "#1c1c1e" }}>Select a parking on the map</p>
                                    <p style={{ margin: 0, fontSize: "13px" }}>Tap an orange marker to see details and availability.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div style={{ position: "absolute", top: "1rem", right: "1rem", zIndex: 10 }}>
                    <select
                        value={style}
                        onChange={(e) => setStyle(e.target.value as StyleKey)}
                        aria-label="Map style"
                        style={{
                            appearance: "none",
                            WebkitAppearance: "none",
                            padding: "10px 38px 10px 14px",
                            borderRadius: "12px",
                            border: "1px solid rgba(255, 255, 255, 0.65)",
                            backgroundColor: "rgba(255, 255, 255, 0.82)",
                            backgroundImage:
                                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%233a3a3c' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><path d='M6 9l6 6 6-6'/></svg>\")",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right 12px center",
                            backdropFilter: "blur(20px) saturate(180%)",
                            WebkitBackdropFilter: "blur(20px) saturate(180%)",
                            boxShadow: "0 10px 30px -12px rgba(0, 0, 0, 0.45)",
                            color: "#1c1c1e",
                            fontSize: "14px",
                            fontWeight: 600,
                            fontFamily:
                                "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', system-ui, sans-serif",
                            cursor: "pointer",
                            outline: "none",
                        }}>
                        <option value="default">Default</option>
                        <option value="openstreetmap">Streets</option>
                        <option value="openstreetmap3d">3D</option>
                    </select>
                </div>
            </div>
        </div>
    );
}