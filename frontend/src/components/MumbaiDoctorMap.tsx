/// <reference types="@types/google.maps" />

import { useCallback, useEffect, useRef, useState } from "react";
import { getMumbaiRailCorridors, getMumbaiRailStation, type MumbaiRailLine } from "@shared/mumbaiRailNetwork";
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
  railLine: MumbaiRailLine | null;
  selectedStation: string | null;
  onSelectStation: (station: string) => void;
};

const MUMBAI_CENTER = { lat: 19.076, lng: 72.8777 };

export function MumbaiDoctorMap({ doctors, selectedDoctorId, onSelectDoctor, railLine, selectedStation, onSelectStation }: MumbaiDoctorMapProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapFailed, setMapFailed] = useState(false);
  const markersRef = useRef<Array<{ marker: google.maps.marker.AdvancedMarkerElement; listener: google.maps.MapsEventListener }>>([]);

  const onMapReady = useCallback((readyMap: google.maps.Map) => setMap(readyMap), []);

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

  const visibleCorridors = getMumbaiRailCorridors(railLine ?? undefined);

  return (
    <div className="mumbai-directory-map-wrap">
      <MapView
        className="mumbai-directory-map"
        initialCenter={MUMBAI_CENTER}
        initialZoom={11}
        onMapReady={onMapReady}
        onMapError={() => setMapFailed(true)}
      />
      {mapFailed && <p className="mumbai-map-error" role="status">The interactive map is unavailable in this session. Directory filters and appointment requests remain available; no location or distance is inferred.</p>}
      <section className="mumbai-rail-guide" aria-labelledby="mumbai-rail-guide-heading">
        <div className="mumbai-rail-guide-header">
          <div>
            <p className="caption">Station reference</p>
            <h3 id="mumbai-rail-guide-heading">Mumbai suburban rail guide</h3>
          </div>
          <span>{railLine ? `${railLine} line` : "All lines"}</span>
        </div>
        <p className="caption mumbai-rail-guide-copy">Stations follow the supplied travel-order reference. Shared stations remain one entity with multiple line associations.</p>
        <div className="mumbai-rail-corridors">
          {visibleCorridors.map((corridor) => (
            <details key={corridor.id} className={`mumbai-rail-corridor line-${corridor.line.toLowerCase()}`} open={railLine === corridor.line}>
              <summary><span>{corridor.line}</span><strong>{corridor.label}</strong><small>{corridor.stations.length} stations</small></summary>
              <div className="mumbai-rail-stations">
                {corridor.stations.map((stationName, index) => {
                  const station = getMumbaiRailStation(stationName);
                  const shared = Boolean(station && station.lines.length > 1);
                  return <button type="button" key={`${corridor.id}-${stationName}`} className={`mumbai-rail-station ${selectedStation === stationName ? "is-selected" : ""}`} onClick={() => onSelectStation(stationName)}>
                    <span className="mumbai-rail-station-index">{index + 1}</span>
                    <span>{stationName}</span>
                    {shared && <em>{station?.lines.join(" + ")}</em>}
                  </button>;
                })}
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
