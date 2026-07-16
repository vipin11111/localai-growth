import { useState, useEffect } from "react";
import { BusinessProfile, MarketingStrategy } from "../types";
import {
  Sparkles,
  Megaphone,
  Check,
  Copy,
  TrendingUp,
  Target,
  Key,
  ListOrdered,
  Search,
  CheckCircle,
  Cpu
} from "lucide-react";

interface MarketingHubProps {
  profile: BusinessProfile | null;
}

export default function MarketingHub({ profile }: MarketingHubProps) {
  const [generating, setGenerating] = useState(false);
  const [marketingData, setMarketingData] = useState<MarketingStrategy | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [apiMessage, setApiMessage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!profile?.name || !profile?.category) {
      alert("Please update your Business Profile first to provide context for the AI marketer.");
      return;
    }

    setGenerating(true);
    setApiMessage(null);

    try {
      const response = await fetch("/api/generate-marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          type: profile.category,
          description: profile.address ? `Located at ${profile.address}.` : ""
        })
      });

      const resData = await response.json();
      if (resData.data) {
        setMarketingData(resData.data);
        if (resData.message) {
          setApiMessage(resData.message);
        }
      }
    } catch (err) {
      console.error("Failed to generate marketing details:", err);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Intro Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold">
            <Megaphone className="w-3.5 h-3.5" /> Google Ads & Marketing Engine
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-50 tracking-tight">AI Ads & SEO Suite</h2>
          <p className="text-xs text-slate-400">
            Synthesize optimized Google search advertisements, high-converting keyword lists, and an actionable local outreach strategy.
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating}
          id="marketing-generate-btn"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white rounded-full font-bold text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2"
        >
          {generating ? (
            <>
              <Cpu className="w-4 h-4 animate-spin" />
              <span>Synthesizing Strategy...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Launch AI Strategy</span>
            </>
          )}
        </button>
      </div>

      {apiMessage && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-950/50 text-[11px] text-amber-700 dark:text-amber-400 rounded-2xl">
          {apiMessage}
        </div>
      )}

      {marketingData ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Column Left: Ads Copy */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-800 dark:text-slate-100">Google Ads Blueprint</h4>
                <p className="text-xs text-slate-400">Copy optimized copy into your Google Ads Manager.</p>
              </div>
            </div>

            {/* Ads Headlines */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Search Headlines (Max 30 chars)</h5>
                <button
                  onClick={() => handleCopy(marketingData.googleAds.headlines.join("\n"), "headlines")}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline"
                  id="copy-headlines"
                >
                  {copiedKey === "headlines" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === "headlines" ? "Copied" : "Copy All"}</span>
                </button>
              </div>

              <div className="space-y-2">
                {marketingData.googleAds.headlines.map((headline, i) => (
                  <div key={i} className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center justify-between text-sm font-semibold text-slate-800 dark:text-slate-200">
                    <span className="truncate">{headline}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase px-2 py-0.5 bg-white dark:bg-slate-900 border rounded-full">
                      {headline.length} / 30
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ads Descriptions */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Search Descriptions (Max 90 chars)</h5>
                <button
                  onClick={() => handleCopy(marketingData.googleAds.descriptions.join("\n"), "descriptions")}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline"
                  id="copy-descriptions"
                >
                  {copiedKey === "descriptions" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === "descriptions" ? "Copied" : "Copy All"}</span>
                </button>
              </div>

              <div className="space-y-2">
                {marketingData.googleAds.descriptions.map((desc, i) => (
                  <div key={i} className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center justify-between text-xs leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
                    <span>{desc}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase px-2 py-0.5 bg-white dark:bg-slate-900 border rounded-full flex-shrink-0">
                      {desc.length} / 90
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Keywords */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Key className="w-3.5 h-3.5 text-indigo-500" /> High-Intent Keywords
                </h5>
                <button
                  onClick={() => handleCopy(marketingData.googleAds.keywords.join(", "), "keywords")}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline"
                  id="copy-keywords"
                >
                  {copiedKey === "keywords" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === "keywords" ? "Copied" : "Copy Keywords"}</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {marketingData.googleAds.keywords.map((kw, i) => (
                  <span key={i} className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-100/30 dark:border-indigo-900/40 rounded-full text-xs font-bold font-mono">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Column Right: Strategy & Auditing */}
          <div className="lg:col-span-6 space-y-6">
            {/* Strategy Roadmap */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
                  <ListOrdered className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-800 dark:text-slate-100">Step-by-Step Local Strategy</h4>
                  <p className="text-xs text-slate-400">Implement these phases sequentially to generate leads.</p>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                {marketingData.strategy.map((step, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center border border-indigo-100 dark:border-indigo-900/50 flex-shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Score & SEO Suggestions */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-800 dark:text-slate-100">Audit & Optimization Advice</h4>
                  <p className="text-xs text-slate-400">Actionable recommendations to boost Google rankings.</p>
                </div>
              </div>

              {/* SEO Score Improvements */}
              <div className="space-y-2.5">
                <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SEO Recommendations</h5>
                <div className="space-y-2">
                  {marketingData.scoreSuggestions.seo.map((suggestion, i) => (
                    <div key={i} className="flex gap-2.5 items-start bg-slate-50 dark:bg-slate-950/30 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Marketing/Promo Suggestions */}
              <div className="space-y-2.5">
                <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Promo & Outreach Ideas</h5>
                <div className="space-y-2">
                  {marketingData.scoreSuggestions.marketing.map((suggestion, i) => (
                    <div key={i} className="flex gap-2.5 items-start bg-slate-50 dark:bg-slate-950/30 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                      <CheckCircle className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-12 text-center shadow-sm flex flex-col items-center justify-center space-y-4">
          <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-3xl w-fit">
            <Megaphone className="w-10 h-10 text-indigo-500 animate-bounce" />
          </div>
          <div className="space-y-1 max-w-md">
            <h4 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">Ready to synthesize marketing?</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Trigger the Gemini models above, and our engine will automatically generate search engine keywords, Google Ads descriptions, and optimization roadmaps.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
