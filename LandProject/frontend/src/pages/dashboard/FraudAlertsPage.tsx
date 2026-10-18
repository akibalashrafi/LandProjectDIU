import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DemoBanner } from '../../components/common/DemoBanner';
import { AlertTriangle, ShieldAlert, CheckCircle2, Info, MapPin } from 'lucide-react';

export const FraudAlertsPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const token = localStorage.getItem('landsure_token');
        const res = await fetch('/api/fraud/alerts', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const json = await res.json();
          setAlerts(json.data);
        }
      } catch (err) {
        console.error('Failed to load alerts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {t('navAlerts')}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {lang === 'bn'
            ? 'স্বচ্ছ ও নিয়মভিত্তিক জালিয়াতি শনাক্তকরণ ইঞ্জিনের প্রাপ্ত ফলাফল ও অমিল।'
            : 'Explainable fraud alerts, overlapping deed detections, and cadastral discrepancy reports.'}
        </p>
      </div>

      <DemoBanner compact />

      {/* Legal & Fairness Notice */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 flex items-start gap-3 text-xs">
        <Info className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
        <div className="space-y-1">
          <p className="font-bold text-amber-300">
            {lang === 'bn' ? 'সতর্ক সংকেতের নীতিগত অবস্থান:' : 'Fairness & Due Process Principle:'}
          </p>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            {lang === 'bn'
              ? 'একটি সতর্কতা কাউকে স্বয়ংক্রিয়ভাবে প্রতারক বা অপরাধী প্রমাণ করে না। উত্তরাধিকারের বন্টন, পূর্ববর্তী খারিজের বিলম্ব বা টাইপো ভুলের কারণেও অসঙ্গতি দেখা দিতে পারে। সকল তথ্যের সত্যতা সহকারী কমিশনার (ভূমি) দ্বারা নিরীক্ষাযোগ্য।'
              : 'A discrepancy alert is not an accusation of fraud. Inheritance subdivisions or typographical variances can produce flags. Authorized review establishes legal finality.'}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
          <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          {lang === 'bn' ? 'সতর্কতা লোড হচ্ছে...' : 'Loading alerts...'}
        </div>
      ) : alerts.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200 space-y-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <h3 className="font-bold text-sm text-slate-800">
            {lang === 'bn' ? 'কোনো সক্রিয় অমিল বা জালিয়াতির সতর্কতা নেই' : 'No Active Discrepancy Alerts'}
          </h3>
          <p className="text-slate-500">
            {lang === 'bn'
              ? 'আপনার নথিভুক্ত সকল জমি ও দলিলের তথ্যে কোনো অসঙ্গতি বা একাধিক বিক্রি শনাক্ত হয়নি।'
              : 'All your registered parcel records and documents align with expected parameters.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map(alert => (
            <div
              key={alert.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 hover:border-rose-400 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded">
                      {alert.alertId}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(alert.detectedAt).toLocaleString()}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mt-1">{alert.title}</h3>
                </div>
                <StatusBadge status={alert.severity} />
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {alert.explanation}
              </p>

              {/* Conflicting Evidence Fields Box */}
              {alert.conflictingFields && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <span className="font-bold text-[11px] text-slate-500 uppercase tracking-wider block">
                    {lang === 'bn' ? 'শনাক্তকৃত অসঙ্গতির প্রমাণাদি (Conflicting Evidence):' : 'Conflicting Evidence Fields:'}
                  </span>
                  <div className="space-y-1 text-slate-700 font-mono text-[11px]">
                    {Object.entries(alert.conflictingFields).map(([key, val]) => (
                      <div key={key} className="flex flex-col sm:flex-row sm:items-center justify-between py-1 border-b border-slate-100 last:border-b-0">
                        <span className="text-slate-400">{key}:</span>
                        <span className="font-semibold text-slate-900">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>
                  🔍 {lang === 'bn' ? 'তথ্যসূত্র:' : 'Source:'} {alert.evidenceSource || 'Cadastral Cross-Match Engine'}
                </span>
                <span className="font-semibold text-slate-700">
                  Status: {alert.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
