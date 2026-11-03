import { describe, expect, it } from 'vitest';
import { appointmentSchema, APPOINTMENT_NEEDS } from './club-appointment';
const base = { club_name: 'Club', email: 'contact@example.com', phone: '', sport: '', members_estimate: '', club_role: '', needs: [], message: '' };
describe('Demande de rendez-vous club', () => {
  it('exige le nom du club', () => expect(appointmentSchema.safeParse({ ...base, club_name: ' ' }).success).toBe(false));
  it('exige un email valide', () => expect(appointmentSchema.safeParse({ ...base, email: '' }).success).toBe(false));
  it('laisse tous les autres champs facultatifs', () => expect(appointmentSchema.safeParse(base).success).toBe(true));
  it('accepte les quatre besoins proposés', () => expect(appointmentSchema.parse({ ...base, needs: [...APPOINTMENT_NEEDS] }).needs).toEqual(['gestion des adhérents','inscriptions en ligne','communication','visibilité']));
  it('rejette un besoin inconnu', () => expect(appointmentSchema.safeParse({ ...base, needs: ['autre'] }).success).toBe(false));
});