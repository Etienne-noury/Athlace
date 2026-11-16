// Fonction edge : club-appointment
// Reçoit une demande de rendez-vous déposée par un club sur /pour-les-clubs/ :
//   1. valide les champs (mêmes règles que src/lib/club-appointment.ts) ;
//   2. limite les envois répétés depuis la même adresse e-mail ;
//   3. enregistre la demande dans club_waitlist ;
//   4. prévient contact@athlace.fr (un échec d'e-mail ne fait pas perdre la demande).
// Appelable sans compte (verify_jwt = false). C'est le SEUL point d'entrée en écriture
// de club_waitlist : la table n'accepte aucune insertion directe depuis le navigateur.

import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { z } from 'npm:zod@3.25.76';
import { sendTemplateEmail } from '../_shared/transactional-email-templates/send-email.ts';

const MAX_BODY_CHARS = 20_000;
const COOLDOWN_MS = 60_000;
const OWNER_EMAIL = 'contact@athlace.fr';

const schema = z.object({
  club_name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(30),
  sport: z.string().trim().max(100),
  members_estimate: z.string().trim().max(50),
  club_role: z.string().trim().max(100),
  message: z.string().trim().max(5000),
  needs: z
    .array(z.enum(['gestion des adhérents', 'inscriptions en ligne', 'communication', 'visibilité']))
    .max(4),
});

const respond = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return respond({ error: 'Méthode non autorisée' }, 405);

  try {
    const raw = await req.text();
    if (raw.length > MAX_BODY_CHARS) return respond({ error: 'Demande trop longue' }, 413);

    let json: unknown;
    try {
      json = JSON.parse(raw);
    } catch {
      return respond({ error: 'Champs invalides' }, 400);
    }
    const parsed = schema.safeParse(json);
    if (!parsed.success) return respond({ error: 'Champs invalides' }, 400);
    const form = parsed.data;

    const url = Deno.env.get('SUPABASE_URL');
    const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!url || !key) return respond({ error: 'Service indisponible' }, 503);
    const db = createClient(url, key);

    // Délai minimal entre deux demandes d'une même adresse (stocké en base, donc
    // indépendant du redémarrage de la fonction).
    const since = new Date(Date.now() - COOLDOWN_MS).toISOString();
    const { count, error: countError } = await db
      .from('club_waitlist')
      .select('id', { count: 'exact', head: true })
      .eq('email', form.email)
      .gte('created_at', since);
    if (countError) throw countError;
    if ((count ?? 0) > 0) return respond({ error: 'Merci de patienter avant une nouvelle demande' }, 429);

    const { data, error } = await db
      .from('club_waitlist')
      .insert({
        ...form,
        phone: form.phone || null,
        sport: form.sport || null,
        club_role: form.club_role || null,
        members_estimate: form.members_estimate || null,
        message: form.message || null,
      })
      .select('id')
      .single();
    if (error || !data) throw error ?? new Error('Insert failed');

    let notified = false;
    try {
      const result = await sendTemplateEmail('club-appointment-owner', OWNER_EMAIL, {
        templateData: form,
        idempotencyKey: `club-appointment-owner-${data.id}`,
      });
      notified = result.sent;
    } catch {
      console.error('Appointment stored; owner email not sent');
    }

    return respond({ success: true, id: data.id, notified });
  } catch (err) {
    console.error('club-appointment error', err instanceof Error ? err.message : err);
    return respond({ error: 'Impossible d’enregistrer la demande' }, 500);
  }
});
