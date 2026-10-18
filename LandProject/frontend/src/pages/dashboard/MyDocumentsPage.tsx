import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DemoBanner } from '../../components/common/DemoBanner';
import {
  FileText,
  Upload,
  Lock,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Search,
  X
} from 'lucide-react';

export const MyDocumentsPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedQR, setSelectedQR] = useState<{ token: string; filename: string; docId: string } | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = localStorage.getItem('landsure_token');
        const res = await fetch('/api/documents', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const json = await res.json();
          setDocs(json.data);
        }
      } catch (err) {
        console.error('Failed to load documents:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const filteredDocs = docs.filter(d => 
    d.originalFilename.toLowerCase().includes(search.toLowerCase()) ||
    d.documentId.toLowerCase().includes(search.toLowerCase()) ||
    d.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {t('navMyDocuments')}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'bn'
              ? 'আপলোডকৃত রেজিস্ট্রিকৃত দলিল, বায়া দলিল, নামজারি ও পরচার তালিকা।'
              : 'Secure digital repository of registered deeds, baya deeds, mutations, and survey maps.'}
          </p>
        </div>
        <Link
          to="/dashboard/documents/upload"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary-800 hover:bg-primary-900 text-white text-xs font-semibold shadow-xs transition"
        >
          <Upload className="w-4 h-4" />
          <span>{t('navUploadDoc')}</span>
        </Link>
      </div>

      <DemoBanner compact />

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={lang === 'bn' ? 'দলিলের নাম বা আইডি দিয়ে খুঁজুন...' : 'Search by filename or document ID...'}
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        />
      </div>

      {/* Documents List */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
          <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          {lang === 'bn' ? 'দলিল লোড হচ্ছে...' : 'Loading documents...'}
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200 space-y-3">
          <FileText className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="font-semibold text-slate-700">
            {lang === 'bn' ? 'কোনো দলিল পাওয়া যায়নি' : 'No documents found'}
          </p>
          <Link
            to="/dashboard/documents/upload"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
          >
            <Upload className="w-4 h-4" />
            <span>{t('navUploadDoc')}</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredDocs.map(doc => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-emerald-500/50 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    {doc.documentId}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">
                    {doc.category.replace('_', ' ')}
                  </span>
                  {doc.parcelSummary && (
                    <span className="text-[11px] text-slate-400">
                      • {t('fieldPlotNumber')}: {doc.parcelSummary}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm text-slate-900 truncate">
                  {doc.originalFilename}
                </h3>

                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-mono text-[11px] bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                    <Lock className="w-3 h-3 text-emerald-600" />
                    SHA-256: {doc.sha256Hash.slice(0, 24)}...
                  </span>
                  <span>• {(doc.fileSizeBytes / (1024 * 1024)).toFixed(2)} MB</span>
                  <span>• {new Date(doc.createdAt).toLocaleDateString()}</span>
                </div>

                {doc.reviewNotes && (
                  <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    ℹ️ {doc.reviewNotes}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
                <StatusBadge status={doc.verificationStatus} />

                <button
                  onClick={() => setSelectedQR({ token: doc.publicToken, filename: doc.originalFilename, docId: doc.documentId })}
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
                  title="View Secure Verification QR Code"
                >
                  <QrCode className="w-4 h-4 text-emerald-700" />
                </button>

                <Link
                  to={`/verify/${doc.publicToken}`}
                  target="_blank"
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
                  title="Open Public Verification Link"
                >
                  <ExternalLink className="w-4 h-4 text-slate-600" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QR Code Modal */}
      {selectedQR && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4 shadow-2xl relative border border-slate-100">
            <button
              onClick={() => setSelectedQR(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                {selectedQR.docId}
              </span>
              <h3 className="font-bold text-slate-900 text-sm truncate">{selectedQR.filename}</h3>
              <p className="text-xs text-slate-500">
                {lang === 'bn' ? 'পাবলিক অখণ্ডতা যাচাইয়ের জন্য স্ক্যান করুন' : 'Scan to inspect cryptographic verification record'}
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block">
              {/* Dynamic QR image generated via public verification URL */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                  `${window.location.origin}/verify/${selectedQR.token}`
                )}`}
                alt="Document Verification QR"
                className="w-48 h-48 mx-auto"
              />
            </div>

            <p className="text-[11px] text-slate-400 font-mono break-all bg-slate-50 p-2 rounded-lg border border-slate-100">
              {window.location.origin}/verify/{selectedQR.token}
            </p>

            <div className="pt-2">
              <Link
                to={`/verify/${selectedQR.token}`}
                target="_blank"
                className="w-full py-2.5 rounded-xl bg-primary-800 hover:bg-primary-900 text-white font-semibold text-xs transition block"
              >
                {lang === 'bn' ? 'যাচাই পেজ খুলুন ↗' : 'Open Verification Page ↗'}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
