import type { ComponentType } from 'npm:react@18.3.1'
import { template as clubAppointmentOwner } from './club-appointment-owner.tsx'

export interface TemplateEntry {
  component: ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  displayName?: string
  previewData?: Record<string, any>
  /** Fixed recipient — overrides caller-provided recipientEmail when set. */
  to?: string
}

/**
 * Template registry — maps template names to their React Email components.
 * Import and register new templates here after creating them in this directory.
 *
 * Example:
 *   import { template as welcomeTemplate } from './welcome.tsx'
 *   // then add to TEMPLATES: 'welcome': welcomeTemplate
 */
export const TEMPLATES: Record<string, TemplateEntry> = {
  'club-appointment-owner': clubAppointmentOwner,
  // Add templates here as they are created, e.g.:
  // 'welcome': welcomeTemplate,
}
