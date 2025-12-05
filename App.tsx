
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Pages
import LandingPage from './pages/LandingPage';
import PricingPage from './pages/PricingPage';
import CheckoutPage from './pages/CheckoutPage';
import DashboardPage from './pages/DashboardPage';

// Components
import Navbar from './components/Navbar';
import Toast, { ToastType } from './components/Toast';

// Context
import { Plan, BillingCycle, User } from './types';
import { PLANS } from './constants';

// Simple Context for Global State
export interface AppContextType {
  user: User | null;
  selectedPlan: Plan | null;
  billingCycle: BillingCycle;
  allPlans: Plan[];
  isAIEnabled: boolean;
  login: (name: string) => void;
  logout: () => void;
  selectPlan: (plan: Plan) => void;
  setBillingCycle: (cycle: BillingCycle) => void;
  completeSubscription: () => void;
  addPlan: (plan: Plan) => void;
  updatePlan: (plan: Plan) => void;
  deletePlan: (planId: string) => void;
  toggleAI: () => void;
  showNotification: (message: string, type?: ToastType) => void;
}

export const AppContext = React.createContext<AppContextType>({} as AppContextType);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [billingCycle, setBillingCycleState] = useState<BillingCycle>(BillingCycle.MONTHLY);
  const [allPlans, setAllPlans] = useState<Plan[]>(PLANS);
  const [isAIEnabled, setIsAIEnabled] = useState<boolean>(true);
  
  // Notification State
  const [notification, setNotification] = useState<{ message: string; type: ToastType } | null>(null);

  const showNotification = (message: string, type: ToastType = 'info') => {
    setNotification({ message, type });
  };

  const login = (name: string) => {
    setUser({
      id: 'usr_123',
      name: name,
      email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
      subscriptionStatus: 'inactive',
      memberSince: new Date().toISOString()
    });
  };

  const logout = () => {
    setUser(null);
    setSelectedPlan(null);
    showNotification("Logged out successfully", 'info');
  };

  const selectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
  };

  const setBillingCycle = (cycle: BillingCycle) => {
    setBillingCycleState(cycle);
  };

  const completeSubscription = () => {
    if (user && selectedPlan) {
      setUser({
        ...user,
        subscriptionStatus: 'active',
        currentPlanId: selectedPlan.id,
        billingCycle: billingCycle
      });
    }
  };

  // Plan Management
  const addPlan = (newPlan: Plan) => {
    setAllPlans([...allPlans, newPlan]);
    showNotification(`Plan "${newPlan.name}" created`, 'success');
  };

  const updatePlan = (updatedPlan: Plan) => {
    setAllPlans(allPlans.map(p => p.id === updatedPlan.id ? updatedPlan : p));
    showNotification(`Plan "${updatedPlan.name}" updated`, 'success');
  };

  const deletePlan = (planId: string) => {
    setAllPlans(allPlans.filter(p => p.id !== planId));
    showNotification("Plan deleted", 'info');
  };

  const toggleAI = () => {
    setIsAIEnabled(!isAIEnabled);
    showNotification(`AI features ${!isAIEnabled ? 'enabled' : 'disabled'}`, 'info');
  };

  return (
    <AppContext.Provider value={{ 
      user, 
      selectedPlan, 
      billingCycle, 
      allPlans, 
      isAIEnabled,
      login, 
      logout, 
      selectPlan, 
      setBillingCycle, 
      completeSubscription,
      addPlan,
      updatePlan,
      deletePlan,
      toggleAI,
      showNotification
    }}>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans relative">
          
          <Navbar />

          {/* Main Content */}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/checkout" element={user ? <CheckoutPage /> : <Navigate to="/pricing" replace />} />
              <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/pricing" replace />} />
            </Routes>
          </main>

          {/* Toast Notification Container */}
          {notification && (
            <Toast 
              message={notification.message} 
              type={notification.type} 
              onClose={() => setNotification(null)} 
            />
          )}

          {/* Footer */}
          <footer className="bg-slate-50 border-t border-gray-200 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="font-bold text-gray-900 mb-4">Product</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>Features</li>
                    <li>Pricing</li>
                    <li>API</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-4">Resources</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>Documentation</li>
                    <li>Guides</li>
                    <li>Support</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-4">Company</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>About</li>
                    <li>Blog</li>
                    <li>Careers</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-4">Legal</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>Privacy</li>
                    <li>Terms</li>
                  </ul>
                </div>
              </div>
              <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} AuraStream, Inc. All rights reserved.
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </AppContext.Provider>
  );
};

export default App;
