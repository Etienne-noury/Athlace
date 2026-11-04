import { afterEach, describe, expect, it, vi } from 'vitest';
import { requestVisitorPosition, VisitorPositionError } from './visitor-position';

afterEach(() => vi.unstubAllGlobals());

describe('visitor proximity coordinates', () => {
  it('uses the accepted browser position as latitude and longitude', async () => {
    const getCurrentPosition = vi.fn((success) => success({ coords: { latitude: 47.2705, longitude: -1.6218 } }));
    vi.stubGlobal('navigator', { geolocation: { getCurrentPosition } });
    await expect(requestVisitorPosition()).resolves.toEqual({ lat: 47.2705, lng: -1.6218 });
    expect(getCurrentPosition).toHaveBeenCalledOnce();
  });

  it('rejects denial so search can fall back without a position', async () => {
    const denied = { code: 1, message: 'Permission denied' };
    vi.stubGlobal('navigator', { geolocation: { getCurrentPosition: (_success: unknown, error: (reason: unknown) => void) => error(denied) } });
    const error = await requestVisitorPosition().catch((e) => e);
    expect(error).toBeInstanceOf(VisitorPositionError);
    expect(error.reason).toBe('denied');
  });

  it('rejects unsupported geolocation without blocking ordinary search', async () => {
    vi.stubGlobal('navigator', {});
    const error = await requestVisitorPosition().catch((e) => e);
    expect(error).toBeInstanceOf(VisitorPositionError);
    expect(error.reason).toBe('unavailable');
  });
});