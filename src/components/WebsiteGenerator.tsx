import { useState, useEffect } from "react";
import { BusinessProfile, GeneratedWebsite } from "../types";
import {
  Sparkles,
  Globe,
  Edit2,
  Check,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Compass,
  Laptop,
  CheckCircle,
  ChevronDown
} from "lucide-react";

interface WebsiteGeneratorProps {
  profile: BusinessProfile | null;
}

export default function WebsiteGenerator({ profile }: WebsiteGeneratorProps) {
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [description, setDescription] = useState("");
  const [services, setServices] = useState("");

  const [generating, setGenerating] = useState(false);
  const [websiteData, setWebsiteData] = useState<GeneratedWebsite | null>(null);
  const [activePreviewTab, setActivePreviewTab] = useState<"home" | "about" | "services" | "contact" | "faq">("home");
  const [editMode, setEditMode] = useState(false);
  const [apiMessage, setApiMessage] = useState<string | null>(null);

  // Load from active profile on mount
  useEffect(() => {
    if (profile) {
      setBusinessName(profile.name || "");
      setBusinessType(profile.category || "");
      setDescription(profile.address ? `Located at ${profile.address}.` : "");
      if (profile.whatsapp) {
        setServices(`WhatsApp Contact: ${profile.whatsapp}`);
      }
    }
  }, [profile]);

  const handleGenerate = async () => {
    if (!businessName.trim() || !businessType.trim()) {
      alert("Please fill out at least the Business Name and Type to generate.");
      return;
    }

    setGenerating(true);
    setApiMessage(null);

    try {
      const response = await fetch("/api/generate-website", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: businessName,
          type: businessType,
          description,
          services
        })
      });

      const resData = await response.json();
      if (resData.data) {
        setWebsiteData(resData.data);
        if (resData.message) {
          setApiMessage(resData.message);
        }
      }
    } catch (err: any) {
      console.error("Failed to generate website:", err);
    } finally {
      setGenerating(false);
    }
  };

  const handleUpdateField = (section: string, field: string, value: any, index?: number) => {
    if (!websiteData) return;

    const copy = { ...websiteData };
    if (section === "homepage") {
      (copy.homepage as any)[field] = value;
    } else if (section === "about") {
      (copy.about as any)[field] = value;
    } else if (section === "contact") {
      (copy.contact as any)[field] = value;
    } else if (section === "services" && index !== undefined) {
      copy.services[index] = { ...copy.services[index], [field]: value };
    } else if (section === "faq" && index !== undefined) {
      copy.faq[index] = { ...copy.faq[index], [field]: value };
    }

    setWebsiteData(copy);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start max-w-7xl mx-auto">
      {/* Parameters Panel */}
      <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl w-fit">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">AI Website Generator</h3>
          <p className="text-xs text-slate-400">
            Synthesize a fully functional website matching local SEO signals. Click "Generate" to launch.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Business Name</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Peak Fitness Hub"
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Business Type / Category</label>
            <input
              type="text"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              placeholder="e.g. Modern Gym, Italian Restaurant"
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Business Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="e.g. Family-owned fitness center near downtown."
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Key Services / Focus Area</label>
            <input
              type="text"
              value={services}
              onChange={(e) => setServices(e.target.value)}
              placeholder="e.g. CrossFit, HIIT classes, Personal Training"
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating}
            id="website-generate-btn"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white rounded-xl font-bold text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2"
          >
            {generating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Synthesizing Website...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Website</span>
              </>
            )}
          </button>
        </div>

        {apiMessage && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-950/50 text-[11px] text-amber-700 dark:text-amber-400 rounded-xl">
            {apiMessage}
          </div>
        )}
      </div>

      {/* Preview Screen */}
      <div className="lg:col-span-8 space-y-4">
        {websiteData ? (
          <>
            {/* View Controller */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Laptop className="w-5 h-5 text-slate-400" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Website Live Sandbox Preview</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditMode(!editMode)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                    editMode
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  }`}
                  id="toggle-website-edit"
                >
                  {editMode ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Finish Editing</span>
                    </>
                  ) : (
                    <>
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Content</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Simulated Live Frame Browser */}
            <div className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-3xl overflow-hidden shadow-md flex flex-col">
              {/* Browser Address Bar */}
              <div className="bg-slate-200 dark:bg-slate-900 px-4 py-3 border-b border-slate-300 dark:border-slate-800 flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                </div>
                <div className="flex-grow bg-white dark:bg-slate-950 px-4 py-1 rounded-lg text-xs text-slate-500 font-mono border border-slate-300/50 dark:border-slate-800 flex items-center justify-between">
                  <span>https://{businessName.toLowerCase().replace(/[^a-z0-9]/g, "") || "sandbox"}.localgrowth.ai</span>
                  <Globe className="w-3.5 h-3.5 text-indigo-500" />
                </div>
              </div>

              {/* Website Navigation Frame */}
              <div className="bg-white text-slate-800 min-h-[500px] flex flex-col justify-between font-sans">
                {/* Header */}
                <header className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-extrabold text-lg text-indigo-700">{businessName}</span>
                  <nav className="flex gap-4 text-xs font-bold text-slate-600">
                    <button
                      onClick={() => setActivePreviewTab("home")}
                      className={`pb-1 border-b-2 ${activePreviewTab === "home" ? "border-indigo-600 text-indigo-600" : "border-transparent"}`}
                    >
                      Home
                    </button>
                    <button
                      onClick={() => setActivePreviewTab("about")}
                      className={`pb-1 border-b-2 ${activePreviewTab === "about" ? "border-indigo-600 text-indigo-600" : "border-transparent"}`}
                    >
                      About
                    </button>
                    <button
                      onClick={() => setActivePreviewTab("services")}
                      className={`pb-1 border-b-2 ${activePreviewTab === "services" ? "border-indigo-600 text-indigo-600" : "border-transparent"}`}
                    >
                      Services
                    </button>
                    <button
                      onClick={() => setActivePreviewTab("faq")}
                      className={`pb-1 border-b-2 ${activePreviewTab === "faq" ? "border-indigo-600 text-indigo-600" : "border-transparent"}`}
                    >
                      FAQ
                    </button>
                    <button
                      onClick={() => setActivePreviewTab("contact")}
                      className={`pb-1 border-b-2 ${activePreviewTab === "contact" ? "border-indigo-600 text-indigo-600" : "border-transparent"}`}
                    >
                      Contact
                    </button>
                  </nav>
                </header>

                {/* Sub-section views */}
                <main className="flex-grow p-8">
                  {activePreviewTab === "home" && (
                    <div className="space-y-8 animate-fade-in text-center max-w-2xl mx-auto py-8">
                      {editMode ? (
                        <div className="space-y-3 text-left bg-slate-50 p-4 rounded-2xl border border-slate-200">
                          <p className="text-[10px] font-bold text-slate-400">EDIT HOME INFO</p>
                          <input
                            type="text"
                            value={websiteData.homepage.heroTitle}
                            onChange={(e) => handleUpdateField("homepage", "heroTitle", e.target.value)}
                            className="w-full px-3 py-1.5 text-sm border rounded bg-white"
                          />
                          <textarea
                            value={websiteData.homepage.heroSubtitle}
                            onChange={(e) => handleUpdateField("homepage", "heroSubtitle", e.target.value)}
                            className="w-full px-3 py-1.5 text-sm border rounded bg-white"
                          />
                        </div>
                      ) : (
                        <>
                          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                            {websiteData.homepage.heroTitle}
                          </h1>
                          <p className="text-slate-600 text-base max-w-xl mx-auto leading-relaxed">
                            {websiteData.homepage.heroSubtitle}
                          </p>
                          <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-sm font-bold shadow-md transition-all">
                            {websiteData.homepage.ctaText}
                          </button>
                        </>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
                        {websiteData.homepage.features.map((feature, i) => (
                          <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-indigo-600" />
                            <p className="text-xs font-bold text-slate-800">{feature}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activePreviewTab === "about" && (
                    <div className="space-y-6 max-w-2xl mx-auto py-6">
                      {editMode ? (
                        <div className="space-y-3 text-left bg-slate-50 p-4 rounded-2xl border border-slate-200">
                          <p className="text-[10px] font-bold text-slate-400">EDIT ABOUT INFO</p>
                          <input
                            type="text"
                            value={websiteData.about.title}
                            onChange={(e) => handleUpdateField("about", "title", e.target.value)}
                            className="w-full px-3 py-1.5 text-sm border rounded bg-white"
                          />
                          <textarea
                            value={websiteData.about.story}
                            onChange={(e) => handleUpdateField("about", "story", e.target.value)}
                            rows={3}
                            className="w-full px-3 py-1.5 text-sm border rounded bg-white"
                          />
                        </div>
                      ) : (
                        <>
                          <h2 className="text-2xl font-extrabold text-slate-900 border-b pb-2">{websiteData.about.title}</h2>
                          <p className="text-slate-600 text-sm leading-relaxed">{websiteData.about.story}</p>
                          <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50">
                            <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">Our Mission</h4>
                            <p className="text-xs text-indigo-900 leading-relaxed italic">{websiteData.about.mission}</p>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {activePreviewTab === "services" && (
                    <div className="space-y-6 max-w-3xl mx-auto py-4">
                      <h2 className="text-2xl font-extrabold text-slate-900 border-b pb-2 text-center">Our Services</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {websiteData.services.map((service, i) => (
                          <div key={i} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col justify-between space-y-3">
                            <div className="space-y-2">
                              {editMode ? (
                                <>
                                  <input
                                    type="text"
                                    value={service.name}
                                    onChange={(e) => handleUpdateField("services", "name", e.target.value, i)}
                                    className="w-full px-2 py-1 text-xs border rounded bg-white"
                                  />
                                  <textarea
                                    value={service.description}
                                    onChange={(e) => handleUpdateField("services", "description", e.target.value, i)}
                                    className="w-full px-2 py-1 text-xs border rounded bg-white"
                                  />
                                </>
                              ) : (
                                <>
                                  <h4 className="font-bold text-sm text-slate-850">{service.name}</h4>
                                  <p className="text-xs text-slate-500 leading-relaxed">{service.description}</p>
                                </>
                              )}
                            </div>
                            <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full w-fit">
                              {service.price}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activePreviewTab === "faq" && (
                    <div className="space-y-4 max-w-2xl mx-auto py-6">
                      <h2 className="text-2xl font-extrabold text-slate-900 border-b pb-2 text-center">Frequently Asked</h2>
                      <div className="space-y-3">
                        {websiteData.faq.map((item, i) => (
                          <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                            <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                              <Compass className="w-4 h-4 text-indigo-500" />
                              {item.question}
                            </h4>
                            <p className="text-xs text-slate-500 pl-5.5 leading-relaxed">{item.answer}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activePreviewTab === "contact" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto py-6">
                      <div className="space-y-4">
                        <h2 className="text-2xl font-extrabold text-slate-900 border-b pb-2">Get in Touch</h2>
                        <p className="text-xs text-slate-500">Have questions? Send us a message or contact us directly.</p>
                        <div className="space-y-3 text-xs text-slate-600">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-slate-400" />
                            <span>{websiteData.contact.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-slate-400" />
                            <span>{websiteData.contact.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            <span>{websiteData.contact.address}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3">
                        <h4 className="font-bold text-xs text-slate-800">Quick Message Inquiry</h4>
                        <input type="text" placeholder="Your Name" className="w-full px-3 py-2 text-xs border rounded-xl bg-white" />
                        <textarea placeholder="Your Message" rows={2} className="w-full px-3 py-2 text-xs border rounded-xl bg-white" />
                        <button className="w-full py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold">Send Message</button>
                      </div>
                    </div>
                  )}
                </main>

                {/* Footer */}
                <footer className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span>© {new Date().getFullYear()} {businessName}. All rights reserved.</span>
                  <div className="flex gap-3">
                    <span className="hover:underline cursor-pointer">Privacy Policy</span>
                    <span className="hover:underline cursor-pointer">Terms of Service</span>
                  </div>
                </footer>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-12 text-center shadow-sm flex flex-col items-center justify-center space-y-4">
            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-3xl w-fit">
              <Laptop className="w-10 h-10 animate-bounce" />
            </div>
            <div className="space-y-1 max-w-md">
              <h4 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">Ready to synthesize?</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Provide your core business information on the left configuration panel and trigger the Gemini engine to build your web presence.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
