import { expect, it } from 'vitest';
import { MAPS_SCRIPT_CROSS_ORIGIN } from './Map';

it('uses anonymous CORS for the managed Maps proxy script', () => {
  expect(MAPS_SCRIPT_CROSS_ORIGIN).toBe('anonymous');
});
