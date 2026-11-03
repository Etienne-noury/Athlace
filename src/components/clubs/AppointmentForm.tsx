import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { APPOINTMENT_NEEDS, appointmentSchema } from '@/lib/club-appointment';

export function AppointmentForm() {
  const [form, setForm] = useState({ club_name: '', email: '', phone: '', sport: '', members_estimate: '', club_role: '', message: '', needs: [] as string[] });
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (sending) return;
    setError('');
    const parsed = appointmentSchema.safeParse(form);
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? 'Vérifiez les champs.'); return; }
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('club-appointment', { body: parsed.data });
      if (error || !data?.success) throw new Error('send');
      setDone(true);
    } catch { setError("L'envoi a échoué, réessayez dans un instant."); }
    finally { setSending(false); }
  };
  if (done) return <div className="py-8 text-center" role="status"><CheckCircle className="h-10 w-10 mx-auto text-primary mb-4" /><p className="text-xl font-bold">Merci ! Nous revenons vers vous sous 48 h pour fixer un créneau.</p></div>;
  const field = (key: Exclude<keyof typeof form, 'needs' | 'message'>, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => <div className="space-y-2"><Label htmlFor={`rdv-${key}`}>{label}</Label><Input id={`rdv-${key}`} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} {...props} /></div>;
  return <form onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
    {field('club_name', 'Nom du club *', { required: true, maxLength: 200, autoComplete: 'organization' })}
    {field('email', 'Email *', { required: true, type: 'email', maxLength: 255, autoComplete: 'email' })}
    {field('phone', 'Téléphone', { type: 'tel', maxLength: 30, autoComplete: 'tel' })}
    {field('sport', 'Sport', { maxLength: 100 })}
    {field('members_estimate', "Nombre d’adhérents", { maxLength: 50, inputMode: 'numeric' })}
    {field('club_role', 'Rôle dans le club', { maxLength: 100 })}
    <fieldset className="sm:col-span-2"><legend className="font-bold text-sm mb-3">Vos besoins</legend><div className="grid gap-3 sm:grid-cols-2">{APPOINTMENT_NEEDS.map((need, i) => <div key={need} className="flex items-center gap-3"><Checkbox id={`rdv-need-${i}`} checked={form.needs.includes(need)} onCheckedChange={(checked) => setForm({ ...form, needs: checked === true ? [...form.needs, need] : form.needs.filter((v) => v !== need) })} /><Label htmlFor={`rdv-need-${i}`} className="font-light capitalize">{need}</Label></div>)}</div></fieldset>
    <div className="sm:col-span-2 space-y-2"><Label htmlFor="rdv-message">Message</Label><Textarea id="rdv-message" rows={5} maxLength={5000} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></div>
    {error && <p role="alert" className="sm:col-span-2 text-sm text-destructive">{error}</p>}
    <div className="sm:col-span-2"><Button type="submit" disabled={sending}>{sending ? 'Envoi…' : 'Demander un rendez-vous'}</Button></div>
  </form>;
}