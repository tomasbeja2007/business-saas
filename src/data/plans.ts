import type { Plan } from '../store/useApp';

/**
 * Early-access pricing. While FREE_EARLY_ACCESS is true every plan unlocks for free.
 * Flip it to false and wire `purchase()` to RevenueCat / StoreKit to start charging.
 */
export const FREE_EARLY_ACCESS = true;

export const PLANS: { id: Plan; title: string; price: string; period: string; note: string; badge?: string }[] = [
  { id: 'weekly', title: 'Weekly', price: '$4.99', period: '/week', note: 'Flexible, cancel anytime' },
  { id: 'yearly', title: 'Yearly', price: '$39.99', period: '/year', note: 'Just $0.77 a week', badge: 'Best value' },
  { id: 'lifetime', title: 'Lifetime', price: '$79.99', period: 'once', note: 'Pay once, keep forever' },
];
