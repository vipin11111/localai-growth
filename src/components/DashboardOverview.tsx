import { BusinessProfile } from "../types";
import {
  TrendingUp,
  Users,
  Award,
  Globe,
  Star,
  Sparkles,
  ArrowRight,
  Megaphone,
  CheckCircle2,
  Lightbulb,
  MessageSquarePlus,
  Play
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
  Legend
} from "recharts";

interface DashboardOverviewProps {
  profile: BusinessProfile | null;
  onNavigate: (tab: any) => void;
  leadsCount: number;
}

// Sample static analytics data representing business trends
const sampleTrafficData = [
  { month: "Jan", visitors: 450, leads: 22 },
  { month: "Feb", visitors: 620, leads: 34 },
  { month: "Mar", visitors: 900, leads: 52 },
  { month: "Apr", visitors: 1100, leads: 75 },
  { month: "May", visitors: 1450, leads: 98 },
  { month: "Jun", visitors: 1980, leads: 135 }
];

const sampleRevenueData = [
  { week: "Wk 1", revenue: 1400, adSpend: 250 },
  { week: "Wk 2", revenue: 2100, adSpend: 300 },
  { week: "Wk 3", revenue: 1850, adSpend: 200 },
  { week: "Wk 4", revenue: 2900, adSpend: 400 }
];

