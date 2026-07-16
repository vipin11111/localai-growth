import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./lib/firebase";
import { BusinessProfile } from "./types";

import Sidebar, { SidebarTab } from "./components/Sidebar";
import ThemeToggle from "./components/ThemeToggle";
import AuthScreen from "./components/AuthScreen";
import DashboardOverview from "./components/DashboardOverview";
import BusinessOnboarding from "./components/BusinessOnboarding";
import WebsiteGenerator from "./components/WebsiteGenerator";
import ContentGenerator from "./components/ContentGenerator";
import LeadCRM from "./components/LeadCRM";
import MarketingHub from "./components/MarketingHub";
import GoogleBusinessMock from "./components/GoogleBusinessMock";
import AnalyticsExpanded from "./components/AnalyticsExpanded";
import AdvisorChat from "./components/AdvisorChat";
import SettingsView from "./components/SettingsView";

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [demoEmail, setDemoEmail] = useState("");
  const [activeTab, setActiveTab] = useState<SidebarTab>("dashboard");
  const [isDark, setIsDark] = useState(false);

  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Apply dark mode on state change
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  // Sync Firebase Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoadingAuth(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        setIsDemo(false);
        // Load Firestore profile
        setLoadingProfile(true);
        try {
          const docRef = doc(db, "businesses", firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setBusinessProfile(docSnap.data() as BusinessProfile);
          } else {
            setBusinessProfile(null);
          }
        } catch (err) {
          console.error("Failed to load business profile:", err);
        } finally {
          setLoadingProfile(false);
        }
      } else {
        setUser(null);
        if (!isDemo) {
          setBusinessProfile(null);
        }
      }
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, [isDemo]);

  // Handle Demo Mode Logins
  const handleDemoLogin = () => {
    setIsDemo(true);
    setDemoEmail("demo@localaigrowth.ai");
    setBusinessProfile({
      name: "Peak Fitness Hub",
      category: "Fitness Center & Gym",
      description: "A premium fitness training center with custom coaching packages and local health memberships.",
      address: "404 Active Lane, Silicon Valley, CA 94025",
      phone: "+1 (555) 482-1920",
      email: "contact@peakfitnesshub.com",
      whatsapp: "+15554821920",
      openingHours: "Mon - Fri: 6:00 AM - 10:00 PM",
      userId: "demo_uid"
    });
  };

  const handleLogout = async () => {
    if (isDemo) {
      setIsDemo(false);
      setBusinessProfile(null);
    } else {
      await signOut(auth);
    }
    setActiveTab("dashboard");
  };

  const handleProfileUpdated = (profile: BusinessProfile) => {
    setBusinessProfile(profile);
  };

  const toggleTheme = () => setIsDark(!isDark);

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Syncing database state...</p>
      </div>
    );
  }

  // Auth gate
  if (!user && !isDemo) {
    return <AuthScreen onDemoLogin={handleDemoLogin} />;
  }

  const activeUserEmail = user ? user.email || "user@localaigrowth.ai" : demoEmail;
  const activeUserId = user ? user.uid : "demo_uid";

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0c0e12] text-[#202124] dark:text-slate-100 flex flex-col md:flex-row transition-colors duration-300">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userEmail={activeUserEmail}
        onLogout={handleLogout}
        businessName={businessProfile?.name || "My Business"}
      />

      {/* Main Workspace Frame */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* Workspace Top Bar Header */}
        <header className="px-8 py-4 border-b border-[#dadce0] dark:border-slate-800 flex items-center justify-between bg-white dark:bg-[#0f111a] sticky top-0 md:relative z-20 h-16">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Dashboard / <span className="text-[#1a73e8] dark:text-blue-400 font-semibold capitalize">{activeTab.replace("_", " ")}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isDemo && (
              <span className="text-[10px] bg-blue-50 dark:bg-blue-950/40 text-[#1967d2] dark:text-blue-400 font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-blue-100/40">
                Demo Preview Mode
              </span>
            )}
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
          </div>
        </header>

        {/* Content canvas */}
        <main className="flex-grow p-6 md:p-8 overflow-y-auto">
          {activeTab === "dashboard" && (
            <DashboardOverview
              profile={businessProfile}
              onNavigate={setActiveTab}
              leadsCount={isDemo ? 4 : 0}
            />
          )}

          {activeTab === "onboarding" && (
            <BusinessOnboarding
              userId={activeUserId}
              onProfileUpdated={handleProfileUpdated}
              initialProfile={businessProfile}
            />
          )}

          {activeTab === "website" && (
            <WebsiteGenerator profile={businessProfile} />
          )}

          {activeTab === "content" && (
            <ContentGenerator profile={businessProfile} userId={activeUserId} />
          )}

          {activeTab === "crm" && (
            <LeadCRM userId={activeUserId} />
          )}

          {activeTab === "marketing" && (
            <MarketingHub profile={businessProfile} />
          )}

          {activeTab === "google_business" && (
            <GoogleBusinessMock profile={businessProfile} />
          )}

          {activeTab === "analytics" && (
            <AnalyticsExpanded profile={businessProfile} />
          )}

          {activeTab === "advisor" && (
            <AdvisorChat profile={businessProfile} />
          )}

          {activeTab === "settings" && (
            <SettingsView
              profile={businessProfile}
              userEmail={activeUserEmail}
              isDark={isDark}
              onToggleTheme={toggleTheme}
              onNavigate={setActiveTab}
            />
          )}
        </main>
      </div>
    </div>
  );
}
