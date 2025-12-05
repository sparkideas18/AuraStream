export enum PlanTier {
  BASIC = 'Basic',
  PRO = 'Pro',
  ENTERPRISE = 'Enterprise'
}

export enum BillingCycle {
  MONTHLY = 'monthly',
  YEARLY = 'yearly'
}

export interface Plan {
  id: string;
  name: string;
  tier: PlanTier;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  recommendedFor: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  currentPlanId?: string;
  billingCycle?: BillingCycle;
  subscriptionStatus: 'active' | 'inactive' | 'past_due';
  memberSince: string;
}

export interface UsageMetric {
  date: string;
  bandwidth: number; // in GB
  requests: number;
}
