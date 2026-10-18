import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { DemoBanner } from '../../components/common/DemoBanner';
import { ShieldCheck, Lock, EyeOff, FileText, Database } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  const { lang, t } = useLanguage();

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6 text-xs text-slate-700">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {lang === 'bn' ? 'গোপনীয়তা ও তথ্য নিরাপত্তা নীতি' : 'Privacy & Data Protection Policy'}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {lang === 'bn' ? 'ব্যক্তিগত তথ্য সুরক্ষা ও ডাটা মিনিমাইজেশন প্রতিশ্রুতি' : 'Data minimization and sensitive cadastral privacy guarantees'}
        </p>
      </div>

      <DemoBanner />

      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          {lang === 'bn' ? '১. ডাটা মিনিমাইজেশন (Data Minimization)' : '1. Data Minimization'}
        </h3>
        <p className="leading-relaxed">
          {lang === 'bn'
            ? 'ল্যান্ডসিওর বিডি কেবল জমি যাচাইকরণের জন্য অত্যাবশ্যকীয় তথ্যই সংগ্রহ করে। জাতীয় পরিচয়পত্র (NID) নম্বর সিস্টেমে সংরক্ষিত থাকলেও তা স্বয়ংক্রিয়ভাবে মাস্কড করা হয় (যেমন: 1988************42)। কোনো অবস্থাতেই পূর্ণ এনআইডি নম্বর বা ব্যক্তিগত মোবাইল নম্বর পাবলিক ইন্টারফেসে প্রদর্শিত হয় না।'
            : 'We collect only strictly necessary cadastral metadata. National ID numbers are masked at rest (e.g. 1988************42). Full NID numbers and personal contact details are never exposed on public pages or API payloads.'}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-600" />
          {lang === 'bn' ? '২. ক্রিপ্টোগ্রাফিক সুরক্ষা ও প্রাইভেট স্টোরেজ' : '2. Cryptographic Protection & Private Storage'}
        </h3>
        <p className="leading-relaxed">
          {lang === 'bn'
            ? 'সকল আপলোডকৃত দলিলের ফাইল অভ্যন্তরীণ প্রাইভেট স্টোরেজে সংরক্ষিত থাকে এবং সরাসরি কোনো পাবলিক ইউআরএল দ্বারা অ্যাক্সেসযোগ্য নয়। পাবলিক যাচাই পেজে কেবল দলিলের SHA-256 ক্রিপ্টোগ্রাফিক হ্যাশ ও দাগ/খতিয়ানের মতো প্রকাশ্য তথ্য প্রকাশ পায়।'
            : 'Uploaded deed documents reside in isolated private storage. Public QR verification links reveal only cryptographic checksums and sanitized cadastral identifiers.'}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <EyeOff className="w-4 h-4 text-emerald-600" />
          {lang === 'bn' ? '৩. নাগরিকের অনুমতি ছাড়া তথ্য শেয়ারিং নিষিদ্ধ' : '3. Explicit User Consent'}
        </h3>
        <p className="leading-relaxed">
          {lang === 'bn'
            ? 'ক্রেতা ও বিক্রেতার সম্মতি ব্যতীত কোনো লেনদেন বা দলিলের ব্যক্তিগত অংশ তৃতীয় পক্ষের সাথে শেয়ার করা হয় না।'
            : 'Information is shared strictly with mutual consent between buyer and seller during active purchase workflows.'}
        </p>
      </div>
    </div>
  );
};
