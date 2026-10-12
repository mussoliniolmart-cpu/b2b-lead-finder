'use client';

import { useState } from 'react';
import { Search, Lock, Download, Phone, MapPin, Globe, Mail, CheckCircle2 } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  phone: string;
  address: string;
  website: string;
  email: string;
}

export default function LeadDashboard() {
  const [businessType, setBusinessType] = useState('');
  const [location, setLocation] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPaidUser, setIsPaidUser] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessType || !location) return;

    setLoading(true);
    setTimeout(() => {
      const mockLeads: Lead[] = Array.from({ length: 12 }, (_, index) => ({
        id: `lead-${index + 1}`,
        name: `${businessType} Pro ${index + 1}`,
        phone: `+254 712 345 ${String(index + 10).padStart(2, '0')}`,
        address: `Moi Avenue, ${location}`,
        website: `www.${businessType.toLowerCase().replace(/\s+/g, '')}${index + 1}.com`,
        email: `contact@${businessType.toLowerCase().replace(/\s+/g, '')}${index + 1}.co.ke`,
      }));
      setLeads(mockLeads);
      setLoading(false);
    }, 1000);
  };

  const handlePaystackPayment = () => {
    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_your_key_here';
    
    const handler = (window as any).PaystackPop.setup({
      key: publicKey,
      email: 'user@example.com',
      amount: 50000,
      currency: 'KES',
      callback: function (response: any) {
        setIsPaidUser(true);
        alert(`Payment successful! Reference: ${response.reference}`);
      },
      onClose: function () {
        alert('Transaction was not completed.');
      },
    });

    handler.openIframe();
  };

  const visibleLeads = isPaidUser ? leads : leads.slice(0, 3);
  const lockedCount = leads.length - visibleLeads.length;

  return (
    <main className="max-w-md sm:max-w-2xl lg:max-w-4xl mx-auto p-4 sm:p-6 pb-24">
      <header className="text-center my-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          B2B Lead Finder <span className="text-blue-600">Micro-SaaS</span>
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Instant hyper-targeted local business leads powered by Paystack.
        </p>
      </header>

      <form onSubmit={handleSearch} className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Business Type
          </label>
          <input
            type="text"
            placeholder="e.g. Plumbers, Cafes, Dentists"
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Location / City
          </label>
          <input
            type="text"
            placeholder="e.g. Nairobi, Lagos, Accra"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition flex items-center justify-center space-x-2 shadow-sm text-sm"
        >
          <Search className="w-4 h-4" />
          <span>{loading ? 'Scraping Leads...' : 'Find Leads'}</span>
        </button>
      </form>

      {leads.length > 0 && (
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">
              Found {leads.length} Leads for {businessType} in {location}
            </h2>
            {isPaidUser && (
              <button
                onClick={() => alert('Downloading CSV...')}
                className="inline-flex items-center space-x-1 text-xs bg-emerald-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-emerald-700 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download CSV</span>
              </button>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {visibleLeads.map((lead) => (
              <div key={lead.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
                <h3 className="font-bold text-slate-900 text-base">{lead.name}</h3>
                <div className="text-xs text-slate-600 space-y-1">
                  <p className="flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{lead.phone}</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{lead.address}</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <Globe className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="truncate">{lead.website}</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="truncate">{lead.email}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {!isPaidUser && lockedCount > 0 && (
            <div className="relative mt-6 rounded-2xl bg-gradient-to-br from-blue-900 to-indigo-900 p-6 text-white text-center shadow-lg overflow-hidden">
              <div className="absolute -right-6 -bottom-6 opacity-10">
                <Lock className="w-36 h-36" />
              </div>
              <div className="relative z-10 space-y-3">
                <span className="inline-block bg-blue-500/30 text-blue-200 text-xs px-3 py-1 rounded-full font-medium">
                  Freemium Limit Reached
                </span>
                <h3 className="text-xl font-bold">
                  Unlock {lockedCount} More Verified Leads & CSV Export
                </h3>
                <p className="text-xs text-blue-100 max-w-sm mx-auto">
                  Get full direct phone numbers, email addresses, and instant CSV export for just $5 via Paystack.
                </p>
                <button
                  onClick={handlePaystackPayment}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-3 rounded-xl transition shadow-md text-sm inline-flex items-center space-x-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Unlock Full List via Paystack</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
