/**
 * Date & Time Formatting Utilities
 */

/**
 * Format date to readable string
 * @param dateString - ISO date string
 * @returns Formatted date (e.g., "Jan 15, 2:30 PM")
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format relative time (e.g., "12h ago")
 * @param dateString - ISO date string
 * @returns Relative time string
 */
export const formatTimeAgo = (dateString: string): string => {
  const now = Date.now();
  const date = new Date(dateString).getTime();
  const diffMs = Math.max(0, now - date);
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
};

/**
 * Format duration from minutes (e.g., "14h 17m")
 * @param minutes - Duration in minutes
 * @returns Formatted duration string
 */
export const formatDuration = (minutes: number | undefined): string => {
  if (!minutes && minutes !== 0) return '';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs === 0) return `${mins}m`;
  return `${hrs}h ${mins}m`;
};

/**
 * Get current timestamp as ISO string
 */
export const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};
