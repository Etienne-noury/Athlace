import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const BATCH_SIZE = 50;
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let geocoded = 0;
      let failed = 0;
      const send = (obj: unknown) =>
        controller.enqueue(encoder.encode(JSON.stringify(obj) + '\n'));

      try {
        while (true) {
          const { data: clubs, error } = await supabase
            .from('clubs_enriched')
            .select('id, address, postal_code, city')
            .is('latitude', null)
            .not('address', 'is', null)
            .limit(BATCH_SIZE);

          if (error) {
            send({ error: error.message, geocoded, failed });
            break;
          }
          if (!clubs || clubs.length === 0) break;

          for (const club of clubs) {
            const q = [club.address, club.postal_code, club.city]
              .filter(Boolean)
              .join(' ')
              .trim();
            if (!q) {
              failed++;
            } else {
              try {
                const url = `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(q)}&limit=1`;
                const res = await fetch(url);
                const json = await res.json();
                const coords = json?.features?.[0]?.geometry?.coordinates;
                if (coords && coords.length === 2) {
                  const [lng, lat] = coords;
                  const { error: upErr } = await supabase
                    .from('clubs_enriched')
                    .update({ latitude: lat, longitude: lng })
                    .eq('id', club.id);
                  if (upErr) failed++;
                  else geocoded++;
                } else {
                  // Mark as failed by setting a sentinel? Just count; loop would repeat.
                  // To avoid infinite loop: set latitude to 0 sentinel? Instead, break loop when nothing was geocoded in an entire batch.
                  failed++;
                }
              } catch {
                failed++;
              }
            }
            send({ progress: { geocoded, failed } });
            await new Promise((r) => setTimeout(r, 100));
          }

          // Safety: if no club in this batch got geocoded, stop to avoid infinite loop
          // (all remaining rows would keep returning as latitude IS NULL).
          const batchGeocoded = clubs.length;
          if (geocoded === 0 && failed >= batchGeocoded) {
            // continue only if we made some progress overall; otherwise break
            if (batchGeocoded < BATCH_SIZE) break;
          }
          if (clubs.length < BATCH_SIZE) break;
        }
        send({ done: true, geocoded, failed });
      } catch (e) {
        send({ error: (e as Error).message, geocoded, failed });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/x-ndjson',
      'Cache-Control': 'no-cache',
    },
  });
});
