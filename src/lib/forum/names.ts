import { getUser } from "./data";

export function displayName(
  userId: string,
  names: Record<string, string>,
): string {
  if (names[userId]) return names[userId]!;
  return getUser(userId)?.name ?? "Üye";
}
