import type { Lead } from '../types/lead';

type GoHighLevelCreateContactRequest = {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  locationId: string;
  tags?: string[];
};

function getEnvString(key: string): string | undefined {
  const value = (import.meta.env as Record<string, unknown>)[key];
  return typeof value === 'string' ? value : undefined;
}

function getRequiredEnvString(key: string): string {
  const value = getEnvString(key);
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

function buildAuthHeader(token: string): string {
  return token.startsWith('Bearer ') ? token : `Bearer ${token}`;
}

function parseTags(tagsCsv: string | undefined): string[] {
  if (!tagsCsv) return [];
  return tagsCsv
    .split(',')
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}

async function safeReadJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return undefined;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export async function createGoHighLevelContact(lead: Lead): Promise<void> {
  const apiToken = getRequiredEnvString('VITE_GHL_API_TOKEN');
  const locationId = getRequiredEnvString('VITE_GHL_LOCATION_ID');

  const baseUrl = getEnvString('VITE_GHL_BASE_URL') ?? 'https://services.leadconnectorhq.com';
  const version = getEnvString('VITE_GHL_API_VERSION') ?? '2021-07-28';

  const url = `${baseUrl.replace(/\/$/, '')}/contacts/`;

  const baseTags = parseTags(getEnvString('VITE_GHL_TAGS'));
  const payload: GoHighLevelCreateContactRequest = {
    firstName: lead.firstName.trim(),
    lastName: lead.lastName.trim(),
    email: lead.email.trim(),
    phone: lead.phone.trim(),
    locationId,
    tags: Array.from(
      new Set([
        ...baseTags,
        'coupon',
        lead.isSanDiegoLocal === 'yes' ? 'san-diego-local-yes' : 'san-diego-local-no',
      ]),
    ),
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: buildAuthHeader(apiToken),
      Version: version,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await safeReadJson(response);
    const message =
      isRecord(body) && typeof body.message === 'string'
        ? body.message
        : `GoHighLevel request failed (${response.status})`;
    throw new Error(message);
  }
}
