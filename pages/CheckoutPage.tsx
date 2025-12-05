
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App.tsx';
import { Lock, CreditCard } from 'lucide-react';
import Button from '../components/Button';
import { BillingCycle } from '../types';
import { mockEmailService } from '../services/mockEmailService';

const CheckoutPage: React.FC = () => {
  const { selectedPlan, billingCycle, user, completeSubscription, showNotification } = useContext(AppContext);
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  if (!selectedPlan || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
           <h2 className="text-2xl font-bold text-gray-900">No plan selected</h2>
           <Button className="mt-4" onClick={() => navigate('/pricing')}>Browse Plans</Button>
        </div>
      </div>
    );
  }

  const price = billingCycle === BillingCycle.MONTHLY ? selectedPlan.priceMonthly : selectedPlan.priceYearly;
  const cycleLabel = billingCycle === BillingCycle.MONTHLY ? '/month' : '/year';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      // Simulate API processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate sending welcome email
      if (user.email) {
        await mockEmailService.sendWelcomeEmail(user.email, selectedPlan.name);
      }

      completeSubscription();
      showNotification(`Welcome to AuraStream! A confirmation email has been sent to ${user.email}`, 'success');
      navigate('/dashboard');
    } catch (error) {
      showNotification("Payment failed. Please try again.", 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Format Helpers
  const formatCard = (val: string) => {
    return val.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);
  };
  const formatExpiry = (val: string) => {
    return val.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200 h-fit">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
          <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-100">
            <div>
              <h3 className="font-semibold text-gray-800">{selectedPlan.name}</h3>
              <p className="text-sm text-gray-500 capitalize">{billingCycle} Billing</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900">${price.toFixed(2)}</p>
              <p className="text-xs text-gray-400">{cycleLabel}</p>
            </div>
          </div>
          <div className="space-y-2 mb-6">
             <div className="flex justify-between text-sm text-gray-600">
               <span>Subtotal</span>
               <span>${price.toFixed(2)}</span>
             </div>
             <div className="flex justify-between text-sm text-gray-600">
               <span>Tax (est.)</span>
               <span>$0.00</span>
             </div>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <span className="font-bold text-lg text-gray-900">Total due today</span>
            <span className="font-bold text-2xl text-indigo-600">${price.toFixed(2)}</span>
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg flex gap-3 items-start">
             <div className="bg-blue-100 p-1 rounded">
               <Lock size={16} className="text-blue-600" />
             </div>
             <p className="text-xs text-blue-800 leading-snug">
               Your subscription will start immediately. You can cancel anytime from your dashboard.
               Secure payment processing provided by Stripe.
             </p>
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <CreditCard className="text-indigo-600" />
            Payment Details
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input 
                type="email" 
                value={user.email} 
                disabled 
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-500 cursor-not-allowed" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Card Information</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="0000 0000 0000 0000"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCard(e.target.value))}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" 
                />
                <div className="absolute right-3 top-2.5 flex gap-1">
                   {/* Simple visual placeholders for card brands */}
                   <div className="w-8 h-5 bg-gray-200 rounded"></div>
                   <div className="w-8 h-5 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <input 
                  type="text" 
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  required
                  maxLength={5}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                <input 
                  type="text" 
                  placeholder="123"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  required
                  maxLength={4}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
              <input 
                type="text" 
                placeholder="Name on card"
                defaultValue={user.name}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" 
              />
            </div>

            <Button 
              type="submit" 
              isLoading={isProcessing} 
              className="w-full mt-4 h-12 text-lg shadow-indigo-200 shadow-lg"
            >
              Pay ${price.toFixed(2)}
            </Button>
            
            <p className="text-center text-xs text-gray-400 mt-4">
              By confirming, you agree to our Terms of Service.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
