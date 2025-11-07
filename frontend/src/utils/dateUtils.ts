/**
 * Date Utilities
 *
 * Description: Helper functions for formatting and normalizing dates to the Melbourne timezone.
 *              Provides utilities to convert between ISO strings and datetime-local inputs.
 *
 * Date Created: 2025-November-07
 * Author: thangtruong
 */

const MELBOURNE_TIMEZONE = 'Australia/Melbourne';
const MELBOURNE_LOCALE = 'en-AU';

type DateTimeParts = Record<string, string>;

const buildParts = (date: Date, options: Intl.DateTimeFormatOptions): DateTimeParts => {
  const formatter = new Intl.DateTimeFormat(MELBOURNE_LOCALE, {
    timeZone: MELBOURNE_TIMEZONE,
    ...options,
  });

  return formatter.formatToParts(date).reduce<DateTimeParts>((acc, part) => {
    if (part.type !== 'literal') {
      acc[part.type] = part.value;
    }
    return acc;
  }, {});
};

const padNumber = (value: number): string => value.toString().padStart(2, '0');

const hasExplicitTimezone = (value: string): boolean => /([zZ]|[+-]\d{2}:\d{2})$/.test(value);

const getTimezoneOffsetMinutes = (date: Date): number => {
  const parts = buildParts(date, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const { year, month, day, hour, minute, second } = parts;
  if (!year || !month || !day || !hour || !minute || !second) {
    return 0;
  }

  const asUTC = Date.UTC(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second),
  );

  return (asUTC - date.getTime()) / 60000;
};

const buildOffsetSuffix = (offsetMinutes: number): string => {
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const absolute = Math.abs(offsetMinutes);
  const hours = padNumber(Math.floor(absolute / 60));
  const minutes = padNumber(absolute % 60);
  return `${sign}${hours}:${minutes}`;
};

const normaliseDateInput = (value: string): string => value.replace(' ', 'T');

export const normalizeToMelbourneIso = (dateString?: string): string | undefined => {
  if (!dateString) {
    return undefined;
  }

  const trimmed = dateString.trim();
  if (!trimmed) {
    return undefined;
  }

  if (hasExplicitTimezone(trimmed)) {
    return trimmed;
  }

  const normalised = normaliseDateInput(trimmed);
  const match = normalised.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2})(?::(\d{2})(?::(\d{2}))?)?$/);
  if (!match) {
    return trimmed;
  }

  const [, year, month, day, hour, minute = '00', second = '00'] = match;

  const utcReference = new Date(Date.UTC(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second),
  ));

  const offsetMinutes = getTimezoneOffsetMinutes(utcReference);
  const offsetSuffix = buildOffsetSuffix(offsetMinutes);

  return `${year}-${month}-${day}T${hour}:${minute}:${second}${offsetSuffix}`;
};

export const formatDateTimeInMelbourne = (
  dateString?: string,
  options?: Intl.DateTimeFormatOptions,
  fallback = 'N/A',
): string => {
  const normalized = normalizeToMelbourneIso(dateString);
  if (!normalized) {
    return fallback;
  }

  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  const formatter = new Intl.DateTimeFormat(MELBOURNE_LOCALE, {
    timeZone: MELBOURNE_TIMEZONE,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    ...options,
  });

  return formatter.format(date);
};

export const formatDateInMelbourne = (dateString?: string, fallback = 'No due date'): string => {
  const normalized = normalizeToMelbourneIso(dateString);
  if (!normalized) {
    return fallback;
  }

  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  const formatter = new Intl.DateTimeFormat(MELBOURNE_LOCALE, {
    timeZone: MELBOURNE_TIMEZONE,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return formatter.format(date);
};

export const toMelbourneDateTimeLocal = (dateString?: string): string => {
  const normalized = normalizeToMelbourneIso(dateString);
  if (!normalized) {
    return '';
  }

  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const parts = buildParts(date, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const { year, month, day, hour, minute } = parts;
  if (!year || !month || !day || !hour || !minute) {
    return '';
  }

  return `${year}-${month}-${day}T${hour}:${minute}`;
};

export const fromMelbourneLocalInputToIso = (localInput?: string): string | undefined => {
  if (!localInput) {
    return undefined;
  }

  const match = localInput.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
  if (!match) {
    return localInput;
  }

  const [, year, month, day, hour, minute] = match;

  const utcReference = new Date(Date.UTC(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
  ));

  const offsetMinutes = getTimezoneOffsetMinutes(utcReference);
  const offsetSuffix = buildOffsetSuffix(offsetMinutes);

  return `${year}-${month}-${day}T${hour}:${minute}:00${offsetSuffix}`;
};

export const getMelbourneTime = (): Date => {
  const now = new Date();
  return new Date(now.toLocaleString('en-US', { timeZone: MELBOURNE_TIMEZONE }));
};

export { MELBOURNE_TIMEZONE };
