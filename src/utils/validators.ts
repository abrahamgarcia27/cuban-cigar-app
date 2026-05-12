import type { Lead, LeadFieldErrors } from '../types/lead';

export function isBlank(value: string): boolean {
  return value.trim().length === 0;
}

export function isValidEmail(value: string): boolean {
  const email = value.trim();
  if (email.length === 0) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(value: string): boolean {
  const normalized = value.replace(/[^\d]/g, '');
  return normalized.length >= 7;
}

export function validateLead(lead: Lead): LeadFieldErrors {
  const errors: LeadFieldErrors = {};

  if (isBlank(lead.firstName)) errors.firstName = 'First name is required.';
  if (isBlank(lead.lastName)) errors.lastName = 'Last name is required.';

  if (isBlank(lead.email)) {
    errors.email = 'Email is required.';
  } else if (!isValidEmail(lead.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (isBlank(lead.phone)) {
    errors.phone = 'Phone is required.';
  } else if (!isValidPhone(lead.phone)) {
    errors.phone = 'Please enter a valid phone number.';
  }

  if (lead.isSanDiegoLocal !== 'yes' && lead.isSanDiegoLocal !== 'no') {
    errors.isSanDiegoLocal = 'Please select an option.';
  }

  return errors;
}
