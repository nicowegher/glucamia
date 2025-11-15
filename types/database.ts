export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          google_id: string;
          created_at: string;
          onboarding_completed: boolean;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          google_id: string;
          created_at?: string;
          onboarding_completed?: boolean;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          google_id?: string;
          created_at?: string;
          onboarding_completed?: boolean;
        };
      };
      user_preferences: {
        Row: {
          user_id: string;
          track_glucose: boolean;
          track_bp: boolean;
          track_medications: boolean;
          track_weight: boolean;
          glucose_high_threshold: number;
          glucose_low_threshold: number;
        };
        Insert: {
          user_id: string;
          track_glucose?: boolean;
          track_bp?: boolean;
          track_medications?: boolean;
          track_weight?: boolean;
          glucose_high_threshold?: number;
          glucose_low_threshold?: number;
        };
        Update: {
          user_id?: string;
          track_glucose?: boolean;
          track_bp?: boolean;
          track_medications?: boolean;
          track_weight?: boolean;
          glucose_high_threshold?: number;
          glucose_low_threshold?: number;
        };
      };
      measurements: {
        Row: {
          id: string;
          user_id: string;
          type: "glucose" | "bp" | "med" | "weight";
          value: number;
          value2: number | null;
          date: string;
          comment: string | null;
          label: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: "glucose" | "bp" | "med" | "weight";
          value: number;
          value2?: number | null;
          date?: string;
          comment?: string | null;
          label?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: "glucose" | "bp" | "med" | "weight";
          value?: number;
          value2?: number | null;
          date?: string;
          comment?: string | null;
          label?: string | null;
          created_at?: string;
        };
      };
      guests: {
        Row: {
          id: string;
          user_id: string;
          guest_email: string;
          status: "pending" | "active";
          invited_at: string;
          token: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          guest_email: string;
          status?: "pending" | "active";
          invited_at?: string;
          token: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          guest_email?: string;
          status?: "pending" | "active";
          invited_at?: string;
          token?: string;
        };
      };
      alerts: {
        Row: {
          id: string;
          user_id: string;
          measurement_id: string;
          alert_type: "high_glucose" | "low_glucose";
          sent_at: string;
          notified_guests: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          measurement_id: string;
          alert_type: "high_glucose" | "low_glucose";
          sent_at?: string;
          notified_guests?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          measurement_id?: string;
          alert_type?: "high_glucose" | "low_glucose";
          sent_at?: string;
          notified_guests?: boolean;
        };
      };
      medications: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          created_at?: string;
        };
      };
    };
  };
}

