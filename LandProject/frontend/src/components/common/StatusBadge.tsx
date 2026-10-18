import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { CheckCircle2, AlertTriangle, Clock, XCircle, ShieldAlert, FileText } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const { lang, t } = useLanguage();

  switch (status) {
    case 'FILE_INTEGRITY_PASSED':
    case 'RECORD_MATCH':
    case 'CONFIRMED':
    case 'COMPLETED':
    case 'APPROVED':
    case 'APPLIED':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 ${className}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          {status === 'FILE_INTEGRITY_PASSED' ? t('statusFileIntegrityPassed')
            : status === 'RECORD_MATCH' ? t('statusRecordMatch')
            : status === 'COMPLETED' ? t('statusCompleted')
            : (lang === 'bn' ? 'অনুমোদিত / সঠিক' : 'Confirmed / Approved')}
        </span>
      );

    case 'WARNING':
    case 'DUPLICATE_SALE':
    case 'SHARE_EXCEEDED':
    case 'HASH_MISMATCH':
    case 'CRITICAL':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200 animate-soft-pulse ${className}`}>
          <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
          {status === 'WARNING' ? t('statusWarning')
            : status === 'DUPLICATE_SALE' ? t('fraudDuplicateSale')
            : status === 'SHARE_EXCEEDED' ? t('fraudShareExceeded')
            : (lang === 'bn' ? 'গুরুতর সতর্কতা' : 'Critical Warning')}
        </span>
      );

    case 'NEEDS_MANUAL_REVIEW':
    case 'MUTATION_MISMATCH':
    case 'AWAITING_OFFICIAL_TRANSFER_EVIDENCE':
    case 'HIGH':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 ${className}`}>
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          {status === 'NEEDS_MANUAL_REVIEW' ? t('statusNeedsManualReview')
            : status === 'MUTATION_MISMATCH' ? t('fraudMutationMismatch')
            : status === 'AWAITING_OFFICIAL_TRANSFER_EVIDENCE' ? t('statusAwaitingEvidence')
            : (lang === 'bn' ? 'তদন্ত প্রয়োজন' : 'Review Required')}
        </span>
      );

    case 'PENDING':
    case 'SUBMITTED':
    case 'AWAITING_BUYER':
    case 'PENDING_USER_CONSENT':
    case 'CLAIMED':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-800 border border-sky-200 ${className}`}>
          <Clock className="w-3.5 h-3.5 text-sky-600" />
          {status === 'PENDING' ? t('statusPending')
            : status === 'AWAITING_BUYER' ? t('statusAwaitingBuyer')
            : status === 'PENDING_USER_CONSENT' ? (lang === 'bn' ? 'নাগরিক ওটিপি অপেক্ষমাণ' : 'Awaiting Citizen OTP')
            : (lang === 'bn' ? 'অপেক্ষমাণ' : 'Pending')}
        </span>
      );

    case 'REFERENCE_UNAVAILABLE':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-300 ${className}`}>
          <FileText className="w-3.5 h-3.5 text-slate-500" />
          {t('statusReferenceUnavailable')}
        </span>
      );

    case 'REJECTED':
    case 'CANCELLED':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-300 ${className}`}>
          <XCircle className="w-3.5 h-3.5 text-gray-500" />
          {status === 'REJECTED' ? t('statusRejected') : (lang === 'bn' ? 'বাতিলকৃত' : 'Cancelled')}
        </span>
      );

    default:
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 ${className}`}>
          {status}
        </span>
      );
  }
};
