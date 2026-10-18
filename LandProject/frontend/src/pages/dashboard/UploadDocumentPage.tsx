import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { DemoBanner } from '../../components/common/DemoBanner';
import {
  Upload,
  FileText,
  Lock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  QrCode
} from 'lucide-react';

export const UploadDocumentPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultParcelId = searchParams.get('parcelId') || '';

  const [parcels, setParcels] = useState<any[]>([]);
  const [selectedParcelId, setSelectedParcelId] = useState(defaultParcelId);
  const [category, setCategory] = useState<string>('REGISTERED_DEED');
  const [file, setFile] = useState<File | null>(null);
  const [buyerName, setBuyerName] = useState('Tanvir Ahmed');
  const [sellerName, setSellerName] = useState('Abdul Malek');
  const [deedNumber, setDeedNumber] = useState('DEED-2026-901');
  const [landArea, setLandArea] = useState('4.0');
  const [plotNumber, setPlotNumber] = useState('342');
  const [khatianNumber, setKhatianNumber] = useState('890');
  const [simulateTampering, setSimulateTampering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successResult, setSuccessResult] = useState<any>(null);

  useEffect(() => {
    const fetchParcels = async () => {
      try {
        const token = localStorage.getItem('landsure_token');
        const res = await fetch('/api/lands', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const json = await res.json();
          setParcels(json.data);
          if (!selectedParcelId && json.data.length > 0) {
            setSelectedParcelId(json.data[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load parcels:', err);
      }
    };

    fetchParcels();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError(lang === 'bn' ? 'অনুগ্রহ করে একটি দলিল ফাইল নির্বাচন করুন।' : 'Please select a document file.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);
      if (selectedParcelId) {
        formData.append('parcelId', selectedParcelId);
      }

      const structured = {
        buyerName,
        sellerName,
        deedNumber,
        landArea: parseFloat(landArea) || 0,
        plotNumber,
        khatianNumber
      };
      formData.append('structuredDataJson', JSON.stringify(structured));

      // Demonstration: if simulate tampering is on, send mismatched reference hash
      if (simulateTampering) {
        formData.append('referenceHash', '0000000000000000000000000000000000000000000000000000000000000000');
        formData.append('referenceSource', 'Sub-Registry Simulated Reference Ledger');
      }

      const token = localStorage.getItem('landsure_token');
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || 'Failed to upload document.');
      }

      setSuccessResult(json.data);
    } catch (err: any) {
      setError(err.message || 'An error occurred during upload.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/dashboard/documents')}
          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {t('navUploadDoc')}
          </h1>
          <p className="text-xs text-slate-500">
            {lang === 'bn'
              ? 'দলিল আপলোডের সাথে সাথে স্বয়ংক্রিয় ক্রিপ্টোগ্রাফিক হ্যাশ ও অমিল নিরীক্ষা সম্পন্ন হবে।'
              : 'Upload deed or mutation files for automated SHA-256 fingerprinting and structured comparison.'}
          </p>
        </div>
      </div>

      <DemoBanner />

      {successResult ? (
        <div className="bg-white rounded-3xl border border-emerald-200 p-8 shadow-md text-center space-y-6">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900">
              {lang === 'bn' ? 'দলিল সফলভাবে আপলোড ও যাচাই সম্পন্ন!' : 'Document Uploaded & Verified!'}
            </h2>
            <p className="text-xs text-slate-500">
              {successResult.document.originalFilename} • ID: {successResult.document.documentId}
            </p>
          </div>

          {/* Cryptographic SHA-256 Box */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left space-y-2 text-xs">
            <div className="flex items-center justify-between font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                Computed SHA-256 Checksum
              </span>
              <span className="text-[10px] text-emerald-700 font-mono">
                {successResult.document.verificationStatus}
              </span>
            </div>
            <p className="font-mono text-xs break-all text-slate-900 bg-white p-2.5 rounded-lg border border-slate-200">
              {successResult.document.sha256Hash}
            </p>
          </div>

          {/* QR Code */}
          {successResult.qrDataUrl && (
            <div className="space-y-2 inline-block">
              <p className="text-xs font-bold text-slate-700">
                {lang === 'bn' ? 'পাবলিক অখণ্ডতা যাচাই QR কোড' : 'Public Verification QR Code'}
              </p>
              <div className="p-3 bg-white border border-slate-200 rounded-2xl shadow-xs inline-block">
                <img src={successResult.qrDataUrl} alt="QR Code" className="w-44 h-44 mx-auto" />
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigate('/dashboard/documents')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-900"
            >
              {lang === 'bn' ? 'আমার দলিল তালিকায় যান' : 'Go to Documents List'}
            </button>
            <button
              onClick={() => { setSuccessResult(null); setFile(null); }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
            >
              {lang === 'bn' ? 'আরেকটি দলিল আপলোড করুন' : 'Upload Another Document'}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* File Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {lang === 'bn' ? 'দলিল ফাইল নির্বাচন করুন (PDF, JPEG, PNG - সর্বোচ্চ ১০ মেগাবাইট)' : 'Select Document File (PDF, JPEG, PNG - Max 10MB)'} *
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-emerald-500 transition cursor-pointer relative bg-slate-50/50">
              <input
                type="file"
                required
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <Upload className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              {file ? (
                <div className="space-y-1">
                  <p className="text-xs font-bold text-emerald-800">{file.name}</p>
                  <p className="text-[11px] text-slate-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB • {file.type}
                  </p>
                </div>
              ) : (
                <div className="space-y-1 text-slate-500 text-xs">
                  <p className="font-semibold text-slate-700">
                    {lang === 'bn' ? 'ফাইল টেনে আনুন অথবা ক্লিক করে আপলোড করুন' : 'Click to select or drag and drop file'}
                  </p>
                  <p className="text-[11px] text-slate-400">PDF, JPG, PNG up to 10MB</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'bn' ? 'দলিলের ধরণ' : 'Document Category'} *
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
              >
                <option value="REGISTERED_DEED">Registered Deed (মূল সাব-কবলা দলিল)</option>
                <option value="BAYA_DEED">Baya Deed / Chain Deed (বায়া দলিল)</option>
                <option value="KHATIAN_PORCHA">Khatian / Porcha (খতিয়ান বা পর্চা)</option>
                <option value="MUTATION_ORDER">Mutation Order / Khatian (নামজারি আদেশ ও খতিয়ান)</option>
                <option value="TAX_RECEIPT">Land Development Tax Receipt (দাখিলা / খাজনা রসিদ)</option>
                <option value="MOUZA_MAP">Mouza / Survey Map (মৌজা নকশা)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'bn' ? 'সংযুক্ত জমি নির্বাচন' : 'Link to Registered Land Parcel'}
              </label>
              <select
                value={selectedParcelId}
                onChange={e => setSelectedParcelId(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
              >
                <option value="">{lang === 'bn' ? '-- কোনো জমি সংযুক্ত নয় --' : '-- No Land Linked --'}</option>
                {parcels.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.internalParcelId} • Plot {p.plotNumber} ({p.mouza})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Structured Document Comparison Metadata */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-700" />
              <span>{lang === 'bn' ? 'দলিলের মূল তথ্যাবলী (স্বয়ংক্রিয় অমিল পরীক্ষার জন্য)' : 'Structured Extraction Fields for Discrepancy Checks'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'bn' ? 'ক্রেতার নাম (দলিল অনুসারে)' : 'Buyer Name'}
                </label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={e => setBuyerName(e.target.value)}
                  placeholder="e.g. Tanvir Ahmed"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'bn' ? 'বিক্রেতার নাম (দলিল অনুসারে)' : 'Seller Name'}
                </label>
                <input
                  type="text"
                  value={sellerName}
                  onChange={e => setSellerName(e.target.value)}
                  placeholder="e.g. Abdul Malek"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'bn' ? 'দলিল নম্বর' : 'Deed Reference Number'}
                </label>
                <input
                  type="text"
                  value={deedNumber}
                  onChange={e => setDeedNumber(e.target.value)}
                  placeholder="e.g. DEED-2026-901"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'bn' ? 'দলিলভুক্ত জমির পরিমাণ (শতাংশ)' : 'Land Area in Deed (Decimal)'}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={landArea}
                  onChange={e => setLandArea(e.target.value)}
                  placeholder="4.0"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Hackathon Demo Feature: Simulate Hash Mismatch */}
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs space-y-2">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-amber-900">
              <input
                type="checkbox"
                checked={simulateTampering}
                onChange={e => setSimulateTampering(e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500"
              />
              <span>
                {lang === 'bn'
                  ? 'হ্যাকাথন ডেমো: বিকৃত ফাইল ও হ্যাশ অমিল পরীক্ষা করুন (Simulate Hash Mismatch Scenario 4)'
                  : 'Hackathon Demo: Simulate tampered deed hash mismatch against registry (Scenario 4)'}
              </span>
            </label>
            <p className="text-slate-600 text-[11px] pl-6">
              {lang === 'bn'
                ? 'এটি চিহ্নিত করলে সিস্টেম একটি কাল্পনিক রেফারেন্স হ্যাশের বিপরীতে তুলনা করবে এবং "Warning: Hash Mismatch" ফ্ল্যাগ তৈরি করবে।'
                : 'When enabled, the file will be compared against a trusted reference that does not match, triggering Scenario 4 fraud detection.'}
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate('/dashboard/documents')}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              {t('btnCancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-primary-800 hover:bg-primary-900 text-white text-xs font-semibold shadow-xs transition"
            >
              {loading ? (lang === 'bn' ? 'যাচাই ও আপলোড হচ্ছে...' : 'Verifying & Uploading...') : t('btnSubmit')}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
