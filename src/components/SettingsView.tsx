import { BusinessProfile } from "../types";
import {
  Settings as SettingsIcon,
  CreditCard,
  User,
  ShieldAlert,
  Moon,
  Sun,
  Laptop,
  CheckCircle,
  HelpCircle,
  ChevronRight
} from "lucide-react";

interface SettingsViewProps {
  profile: BusinessProfile | null;
  userEmail: string;
  isDark: boolean;
  onToggleTheme: () => void;
  onNavigate: (tab: any) => void;
}

export default function SettingsView({
  profile,
  userEmail,
  isDark,
  onToggleTheme,
  onNavigate
}: SettingsViewProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold">
            <SettingsIcon className="w-3.5 h-3.5" /> Workspace Settings
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-50 tracking-tight">System Configuration</h2>
          <p className="text-xs text-slate-400">
            Configure system themes, profile authorization, billing packages, and business data links.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Navigation Rail */}
        <div className="md:col-span-1 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-4 shadow-sm space-y-1">
          <button className="w-full flex items-center justify-between p-3 rounded-2xl bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider text-left">
            <span className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Workspace & Profile</span>
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
          <button onClick={onToggleTheme} className="w-full flex items-center justify-between p-3 rounded-2xl text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/40 text-xs font-bold uppercase tracking-wider text-left transition-all">
            <span className="flex items-center gap-2">
              {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
              <span>Toggle theme: {isDark ? "Light" : "Dark"}</span>
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Configurations Forms */}
        <div className="md:col-span-2 space-y-6">
          {/* Section: Profile info */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm space-y-4">
            <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <User className="text-indigo-600 w-5 h-5" /> Account Details
            </h4>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-400 uppercase tracking-wider">Authorized Email</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">{userEmail}</p>
                </div>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 rounded-full font-bold uppercase tracking-wider">
                  Verified
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-400 uppercase tracking-wider">Active Business Link</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">{profile?.name || "No active business linked"}</p>
                </div>
                <button
                  onClick={() => onNavigate("onboarding")}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* Section: Billing Mocks */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm space-y-4">
            <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <CreditCard className="text-indigo-600 w-5 h-5" /> SaaS Billing & Subscription
            </h4>

            <div className="p-5 bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white rounded-2xl space-y-4 shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] uppercase tracking-wider font-extrabold bg-white/20 px-2.5 py-1 rounded-full">
                    Active Growth Tier
                  </span>
                  <h3 className="text-xl font-black mt-2">LocalAI Pro Suite</h3>
                </div>
                <span className="text-xl font-black">$49/mo</span>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-100">
                <CheckCircle className="w-4.5 h-4.5 fill-white text-indigo-600" />
                <span>Unlimited AI website synthesis & content drafts active</span>
              </div>

              <div className="pt-2 flex justify-between items-center text-[11px] text-indigo-100 border-t border-white/20">
                <span>Renews on July 24, 2026</span>
                <span className="hover:underline cursor-pointer font-bold uppercase tracking-wider">Manage Subscription</span>
              </div>
            </div>
          </div>

          {/* Settings Help banner */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/50 dark:border-slate-800 flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200">Need Enterprise Integration?</h5>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Want to hook up multiple business locations or connect a custom Twilio / SMS reservation gateway? Contact our team at integrations@localgrowth.ai
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
