import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { DemoBanner } from '../../components/common/DemoBanner';
import { Scale, AlertTriangle, FileText } from 'lucide-react';

export const TermsPage: React.FC = () => {
  const { lang, t } = useLanguage();

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6 text-xs text-slate-700">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {lang === 'bn' ? 'ব্যবহারের শর্তাবলী ও আইনি অস্বীকৃতি' : 'Terms of Service & Legal Disclaimer'}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {lang === 'bn' ? 'প্ল্যাটফর্মের আইনগত সীমাবদ্ধতা ও ব্যবহারের নিয়ম' : 'Terms governing platform usage and legal scope'}
        </p>
      </div>

      <DemoBanner />

      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Scale className="w-4 h-4 text-emerald-600" />
          {lang === 'bn' ? '১. প্ল্যাটফর্মের আইনি প্রকৃতি' : '1. Legal Status of Platform'}
        </h3>
        <p className="leading-relaxed">
          {lang === 'bn'
            ? 'ল্যান্ডসিওর বিডি কোনো সরকারি মালিকানা সনদ বা রেজিস্ট্রি সনদপত্র প্রদানকারী কর্তৃপক্ষ নয়। এটি একটি উন্নত ডিজিটাল রেকর্ড ব্যবস্থাপনা ও জালিয়াতি শনাক্তকরণ সহায়ক সফটওয়্যার। যে কোনো জমি ক্রয়ের পূর্বে সংশ্লিষ্ট সাব-রেজিস্ট্রি অফিস ও উপজেলা ভূমি অফিসে সরেজমিনে অনুসন্ধান করার জন্য অনুরোধ করা হচ্ছে।'
            : 'LandSure BD is an independent verification-support tool. It does not certify official government legal ownership. Users must independently consult official land offices and sub-registries.'}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          {lang === 'bn' ? '২. ডেমো ডেটা ও হ্যাকাথন নমুনা' : '2. Demonstration Sample Data'}
        </h3>
        <p className="leading-relaxed">
          {lang === 'bn'
            ? 'এই প্ল্যাটফর্মে ব্যবহৃত নাম (যেমন: তানভীর আহমেদ, ফারহানা ইয়াসমিন), দাগ নম্বর ও দলিল নম্বর সম্পূর্ণ কাল্পনিক এবং শুধুমাত্র প্রযুক্তিগত কারিগরি প্রদর্শনের উদ্দেশ্যে প্রস্তুত।'
            : 'All names, plot identifiers, and deed checksums in this demonstration environment are entirely fictional for prototype presentation.'}
        </p>
      </div>
    </div>
  );
};
