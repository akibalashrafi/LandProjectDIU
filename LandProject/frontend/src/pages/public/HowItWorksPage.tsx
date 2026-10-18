import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { DemoBanner } from '../../components/common/DemoBanner';
import {
  FileCheck2,
  Lock,
  Layers,
  ShieldCheck,
  CheckCircle2,
  QrCode,
  FileSearch,
  Scale,
  Smartphone
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const { lang, t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {t('navHowItWorks')}
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          {lang === 'bn'
            ? 'ল্যান্ডসিওর বিডি কীভাবে জমির ডিজিটাল রেকর্ড যাচাই করে এবং জালিয়াতি শনাক্ত করে তার কারিগরি ও আইনি প্রবাহ।'
            : 'Technical and operational workflow of LandSure BD: document integrity, fraud rules, and citizen-governed land transactions.'}
        </p>
      </div>

      <DemoBanner />

      {/* Step 1 */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
            01
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {lang === 'bn' ? '১. ডিজিটাল পার্সেল ও মালিকানা দাবি সৃষ্টি' : '1. Digital Parcel & Ownership Claim Registration'}
            </h3>
            <p className="text-xs text-slate-500">
              {lang === 'bn' ? 'মৌজা, খতিয়ান, দাগ ও হিস্যা' : 'Cadastral identity and claimed shares'}
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          {lang === 'bn'
            ? 'জমির মালিক বা ক্রেতা তার জমির ভৌগোলিক ও সার্ভে সংক্রান্ত তথ্য (জেলা, উপজেলা, মৌজা, খতিয়ান, দাগ, জরিপের ধরণ এবং অর্জিত হিস্যা) সিস্টেমে নথিভুক্ত করেন। সিস্টেম প্রতিটি পার্সেলের জন্য একটি অনন্য শনাক্তকারী (Internal Parcel ID) বরাদ্দ করে।'
            : 'Users declare cadastral identifiers including District, Upazila, Mouza, Plot, Khatian, Survey Type (CS, SA, RS, BS), and specific decimal shares. The system issues an immutable Internal Parcel ID.'}
        </p>
      </div>

      {/* Step 2 */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-800 font-bold flex items-center justify-center text-sm">
            02
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {lang === 'bn' ? '২. ক্রিপ্টোগ্রাফিক দলিল অখণ্ডতা বিশ্লেষণ (SHA-256)' : '2. Cryptographic Document Ingestion & Hashing'}
            </h3>
            <p className="text-xs text-slate-500">
              {lang === 'bn' ? 'ডিজিটাল দলিলের সততা পরীক্ষা' : 'SHA-256 digital fingerprinting'}
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          {lang === 'bn'
            ? 'মূল রেজিস্ট্রিকৃত দলিল, বায়া দলিল বা পরচা আপলোডের সময় সার্ভার তৎক্ষণাৎ একটি ২৫৬-বিট ক্রিপ্টোগ্রাফিক হ্যাশ (SHA-256) প্রস্তুত করে। যদি দলিলটি পূর্বে সরকারি ভল্টে সংরক্ষিত হ্যাশের সাথে মিলে যায়, তবে এটি "File Integrity Passed" সনদ পায়। দলিলের সামান্য একটি বিন্দুও পরিবর্তিত হলে হ্যাশ অমিল হয়ে যাবে।'
            : 'Upon uploading deeds, mutation orders, or porchas, the server computes a 256-bit SHA-256 hash. If it matches the reference repository hash, it passes file integrity. Any altered byte instantly flags a hash mismatch.'}
        </p>
      </div>

      {/* Step 3 */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 font-bold flex items-center justify-center text-sm">
            03
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {lang === 'bn' ? '৩. জালিয়াতি শনাক্তকরণ ইঞ্জিন (Fraud Detection Engine)' : '3. Rule-Based Fraud Detection Engine'}
            </h3>
            <p className="text-xs text-slate-500">
              {lang === 'bn' ? 'স্বচ্ছ নিয়ম ও প্রমাণভিত্তিক সতর্কতা' : 'Duplicate sales, name mismatches, share limits'}
            </p>
          </div>
        </div>
        <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
          <p>
            {lang === 'bn'
              ? 'সিস্টেমটি কোনো অস্বচ্ছ অ্যালগরিদম নয়, বরং সুস্পষ্ট আইনি ও গাণিতিক নিয়মের উপর ভিত্তি করে কাজ করে:'
              : 'Our fraud engine operates strictly on explainable cadastral rules:'}
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>{t('fraudDuplicateSale')}:</strong>{' '}
              {lang === 'bn'
                ? 'একই দাগের মোট আয়তনের চেয়ে রেজিস্ট্রি দলিলের মোট পরিমাণ বেশি হলে তাৎক্ষণিক সতর্কতা জারি হয়।'
                : 'Flags when cumulative deed sales on a plot exceed official plot area.'}
            </li>
            <li>
              <strong>{t('fraudMutationMismatch')}:</strong>{' '}
              {lang === 'bn'
                ? 'রেজিস্ট্রি দলিলের ক্রেতার সাথে খতিয়ান বা নামজারি রেকর্ডের ক্রেতার নামে কোনো অমিল থাকলে তা চিহ্নিত করা হয়।'
                : 'Detects name differences between deed buyer and recorded mutation owner.'}
            </li>
            <li>
              <strong>{t('fraudShareExceeded')}:</strong>{' '}
              {lang === 'bn'
                ? 'বিক্রেতা তার বৈধ হিস্যার অতিরিক্ত জমি বিক্রির প্রস্তাব দিলে সিস্টেম তা স্বয়ংক্রিয়ভাবে আটকে দেয়।'
                : 'Blocks sale requests where proposed area exceeds seller verified ownership.'}
            </li>
          </ul>
        </div>
      </div>

      {/* Step 4 */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-sm">
            04
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {lang === 'bn' ? '৪. সুরক্ষিত ক্রয়-বিক্রয় ও নাগরিক ওটিপি সম্মতি' : '4. Secure Buy/Sell Workflow & Citizen OTP Consent'}
            </h3>
            <p className="text-xs text-slate-500">
              {lang === 'bn' ? 'নাগরিকের অনুমতি ব্যতীত কোনো পরিবর্তন নয়' : 'Two-party consent and zero silent updates'}
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          {lang === 'bn'
            ? 'কোনো লেনদেন বা সংবেদনশীল রেকর্ড সংশোধনের জন্য উভয় পক্ষের ডিজিটাল সম্মতি ও নাগরিকের নিবন্ধিত ফোনে পাঠানো ওয়ান-টাইম পাসওয়ার্ড (OTP) যাচাইকরণ বাধ্যতামূলক। অনুমোদন সম্পন্ন হওয়ার পর ডাটাবেসে একটি নতুন অপরিবর্তনীয় অডিট ব্লক তৈরি হয়।'
            : 'Transactions require explicit seller and buyer consent plus documentary evidence. Any administrative correction demands citizen OTP authorization. Once approved, ownership shares update atomically with tamper-evident audit logging.'}
        </p>
      </div>
    </div>
  );
};
