// utils/devUser.ts
import { v4 as uuidv4 } from "uuid";

/**
 * Returns a unique user ID for development/testing.
 * Stored in localStorage per browser session.
 */
export function getDevUserId(): string {
  if (typeof window === "undefined") return "server-session"; // fallback for SSR

  let devUserId = localStorage.getItem("velric_dev_user_id");
  
  if (!devUserId) {
    devUserId = uuidv4();
    localStorage.setItem("velric_dev_user_id", devUserId);
  }
  
  return devUserId;
}
