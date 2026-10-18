import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { DemoBanner } from '../../components/common/DemoBanner';
import { ShieldCheck, Scale, AlertTriangle, FileText, CheckCircle, Info } from 'lucide-react';

export const VerificationRulesPage: React.FC = () => {
  const { lang, t } = useLanguage();

  const rules = [
    {
      id: 'RULE-01',
      title: lang === 'bn' ? 'নিয়ম ১: ক্রিপ্টোগ্রাফিক ফাইল অখণ্ডতা (SHA-256)' : 'Rule 1: Cryptographic Hash Integrity',
      severity: 'CRITICAL',
      desc: lang === 'bn'
        ? 'আপলোডকৃত দলিলের SHA-256 হ্যাশ সরকারি রেফারেন্স ভল্টের সাথে হুবহু মিলতে হবে। একটি বর্ণ বা ডিজিটাল ওয়াটারমার্ক পরিবর্তন হলেও ফাইল অখণ্ডতা ব্যর্থ ঘোষিত হবে।'
        : 'Uploaded deed files must match trusted reference checksums byte-for-byte. Any modification triggers a hash tampering alert.'
    },
    {
      id: 'RULE-02',
      title: lang === 'bn' ? 'নিয়ম ২: সম্ভাব্য একাধিক বিক্রি ও দাগ ধারণক্ষমতা' : 'Rule 2: Potential Duplicate Sale & Plot Capacity',
      severity: 'CRITICAL',
      desc: lang === 'bn'
        ? 'একটি নির্দিষ্ট দাগে একাধিক দলিলের মোট বিক্রিত জমির পরিমাণ সংশ্লিষ্ট দাগের মূল খতিয়ানের মোট জমির চেয়ে বেশি হতে পারবে না।'
        : 'Cumulative deed sales registered on a specific plot cannot exceed the official cadastral parcel area.'
    },
    {
      id: 'RULE-03',
      title: lang === 'bn' ? 'নিয়ম ৩: বিক্রেতার অবশিষ্ট বৈধ মালিকানা হিস্যা' : 'Rule 3: Seller Eligible Remaining Share',
      severity: 'CRITICAL',
      desc: lang === 'bn'
        ? 'বিক্রেতা কেবল তার যাচাইকৃত রেকর্ডসম্মত অংশের মধ্য থেকে জমি বিক্রি করতে পারবেন। পূর্বে প্রস্তাবিত কিন্তু অনিষ্পন্ন লেনদেনের পরিমাণ বাদ দিয়ে অবশিষ্ট হিস্যা হিসাব করা হয়।'
        : 'Sellers can only transfer within their verified ownership share minus any active, uncompleted sale commitments.'
    },
    {
      id: 'RULE-04',
      title: lang === 'bn' ? 'নিয়ম ৪: নামজারি ও সাব-রেজিস্ট্রি তথ্যের সামঞ্জস্য' : 'Rule 4: Deed vs. Mutation Consistency',
      severity: 'HIGH',
      desc: lang === 'bn'
        ? 'সাব-রেজিস্ট্রি দলিলের ক্রেতার নাম এবং সহকারী কমিশনার (ভূমি) অফিসের নামজারি খতিয়ানের ক্রেতার নাম ও খতিয়ান নম্বর সামঞ্জস্যপূর্ণ হতে হবে।'
        : 'Buyer names and plot allocations between the registered deed and assistant commissioner land (AC Land) mutation records must match.'
    },
    {
      id: 'RULE-05',
      title: lang === 'bn' ? 'নিয়ম ৫: সমসাময়িক বা ওভারল্যাপিং লেনদেন নিয়ন্ত্রণ' : 'Rule 5: Concurrent Transaction Concurrency Locks',
      severity: 'CRITICAL',
      desc: lang === 'bn'
        ? 'একই বিক্রেতার একই জমির উপর দুটি সমসাময়িক ক্রয়-বিক্রয় অনুরোধ স্বাধীনভাবে বিক্রেতার অংশের চেয়ে বেশি জমি বরাদ্দ করতে পারবে না। সিস্টেম ডাটাবেস লেভেলে মিউচুয়াল এক্সক্লুসিভ লক প্রয়োগ করে।'
        : 'Concurrent transactions undergo database-level locking preventing two concurrent sale requests from over-allocating the same share.'
    },
    {
      id: 'RULE-06',
      title: lang === 'bn' ? 'নিয়ম ৬: অপরিবর্তনীয় অডিট চেইন ও নাগরিক ওটিপি' : 'Rule 6: Tamper-Evident Audit & Citizen OTP',
      severity: 'HIGH',
      desc: lang === 'bn'
        ? 'কোনো অ্যাডমিন বা তৃতীয় পক্ষ ব্যবহারকারীর অনুমতি ও ওটিপি ছাড়া দাগের আয়তন বা মালিকানা সংশোধন করতে পারবে না। প্রতিটি ঘটনা একটি ক্রিপ্টোগ্রাফিক চেইনে লিপিবদ্ধ থাকে।'
        : 'No admin can alter records without citizen OTP verification. All events are logged in an append-only SHA-256 hash chain.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
          <Scale className="w-3.5 h-3.5" />
          <span>{lang === 'bn' ? 'স্বচ্ছ ও নিরপেক্ষ নীতি' : 'Transparent & Neutral Policies'}</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {t('navVerificationRules')}
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          {lang === 'bn'
            ? 'ল্যান্ডসিওর বিডি-তে প্রয়োগকৃত সকল গাণিতিক, ভৌগোলিক ও আইনি যাচাই নীতিমালার বিবরণ।'
            : 'Detailed criteria and cadastral rules implemented in the LandSure BD verification engine.'}
        </p>
      </div>

      <DemoBanner />

      <div className="space-y-4">
        {rules.map(rule => (
          <div key={rule.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-md">
                {rule.id}
              </span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                rule.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {rule.severity}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900">{rule.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{rule.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 space-y-3">
        <h4 className="font-bold text-sm text-amber-300 flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-400" />
          {lang === 'bn' ? 'সতর্কতা সম্পর্কিত আইনি দিকনির্দেশনা' : 'Legal Guidelines on Fraud Alerts'}
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          {lang === 'bn'
            ? 'একটি সতর্ক সংকেত কাউকে সরাসরি অপরাধী বা প্রতারক হিসেবে চিহ্নিত করে না। উত্তরাধিকার, বৈধ বন্টন বা টাইপো সংক্রান্ত ভুলের কারণেও অসঙ্গতি দেখা দিতে পারে। সকল অমিলের ক্ষেত্রে সহকারী কমিশনার (ভূমি) বা সাব-রেজিস্ট্রারের ম্যানুয়াল তদন্ত বাধ্যতামূলক।'
            : 'A detected alert does not criminalize any individual. Joint family inheritance, legitimate subdivision, or typographical errors can produce discrepancies. All alerts recommend administrative review.'}
        </p>
      </div>
    </div>
  );
};
