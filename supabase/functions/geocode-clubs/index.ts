import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const BATCH_SIZE = 200;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const { data: clubs, error } = await supabase
    .from('clubs_enriched')
    .select('id, address, postal_code, city')
    .is('latitude', null)
    .limit(BATCH_SIZE);

  if (error) {
    return new Response(JSON.stringify({ error: error.message, geocoded: 0, failed: 0, remaining: 0 }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (!clubs || clubs.length === 0) {
    return new Response(JSON.stringify({ geocoded: 0, failed: 0, remaining: 0 }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const csvLines = clubs
    .map((c) => `${[c.address, c.postal_code, c.city].filter(Boolean).join(' ')}`)
    .join('\n');

  const formData = new FormData();
  formData.append('data', new Blob([`adresse\n${csvLines}`], { type: 'text/csv' }), 'adresses.csv');
  formData.append('columns', 'adresse');
  formData.append('result_columns', 'latitude,longitude,result_score');

  try {
    const res = await fetch('https://api-adresse.data.gouv.fr/search/csv/', {
      method: 'POST',
      body: formData,
    });

    const text = await res.text();
    const lines = text.split('\n').slice(1); // skip header

    let geocoded = 0;
    let failed = 0;

    for (let i = 0; i < clubs.length; i++) {
      const cols = lines[i]?.split(',');
      const lat = parseFloat(cols?.[cols.length - 3]);
      const lng = parseFloat(cols?.[cols.length - 2]);
      const score = parseFloat(cols?.[cols.length - 1]);

      if (!isNaN(lat) && !isNaN(lng) && score > 0.3) {
        await supabase.from('clubs_enriched').update({ latitude: lat, longitude: lng }).eq('id', clubs[i].id);
        geocoded++;
      } else {
        await supabase.from('clubs_enriched').update({ latitude: 0, longitude: 0 }).eq('id', clubs[i].id);
        failed++;
      }
    }

    return new Response(JSON.stringify({ geocoded, failed, remaining: clubs.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    for (const club of clubs) {
      await supabase.from('clubs_enriched').update({ latitude: 0, longitude: 0 }).eq('id', club.id);
    }
    return new Response(
      JSON.stringify({ error: e.message, geocoded: 0, failed: clubs.length, remaining: clubs.length }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
