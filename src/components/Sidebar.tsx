import {
  LayoutDashboard,
  Store,
  Globe,
  FileText,
  Users,
  Megaphone,
  MessageSquareQuote,
  BarChart3,
  Lightbulb,
  Settings as SettingsIcon,
  LogOut,
  Sparkles,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

export type SidebarTab =
  | "dashboard"
  | "onboarding"
  | "website"
  | "content"
  | "crm"
  | "marketing"
  | "google_business"
  | "analytics"
  | "advisor"
  | "settings";

interface SidebarProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
  userEmail: string;
  onLogout: () => void;
  businessName: string;
}

export default function Sidebar({
  activeTab,
  onTabChange,
  userEmail,
  onLogout,
  businessName
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  interface MenuItem {
    readonly id: SidebarTab;
    readonly label: string;
    readonly icon: any;
    readonly highlight?: boolean;
  }

  const menuItems: readonly MenuItem[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "onboarding", label: "Business Profile", icon: Store },
    { id: "website", label: "AI Website Gen", icon: Globe, highlight: true },
    { id: "content", label: "AI Content Maker", icon: FileText },
    { id: "crm", label: "Customer Leads", icon: Users },
    { id: "marketing", label: "AI Ads & Marketing", icon: Megaphone },
    { id: "google_business", label: "Google Profile", icon: MessageSquareQuote },
    { id: "analytics", label: "Insights & Charts", icon: BarChart3 },
    { id: "advisor", label: "AI Advisor", icon: Lightbulb, highlight: true },
    { id: "settings", label: "Settings", icon: SettingsIcon }
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleTabClick = (tabId: SidebarTab) => {
    onTabChange(tabId);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-tr from-indigo-500 to-indigo-600 rounded-xl text-white shadow-sm">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <span className="font-bold text-slate-800 dark:text-slate-100 tracking-tight text-lg">LocalAI Growth</span>
        </div>
        <button
          onClick={toggleSidebar}
          className="p-2 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          id="mobile-sidebar-toggle"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar overlay for mobile */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed md:sticky top-0 left-0 bottom-0 z-40 w-72 bg-white dark:bg-slate-900 border-r border-[#dadce0] dark:border-slate-800 flex flex-col justify-between py-6 transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Logo Brand Header */}
          <div className="px-6 mb-8 flex items-center gap-3">
            <div className="w-8 h-8 bg-[#1a73e8] rounded-lg flex items-center justify-center text-white font-black shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-semibold text-lg tracking-tight text-[#202124] dark:text-slate-50">
                LocalAI Growth
              </h1>
              <span className="text-[10px] text-slate-500 font-medium">SaaS Small Biz Suite</span>
            </div>
          </div>

          {/* Active Business Info Card */}
          <div className="mx-4 mb-6 p-4 rounded-2xl bg-[#f8f9fa] dark:bg-slate-950/40 border border-[#dadce0] dark:border-slate-800 shadow-none">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Active Business</p>
            <h3 className="font-semibold text-sm text-[#202124] dark:text-slate-200 mt-1 truncate">
              {businessName || "My Small Business"}
            </h3>
            <div className="flex items-center gap-1.5 mt-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Synced with Maps</span>
            </div>
          </div>

          {/* Nav list - Material Design 3 Style */}
          <nav className="px-3 space-y-1 overflow-y-auto max-h-[45vh] pr-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id as SidebarTab)}
                  id={`nav-${item.id}`}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-150 text-xs font-medium ${
                    isActive
                      ? "bg-[#e8f0fe] text-[#1967d2] dark:bg-blue-950/50 dark:text-blue-300 font-semibold"
                      : "text-[#5f6368] hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100"
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-[#1a73e8] dark:text-blue-400" : "text-slate-400"}`} />
                  <span className="flex-grow text-left">{item.label}</span>
                  {item.highlight && (
                    <span className="text-[9px] bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                      AI
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Current Plan Widget */}
        <div className="px-4 space-y-4">
          <div className="p-4 mx-1 bg-blue-50/70 dark:bg-blue-950/20 rounded-2xl border border-blue-100/30 dark:border-blue-900/20">
            <p className="text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-0.5">Current Plan</p>
            <p className="text-xs text-blue-900 dark:text-blue-200 font-semibold mb-2">Growth Professional</p>
            <div className="h-1 w-full bg-blue-100 dark:bg-blue-900 rounded-full mb-2 overflow-hidden">
              <div className="h-1 w-3/4 bg-blue-600 dark:bg-blue-500 rounded-full"></div>
            </div>
            <p className="text-[9px] text-blue-700 dark:text-blue-400">75% AI tokens used</p>
          </div>

          {/* Footer info & Logout */}
          <div className="border-t border-[#dadce0] dark:border-slate-800 pt-3 space-y-2">
            <div className="px-3 flex flex-col">
              <span className="text-[10px] text-slate-400 font-semibold">User Account</span>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate" title={userEmail}>
                {userEmail}
              </span>
            </div>

            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-slate-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition-all duration-150 text-xs font-medium"
              id="sidebar-logout-btn"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
