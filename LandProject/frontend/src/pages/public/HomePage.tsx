import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  ShieldCheck,
  Search,
  FileCheck2,
  AlertTriangle,
  ArrowRight,
  Lock,
  Layers,
  Scale,
  CheckCircle,
  HelpCircle,
  QrCode
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { lang, t } = useLanguage();
  const { quickLogin } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    setSearchError('');
    setSearchResult(null);

    // If looks like a token, redirect to /verify/:token
    if (searchQuery.startsWith('tok-') || searchQuery.length > 20) {
      navigate(`/verify/${searchQuery.trim()}`);
      return;
    }

    try {
      const res = await fetch(`/api/public/parcel-check?plot=${encodeURIComponent(searchQuery.trim())}`);
      const data = await res.json();
      if (res.ok && data.data && data.data.length > 0) {
        setSearchResult(data.data[0]);
      } else {
        setSearchError(lang === 'bn' ? 'কোনো রেকর্ড পাওয়া যায়নি।' : 'No matching record found in sample database.');
      }
    } catch (err) {
      setSearchError(lang === 'bn' ? 'অনুসন্ধানে ত্রুটি হয়েছে।' : 'Search request failed.');
    } finally {
      setSearching(false);
    }
  };

  const handleDemoClick = async (role: string) => {
    await quickLogin(role);
    navigate(role === 'ADMIN' ? '/admin' : '/dashboard');
  };

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-950 via-slate-900 to-primary-950 text-white p-8 sm:p-12 lg:p-16 shadow-2xl border border-slate-800">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-900/60 border border-primary-500/30 text-emerald-300 text-xs font-semibold tracking-wide">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'bn' ? 'জাতীয় ভূমি রেকর্ড সততা ও জালিয়াতি প্রতিরোধ' : 'National Land Record Integrity & Fraud Defense'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white">
            {t('heroTitle')}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
            {t('tagline')}
          </p>

          {/* Interactive Search Bar */}
          <div className="pt-2">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 max-w-2xl bg-white/10 p-2 rounded-2xl backdrop-blur-md border border-white/15">
              <div className="relative flex-1 flex items-center">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <button
                type="submit"
                disabled={searching}
                className="px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm transition shadow-lg shadow-primary-900/40 flex items-center justify-center gap-2"
              >
                {searching ? (lang === 'bn' ? 'যাচাই হচ্ছে...' : 'Verifying...') : t('btnVerify')}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <p className="text-xs text-slate-400 mt-2">
              💡 {lang === 'bn' ? 'ডেমো টোকেন চেষ্টা করুন:' : 'Try sample inputs:'}{' '}
              <button
                onClick={() => setSearchQuery('342')}
                className="text-emerald-400 hover:underline font-mono"
              >
                Plot 342
              </button>
              {', '}
              <button
                onClick={() => setSearchQuery('1042')}
                className="text-emerald-400 hover:underline font-mono"
              >
                Plot 1042 (Duplicate Alert)
              </button>
              {', '}
              <button
                onClick={() => setSearchQuery('tok-verify-clean-1001')}
                className="text-emerald-400 hover:underline font-mono"
              >
                QR Token #1001
              </button>
            </p>
          </div>

          {/* Search Result Box */}
          {searchResult && (
            <div className="mt-4 p-4 rounded-xl bg-white/15 border border-white/20 text-white text-xs space-y-2 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-emerald-300">
                  {searchResult.internalParcelId} • Plot {searchResult.plotNumber} ({searchResult.mouza})
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono text-[10px]">
                  {searchResult.verificationStatus}
                </span>
              </div>
              <p className="text-slate-200">
                District: {searchResult.district} | Upazila: {searchResult.upazila} | Area: {searchResult.totalArea} {searchResult.areaUnit}
              </p>
              {searchResult.hasActiveFraudAlerts && (
                <div className="flex items-center gap-1.5 text-rose-300 font-semibold text-[11px] bg-rose-950/60 p-2 rounded">
                  <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span>
                    {lang === 'bn'
                      ? 'সতর্কতা: এই দাগের উপর সক্রিয় জালিয়াতি বা একাধিক বিক্রির অভিযোগ রয়েছে।'
                      : 'Notice: Active duplicate sale or discrepancy alert flagged on this plot.'}
                  </span>
                </div>
              )}
            </div>
          )}

          {searchError && (
            <div className="mt-3 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs">
              {searchError}
            </div>
          )}

          {/* Quick Demo Launchers for Judges */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center gap-3">
            <span className="text-xs text-slate-400 font-semibold">{t('btnQuickLogin')}:</span>
            <button
              onClick={() => handleDemoClick('CITIZEN')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-medium transition"
            >
              Tanvir (Seller)
            </button>
            <button
              onClick={() => handleDemoClick('BUYER')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-medium transition"
            >
              Farhana (Buyer)
            </button>
            <button
              onClick={() => handleDemoClick('ADMIN')}
              className="px-3 py-1.5 rounded-lg bg-amber-950/80 hover:bg-amber-900 border border-amber-600/40 text-xs text-amber-300 font-semibold transition"
            >
              Anisur (Admin)
            </button>
            <button
              onClick={() => handleDemoClick('REVIEWER')}
              className="px-3 py-1.5 rounded-lg bg-sky-950/80 hover:bg-sky-900 border border-sky-600/40 text-xs text-sky-300 font-semibold transition"
            >
              Shamima (AC Land Reviewer)
            </button>
          </div>
        </div>
      </section>

      {/* 3 Pillars / Feature Highlights */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {lang === 'bn' ? 'ভূমি সুরক্ষার ৩টি শক্তিশালী স্তর' : 'Three Layers of Land Security'}
          </h2>
          <p className="text-sm text-slate-600">
            {lang === 'bn'
              ? 'কৃত্রিম জটিলতা পরিহার করে সম্পূর্ণ স্বচ্ছ, নিয়মভিত্তিক ও ক্রিপ্টোগ্রাফিক সুরক্ষা।'
              : 'Transparent, rule-based mathematical precision protecting land ownership.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Lock className="w-6 h-6 text-emerald-700" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{t('feature1Title')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{t('feature1Desc')}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-rose-700" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{t('feature2Title')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{t('feature2Desc')}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition space-y-4">
            <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-sky-700" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{t('feature3Title')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{t('feature3Desc')}</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            {lang === 'bn' ? 'স্বচ্ছ কর্মপ্রক্রিয়া' : 'Workflow Architecture'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold">
            {lang === 'bn' ? 'যেভাবে দলিলের সত্যতা নিশ্চিত হয়' : 'How Verification Actually Works'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-3">
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
              STEP 01
            </span>
            <h4 className="font-bold text-sm text-white">
              {lang === 'bn' ? '১. জমি ও খতিয়ান নিবন্ধন' : '1. Land & Khatian Registration'}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'bn'
                ? 'নাগরিক তাদের জেলা, উপজেলা, মৌজা, খতিয়ান ও দাগ নম্বর দিয়ে নিজস্ব জমির ডিজিটাল রেকর্ড তৈরি করেন।'
                : 'Citizens record their plots, khatians, mouza, and claimed ownership portions.'}
            </p>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-3">
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
              STEP 02
            </span>
            <h4 className="font-bold text-sm text-white">
              {lang === 'bn' ? '২. ক্রিপ্টোগ্রাফিক দলিল আপলোড' : '2. Cryptographic Document Ingestion'}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'bn'
                ? 'দলিল আপলোডের সাথে সাথে সার্ভারে SHA-256 হ্যাশ তৈরি হয় এবং রেফারেন্স ভল্টের সাথে মেলানো হয়।'
                : 'Uploaded deeds are hashed via SHA-256 and checked against sample reference registers.'}
            </p>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-3">
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
              STEP 03
            </span>
            <h4 className="font-bold text-sm text-white">
              {lang === 'bn' ? '৩. জালিয়াতি ও অমিল বিশ্লেষণ' : '3. Rule-Based Fraud Detection'}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'bn'
                ? 'একই দাগে অন্য কোনো দলিল রয়েছে কিনা এবং বিক্রেতার অংশে পর্যাপ্ত জমি আছে কিনা যাচাই হয়।'
                : 'Detects duplicate sales, mutation buyer mismatches, and excess share sale attempts.'}
            </p>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-3">
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
              STEP 04
            </span>
            <h4 className="font-bold text-sm text-white">
              {lang === 'bn' ? '৪. নিরাপদ QR কোড ও অডিট ট্রেইল' : '4. Secure QR & Audit Trail'}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'bn'
                ? 'প্রতিটি দলিলের জন্য সুরক্ষিত QR কোড তৈরি হয় এবং প্রতিটি পদক্ষেপে অপরিবর্তনীয় অডিট লগ লেখা হয়।'
                : 'Generates secure non-guessable QR verification tokens and tamper-evident audit records.'}
            </p>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">
            {lang === 'bn' ? 'সচরাচর জিজ্ঞাসিত প্রশ্নাবলী' : 'Frequently Asked Questions'}
          </h2>
          <p className="text-xs text-slate-500">
            {lang === 'bn' ? 'প্ল্যাটফর্মের স্বচ্ছতা ও সীমাবদ্ধতা সম্পর্কে জানুন' : 'Understanding platform scope and integrity'}
          </p>
        </div>

        <div className="space-y-4 text-xs">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              {lang === 'bn' ? 'এই প্ল্যাটফর্মটি কি সরকারিভাবে জমির মালিকানা নিশ্চিত করে?' : 'Does this platform certify official legal ownership?'}
            </h4>
            <p className="text-slate-600 leading-relaxed">
              {lang === 'bn'
                ? 'না। এটি একটি স্বাধীন ডিজিটাল রেকর্ড ব্যবস্থাপনা ও জালিয়াতি শনাক্তকরণ প্ল্যাটফর্মের প্রোটোটাইপ। এটি দলিলের ডিজিটাল অখণ্ডতা ও তথ্যের অসঙ্গতি শনাক্ত করে, কিন্তু সরকারের আইনগত মালিকানা সনদের বিকল্প নয়।'
                : 'No. This platform is an independent verification-support prototype. It verifies mathematical file integrity and structured discrepancies, but does not certify legal government ownership.'}
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              {lang === 'bn' ? 'পাবলিক QR কোড স্ক্যান করলে কি ব্যক্তিগত এনআইডি বা ফোন নম্বর দেখা যাবে?' : 'Does the public QR verification reveal sensitive personal NIDs?'}
            </h4>
            <p className="text-slate-600 leading-relaxed">
              {lang === 'bn'
                ? 'না। ডাটা মিনিমাইজেশন নীতির আলোকে পাবলিক যাচাই পেজে কেবল দলিলের অখণ্ডতা স্ট্যাটাস, জেলা, মৌজা ও দাগ নম্বর প্রদর্শিত হয়; কোনো ব্যক্তিগত এনআইডি বা ব্যক্তিগত মোবাইল নম্বর উন্মুক্ত করা হয় না।'
                : 'No. Under our privacy-by-design policy, public verification reveals only document category, SHA-256 status, and sanitized cadastral identifiers without leaking NID or contact details.'}
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              {lang === 'bn' ? 'অ্যাডমিন কি নীরবে কারো রেকর্ড পরিবর্তন করতে পারবে?' : 'Can an Admin silently overwrite a land record?'}
            </h4>
            <p className="text-slate-600 leading-relaxed">
              {lang === 'bn'
                ? 'কখনোই নয়। যেকোনো সংবেদনশীল আপডেটের জন্য সংশ্লিষ্ট নাগরিকের নিবন্ধিত ফোনে ওয়ান-টাইম পাসওয়ার্ড (OTP) পাঠানো হয় এবং নাগরিকের সম্মতি ছাড়া কোনো পরিবর্তন কার্যকর হয় না।'
                : 'Never. Any sensitive change triggers an admin update request that requires the citizen to authenticate with an expiring one-time OTP.'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
