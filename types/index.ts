export type MeasurementType = "glucose" | "bp" | "med" | "weight";

export type AlertType = "high_glucose" | "low_glucose";

export type GuestStatus = "pending" | "active";

export type GlucoseLabel =
  | "Antes de comer"
  | "Después de comer"
  | "Ayunas"
  | "Otro";

export interface User {
  id: string;
  email: string;
  name: string | null;
  google_id: string;
  created_at: string;
  onboarding_completed: boolean;
}

export interface UserPreferences {
  user_id: string;
  track_glucose: boolean;
  track_bp: boolean;
  track_medications: boolean;
  track_weight: boolean;
  glucose_high_threshold: number;
  glucose_low_threshold: number;
}

export interface Measurement {
  id: string;
  user_id: string;
  type: MeasurementType;
  value: number;
  value2?: number | null;
  date: string;
  comment?: string | null;
  label?: string | null;
  created_at?: string;
}

export interface Guest {
  id: string;
  user_id: string;
  guest_email: string;
  status: GuestStatus;
  invited_at: string;
  token: string;
}

export interface Alert {
  id: string;
  user_id: string;
  measurement_id: string;
  alert_type: AlertType;
  sent_at: string;
  notified_guests: boolean;
}

export interface Medication {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}

