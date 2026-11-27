// Types partagés par les étapes du formulaire « Mon club ».

import { type ClubPayload } from '@/lib/club-form';

export type SetFn = <K extends keyof ClubPayload>(k: K, v: ClubPayload[K]) => void;
export interface StepProps { p: ClubPayload; set: SetFn; fed: (k: keyof ClubPayload) => boolean }
