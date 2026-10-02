import { post } from "@/lib/api";

export async function createCheckoutSessionApi(): Promise<{ url: string }> {
  return post<{ url: string }>("/billing/checkout");
}

export async function createPortalSessionApi(): Promise<{ url: string }> {
  return post<{ url: string }>("/billing/portal");
}

/** True when an API error carries the backend's PREMIUM_REQUIRED code. */
export function isPremiumRequiredError(err: unknown): boolean {
  const e = err as { response?: { data?: { code?: string } } };
  return e?.response?.data?.code === "PREMIUM_REQUIRED";
}
