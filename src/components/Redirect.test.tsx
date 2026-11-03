import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { MapSearchRedirect } from './Redirect';

describe('legacy map URLs', () => {
  it.each(['/carte', '/carte/'])('redirects %s to /clubs/ preserving every URL parameter', async (path) => {
    const container = document.createElement('div');
    const root = createRoot(container);
    let destination = '';
    function CaptureLocation() {
      const location = useLocation();
      destination = location.pathname + location.search + location.hash;
      return null;
    }
    await act(async () => {
      root.render(<MemoryRouter initialEntries={[`${path}?q=Orvault&discipline=hockey&autour=1&custom=ok#results`]}>
        <Routes>
          <Route path="/carte" element={<MapSearchRedirect />} />
          <Route path="/clubs/" element={<CaptureLocation />} />
        </Routes>
      </MemoryRouter>);
    });
    expect(destination).toBe('/clubs/?q=Orvault&discipline=hockey&autour=1&custom=ok#results');
    await act(async () => root.unmount());
  });
});