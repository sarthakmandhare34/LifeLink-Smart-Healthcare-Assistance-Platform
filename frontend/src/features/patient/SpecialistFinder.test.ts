import { describe, expect, it } from 'vitest';
import { BROWSER_LOCATION_PRIVACY, BROWSER_LOCATION_TITLE, RESIDENCE_CORRIDOR_LABEL, RESIDENCE_STATION_LABEL, SPECIALTY_SEARCH_GUIDANCE, SPECIALIST_LOAD_ERROR_MESSAGE, SPECIALIST_LOAD_ERROR_TITLE } from './SpecialistFinder';


describe('specialist finder residence prompts', () => {
  it('uses patient-centred wording for the Mumbai corridor and station choices', () => {
    expect(RESIDENCE_CORRIDOR_LABEL).toBe('Which part of Mumbai do you live in?');
    expect(RESIDENCE_STATION_LABEL).toBe('Which station is closest to where you live?');
  });

  it('states the optional browser-only location boundary without implying storage or external directory data', () => {
    expect(BROWSER_LOCATION_TITLE).toBe('Optional browser location');
    expect(BROWSER_LOCATION_PRIVACY).toContain('not stored or sent to LifeLink');
  });

  it('explains that free-text search is specialty-only while residence choices remain dedicated filters', () => {
    expect(SPECIALTY_SEARCH_GUIDANCE).toContain('specialties only');
    expect(SPECIALTY_SEARCH_GUIDANCE).toContain('station filters');
  });


  it('provides recoverable, non-technical data-load messaging', () => {
    expect(SPECIALIST_LOAD_ERROR_TITLE).toBe('We couldn’t load the specialist directory');
    expect(SPECIALIST_LOAD_ERROR_MESSAGE).toContain('check your connection');
    expect(SPECIALIST_LOAD_ERROR_MESSAGE).not.toContain('TRPC');
  });
});
