import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DemoBanner } from '../../components/common/DemoBanner';
import {
  ArrowRightLeft,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  MapPin
} from 'lucide-react';

export const TransactionsPage: React.FC = () => {
  const { user } = useAuth();
  const { lang, t } = useLanguage();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('landsure_token');
      const res = await fetch('/api/transactions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const json = await res.json();
        setTransactions(json.data);
      }
    } catch (err) {
      console.error('Failed to load transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleBuyerAccept = async (txId: string) => {
    setActionLoading(true);
    setMessage('');
    try {
      const token = localStorage.getItem('landsure_token');
      const res = await fetch(`/api/transactions/${txId}/accept`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (res.ok) {
        setMessage(lang === 'bn' ? 'লেনদেন সফলভাবে গ্রহণ করা হয়েছে!' : 'Transaction accepted successfully!');
        await fetchTransactions();
      } else {
        setMessage(json.message || 'Action failed.');
      }
    } catch (err) {
      setMessage('Network error.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {t('navTransactions')}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'bn'
              ? 'আপনার জমি ক্রয় ও বিক্রয়ের প্রস্তাবনা এবং ডিজিটাল সম্মতির স্থিতি।'
              : 'Buy and sell proposals, mutual consent records, and evidence approval lifecycle.'}
          </p>
        </div>
        <Link
          to="/dashboard/transactions/new"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary-800 hover:bg-primary-900 text-white text-xs font-semibold shadow-xs transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t('navNewTransaction')}</span>
        </Link>
      </div>

      <DemoBanner compact />

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
          <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          {lang === 'bn' ? 'লেনদেন লোড হচ্ছে...' : 'Loading transactions...'}
        </div>
      ) : transactions.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200 space-y-3">
          <ArrowRightLeft className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="font-semibold text-slate-700">
            {lang === 'bn' ? 'কোনো লেনদেন পাওয়া যায়নি' : 'No transactions recorded'}
          </p>
          <Link
            to="/dashboard/transactions/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('navNewTransaction')}</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map(tx => {
            const isBuyer = tx.buyerId === user?.id;
            const isSeller = tx.sellerId === user?.id;

            return (
              <div
                key={tx.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        {tx.txReference}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-700">
                      {isSeller ? (
                        <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-bold">
                          {lang === 'bn' ? 'বিক্রেতা হিসেবে প্রস্তাবিত' : 'You are the Seller'}
                        </span>
                      ) : (
                        <span className="text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded font-bold">
                          {lang === 'bn' ? 'ক্রেতা হিসেবে আপনাকে আমন্ত্রিত' : 'You are the Buyer'}
                        </span>
                      )}
                    </p>
                  </div>
                  <StatusBadge status={tx.status} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] text-slate-400 block font-semibold">
                      {lang === 'bn' ? 'বিক্রেতা' : 'Seller'}
                    </span>
                    <span className="font-bold text-slate-900">{tx.sellerName || tx.sellerId}</span>
                    <span className="block text-[11px] text-emerald-700">
                      ✓ {lang === 'bn' ? 'বিক্রেতার সম্মতি প্রাপ্ত' : 'Seller Consented'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] text-slate-400 block font-semibold">
                      {lang === 'bn' ? 'ক্রেতা' : 'Buyer'}
                    </span>
                    <span className="font-bold text-slate-900">{tx.buyerName || tx.buyerId}</span>
                    <span className="block text-[11px]">
                      {tx.buyerConsent ? (
                        <span className="text-emerald-700 font-semibold">
                          ✓ {lang === 'bn' ? 'ক্রেতার সম্মতি প্রাপ্ত' : 'Buyer Consented'}
                        </span>
                      ) : (
                        <span className="text-amber-700 font-semibold">
                          ⏳ {lang === 'bn' ? 'ক্রেতার সম্মতি অপেক্ষমাণ' : 'Awaiting Buyer Consent'}
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] text-slate-400 block font-semibold">
                      {lang === 'bn' ? 'প্রস্তাবিত বিক্রির পরিমাণ' : 'Proposed Transfer Area'}
                    </span>
                    <span className="font-extrabold text-sm text-emerald-800">
                      {tx.proposedArea} {tx.parcel?.areaUnit || 'decimal'}
                    </span>
                    {tx.parcel && (
                      <span className="block text-[11px] text-slate-500">
                        Plot: {tx.parcel.plotNumber} ({tx.parcel.mouza})
                      </span>
                    )}
                  </div>
                </div>

                {tx.transferNotes && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    ℹ️ {tx.transferNotes}
                  </p>
                )}

                {/* Buyer Action Button if consent pending */}
                {isBuyer && !tx.buyerConsent && tx.status === 'SUBMITTED' && (
                  <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <p className="font-bold text-indigo-950">
                        {lang === 'bn' ? 'আপনি কি এই জমি কেনার প্রস্তাবে সম্মতি দিচ্ছেন?' : 'Do you consent to this land purchase proposal?'}
                      </p>
                      <p className="text-indigo-800 text-[11px]">
                        {lang === 'bn' ? 'সম্মতি প্রদান করলে এটি যাচাই ও প্রমাণাদিসহ পর্যালোচনার ধাপে যাবে।' : 'Accepting will advance this transaction to official evidence review.'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleBuyerAccept(tx.id)}
                      disabled={actionLoading}
                      className="px-4 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-semibold whitespace-nowrap shadow-xs transition"
                    >
                      {actionLoading ? 'Processing...' : (lang === 'bn' ? 'আমি ক্রয় প্রস্তাবে সম্মত' : 'I Accept Purchase Terms')}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
