export function getDaysSinceLastUpdate(lastUpdate) {
  if (!lastUpdate) return null;
  
  const lastUpdateDate = new Date(lastUpdate);
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate - lastUpdateDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

export function formatLastUpdateTime(lastUpdate) {
  if (!lastUpdate) return 'No updates';
  
  const days = getDaysSinceLastUpdate(lastUpdate);
  
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}