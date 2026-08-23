import { useCallback, useEffect, useMemo, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { BentoGrid, BentoItem } from '../../components/layout/Bento';
import { UserCheck, Search, MapPin, Building, Map as MapIcon, Route, TrainFront, LocateFixed, X } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { trpc } from '../../lib/trpc';
import { MumbaiDoctorMap } from '../../components/MumbaiDoctorMap';
import type { MumbaiRailLine } from '@shared/mumbaiRailNetwork';
import { sortByBrowserLocation, type BrowserLocation } from './discoveryLocation';
import '../../discovery.css';

const ALL_FILTER = 'all';
export const RESIDENCE_CORRIDOR_LABEL = 'Which part of Mumbai do you live in?';
export const RESIDENCE_STATION_LABEL = 'Which station is closest to where you live?';
export const BROWSER_LOCATION_TITLE = 'Optional browser location';
export const BROWSER_LOCATION_PRIVACY = 'Optional: use your browser location to order only the visible controlled development entries. Your location is not stored or sent to LifeLink.';
export const SPECIALTY_SEARCH_GUIDANCE = 'Free-text search matches specialties only. Use the Mumbai area and station filters below for where you live.';

export const SpecialistFinder = () => {
  const trpcUtils = trpc.useUtils();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSpecialty = searchParams.get('specialty') || ALL_FILTER;
  const [specialty, setSpecialty] = useState(initialSpecialty);
  const [railLine, setRailLine] = useState(ALL_FILTER);
  const [station, setStation] = useState(ALL_FILTER);
  const [searchTerm, setSearchTerm] = useState('');
  const discoveryFilters = useMemo(() => ({
    city: 'Mumbai' as const,
    specialty: specialty === ALL_FILTER ? undefined : specialty,
    railLine: railLine === ALL_FILTER ? undefined : railLine as MumbaiRailLine,
    station: station === ALL_FILTER ? undefined : station,
    query: searchTerm.trim() || undefined,
  }), [railLine, searchTerm, specialty, station]);
  const directoryQuery = trpc.patientDiscovery.list.useQuery(discoveryFilters);
  const facetsQuery = trpc.patientDiscovery.facets.useQuery();
  const availableStations = useMemo(() => (
    (facetsQuery.data?.stations ?? []).filter((candidate) => railLine === ALL_FILTER || candidate.lines.includes(railLine as MumbaiRailLine))
  ), [facetsQuery.data?.stations, railLine]);
  const requestMutation = trpc.patientAppointment.request.useMutation();
  const navigate = useNavigate();
  const [requestedAt, setRequestedAt] = useState('');
  const [requestedDocId, setRequestedDocId] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [requestError, setRequestError] = useState('');
  const [browserLocation, setBrowserLocation] = useState<BrowserLocation | null>(null);
  const [locationStatus, setLocationStatus] = useState(BROWSER_LOCATION_PRIVACY);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    const requestedSpecialty = searchParams.get('specialty') || ALL_FILTER;
    if (requestedSpecialty !== specialty) setSpecialty(requestedSpecialty);
  }, [searchParams, specialty]);

  useEffect(() => {
    if (selectedDocId && !directoryQuery.data?.some((doctor) => doctor.id === selectedDocId)) setSelectedDocId(null);
  }, [directoryQuery.data, selectedDocId]);

  useEffect(() => {
    if (station !== ALL_FILTER && !availableStations.some((candidate) => candidate.name === station)) setStation(ALL_FILTER);
  }, [availableStations, station]);

  const updateSpecialty = (nextSpecialty: string) => {
    setSpecialty(nextSpecialty);
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      if (nextSpecialty === ALL_FILTER) next.delete('specialty');
      else next.set('specialty', nextSpecialty);
      return next;
    }, { replace: true });
  };

  const updateRailLine = (nextRailLine: string) => {
    setRailLine(nextRailLine);
    if (station !== ALL_FILTER && nextRailLine !== ALL_FILTER && !availableStations.find((candidate) => candidate.name === station)?.lines.includes(nextRailLine as MumbaiRailLine)) setStation(ALL_FILTER);
  };

  const selectDoctor = useCallback((doctorId: string) => {
    setSelectedDocId(doctorId);
    setRequestError('');
  }, []);

  const requestBrowserLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('This browser does not support location. You can still choose the Mumbai area closest to where you live.');
      return;
    }

    setIsLocating(true);
    setLocationStatus('Requesting your browser location…');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setBrowserLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        setLocationStatus('Location is active for this page only. Controlled development entries are ordered approximately from your browser location; no coordinates are stored or sent to LifeLink.');
        setIsLocating(false);
      },
      () => {
        setLocationStatus('Location was not shared. You can continue using the Mumbai area and station filters; no location was stored.');
        setIsLocating(false);
      },
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 300_000 },
    );
  };

  const clearBrowserLocation = () => {
    setBrowserLocation(null);
    setLocationStatus('Browser location cleared. Directory results return to their standard controlled order; no location was stored.');
  };

  const handleRequest = async (doctorId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!requestedAt) {
      setRequestError('Choose a requested visit date and time before sending an appointment request.');
      return;
    }

    setProcessingId(doctorId);
    setRequestError('');
    try {
      await requestMutation.mutateAsync({ doctorId, scheduledAt: new Date(requestedAt) });
      await trpcUtils.patientAppointment.list.invalidate();
      await trpcUtils.patientDashboard.summary.invalidate();
      setRequestedDocId(doctorId);
      window.setTimeout(() => navigate('/patient/appointments'), 900);
    } catch (error: unknown) {
      setRequestError(error instanceof Error ? error.message : 'Unable to submit the appointment request.');
    } finally {
      setProcessingId(null);
    }
  };

  const filteredDoctors = directoryQuery.data ?? [];
  const displayedDoctors = useMemo(() => browserLocation ? sortByBrowserLocation(filteredDoctors, browserLocation) : filteredDoctors, [browserLocation, filteredDoctors]);

  if (directoryQuery.isLoading || facetsQuery.isLoading) return <div className="flex items-center justify-center h-full"><p className="caption">Loading the controlled Mumbai development directory…</p></div>;

  const facets = facetsQuery.data;

  return (
    <div className="container" style={{ padding: 0 }}>
      <header className="mb-4 flex items-center gap-3">
        <div style={{ width: 44, height: 44, borderRadius: '14px', background: 'rgba(0,27,48,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <UserCheck size={24} color="var(--color-primary)" />
        </div>
        <div>
          <h1 style={{ margin: 0 }}>Specialist Finder</h1>
          <p className="caption">Browse controlled Mumbai development entries by specialty and the Mumbai area closest to where you live, then send a patient-owned appointment request.</p>
        </div>
      </header>

      <Card variant="glass" className="mb-4">
        <div className="flex-col gap-3">
          <div className="mock-directory-notice" role="note">
            <MapIcon size={18} aria-hidden="true" />
            <span><strong>Development directory only.</strong> These are controlled mock entries, not verified clinicians, availability, ratings, or medical recommendations.</span>
          </div>
          <div style={{ display: 'flex', gap: 'var(--spacing-3)', alignItems: 'center' }}>
            <Search size={20} color="var(--color-primary)" style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <Input placeholder="Search by specialty…" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
              <p className="caption discovery-search-guidance">{SPECIALTY_SEARCH_GUIDANCE}</p>
            </div>
          </div>
          <div className="discovery-location-control">
            <div>
              <p className="discovery-location-title">{BROWSER_LOCATION_TITLE}</p>
              <p className="caption discovery-location-copy" aria-live="polite">{locationStatus}</p>
            </div>
            <div className="discovery-location-actions">
              <Button type="button" variant="outline" size="sm" onClick={requestBrowserLocation} disabled={isLocating}>
                <LocateFixed size={15} /> {isLocating ? 'Getting location…' : browserLocation ? 'Refresh my location' : 'Use my location'}
              </Button>
              {browserLocation && <Button type="button" variant="secondary" size="sm" onClick={clearBrowserLocation}><X size={15} /> Clear</Button>}
            </div>
          </div>
          <div className="discovery-filter-grid">
            <div>
              <label className="discovery-filter-label" htmlFor="specialty-filter">Specialty</label>
              <select id="specialty-filter" className="discovery-filter-select" value={specialty} onChange={(event) => updateSpecialty(event.target.value)}>
                <option value={ALL_FILTER}>All specialties</option>
                {facets?.specialties.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </div>
            <div>
              <label className="discovery-filter-label" htmlFor="rail-filter">{RESIDENCE_CORRIDOR_LABEL}</label>
              <select id="rail-filter" className="discovery-filter-select" value={railLine} onChange={(event) => updateRailLine(event.target.value)}>
                <option value={ALL_FILTER}>Choose a rail corridor</option>
                {facets?.railLines.map((value) => <option key={value} value={value}>{value} line</option>)}
              </select>
            </div>
            <div>
              <label className="discovery-filter-label" htmlFor="station-filter">{RESIDENCE_STATION_LABEL}</label>
              <select id="station-filter" className="discovery-filter-select" value={station} onChange={(event) => setStation(event.target.value)}>
                <option value={ALL_FILTER}>Choose a station</option>
                {availableStations.map((value) => <option key={value.id} value={value.name}>{value.name}{value.lines.length > 1 ? ` · ${value.lines.join(" + ")}` : ""}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: 'var(--text-caption)', color: 'var(--color-primary)' }}>Requested visit date and time</label>
            <Input type="datetime-local" value={requestedAt} onChange={(event) => setRequestedAt(event.target.value)} />
          </div>
          {requestError && <div className="alert-panel"><span className="caption">{requestError}</span></div>}
        </div>
      </Card>

      <div className="discovery-workspace">
        <section>
          <div className="discovery-results-heading">
            <div>
              <h2 style={{ fontSize: 'var(--text-h2)', margin: 0 }}>Mumbai Development Directory</h2>
              <p className="caption">{displayedDoctors.length} controlled {displayedDoctors.length === 1 ? 'entry' : 'entries'} match the current filters.{browserLocation ? ' They are ordered approximately from your browser location.' : ''}</p>
            </div>
            <Badge status="neutral">Mumbai only</Badge>
          </div>
          <BentoGrid>
            {displayedDoctors.map((doctor) => {
              const isSelected = selectedDocId === doctor.id;
              return (
                <BentoItem key={doctor.id} colSpan={2}>
                  <Card variant="glass" interactive selected={isSelected} className="h-full flex-col justify-between" onClick={() => selectDoctor(doctor.id)}>
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 style={{ margin: 0, color: 'var(--color-primary)' }}>{doctor.name}</h3>
                          <p style={{ color: 'var(--color-success)', fontWeight: 600, margin: '2px 0 0 0' }}>{doctor.specialty}</p>
                        </div>
                        <Badge status="neutral">Development mock</Badge>
                      </div>
                      <div className="flex-col gap-1 mt-2">
                        <div className="caption flex items-center gap-1"><Building size={14} /> {doctor.hospital}</div>
                        <div className="caption flex items-center gap-1"><MapPin size={14} /> {doctor.locality}, {doctor.city} • {doctor.station} station</div>
                        <div className="caption flex items-center gap-1"><TrainFront size={14} /> {doctor.railLines.join(" + ")} connectivity</div>
                      </div>
                    </div>
                    <div style={{ marginTop: 'var(--spacing-4)', paddingTop: 'var(--spacing-3)', borderTop: '1px solid var(--color-border)' }}>
                      {requestedDocId === doctor.id ? (
                        <Button variant="secondary" className="w-full" disabled>Requested! Opening appointments…</Button>
                      ) : (
                        <Button variant="primary" className="w-full" onClick={(event) => handleRequest(doctor.id, event)} disabled={processingId === doctor.id}>
                          {processingId === doctor.id ? 'Requesting Appointment…' : 'Request Appointment'}
                        </Button>
                      )}
                    </div>
                  </Card>
                </BentoItem>
              );
            })}
            {displayedDoctors.length === 0 && (
              <BentoItem colSpan={4}>
                <Card variant="glass" style={{ textAlign: 'center', padding: 'var(--spacing-6)' }}><p className="text-muted" style={{ margin: 0 }}>No controlled directory entries match the selected Mumbai filters. Clear a filter to view the available development entries.</p></Card>
              </BentoItem>
            )}
          </BentoGrid>
        </section>

        <aside className="discovery-map-pane">
          <Card variant="glass" className="directory-map-card">
            <div className="flex items-center gap-2 mb-3">
              <Route size={20} color="var(--color-primary)" />
              <div><h2 style={{ margin: 0, fontSize: 'var(--text-h3)' }}>Interactive Mumbai map</h2><p className="caption">Google Maps base map and controlled directory markers stay in sync.</p></div>
            </div>
            <MumbaiDoctorMap doctors={displayedDoctors} selectedDoctorId={selectedDocId} onSelectDoctor={selectDoctor} browserLocation={browserLocation} />
            <p className="caption discovery-map-note">The interactive map identifies only controlled directory entries. If you choose to share browser location, it is used only in this page to order entries and center the map; it is not stored or sent to LifeLink. The directory does not claim verified clinicians or live availability.</p>
          </Card>
        </aside>
      </div>
    </div>
  );
};
