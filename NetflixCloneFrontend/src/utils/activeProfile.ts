import type { Profile } from "../types/Profile";

const KEY = "activeProfile";

export function getActiveProfile(): Profile | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Profile;
  } catch {
    return null;
  }
}

export function setActiveProfile(profile: Profile) {
  localStorage.setItem(KEY, JSON.stringify(profile));
}

export function clearActiveProfile() {
  localStorage.removeItem(KEY);
}