export default function DashboardOverview({
  profile,
  onNavigate,
  leadsCount
}: DashboardOverviewProps) {
  const isProfileComplete = !!(profile?.name && profile?.category);

  // Dynamic calculations or realistic presets
  const stats = {
    visitors: isProfileComplete ? 1980 : 0,
    leads: isProfileComplete ? (leadsCount || 12) : 0,
    rating: isProfileComplete ? 4.8 : 0,
    reviewCount: isProfileComplete ? 42 : 0,
    seoScore: isProfileComplete ? 84 : 10,
    marketingScore: isProfileComplete ? 78 : 5
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30";
    if (score >= 50) return "text-amber-500 bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30";
    return "text-slate-400 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800";
  };

  return (
    <div className="space-y-6">
      {/* Onboarding Alert Banner */}
      {!isProfileComplete && (
        <div className="bg-[#fef7e0] border border-[#fdd663] rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-semibold text-amber-900 dark:text-amber-400 flex items-center gap-1.5 text-sm">
              <Lightbulb className="w-5 h-5 text-amber-600" /> Let's complete your business setup!
            </h4>
            <p className="text-xs text-slate-700 dark:text-slate-300">
              Provide your business info first to unlock AI models configured specifically for your localized niche.
            </p>
          </div>
          <button
            onClick={() => onNavigate("onboarding")}
            className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5"
          >
            <span>Set Up Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* AI Performance Header */}
      <div className="bg-white dark:bg-slate-900 border border-[#dadce0] dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-none relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#e8f0fe] dark:bg-blue-950/40 text-[#1967d2] dark:text-blue-400 rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> LocalAI Marketing advisor
          </div>
          <h2 className="text-xl font-semibold text-[#202124] dark:text-slate-50 tracking-tight">
            {profile?.name ? `Hello, ${profile.name}! 👋` : "Welcome to LocalAI Growth!"}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            {isProfileComplete
              ? `Your online footprint is active! Our AI models suggest posting a new promotion to WhatsApp today to capture high-intent weekend traffic.`
              : `Create your business profile today, and our models will automatically synthesize Google Ads keywords, website designs, and marketing calendars.`}
          </p>
        </div>

        {isProfileComplete && (
          <div className="flex flex-wrap gap-3">
            <div className={`px-4 py-3 rounded-xl border flex items-center gap-3 ${getScoreColor(stats.seoScore)}`}>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">SEO Score</p>
                <p className="text-lg font-bold">{stats.seoScore}%</p>
              </div>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <div className={`px-4 py-3 rounded-xl border flex items-center gap-3 ${getScoreColor(stats.marketingScore)}`}>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Promo Rating</p>
                <p className="text-lg font-bold">{stats.marketingScore}%</p>
              </div>
              <Award className="w-4 h-4 text-[#1a73e8]" />
            </div>
          </div>
        )}
      </div>

      {/* Grid Widgets Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Visitors Widget */}
        <div className="bg-white dark:bg-slate-900 border border-[#dadce0] dark:border-slate-800 rounded-2xl p-5 shadow-none flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Visitors</span>
            <h3 className="text-xl font-bold text-[#202124] dark:text-slate-50 tracking-tight">
              {stats.visitors.toLocaleString()}
            </h3>
            <p className="text-[10px] font-medium text-emerald-600 flex items-center gap-0.5">
              <span>+24.8%</span> <span className="text-slate-400">this month</span>
            </p>
          </div>
          <div className="p-2.5 bg-gray-100 dark:bg-slate-800 text-[#5f6368] dark:text-slate-300 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* CRM Leads Widget */}
        <div className="bg-white dark:bg-slate-900 border border-[#dadce0] dark:border-slate-800 rounded-2xl p-5 shadow-none flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">CRM Leads</span>
            <h3 className="text-xl font-bold text-[#202124] dark:text-slate-50 tracking-tight">
              {stats.leads}
            </h3>
            <p className="text-[10px] font-medium text-[#1a73e8] dark:text-blue-400 flex items-center gap-0.5">
              <span>Stable growth</span>
            </p>
          </div>
          <div className="p-2.5 bg-gray-100 dark:bg-slate-800 text-[#5f6368] dark:text-slate-300 rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Google Reviews Widget */}
        <div className="bg-white dark:bg-slate-900 border border-[#dadce0] dark:border-slate-800 rounded-2xl p-5 shadow-none flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Google Reviews</span>
            <div className="flex items-center gap-1">
              <span className="text-xl font-bold text-[#202124] dark:text-slate-50 tracking-tight">
                {stats.rating}
              </span>
              <div className="flex text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
              </div>
            </div>
            <p className="text-[10px] font-medium text-slate-400">
              Based on {stats.reviewCount} local reviews
            </p>
          </div>
          <div className="p-2.5 bg-gray-100 dark:bg-slate-800 text-[#5f6368] dark:text-slate-300 rounded-xl">
            <Star className="w-5 h-5 fill-[#5f6368] dark:fill-slate-700" />
          </div>
        </div>

        {/* Website Sync Status */}
        <div className="bg-white dark:bg-slate-900 border border-[#dadce0] dark:border-slate-800 rounded-2xl p-5 shadow-none flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Website Status</span>
            <h3 className="text-xl font-bold text-[#202124] dark:text-slate-50 tracking-tight">
              {isProfileComplete ? "Live" : "Inactive"}
            </h3>
            <div className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${isProfileComplete ? "bg-emerald-500" : "bg-slate-400"}`}></span>
              <span className="text-[10px] text-slate-400 font-medium">
                {isProfileComplete ? "SSL Secured" : "Profile missing"}
              </span>
            </div>
          </div>
          <div className="p-2.5 bg-gray-100 dark:bg-slate-800 text-[#5f6368] dark:text-slate-300 rounded-xl">
            <Globe className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Two-Column Chart Sections */}
      {isProfileComplete && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Traffic Overview */}
          <div className="bg-white dark:bg-slate-900 border border-[#dadce0] dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-none">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
              <div>
                <h4 className="font-semibold text-sm text-[#202124] dark:text-slate-100">Local Traffic Trends</h4>
                <p className="text-xs text-slate-400">Unique visitors vs lead conversions</p>
              </div>
              <span className="text-xs font-semibold bg-[#e8f0fe] text-[#1967d2] px-3 py-1 rounded-full">
                6-Month Outlook
              </span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sampleTrafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1a73e8" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#1a73e8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00acc1" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#00acc1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #dadce0", boxShadow: "none" }} />
                  <Area type="monotone" dataKey="visitors" stroke="#1a73e8" strokeWidth={2} fillOpacity={1} fill="url(#colorVisitors)" name="Visitors" />
                  <Area type="monotone" dataKey="leads" stroke="#00acc1" strokeWidth={2} fillOpacity={1} fill="url(#colorLeads)" name="Leads Generated" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue & Ad Spend */}
          <div className="bg-white dark:bg-slate-900 border border-[#dadce0] dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-none">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
              <div>
                <h4 className="font-semibold text-sm text-[#202124] dark:text-slate-100">Revenue & Marketing Performance</h4>
                <p className="text-xs text-slate-400">Weekly sales output vs paid digital campaign spend</p>
              </div>
              <span className="text-xs font-semibold bg-[#e8f0fe] text-[#1967d2] px-3 py-1 rounded-full">
                4-Week Pulse
              </span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sampleRevenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #dadce0", boxShadow: "none" }} />
                  <Bar dataKey="revenue" fill="#1a73e8" radius={[4, 4, 0, 0]} name="Revenue ($)" />
                  <Bar dataKey="adSpend" fill="#00acc1" radius={[4, 4, 0, 0]} name="Google Ads Spend ($)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Suggested Quick Actions */}
      <div className="bg-white dark:bg-slate-900 border border-[#dadce0] dark:border-slate-800 rounded-2xl p-6 shadow-none">
        <h4 className="font-semibold text-sm text-[#202124] dark:text-slate-100 mb-4 flex items-center gap-1.5">
          <CheckCircle2 className="text-[#1a73e8] w-5 h-5" /> Quick Launch Board
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <button
            onClick={() => onNavigate("website")}
            className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-[#e8f0fe] hover:text-[#1967d2] dark:hover:bg-blue-950/20 border border-[#dadce0] dark:border-slate-700/40 text-left transition-all space-y-2 group"
          >
            <div className="p-2 bg-white dark:bg-slate-900 rounded-lg w-9 h-9 flex items-center justify-center text-slate-500 group-hover:text-[#1a73e8] border border-[#dadce0] dark:border-slate-800">
              <Globe className="w-4 h-4" />
            </div>
            <h5 className="font-semibold text-sm text-[#202124] dark:text-slate-100">Launch AI Web Builder</h5>
            <p className="text-[11px] text-slate-500">Generate a modular, multi-section landing page for products.</p>
          </button>

          <button
            onClick={() => onNavigate("content")}
            className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-[#e8f0fe] hover:text-[#1967d2] dark:hover:bg-blue-950/20 border border-[#dadce0] dark:border-slate-700/40 text-left transition-all space-y-2 group"
          >
            <div className="p-2 bg-white dark:bg-slate-900 rounded-lg w-9 h-9 flex items-center justify-center text-slate-500 group-hover:text-[#1a73e8] border border-[#dadce0] dark:border-slate-800">
              <Megaphone className="w-4 h-4" />
            </div>
            <h5 className="font-semibold text-sm text-[#202124] dark:text-slate-100">Create AI Social Post</h5>
            <p className="text-[11px] text-slate-500">Synthesize posts for Facebook, Instagram, or WhatsApp promos.</p>
          </button>

          <button
            onClick={() => onNavigate("advisor")}
            className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-[#e8f0fe] hover:text-[#1967d2] dark:hover:bg-blue-950/20 border border-[#dadce0] dark:border-slate-700/40 text-left transition-all space-y-2 group"
          >
            <div className="p-2 bg-white dark:bg-slate-900 rounded-lg w-9 h-9 flex items-center justify-center text-slate-500 group-hover:text-[#1a73e8] border border-[#dadce0] dark:border-slate-800">
              <Lightbulb className="w-4 h-4" />
            </div>
            <h5 className="font-semibold text-sm text-[#202124] dark:text-slate-100">Ask Business Advisor</h5>
            <p className="text-[11px] text-slate-500">Consult with the Gemini LLM advisor on local competition.</p>
          </button>
        </div>
      </div>
    </div>
  );
}
