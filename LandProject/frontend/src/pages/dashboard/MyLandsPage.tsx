import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DemoBanner } from '../../components/common/DemoBanner';
import {
  MapPin,
  PlusCircle,
  Search,
  FileText,
  AlertTriangle,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export const MyLandsPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const [lands, setLands] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLands = async () => {
      try {
        const token = localStorage.getItem('landsure_token');
        const res = await fetch('/api/lands', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setLands(data.data);
        }
      } catch (err) {
        console.error('Failed to load lands:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLands();
  }, []);

  const filteredLands = lands.filter(l => {
    const q = search.toLowerCase();
    return (
      l.plotNumber.toLowerCase().includes(q) ||
      l.khatianNumber.toLowerCase().includes(q) ||
      l.mouza.toLowerCase().includes(q) ||
      l.district.toLowerCase().includes(q) ||
      l.internalParcelId.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {t('navMyLands')}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'bn'
              ? 'আপনার নামে রেকর্ডভুক্ত সকল খতিয়ান ও দাগের বিস্তারিত তালিকা।'
              : 'Complete list of your registered land parcels, khatians, and claimed ownership portions.'}
          </p>
        </div>
        <Link
          to="/dashboard/lands/new"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary-800 hover:bg-primary-900 text-white text-xs font-semibold shadow-xs transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t('navAddLand')}</span>
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
          placeholder={lang === 'bn' ? 'দাগ, খতিয়ান বা মৌজা দিয়ে খুঁজুন...' : 'Search by plot, khatian, mouza...'}
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        />
      </div>

      {/* Land Parcels Table / Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
          <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          {lang === 'bn' ? 'জমি লোড হচ্ছে...' : 'Loading parcels...'}
        </div>
      ) : filteredLands.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200 space-y-3">
          <MapPin className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="font-semibold text-slate-700">
            {lang === 'bn' ? 'কোনো জমি খুঁজে পাওয়া যায়নি' : 'No matching land parcels found'}
          </p>
          <Link
            to="/dashboard/lands/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('navAddLand')}</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLands.map(parcel => (
            <Link
              key={parcel.id}
              to={`/dashboard/lands/${parcel.id}`}
              className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    {parcel.internalParcelId}
                  </span>
                  <StatusBadge status={parcel.verificationStatus} />
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {t('fieldPlotNumber')}: {parcel.plotNumber} • {t('fieldKhatianNumber')}: {parcel.khatianNumber}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {parcel.mouza}, {parcel.upazila}, {parcel.district}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 block">{t('fieldSurveyType')}</span>
                    <span className="font-semibold text-slate-700">{parcel.surveyType}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">{t('fieldClaimedShare')}</span>
                    <span className="font-bold text-emerald-800">
                      {parcel.userClaim?.claimedShare ?? parcel.totalArea} {parcel.areaUnit}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    {parcel.documentCount ?? 0} {lang === 'bn' ? 'দলিল' : 'docs'}
                  </span>
                  {parcel.activeAlertsCount > 0 && (
                    <span className="flex items-center gap-1 text-rose-600 font-bold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {parcel.activeAlertsCount} {lang === 'bn' ? 'সতর্কতা' : 'alerts'}
                    </span>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
