import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App.tsx';
import { MOCK_USAGE_DATA } from '../constants';
import { BillingCycle, Plan } from '../types';
import PlanCard from '../components/PlanCard';
import Button from '../components/Button';
import { Sparkles, X, Activity, ToggleLeft, ToggleRight } from 'lucide-react';
import { getPlanRecommendation } from '../services/geminiService';

const PricingPage: React.FC = () => {
  const { billingCycle, setBillingCycle, selectPlan, login, allPlans, isAIEnabled, toggleAI } = useContext(AppContext);
  const navigate = useNavigate();
  
  // AI Advisor State
  const [advisorOpen, setAdvisorOpen] = useState(false);
  const [userQuery, setUserQuery] = useState('');
  const [budget, setBudget] = useState('');
  const [features, setFeatures] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendation, setRecommendation] = useState<{ id: string; reason: string } | null>(null);

  // Close advisor if AI is disabled globally
  useEffect(() => {
    if (!isAIEnabled) {
      setAdvisorOpen(false);
    }
  }, [isAIEnabled]);

  const handlePlanSelect = (plan: Plan) => {
    selectPlan(plan);
    // Simulate a quick login for demo purposes if not logged in
    login("Demo User"); 
    navigate('/checkout');
  };

  const handleAIAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim() && !budget && !features.trim()) return;

    setIsAnalyzing(true);
    setRecommendation(null);
    
    try {
      const result = await getPlanRecommendation({
        description: userQuery,
        budget: budget ? parseFloat(budget) : undefined,
        features: features,
        usageHistory: MOCK_USAGE_DATA,
        availablePlans: allPlans
      });
      setRecommendation({
        id: result.recommendedPlanId,
        reason: result.reasoning
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Pricing</h2>
          <p className="mt-2 text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Plans that fit your scale
          </p>
          <p className="mt-4 text-xl text-gray-500 mb-8">
            Simple, transparent pricing. No hidden fees. Cancel anytime.
          </p>
          
          {/* AI Feature Toggle */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className={`text-sm font-medium ${isAIEnabled ? 'text-indigo-700' : 'text-gray-500'}`}>
              AI Features {isAIEnabled ? 'Enabled' : 'Disabled'}
            </span>
            <button
              onClick={toggleAI}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isAIEnabled ? 'bg-indigo-600' : 'bg-gray-300'}`}
              title="Toggle AI Recommendations"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAIEnabled ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </div>
          
          {/* AI Advisor Toggle (Only visible if enabled) */}
          {isAIEnabled && (
            <div className="relative z-10">
               {!advisorOpen ? (
                  <button 
                    onClick={() => setAdvisorOpen(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                  >
                    <Sparkles size={18} />
                    Not sure? Ask our AI Advisor
                  </button>
               ) : (
                  <div className="bg-white rounded-2xl shadow-2xl p-6 border border-purple-100 animate-fade-in text-left max-w-2xl mx-auto relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                         <Sparkles className="text-purple-600" size={24} />
                         AI Plan Advisor
                      </h3>
                      <button 
                        onClick={() => setAdvisorOpen(false)} 
                        className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    
                    <form onSubmit={handleAIAnalyze} className="space-y-4">
                      <div className="bg-blue-50 p-3 rounded-lg flex items-start gap-2 text-sm text-blue-800 mb-2">
                         <Activity size={16} className="mt-0.5 flex-shrink-0" />
                         <p>We'll analyze your current usage patterns (Simulated Data) alongside your requirements to find the best fit.</p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">How do you plan to use AuraStream?</label>
                        <textarea 
                          value={userQuery}
                          onChange={(e) => setUserQuery(e.target.value)}
                          placeholder="e.g. 'I have a family of 4, we watch on TV and phones, and need downloads for travel.'"
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-shadow"
                          rows={2}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                           <label className="block text-sm font-semibold text-gray-700 mb-1">Max Monthly Budget</label>
                           <div className="relative">
                             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                             <input 
                                type="number"
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                                placeholder="e.g. 20"
                                className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                             />
                           </div>
                        </div>
                        <div>
                           <label className="block text-sm font-semibold text-gray-700 mb-1">Must-have Features</label>
                           <input 
                              type="text"
                              value={features}
                              onChange={(e) => setFeatures(e.target.value)}
                              placeholder="e.g. 4K, Sports, Ad-free"
                              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                           />
                        </div>
                      </div>

                      <div className="pt-2">
                        <Button type="submit" isLoading={isAnalyzing} variant="secondary" className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0">
                          Find My Perfect Plan
                        </Button>
                      </div>
                    </form>
                    
                    {recommendation && (
                      <div className="mt-6 p-5 bg-indigo-50 rounded-xl border border-indigo-100 flex gap-4 animate-fade-in">
                        <div className="bg-white p-2 rounded-full h-fit shadow-sm">
                           <Sparkles className="text-indigo-600" size={20} />
                        </div>
                        <div>
                          <p className="text-indigo-900 font-medium text-lg mb-1">
                            We recommend: <span className="font-bold">{allPlans.find(p => p.id === recommendation.id)?.name}</span>
                          </p>
                          <p className="text-indigo-700 text-sm leading-relaxed">{recommendation.reason}</p>
                        </div>
                      </div>
                    )}
                  </div>
               )}
            </div>
          )}
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-white p-1 rounded-xl border border-gray-200 inline-flex relative">
             <div className="w-full h-full absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* Visual slider background could go here */}
             </div>
             <button 
               onClick={() => setBillingCycle(BillingCycle.MONTHLY)}
               className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${billingCycle === BillingCycle.MONTHLY ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
             >
               Monthly
             </button>
             <button 
               onClick={() => setBillingCycle(BillingCycle.YEARLY)}
               className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${billingCycle === BillingCycle.YEARLY ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
             >
               Yearly <span className="ml-1 text-xs text-green-500 font-bold">-20%</span>
             </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {allPlans.map((plan) => (
            <PlanCard 
              key={plan.id} 
              plan={plan} 
              billingCycle={billingCycle} 
              onSelect={handlePlanSelect}
              isRecommended={recommendation?.id === plan.id}
            />
          ))}
        </div>

        <div className="mt-16 bg-white rounded-xl p-8 border border-gray-200 text-center">
          <h3 className="font-bold text-lg mb-2">Need a custom enterprise solution?</h3>
          <p className="text-gray-500 mb-4">We offer dedicated infrastructure for large-scale deployments.</p>
          <Button variant="outline">Contact Sales</Button>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;