import { Plan, PlanTier, BillingCycle } from './types';

export const APP_NAME = "AuraStream";

export const PLANS: Plan[] = [
  {
    id: 'plan_basic',
    name: 'Starter Stream',
    tier: PlanTier.BASIC,
    priceMonthly: 9.99,
    priceYearly: 99.00,
    features: ['1 User', 'SD Quality', 'Ad-supported', 'Limited Support'],
    recommendedFor: 'Individuals who watch casually on mobile devices.'
  },
  {
    id: 'plan_pro',
    name: 'Pro Stream',
    tier: PlanTier.PRO,
    priceMonthly: 19.99,
    priceYearly: 199.00,
    features: ['3 Users', 'HD Quality', 'Ad-free', 'Priority Email Support', 'Offline Downloads'],
    recommendedFor: 'Small families or couples who want high definition content.'
  },
  {
    id: 'plan_ent',
    name: 'Ultra Stream',
    tier: PlanTier.ENTERPRISE,
    priceMonthly: 29.99,
    priceYearly: 299.00,
    features: ['Unlimited Users', '4K Ultra HD', 'Dolby Atmos', '24/7 Phone Support', 'Early Access'],
    recommendedFor: 'Large households, tech enthusiasts, and home theater owners.'
  }
];

export const MOCK_USAGE_DATA = [
  { date: '2023-10-01', bandwidth: 12, requests: 1200 },
  { date: '2023-10-02', bandwidth: 18, requests: 1500 },
  { date: '2023-10-03', bandwidth: 15, requests: 1300 },
  { date: '2023-10-04', bandwidth: 25, requests: 2100 },
  { date: '2023-10-05', bandwidth: 22, requests: 1900 },
  { date: '2023-10-06', bandwidth: 30, requests: 2500 },
  { date: '2023-10-07', bandwidth: 28, requests: 2300 },
];
