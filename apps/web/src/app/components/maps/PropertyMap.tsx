/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  GoogleMap,
  useLoadScript,
  OverlayView,
  OverlayViewF,
} from "@react-google-maps/api";

type LatLngLiteral = { lat: number; lng: number };

interface PropertyMapProps {
  address: string;
  zoom?: number;
}

const defaultCenter: LatLngLiteral = { lat: 51.5074, lng: -0.1278 }; // London
const mapContainerStyle = { width: "100%", height: "100%" };

export default function PropertyMap({ address, zoom = 15 }: PropertyMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAP_ID; // optional

  // Load marker lib only if we *might* use Advanced Markers
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: useMemo(() => (mapId ? (["marker"] as any) : []), [mapId]),
  });

  const [center, setCenter] = useState<LatLngLiteral | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);

  const mapRef = useRef<google.maps.Map | null>(null);
  const advancedMarkerRef =
    useRef<google.maps.marker.AdvancedMarkerElement | null>(null);

  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  // Geocode address
  useEffect(() => {
    if (!isLoaded || !address) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const loc = results[0].geometry.location;
        setCenter({ lat: loc.lat(), lng: loc.lng() });
        setGeoError(null);
      } else {
        setCenter(defaultCenter);
        setGeoError("Could not geocode address");
      }
    });
  }, [isLoaded, address]);

  // Advanced Marker only when mapId is present (vector map)
  useEffect(() => {
    if (!isLoaded || !mapRef.current || !center || !mapId) return;

    if (advancedMarkerRef.current) {
      advancedMarkerRef.current.map = null;
      advancedMarkerRef.current = null;
    }

    const init = async () => {
      await google.maps.importLibrary?.("marker"); // no-op if loaded
      const marker = new google.maps.marker.AdvancedMarkerElement({
        map: mapRef.current!,
        position: center,
        title: address,
        // Optional: custom PinElement
        // content: new google.maps.marker.PinElement({ scale: 1.1 }).element,
      });
      advancedMarkerRef.current = marker;
    };

    init();

    return () => {
      if (advancedMarkerRef.current) {
        advancedMarkerRef.current.map = null;
        advancedMarkerRef.current = null;
      }
    };
  }, [isLoaded, center, address, mapId]);

  if (!apiKey) {
    return (
      <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
        Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
        Failed to load Google Maps.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
        Loading map…
      </div>
    );
  }

  return (
    <GoogleMap
      onLoad={handleMapLoad}
      mapContainerStyle={mapContainerStyle}
      center={center ?? defaultCenter}
      zoom={center ? zoom : 10}
      options={{
        mapId: mapId || undefined, // Advanced Markers need this; Overlay fallback doesn’t
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      }}
    >
      {/* Fallback HTML pin (no Map ID required, no deprecation warnings) */}
      {!mapId && center && (
        <OverlayViewF
          position={center}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
          <div
            style={{
              transform: "translate(-50%, -100%)",
              position: "relative",
            }}
          >
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: "9999px",
                background: "#7c3aed",
                border: "2px solid white",
                boxShadow: "0 1px 6px rgba(0,0,0,0.3)",
              }}
              title={address}
            />
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: "6px solid transparent",
                borderRight: "6px solid transparent",
                borderTop: "10px solid #7c3aed",
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                bottom: -8,
                filter: "drop-shadow(0 1px 4px rgba(0,0,0,0.2))",
              }}
            />
          </div>
        </OverlayViewF>
      )}

      {!center && geoError && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded bg-white/90 px-2 py-1 text-xs shadow">
          {geoError}
        </div>
      )}
    </GoogleMap>
  );
}
