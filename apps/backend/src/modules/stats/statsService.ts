import { getStats } from "./statsRepository";

export async function fetchStats() {
  return getStats();
}
