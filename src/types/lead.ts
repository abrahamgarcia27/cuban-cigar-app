export type SanDiegoLocalAnswer = 'yes' | 'no';

export interface Lead {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isSanDiegoLocal: SanDiegoLocalAnswer | '';
}

export type LeadFieldErrors = Partial<Record<keyof Lead, string>>;
