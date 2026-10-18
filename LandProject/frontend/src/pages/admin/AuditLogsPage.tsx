import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { DemoBanner } from '../../components/common/DemoBanner';
import {
  FileCheck2,
  Lock,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Search,
  ExternalLink
} from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const [logs, setLogs] = useState<any[]>([]);
  const [integrity, setIntegrity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('landsure_token');
      const res = await fetch('/api/admin/audit-logs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const json = await res.json();
        setLogs(json.data.logs);
        setIntegrity(json.data.integrity);
      }
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(l =>
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.targetId.toLowerCase().includes(search.toLowerCase()) ||
    l.targetType.toLowerCase().includes(search.toLowerCase()) ||
    (l.reason && l.reason.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
              SHA-256 HASH CHAIN
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            {t('navAuditLogs')}
          </h1>
          <p className="text-xs text-slate-500">
            {lang === 'bn'
              ? 'প্ল্যাটফর্মের প্রতিটি গুরুত্বপূর্ণ ঘটনা ক্রিপ্টোগ্রাফিক হ্যাশ চেইনে স্থায়ীভাবে রেকর্ডকৃত।'
              : 'Tamper-evident, cryptographically linked record of every sensitive mutation and ownership transfer.'}
          </p>
        </div>

        <button
          onClick={fetchLogs}
          disabled={loading}
          className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-xs transition flex items-center gap-1.5"
        >
          <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{lang === 'bn' ? 'লগ রিফ্রেশ করুন' : 'Refresh Audit Chain'}</span>
        </button>
      </div>

      <DemoBanner />

      {/* Cryptographic Chain Integrity Card */}
      {integrity && (
        <div className={`p-4 rounded-2xl border text-xs flex items-center justify-between ${
          integrity.isValid
            ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
            : 'bg-rose-950 text-rose-300 border-rose-500/40'
        }`}>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <span className="font-bold text-sm">
                {integrity.isValid
                  ? (lang === 'bn' ? 'অডিট ট্রেইলের গাণিতিক অখণ্ডতা শতভাগ প্রমাণিত' : 'Audit Log Chain Cryptographically Valid')
                  : 'Chain Tampering Detected!'}
              </span>
              <p className="text-[11px] opacity-80">
                {integrity.totalEvents} sequential events checked. No hash breaks or unauthorized overwrites detected.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={lang === 'bn' ? 'অ্যাকশন বা আইডি দিয়ে লগ ফিল্টার করুন...' : 'Filter by action, target ID, reason...'}
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        />
      </div>

      {/* Logs Timeline */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
          <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          {lang === 'bn' ? 'অডিট চেইন লোড হচ্ছে...' : 'Loading audit chain...'}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLogs.map(log => (
            <div
              key={log.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2 hover:border-emerald-400 transition text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded font-mono text-[11px]">
                    {log.action}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">
                    Target: {log.targetType} #{log.targetId}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>

              {log.reason && (
                <p className="text-slate-700 leading-relaxed font-medium">
                  {log.reason}
                </p>
              )}

              {/* Cryptographic Link Hashes */}
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-mono text-[10px] text-slate-600 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Current Event Hash:</span>
                  <span className="font-bold text-emerald-800 break-all">{log.eventHash}</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-1">
                  <span className="text-slate-400">Parent Previous Hash:</span>
                  <span className="text-slate-500 break-all">{log.previousHash || '0000000000000000000000000000000000000000000000000000000000000000 (GENESIS)'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Actor: {log.actorId || 'SYSTEM'} ({log.actorRole})</span>
                <span className="font-semibold text-emerald-700">Outcome: {log.outcome}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
