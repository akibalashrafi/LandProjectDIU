import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { ShieldCheck, Lock, FileCheck2, Scale, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { lang, t } = useLanguage();

  return (
    <footer className="bg-navy-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Identity */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">LandSure BD</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'bn'
                ? 'বাংলাদেশের জন্য ডিজিটাল ভূমি রেকর্ড অখণ্ডতা, জালিয়াতি শনাক্তকরণ ও লেনদেন নিরাপত্তা প্ল্যাটফর্ম।'
                : 'National prototype for digital land record integrity, fraud detection, and secure land transactions in Bangladesh.'}
            </p>
            <div className="text-[11px] text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800/60 rounded px-2.5 py-1 inline-block">
              {lang === 'bn' ? 'প্রোটোটাইপ হ্যাকাথন ভার্সন' : 'Prototype Hackathon Version'}
            </div>
          </div>

          {/* Col 2: Platform Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              {lang === 'bn' ? 'প্ল্যাটফর্ম' : 'Platform'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/how-it-works" className="hover:text-emerald-400 transition">
                  {t('navHowItWorks')}
                </Link>
              </li>
              <li>
                <Link to="/verification-rules" className="hover:text-emerald-400 transition">
                  {t('navVerificationRules')}
                </Link>
              </li>
              <li>
                <Link to="/verify/tok-verify-clean-1001" className="hover:text-emerald-400 transition">
                  {t('navPublicVerify')}
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-emerald-400 transition">
                  {t('navDashboard')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Verification Principles */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              {lang === 'bn' ? 'নীতিমালা ও নিরাপত্তা' : 'Trust & Security'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 text-slate-400">
                <Lock className="w-3.5 h-3.5 text-emerald-500" />
                <span>SHA-256 {lang === 'bn' ? 'ক্রিপ্টোগ্রাফিক হ্যাশ' : 'Integrity Checks'}</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-400">
                <FileCheck2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>{lang === 'bn' ? 'অপরিবর্তনীয় অডিট ট্রেইল' : 'Tamper-Evident Logs'}</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-400">
                <Scale className="w-3.5 h-3.5 text-emerald-500" />
                <span>{lang === 'bn' ? 'স্বচ্ছ নিয়মভিত্তিক সতর্কতা' : 'Explainable Rule Engine'}</span>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-emerald-400 transition">
                  {lang === 'bn' ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-emerald-400 transition">
                  {lang === 'bn' ? 'ব্যবহারের শর্তাবলী' : 'Terms of Service'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Honesty Disclaimer */}
          <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/60 text-xs">
            <h4 className="font-bold text-amber-400 mb-2">
              {lang === 'bn' ? 'সরকারি তথ্যের সীমাবদ্ধতা' : 'Data Integrity Notice'}
            </h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              {lang === 'bn'
                ? 'এটি কোনো সরকারি ভূমি মালিকানা সনদপত্র নয়। অনুমোদিত সরকারি এপিআই সংযোগ ব্যতীত কোনো দলিলকে সরকারিভাবে যাচাইকৃত বলে দাবি করা যাবে না।'
                : 'This platform is an independent verification tool. Without direct authorized government registry access, records are compared against simulated demonstration manifests.'}
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} LandSure BD. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" /> for Digital Bangladesh Hackathon
          </p>
        </div>
      </div>
    </footer>
  );
};
