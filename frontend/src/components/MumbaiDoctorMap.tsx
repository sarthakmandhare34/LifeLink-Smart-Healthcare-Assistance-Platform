/// <reference types="@types/google.maps" />

import { useCallback, useEffect, useRef, useState } from "react";
import type { MumbaiRailLine } from "@shared/mumbaiRailNetwork";
import { MapView } from "./Map";

export type DirectoryMapDoctor = {
  id: string;
  name: string;
  specialty: string;
  locality: string;
  railLine: MumbaiRailLine;
  railLines: readonly MumbaiRailLine[];
  station: string;
  latitude: number;
  longitude: number;
};

type MumbaiDoctorMapProps = {
  doctors: DirectoryMapDoctor[];
  selectedDoctorId: string | null;
  onSelectDoctor: (doctorId: string) => void;
};

const MUMBAI_CENTER = { lat: 19.076, lng: 72.8777 };

export function MumbaiDoctorMap({ doctors, selectedDoctorId, onSelectDoctor }: MumbaiDoctorMapProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapFailed, setMapFailed] = useState(false);
  const markersRef = useRef<Array<{ marker: google.maps.marker.AdvancedMarkerElement; listener: google.maps.MapsEventListener }>>([]);

  const onMapReady = useCallback((readyMap: google.maps.Map) => {
    setMapFailed(false);
    setMap(readyMap);
  }, []);

  useEffect(() => {
    if (!map || !window.google) return;

    markersRef.current.forEach(({ marker, listener }) => {
      listener.remove();
      marker.map = null;
    });

    const bounds = new window.google.maps.LatLngBounds();
    markersRef.current = doctors.map((doctor) => {
      const marker = new window.google.maps.marker.AdvancedMarkerElement({
        map,
        position: { lat: doctor.latitude, lng: doctor.longitude },
        title: `${doctor.name} — ${doctor.specialty} in ${doctor.locality}`,
      });
      const listener = marker.addListener("click", () => onSelectDoctor(doctor.id));
      bounds.extend({ lat: doctor.latitude, lng: doctor.longitude });
      return { marker, listener };
    });

    if (doctors.length === 1) {
      map.setCenter({ lat: doctors[0].latitude, lng: doctors[0].longitude });
      map.setZoom(13);
    } else if (doctors.length > 1) {
      map.fitBounds(bounds, 48);
    } else {
      map.setCenter(MUMBAI_CENTER);
      map.setZoom(11);
    }

    return () => {
      markersRef.current.forEach(({ marker, listener }) => {
        listener.remove();
        marker.map = null;
      });
      markersRef.current = [];
    };
  }, [doctors, map, onSelectDoctor]);

  useEffect(() => {
    const selectedDoctor = doctors.find((doctor) => doctor.id === selectedDoctorId);
    if (map && selectedDoctor) {
      map.panTo({ lat: selectedDoctor.latitude, lng: selectedDoctor.longitude });
      map.setZoom(14);
    }
  }, [doctors, map, selectedDoctorId]);

  return (
    <div className="mumbai-directory-map-wrap">
      <MapView
        className="mumbai-directory-map"
        initialCenter={MUMBAI_CENTER}
        initialZoom={11}
        onMapReady={onMapReady}
        onMapError={() => setMapFailed(true)}
      />
      {map && <p className="mumbai-map-status" role="status">Interactive Google Maps view is ready. Select a directory card or marker to focus its controlled location.</p>}
      {mapFailed && <p className="mumbai-map-error" role="status">The interactive map is unavailable in this session. Directory filters and appointment requests remain available; no location or distance is inferred.</p>}
    </div>
  );
}
