import { describe, expect, it } from 'vitest';
import { sortByBrowserLocation } from './discoveryLocation';

describe('browser-only controlled-directory ordering', () => {
  it('orders visible directory entries by approximate proximity without adding location to their data', () => {
    const entries = [
      { id: 'far', latitude: 19.3, longitude: 73.1 },
      { id: 'near', latitude: 19.08, longitude: 72.88 },
    ];

    expect(sortByBrowserLocation(entries, { latitude: 19.076, longitude: 72.8777 }).map((entry) => entry.id)).toEqual(['near', 'far']);
  });
});
