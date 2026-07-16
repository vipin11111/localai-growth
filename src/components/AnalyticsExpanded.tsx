import { BusinessProfile } from "../types";
import {
  BarChart3,
  TrendingUp,
  Award,
  Globe,
  Share2,
  PieChart as PieIcon,
  MousePointerClick
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
  PieChart,
  Cell,
  Pie
} from "recharts";

interface AnalyticsExpandedProps {
  profile: BusinessProfile | null;
}

// Pre-seeded advanced analytics logs representing localized growth metrics
const trafficSourceData = [
  { name: "Google Search", value: 45, color: "#4f46e5" },
  { name: "WhatsApp Direct", value: 30, color: "#06b6d4" },
  { name: "Instagram Reels", value: 15, color: "#ec4899" },
  { name: "Direct Traffic", value: 10, color: "#10b981" }
];

const performanceMetrics = [
  { day: "Mon", organic: 120, paid: 40 },
  { day: "Tue", organic: 140, paid: 60 },
  { day: "Wed", organic: 180, paid: 90 },
  { day: "Thu", organic: 210, paid: 130 },
  { day: "Fri", organic: 290, paid: 180 },
  { day: "Sat", organic: 340, paid: 220 },
  { day: "Sun", organic: 280, paid: 110 }
];

export default function AnalyticsExpanded({ profile }: AnalyticsExpandedProps) {
  const isProfileComplete = !!(profile?.name && profile?.category);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Intro Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold">
            <BarChart3 className="w-3.5 h-3.5" /> Performance Analytics
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-50 tracking-tight">Insights & Local Outreach Analytics</h2>
          <p className="text-xs text-slate-400">
            Audit localized search traffic trends, referral channel allocations, and daily campaign reach statistics.
          </p>
        </div>
      </div>

      {isProfileComplete ? (
        <div className="space-y-6">
          {/* Top row mini widgets */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-5 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Organic Share</p>
                <h4 className="text-xl font-extrabold text-slate-850 dark:text-slate-100">62.4%</h4>
                <p className="text-[10px] text-emerald-500 font-medium">+4.2% on Google Maps</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-5 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl">
                <MousePointerClick className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lead Conversion Rate</p>
                <h4 className="text-xl font-extrabold text-slate-850 dark:text-slate-100">6.8%</h4>
                <p className="text-[10px] text-indigo-500 font-medium">Top 15% in category</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-5 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl">
                <Share2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Social Referrals</p>
                <h4 className="text-xl font-extrabold text-slate-850 dark:text-slate-100">450 clicks</h4>
                <p className="text-[10px] text-pink-500 font-medium">+15.8% Instagram reach</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Column Left: Daily Reach Stacked Chart */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100">Daily Traffic Allocations</h4>
                <p className="text-xs text-slate-400">Comparing organic SEO reach versus paid advertising acquisitions</p>
              </div>

              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceMetrics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }} />
                    <Bar dataKey="organic" fill="#4f46e5" stackId="a" radius={[4, 4, 0, 0]} name="Organic SEO" />
                    <Bar dataKey="paid" fill="#06b6d4" stackId="a" radius={[4, 4, 0, 0]} name="Google Ads Traffic" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Column Right: Traffic Referral Allocation Pie Chart */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-5 md:p-6 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100">Referral Channels</h4>
                <p className="text-xs text-slate-400">Unique allocation percent</p>
              </div>

              <div className="h-44 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "none" }} />
                    <Pie
                      data={trafficSourceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {trafficSourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2 mt-4">
                {trafficSourceData.map((src, i) => (
                  <div key={i} className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 font-semibold">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: src.color }}></span>
                      <span>{src.name}</span>
                    </div>
                    <span className="font-mono">{src.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-12 text-center shadow-sm flex flex-col items-center justify-center space-y-4">
          <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-3xl w-fit">
            <BarChart3 className="w-10 h-10 text-indigo-500 animate-bounce" />
          </div>
          <div className="space-y-1 max-w-md">
            <h4 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">Launch Analytics Board</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Complete your Business Profile to begin analyzing click-through rates, lead acquisitions, and organic traffic allocations.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
