import React from 'react';
import { Server, Database, CreditCard, Shield, Globe, ArrowRight } from 'lucide-react';

const ArchitectureDiagram: React.FC = () => {
  return (
    <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
      <h3 className="text-lg font-bold text-slate-800 mb-6">System Architecture Blueprint</h3>
      
      <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
        
        {/* Frontend */}
        <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm border border-slate-100 w-48">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-full mb-3">
            <Globe size={24} />
          </div>
          <h4 className="font-semibold text-slate-700">Client (React)</h4>
          <p className="text-xs text-slate-500 mt-1">Firebase Hosting</p>
          <div className="mt-2 text-xs bg-slate-100 p-1 rounded w-full">Vite / Tailwind</div>
        </div>

        <ArrowRight className="hidden md:block text-slate-400" />

        {/* Backend Group */}
        <div className="flex flex-col gap-4 p-4 border-2 border-dashed border-slate-300 rounded-xl relative">
          <span className="absolute -top-3 left-4 bg-slate-50 px-2 text-xs font-bold text-slate-400">Google Cloud Run</span>
          
          <div className="flex flex-col md:flex-row gap-4">
            {/* API Server */}
            <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm border border-slate-100 w-48">
              <div className="p-3 bg-indigo-100 text-indigo-600 rounded-full mb-3">
                <Server size={24} />
              </div>
              <h4 className="font-semibold text-slate-700">API (Node/Express)</h4>
              <p className="text-xs text-slate-500 mt-1">RESTful Endpoints</p>
              <div className="mt-2 text-xs text-left w-full space-y-1">
                <div className="bg-slate-50 p-1 rounded font-mono">/api/auth</div>
                <div className="bg-slate-50 p-1 rounded font-mono">/api/billing</div>
              </div>
            </div>

            {/* Services */}
            <div className="flex flex-col justify-center gap-2">
               <div className="flex items-center gap-2 p-2 bg-white rounded shadow-sm text-xs">
                  <Shield size={16} className="text-emerald-500"/>
                  <span>JWT Auth</span>
               </div>
               <div className="flex items-center gap-2 p-2 bg-white rounded shadow-sm text-xs">
                  <CreditCard size={16} className="text-purple-500"/>
                  <span>Stripe SDK</span>
               </div>
            </div>
          </div>
        </div>

        <ArrowRight className="hidden md:block text-slate-400" />

        {/* Database */}
        <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm border border-slate-100 w-48">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-full mb-3">
            <Database size={24} />
          </div>
          <h4 className="font-semibold text-slate-700">Database</h4>
          <p className="text-xs text-slate-500 mt-1">PostgreSQL (Cloud SQL)</p>
          <div className="mt-2 text-xs text-left w-full space-y-1">
            <div className="bg-slate-50 p-1 rounded font-mono">tbl_users</div>
            <div className="bg-slate-50 p-1 rounded font-mono">tbl_subscriptions</div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-sm text-slate-600 border-t pt-4">
        <p className="font-semibold mb-2">Key Integration Flow:</p>
        <ol className="list-decimal list-inside space-y-1 text-slate-500">
          <li>User submits payment details from React Client to Stripe directly.</li>
          <li>Stripe returns a Payment Method ID.</li>
          <li>Client sends ID to Node.js backend.</li>
          <li>Node.js backend creates Subscription via Stripe API.</li>
          <li>Stripe sends Webhook to Node.js to confirm payment success.</li>
          <li>Node.js updates PostgreSQL to set status to 'active'.</li>
        </ol>
      </div>
    </div>
  );
};

export default ArchitectureDiagram;
