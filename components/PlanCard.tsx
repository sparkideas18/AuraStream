import React from 'react';
import { Check, Star } from 'lucide-react';
import { Plan, BillingCycle } from '../types';
import Button from './Button';

interface PlanCardProps {
  plan: Plan;
  billingCycle: BillingCycle;
  isRecommended?: boolean;
  onSelect: (plan: Plan) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, billingCycle, isRecommended, onSelect }) => {
  const price = billingCycle === BillingCycle.MONTHLY ? plan.priceMonthly : (plan.priceYearly / 12).toFixed(2);
  
  return (
    <div className={`relative flex flex-col p-6 bg-white rounded-2xl shadow-xl transition-transform hover:scale-105 ${isRecommended ? 'border-2 border-indigo-500 ring-4 ring-indigo-50' : 'border border-gray-100'}`}>
      {isRecommended && (
        <div className="absolute top-0 right-0 -mt-3 -mr-3 px-3 py-1 bg-indigo-500 text-white text-xs font-bold uppercase rounded-full shadow-md flex items-center gap-1">
          <Star size={12} fill="currentColor" /> Recommended
        </div>
      )}
      
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
        <p className="text-sm text-gray-500 mt-1 h-10">{plan.recommendedFor}</p>
      </div>
      
      <div className="mb-6">
        <span className="text-4xl font-extrabold text-gray-900">${price}</span>
        <span className="text-gray-500 font-medium">/mo</span>
        {billingCycle === BillingCycle.YEARLY && (
          <p className="text-xs text-green-600 font-semibold mt-1">Billed ${plan.priceYearly} yearly</p>
        )}
      </div>

      <ul className="flex-1 space-y-3 mb-6">
        {plan.features.map((feature, idx) => (
          <li key={idx} className="flex items-start">
            <Check className="h-5 w-5 text-green-500 flex-shrink-0 mr-2" />
            <span className="text-gray-600 text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <Button 
        variant={isRecommended ? 'primary' : 'outline'} 
        className="w-full"
        onClick={() => onSelect(plan)}
      >
        Choose {plan.name}
      </Button>
    </div>
  );
};

export default PlanCard;
