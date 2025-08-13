export function formatStripeTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000); // Stripe timestamp is in seconds
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
