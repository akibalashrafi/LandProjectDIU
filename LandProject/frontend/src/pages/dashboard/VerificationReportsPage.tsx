import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DemoBanner } from '../../components/common/DemoBanner';
import { FileCheck2, AlertTriangle, CheckCircle2, Lock, ArrowRight } from 'lucide-react';

export const VerificationReportsPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const token = localStorage.getItem('landsure_token');
        const res = await fetch('/api/documents', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const json = await res.json();
          // Filter documents with report
          const withReports = json.data.filter((d: any) => d.report);
          setReports(withReports);
        }
      } catch (err) {
        console.error('Failed to load reports:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {t('navVerificationReports')}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {lang === 'bn'
            ? 'দলিলের অখণ্ডতা, রেকর্ড সামঞ্জস্য এবং অসঙ্গতি সংক্রান্ত বিশদ প্রতিবেদন।'
            : 'Detailed findings on cryptographic integrity, discrepancy evaluations, and cadastral alignments.'}
        </p>
      </div>

      <DemoBanner compact />

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
          <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          {lang === 'bn' ? 'প্রতিবেদন লোড হচ্ছে...' : 'Loading reports...'}
        </div>
      ) : reports.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
          {lang === 'bn' ? 'কোনো প্রতিবেদন তৈরি হয়নি।' : 'No verification reports found.'}
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map(doc => {
            const report = doc.report;
            return (
              <div
                key={report.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        {doc.documentId}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(report.verifiedAt).toLocaleString()}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm mt-1">{doc.originalFilename}</h3>
                  </div>
                  <StatusBadge status={report.overallStatus} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] text-slate-400 block font-semibold">
                      {lang === 'bn' ? 'ফাইল ডিজিটাল অখণ্ডতা' : 'File Integrity'}
                    </span>
                    <span className="font-bold flex items-center gap-1 text-slate-800">
                      {report.fileIntegrityPassed ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Passed (SHA-256)
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4 text-rose-600" />
                          Failed Checksum
                        </>
                      )}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] text-slate-400 block font-semibold">
                      {lang === 'bn' ? 'সরকারি রেফারেন্স হ্যাশ' : 'Reference Hash'}
                    </span>
                    <span className="font-semibold text-slate-800">
                      {report.referenceHashMatched ? 'Matched Official Ledger' : 'No Official Hash Match'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] text-slate-400 block font-semibold">
                      {lang === 'bn' ? 'রেকর্ড মিল' : 'Record Comparison'}
                    </span>
                    <span className="font-semibold text-slate-800">
                      {report.recordMatchStatus}
                    </span>
                  </div>
                </div>

                {report.discrepanciesJson && report.discrepanciesJson.length > 0 && (
                  <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-4 space-y-2 text-xs">
                    <h4 className="font-bold text-rose-950 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      {lang === 'bn' ? 'শনাক্তকৃত অসঙ্গতির তালিকা:' : 'Identified Discrepancies:'}
                    </h4>
                    <div className="space-y-1.5">
                      {report.discrepanciesJson.map((disc: any, idx: number) => (
                        <div key={idx} className="bg-white p-2.5 rounded-lg border border-rose-100 text-[11px] space-y-0.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-rose-900">{disc.field}</span>
                            <span className="text-[10px] font-semibold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                              {disc.severity}
                            </span>
                          </div>
                          <p className="text-slate-600">{disc.description}</p>
                          <p className="text-slate-500 font-mono text-[10px]">
                            Expected: {disc.expected} | Actual: {disc.actual}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {report.reviewerNotes && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    👨‍⚖️ <strong>{lang === 'bn' ? 'তদন্তকারী কর্মকর্তার নোট:' : 'Reviewer Finding:'}</strong> {report.reviewerNotes}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
