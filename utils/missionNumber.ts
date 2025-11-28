/**
 * Generate a unique mission number from a UUID
 * Converts UUID to a shorter, human-readable format like MSN-ABC123
 */
export function generateMissionNumber(missionId: string | null | undefined | number): string {
  // Handle null, undefined, or empty values
  if (!missionId) return "MSN-00000";
  
  // Convert to string if it's not already
  const missionIdStr = String(missionId);
  
  // If it's not a valid UUID format, generate from hash
  if (!missionIdStr || missionIdStr.length < 8) {
    // Fallback: generate from a hash of the value
    let hash = 0;
    for (let i = 0; i < missionIdStr.length; i++) {
      const char = missionIdStr.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    const base36 = Math.abs(hash).toString(36).toUpperCase();
    const padded = base36.padStart(6, '0');
    return `MSN-${padded}`;
  }
  
  // Remove hyphens and take first 8 characters
  const cleanId = missionIdStr.replace(/-/g, '').substring(0, 8);
  
  // Convert to base36 for shorter representation
  // This gives us alphanumeric characters (0-9, a-z)
  const num = parseInt(cleanId, 16);
  
  // Handle NaN case
  if (isNaN(num)) {
    // Fallback: generate from string hash
    let hash = 0;
    for (let i = 0; i < cleanId.length; i++) {
      const char = cleanId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    const base36 = Math.abs(hash).toString(36).toUpperCase();
    const padded = base36.padStart(6, '0');
    return `MSN-${padded}`;
  }
  
  const base36 = num.toString(36).toUpperCase();
  
  // Pad to 6 characters and format as MSN-XXXXXX
  const padded = base36.padStart(6, '0');
  return `MSN-${padded}`;
}

/**
 * Generate a unique mission number with timestamp component
 * Format: MSN-YYMMDD-XXXXX (e.g., MSN-250120-A1B2C3)
 */
export function generateTimestampedMissionNumber(missionId: string | null | undefined | number): string {
  if (!missionId) return "MSN-00000";
  
  // Convert to string if it's not already
  const missionIdStr = String(missionId);
  
  // Get current date components
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const datePrefix = `${year}${month}${day}`;
  
  // Generate unique suffix from mission ID
  const cleanId = missionIdStr.replace(/-/g, '').substring(0, 6);
  const num = parseInt(cleanId, 16);
  
  // Handle NaN case
  if (isNaN(num)) {
    // Fallback: generate from string hash
    let hash = 0;
    for (let i = 0; i < cleanId.length; i++) {
      const char = cleanId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    const suffix = Math.abs(hash).toString(36).toUpperCase().padStart(6, '0');
    return `MSN-${datePrefix}-${suffix}`;
  }
  
  const suffix = num.toString(36).toUpperCase().padStart(6, '0');
  
  return `MSN-${datePrefix}-${suffix}`;
}

