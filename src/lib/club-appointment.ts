import { z } from 'zod';

export const APPOINTMENT_NEEDS = ['gestion des adhérents', 'inscriptions en ligne', 'communication', 'visibilité'] as const;
export const appointmentSchema = z.object({
  club_name: z.string().trim().min(1, 'Indiquez le nom du club').max(200),
  email: z.string().trim().email('Email invalide').max(255),
  phone: z.string().trim().max(30), sport: z.string().trim().max(100),
  members_estimate: z.string().trim().max(50), club_role: z.string().trim().max(100),
  needs: z.array(z.enum(APPOINTMENT_NEEDS)).max(4), message: z.string().trim().max(5000),
});