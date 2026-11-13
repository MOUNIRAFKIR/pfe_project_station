'use client'
import { useState, useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { Map, MapControls , type MapRef} from "@/components/ui/map";
//import { Card } from "../../components/ui/map";

const styles = {
    default: undefined,
    openstreetmap: "https://tiles.openfreemap.org/styles/bright",
    openstreetmap3d: "https://tiles.openfreemap.org/styles/liberty",
};
type StyleKey = keyof typeof styles;

export default function HomePage() {
    const mapRef = useRef<MapRef>(null);
    const [style, setStyle] = useState<StyleKey>("default");
    const selectedStyle = styles[style];
    const is3D = style === "openstreetmap3d";

    useEffect(() => {
        mapRef.current?.easeTo({ pitch: is3D ? 60 : 0, duration: 500 });
    }, [is3D]);

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