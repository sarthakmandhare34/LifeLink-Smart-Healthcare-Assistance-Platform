import { describe, expect, it } from 'vitest';
import { RESIDENCE_CORRIDOR_LABEL, RESIDENCE_STATION_LABEL } from './SpecialistFinder';

describe('specialist finder residence prompts', () => {
  it('uses patient-centred wording for the Mumbai corridor and station choices', () => {
    expect(RESIDENCE_CORRIDOR_LABEL).toBe('Which part of Mumbai do you live in?');
    expect(RESIDENCE_STATION_LABEL).toBe('Which station is closest to where you live?');
  });
});
