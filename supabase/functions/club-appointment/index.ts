import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { z } from 'npm:zod@3.25.76';
import { sendTemplateEmail } from '../_shared/transactional-email-templates/send-email.ts';
const schema = z.object({ club_name: z.string().trim().min(1).max(200), email: z.string().trim().email().max(255), phone: z.string().trim().max(30), sport: z.string().trim().max(100), members_estimate: z.string().trim().max(50), club_role: z.string().trim().max(100), message: z.string().trim().max(5000), needs: z.array(z.enum(['gestion des adhérents','inscriptions en ligne','communication','visibilité'])).max(4) });
const respond = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return respond({ error: 'Méthode non autorisée' }, 405);
  try {
    const raw = await req.text();
    if (raw.length > 20000) return respond({ error: 'Demande trop longue' }, 413);
    const parsed = schema.safeParse(JSON.parse(raw));
    if (!parsed.success) return respond({ error: 'Champs invalides' }, 400);
    const url = Deno.env.get('SUPABASE_URL');
    const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!url || !key) return respond({ error: 'Service indisponible' }, 503);
    const db = createClient(url, key);
    // Persistent per-address cooldown, independent of edge instance lifecycle.
    const { count, error: countError } = await db.from('club_waitlist').select('id', { count: 'exact', head: true }).eq('email', parsed.data.email).gte('created_at', new Date(Date.now() - 60000).toISOString());
    if (countError) throw countError;
    if ((count ?? 0) > 0) return respond({ error: 'Merci de patienter avant une nouvelle demande' }, 429);
    const { data, error } = await db.from('club_waitlist').insert({ ...parsed.data, phone: parsed.data.phone || null, sport: parsed.data.sport || null, club_role: parsed.data.club_role || null, members_estimate: parsed.data.members_estimate || null, message: parsed.data.message || null }).select('id').single();
    if (error || !data) throw error ?? new Error('Insert failed');
    let notified = false;
    try { const result = await sendTemplateEmail('club-appointment-owner', 'contact@athlace.fr', { templateData: parsed.data, idempotencyKey: `club-appointment-owner-${data.id}` }); notified = result.sent; }
    catch { console.error('Appointment stored; owner email not sent'); }
    return respond({ success: true, id: data.id, notified });
  } catch { return respond({ error: 'Impossible d’enregistrer la demande' }, 500); }
});