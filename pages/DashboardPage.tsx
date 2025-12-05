
import React, { useContext, useState } from 'react';
import { AppContext } from '../App.tsx';
import { MOCK_USAGE_DATA } from '../constants';
import { Plan, PlanTier } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Settings, CreditCard, Activity, Code, Plus, Edit2, Trash2, X, Mail } from 'lucide-react';
import Button from '../components/Button';
import ArchitectureDiagram from '../components/ArchitectureDiagram';
import { mockEmailService } from '../services/mockEmailService';

const DashboardPage: React.FC = () => {
  const { user, selectedPlan, billingCycle, allPlans, addPlan, updatePlan, deletePlan, showNotification } = useContext(AppContext);
  const plan = allPlans.find(p => p.id === user?.currentPlanId) || selectedPlan;
  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'blueprint' | 'admin'>('overview');

  // Admin State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  // Email Test State
  const [isSendingEmail, setIsSendingEmail] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Plan>>({
    name: '',
    priceMonthly: 0,
    priceYearly: 0,
    features: [],
    recommendedFor: ''
  });
  const [featureInput, setFeatureInput] = useState('');

  if (!user) return null;

  const handleOpenCreate = () => {
    setEditingPlan(null);
    setFormData({
      name: '',
      tier: PlanTier.BASIC,
      priceMonthly: 0,
      priceYearly: 0,
      recommendedFor: '',
    });
    setFeatureInput('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setFormData({ ...plan });
    setFeatureInput(plan.features.join('\n'));
    setIsModalOpen(true);
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    const featuresArray = featureInput.split('\n').filter(f => f.trim() !== '');
    
    const finalPlan: Plan = {
      id: editingPlan ? editingPlan.id : `plan_${Date.now()}`,
      name: formData.name || 'New Plan',
      tier: formData.tier || PlanTier.BASIC,
      priceMonthly: Number(formData.priceMonthly),
      priceYearly: Number(formData.priceYearly),
      features: featuresArray,
      recommendedFor: formData.recommendedFor || ''
    };

    if (editingPlan) {
      updatePlan(finalPlan);
    } else {
      addPlan(finalPlan);
    }
    setIsModalOpen(false);
  };

  const handleDeletePlan = (id: string) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      deletePlan(id);
    }
  };

  // Email Tests
  const testRenewalEmail = async () => {
    if (!user.email) return;
    setIsSendingEmail('renewal');
    const price = billingCycle === 'monthly' ? plan?.priceMonthly : plan?.priceYearly;
    const date = new Date();
    date.setDate(date.getDate() + 30);
    
    await mockEmailService.sendRenewalNotice(user.email, date.toDateString(), price || 0);
    showNotification('Test: Renewal email sent to console', 'info');
    setIsSendingEmail(null);
  };

  const testFailureEmail = async () => {
    if (!user.email) return;
    setIsSendingEmail('failure');
    await mockEmailService.sendPaymentFailure(user.email);
    showNotification('Test: Payment failure email sent to console', 'error');
    setIsSendingEmail(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-indigo-900 pb-32">
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
           <div className="flex justify-between items-center">
             <div>
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <p className="text-indigo-200 mt-2">Welcome back, {user.name}</p>
             </div>
             {/* Admin Badge */}
             <div className="bg-indigo-800 text-indigo-200 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border border-indigo-700">
                Admin Access
             </div>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto -mt-24 px-4 sm:px-6 lg:px-8 pb-12">
        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden min-h-[600px] flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 overflow-x-auto">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-4 px-4 whitespace-nowrap text-center font-medium text-sm transition-colors ${activeTab === 'overview' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`flex-1 py-4 px-4 whitespace-nowrap text-center font-medium text-sm transition-colors ${activeTab === 'settings' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Subscription Settings
            </button>
            <button 
              onClick={() => setActiveTab('admin')}
              className={`flex-1 py-4 px-4 whitespace-nowrap text-center font-medium text-sm transition-colors ${activeTab === 'admin' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
               Plan Management
            </button>
            <button 
              onClick={() => setActiveTab('blueprint')}
              className={`flex-1 py-4 px-4 whitespace-nowrap text-center font-medium text-sm transition-colors ${activeTab === 'blueprint' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
               Developer Blueprint
            </button>
          </div>

          <div className="p-8">
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-fade-in">
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl border border-indigo-100">
                      <div className="flex items-center gap-3 mb-2">
                        <Activity className="text-indigo-600" size={20}/>
                        <h3 className="font-semibold text-gray-700">Current Plan</h3>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{plan?.name || "No Active Plan"}</p>
                      <p className="text-sm text-green-600 font-medium mt-1">Active • Auto-renew on</p>
                   </div>
                   <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                      <h3 className="font-semibold text-gray-700 mb-2">Monthly Usage</h3>
                      <p className="text-2xl font-bold text-gray-900">145 GB</p>
                      <p className="text-sm text-gray-400 mt-1">of Unlimited</p>
                   </div>
                   <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                      <h3 className="font-semibold text-gray-700 mb-2">Next Billing</h3>
                      <p className="text-2xl font-bold text-gray-900">Nov 1, 2023</p>
                      <p className="text-sm text-gray-400 mt-1">${billingCycle === 'monthly' ? plan?.priceMonthly : plan?.priceYearly}</p>
                   </div>
                </div>

                {/* Chart */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-6">Data Consumption (Last 7 Days)</h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={MOCK_USAGE_DATA}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="date" tickFormatter={(str) => str.slice(5)} stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip 
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="bandwidth" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
                 <div className="flex justify-between items-center pb-6 border-b border-gray-100">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Plan Details</h3>
                      <p className="text-sm text-gray-500">Manage your subscription tier</p>
                    </div>
                    <Button variant="outline">Change Plan</Button>
                 </div>
                 
                 <div className="flex justify-between items-center pb-6 border-b border-gray-100">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Payment Method</h3>
                      <p className="text-sm text-gray-500">Visa ending in 4242</p>
                    </div>
                    <Button variant="ghost" className="text-indigo-600">Update</Button>
                 </div>

                 {/* Email Simulator */}
                 <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-2 mb-4">
                      <Mail size={20} className="text-gray-600" />
                      <h3 className="text-lg font-bold text-gray-900">Test Notifications</h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">Simulate backend email triggers for demonstration purposes.</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                       <Button 
                          onClick={testRenewalEmail} 
                          isLoading={isSendingEmail === 'renewal'}
                          variant="secondary"
                          className="bg-blue-600 hover:bg-blue-700"
                       >
                         Trigger Renewal Notice
                       </Button>
                       <Button 
                          onClick={testFailureEmail} 
                          isLoading={isSendingEmail === 'failure'}
                          className="bg-red-600 hover:bg-red-700"
                       >
                         Trigger Payment Failed
                       </Button>
                    </div>
                 </div>

                 <div className="pt-4">
                    <h3 className="text-lg font-bold text-red-600 mb-2">Danger Zone</h3>
                    <div className="bg-red-50 p-4 rounded-lg border border-red-100 flex justify-between items-center">
                       <div>
                         <p className="text-sm font-medium text-red-900">Cancel Subscription</p>
                         <p className="text-xs text-red-700">Your access will end immediately.</p>
                       </div>
                       <Button className="bg-white text-red-600 border border-red-200 hover:bg-red-50">Cancel</Button>
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'admin' && (
              <div className="animate-fade-in">
                 <div className="flex justify-between items-center mb-8">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Plan Management</h2>
                      <p className="text-sm text-gray-500">Create, edit, or delete subscription tiers</p>
                    </div>
                    <Button onClick={handleOpenCreate} className="flex items-center gap-2">
                       <Plus size={18} /> New Plan
                    </Button>
                 </div>

                 <div className="grid grid-cols-1 gap-6">
                    {allPlans.map(p => (
                       <div key={p.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                          <div className="mb-4 sm:mb-0">
                             <div className="flex items-center gap-3">
                               <h3 className="font-bold text-lg text-gray-900">{p.name}</h3>
                               <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                                 p.tier === 'Enterprise' ? 'bg-purple-100 text-purple-700' : 
                                 p.tier === 'Pro' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'
                               }`}>
                                 {p.tier}
                               </span>
                             </div>
                             <div className="mt-1 flex gap-4 text-sm text-gray-600">
                                <span>${p.priceMonthly}/mo</span>
                                <span>${p.priceYearly}/yr</span>
                             </div>
                             <p className="text-xs text-gray-400 mt-2 max-w-md">{p.recommendedFor}</p>
                          </div>
                          
                          <div className="flex gap-3">
                             <button onClick={() => handleOpenEdit(p)} className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                               <Edit2 size={18} />
                             </button>
                             <button onClick={() => handleDeletePlan(p.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                               <Trash2 size={18} />
                             </button>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
            )}

            {activeTab === 'blueprint' && (
              <div className="space-y-6 animate-fade-in">
                 <div className="flex items-start gap-4 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm">
                    <Code className="flex-shrink-0 mt-0.5" />
                    <p>
                      This tab visualizes the Full-Stack architecture requested in your prompt. 
                      While this is a frontend-only React demo, the diagram below represents how the 
                      Node.js, Stripe, and PostgreSQL components would be orchestrated in a production deployment.
                    </p>
                 </div>
                 <ArchitectureDiagram />
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Edit/Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setIsModalOpen(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                        {editingPlan ? 'Edit Plan' : 'Create New Plan'}
                      </h3>
                      <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                        <X size={20} />
                      </button>
                    </div>
                    
                    <form id="planForm" onSubmit={handleSavePlan} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Plan Name</label>
                        <input 
                          type="text" 
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Monthly Price</label>
                            <input 
                              type="number" 
                              required
                              step="0.01"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              value={formData.priceMonthly}
                              onChange={e => setFormData({...formData, priceMonthly: parseFloat(e.target.value)})}
                            />
                         </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Yearly Price</label>
                            <input 
                              type="number" 
                              required
                              step="0.01"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              value={formData.priceYearly}
                              onChange={e => setFormData({...formData, priceYearly: parseFloat(e.target.value)})}
                            />
                         </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Tier</label>
                        <select 
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={formData.tier}
                          onChange={e => setFormData({...formData, tier: e.target.value as PlanTier})}
                        >
                          {Object.values(PlanTier).map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Recommended For</label>
                        <textarea 
                          rows={2}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={formData.recommendedFor}
                          onChange={e => setFormData({...formData, recommendedFor: e.target.value})}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Features (one per line)</label>
                        <textarea 
                          rows={4}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={featureInput}
                          onChange={e => setFeatureInput(e.target.value)}
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button type="submit" form="planForm" className="w-full sm:w-auto sm:ml-3">
                  {editingPlan ? 'Save Changes' : 'Create Plan'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="mt-3 w-full sm:mt-0 sm:w-auto">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
