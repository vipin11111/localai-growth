import { useState, useEffect } from "react";
import { BusinessProfile, GeneratedContent } from "../types";
import { db } from "../lib/firebase";
import { collection, addDoc, getDocs, query, where, orderBy } from "firebase/firestore";
import {
  Sparkles,
  Instagram,
  Facebook,
  Phone,
  BookOpen,
  ShoppingBag,
  Copy,
  Check,
  Save,
  Trash2,
  ListRestart,
  Heart
} from "lucide-react";

interface ContentGeneratorProps {
  profile: BusinessProfile | null;
  userId: string;
}

export default function ContentGenerator({ profile, userId }: ContentGeneratorProps) {
  const [contentType, setContentType] = useState<GeneratedContent["contentType"]>("Instagram");
  const [tone, setTone] = useState("professional");
  const [additionalDirectives, setAdditionalDirectives] = useState("");

  const [generating, setGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState<{ title: string; content: string; hashtags: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  const [savedLogs, setSavedLogs] = useState<GeneratedContent[]>([]);
  const [fetchingLogs, setFetchingLogs] = useState(false);

  useEffect(() => {
    fetchSavedLogs();
  }, [userId]);

  const fetchSavedLogs = async () => {
    setFetchingLogs(true);
    try {
      const q = query(
        collection(db, "contents"),
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      const logs: GeneratedContent[] = [];
      querySnapshot.forEach((doc) => {
        logs.push({ id: doc.id, ...doc.data() } as GeneratedContent);
      });
      // Sort client-side to avoid index requirement overhead
      logs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setSavedLogs(logs);
    } catch (err) {
      console.error("Error fetching content logs:", err);
    } finally {
      setFetchingLogs(false);
    }
  };

  const handleGenerate = async () => {
    if (!profile?.name || !profile?.category) {
      alert("Please update your Business Profile first to provide context for the AI writer.");
      return;
    }

    setGenerating(true);
    setCopied(false);

    try {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          type: profile.category,
          description: `${profile.address ? `Located at ${profile.address}. ` : ""}${additionalDirectives}. Tone of Voice: ${tone}`,
          contentType
        })
      });

      const resData = await response.json();
      if (resData.data) {
        setGeneratedText(resData.data);
      }
    } catch (err) {
      console.error("Failed to generate content:", err);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedText) return;
    const fullText = `${generatedText.title}\n\n${generatedText.content}\n\n${generatedText.hashtags}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    if (!generatedText || !userId) return;

    setSaving(true);
    const itemToSave = {
      contentType,
      title: generatedText.title,
      content: generatedText.content,
      hashtags: generatedText.hashtags,
      userId,
      createdAt: new Date().toISOString()
    };

    try {
      await addDoc(collection(db, "contents"), itemToSave);
      await fetchSavedLogs();
      alert("Marketing copy saved successfully to your content logs!");
    } catch (err) {
      console.error("Error saving marketing content:", err);
    } finally {
      setSaving(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "Instagram":
        return <Instagram className="w-5 h-5" />;
      case "Facebook":
        return <Facebook className="w-5 h-5" />;
      case "WhatsApp":
        return <Phone className="w-5 h-5" />;
      case "Blog":
        return <BookOpen className="w-5 h-5" />;
      default:
        return <ShoppingBag className="w-5 h-5" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Intro header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" /> High-conversion copywriting
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-50 tracking-tight">AI Content & Media Copywriter</h2>
          <p className="text-xs text-slate-400">
            Select a target marketing channel and let Gemini generate creative post copy, hashtags, or blog articles.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Settings Column */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm space-y-5">
          <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800">
            Campaign Setup
          </h4>

          {/* Content Type select */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Channel / Format</label>
            <div className="grid grid-cols-2 gap-2">
              {(["Instagram", "Facebook", "WhatsApp", "Blog", "Product Description"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setContentType(type)}
                  type="button"
                  className={`px-3 py-2.5 rounded-2xl text-xs font-bold border transition-all flex items-center gap-1.5 justify-center ${
                    contentType === type
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                      : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                >
                  {getIcon(type)}
                  <span>{type.split(" ")[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tone select */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tone of Voice</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-100 focus:outline-none"
            >
              <option value="professional">Professional & Authoritative</option>
              <option value="witty">Witty & Creative</option>
              <option value="bold">Bold & Energetic</option>
              <option value="friendly">Friendly & Trustworthy</option>
              <option value="educational">Educational & Instructive</option>
            </select>
          </div>

          {/* Additional Directives */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Additional Directives (Optional)</label>
            <textarea
              value={additionalDirectives}
              onChange={(e) => setAdditionalDirectives(e.target.value)}
              rows={3}
              placeholder="e.g. Focus on our upcoming summer sale or discount code SUMMER15."
              className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-100 focus:outline-none"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating}
            id="content-generate-btn"
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white rounded-xl font-bold text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2"
          >
            {generating ? (
              <>
                <ListRestart className="w-4 h-4 animate-spin" />
                <span>Writing Content...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Write Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Content Viewer / Output */}
        <div className="lg:col-span-8 space-y-6">
          {generatedText ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
                    {getIcon(contentType)}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-800 dark:text-slate-100">{contentType} Generation</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tone: {tone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl transition-all"
                    title="Copy Content"
                    id="copy-content-btn"
                  >
                    {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="p-2 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl transition-all disabled:opacity-40"
                    title="Save to Logs"
                    id="save-content-btn"
                  >
                    <Save className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-900 dark:text-slate-50">{generatedText.title}</h3>
                <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-sans bg-slate-50/50 dark:bg-slate-950/30 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                  {generatedText.content}
                </div>
                {generatedText.hashtags && (
                  <div className="text-xs text-indigo-600 dark:text-indigo-400 font-bold tracking-tight">
                    {generatedText.hashtags}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-12 text-center shadow-sm flex flex-col items-center justify-center space-y-4">
              <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-3xl w-fit">
                <BookOpen className="w-10 h-10 text-indigo-500 animate-pulse" />
              </div>
              <div className="space-y-1 max-w-md">
                <h4 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">AI Copywriter Output</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Select your settings and generate high-engagement social copy custom tailored to your business profile.
                </p>
              </div>
            </div>
          )}

          {/* Saved Log History */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm space-y-4">
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800">
              Content History Logs
            </h4>

            {fetchingLogs ? (
              <div className="text-center py-4 text-xs text-slate-400">Loading saved logs...</div>
            ) : savedLogs.length > 0 ? (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {savedLogs.map((log) => (
                  <div key={log.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/40 flex items-start justify-between gap-4">
                    <div className="space-y-1.5 flex-grow">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-full">
                          {log.contentType}
                        </span>
                        <span className="text-[10px] text-slate-400">{new Date(log.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">{log.title}</h5>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{log.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">No content has been saved yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
