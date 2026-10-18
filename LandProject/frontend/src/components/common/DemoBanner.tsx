import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { AlertTriangle, Info } from 'lucide-react';

export const DemoBanner: React.FC<{ compact?: boolean }> = ({ compact }) => {
  const { lang } = useLanguage();

  if (compact) {
    return (
      <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-800 dark:text-amber-300 px-4 py-1.5 text-xs flex items-center justify-center space-x-2">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
        <span className="font-medium text-center">
          {lang === 'bn'
            ? 'ডেমো ডেটা — সরকারি অফিসিয়াল রেকর্ড নয় (হ্যাকাথন ও প্রযুক্তিগত প্রদর্শনের জন্য তৈরি)'
            : 'DEMO DATA — NOT AN OFFICIAL GOVERNMENT LAND RECORD (Built for prototype demonstration)'}
        </span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-200 rounded-lg p-3 my-4 shadow-sm flex items-start space-x-3 text-amber-900">
      <Info className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
      <div className="text-sm">
        <span className="font-bold">
          {lang === 'bn' ? 'গুরুত্বপূর্ণ সতর্কতা ও তথ্যসীমাবদ্ধতা:' : 'Important Limitation & Legal Notice:'}
        </span>{' '}
        {lang === 'bn'
          ? 'এই প্ল্যাটফর্মে প্রদর্শিত সকল খতিয়ান, দাগ, নামজারি ও দলিলের তথ্য কাল্পনিক ডেমো ডেটা। সিস্টেমটি কেবল দলিলের ডিজিটাল অখণ্ডতা ও রেকর্ডের অমিল গাণিতিকভাবে যাচাই করতে সক্ষম, এটি কোনো সরকারি মালিকানা সনদ প্রদান করে না।'
          : 'All land records, khatians, plot numbers, and deeds shown are fictional dummy data for demonstration. The system establishes cryptographic document integrity and structural discrepancies, not official legal ownership.'}
      </div>
    </div>
  );
};
