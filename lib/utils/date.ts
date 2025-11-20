import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays } from "date-fns";
import { es } from "date-fns/locale";

export function formatDate(date: Date | string): string {
  return format(new Date(date), "dd/MM/yyyy HH:mm", { locale: es });
}

export function formatDateShort(date: Date | string): string {
  return format(new Date(date), "dd/MM/yyyy", { locale: es });
}

/**
 * Convierte un Date a formato datetime-local usando la zona horaria local del usuario.
 * Esto es necesario porque toISOString() siempre devuelve UTC, pero datetime-local espera hora local.
 */
export function dateToDatetimeLocal(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Convierte un string datetime-local a ISO string, interpretándolo como hora local.
 * El string datetime-local ya está en hora local del usuario, así que necesitamos
 * crear un Date interpretándolo como local y luego convertir a ISO.
 */
export function datetimeLocalToISO(datetimeLocal: string): string {
  // datetime-local viene en formato YYYY-MM-DDTHH:mm y se interpreta como hora local
  const date = new Date(datetimeLocal);
  return date.toISOString();
}

type DateRangeFilter = "today" | "week" | "month" | "custom" | "last7" | "last30" | "last90";

export function getDateRange(filter: DateRangeFilter = "today", customStart?: Date, customEnd?: Date) {
  const now = new Date();
  const endOfToday = endOfDay(now);
  
  switch (filter) {
    case "today":
      return {
        start: startOfDay(now),
        end: endOfDay(now),
      };
    case "week":
      return {
        start: startOfWeek(now, { locale: es }),
        end: endOfWeek(now, { locale: es }),
      };
    case "month":
      return {
        start: startOfMonth(now),
        end: endOfMonth(now),
      };
    case "last7":
      return {
        start: startOfDay(subDays(endOfToday, 7)),
        end: endOfToday,
      };
    case "last30":
      return {
        start: startOfDay(subDays(endOfToday, 30)),
        end: endOfToday,
      };
    case "last90":
      return {
        start: startOfDay(subDays(endOfToday, 90)),
        end: endOfToday,
      };
    case "custom":
      return {
        start: customStart || startOfDay(now),
        end: customEnd || endOfToday,
      };
    default:
      return {
        start: startOfDay(subDays(endOfToday, 30)),
        end: endOfToday,
      };
  }
}

