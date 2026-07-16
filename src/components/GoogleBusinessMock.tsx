import { useState } from "react";
import { BusinessProfile } from "../types";
import {
  MessageSquareQuote,
  Star,
  MapPin,
  Camera,
  Check,
  Send,
  Plus,
  RefreshCw,
  Globe,
  Sparkles
} from "lucide-react";

interface GoogleBusinessMockProps {
  profile: BusinessProfile | null;
}

export default function GoogleBusinessMock({ profile }: GoogleBusinessMockProps) {
  const isProfileComplete = !!(profile?.name && profile?.category);

  // Pre-seed some mock local reviews representing Google Maps integrations
  const [reviews, setReviews] = useState([
    {
      id: "1",
      author: "Samantha Greene",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=60",
      rating: 5,
      relativeTime: "2 days ago",
      text: `Absolutely incredible experience working with ${profile?.name || "them"}! Highly professional, extremely prompt, and exceeded all our expectations. Will definitely recommend to friends!`,
      reply: ""
    },
    {
      id: "2",
      author: "Robert Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=60",
      rating: 4,
      relativeTime: "1 week ago",
      text: "Great quality support and stellar execution. The team knows exactly what they are doing. Docked one star only because booking was slightly delayed.",
      reply: "Thank you for the constructive feedback Robert! We are streamlining our scheduling calendars as we speak."
    },
    {
      id: "3",
      author: "Emily Watson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&auto=format&fit=crop&q=60",
      rating: 5,
      relativeTime: "3 weeks ago",
      text: "Best decision we made this year. Super friendly customer care and excellent localized services.",
      reply: ""
    }
  ]);

  const [replyInput, setReplyInput] = useState<Record<string, string>>({});
  const [syncing, setSyncing] = useState(false);

  const handleSendReply = (reviewId: string) => {
    const text = replyInput[reviewId];
    if (!text?.trim()) return;

    setReviews(
      reviews.map((rev) => (rev.id === reviewId ? { ...rev, reply: text } : rev))
    );
    setReplyInput({ ...replyInput, [reviewId]: "" });
  };

  const handleSyncMaps = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      alert("Successfully synced Google Business Profile metrics with Google Maps!");
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Intro Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold">
            <MessageSquareQuote className="w-3.5 h-3.5" /> Google Business Profile
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-50 tracking-tight">Google Maps Sync</h2>
          <p className="text-xs text-slate-400">
            Monitor incoming client reviews, respond with localized marketing comments, and edit business listing metadata.
          </p>
        </div>

        {isProfileComplete && (
          <button
            onClick={handleSyncMaps}
            disabled={syncing}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white rounded-full text-xs font-bold tracking-wide shadow-md transition-all flex items-center gap-1.5"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
            <span>{syncing ? "Syncing..." : "Sync Google Profile"}</span>
          </button>
        )}
      </div>

      {isProfileComplete ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Column Left: Listing Stats */}
          <div className="lg:col-span-4 space-y-6">
            {/* Listing Details Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm space-y-5">
              <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800">
                Maps Listing Preview
              </h4>

              <div className="space-y-4">
                <div className="flex gap-3 items-center">
                  <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Business Title</h5>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{profile.name}</p>
                  </div>
                </div>

                <div className="flex gap-3 items-center">
                  <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
                    <Star className="w-5 h-5 fill-indigo-100 dark:fill-indigo-950" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Rating Score</h5>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-sm font-extrabold text-slate-850 dark:text-slate-200">4.8</span>
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                      <span className="text-xs text-slate-400 font-medium">(42 Reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 items-center">
                  <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Listing Address</h5>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]" title={profile.address}>
                      {profile.address || "Unspecified location"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated Map Embed */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-4 shadow-sm space-y-3">
              <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">Local Map Geolocation</h5>
              <div className="aspect-video rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 bg-slate-100 relative">
                {/* Simulated Google Map Canvas */}
                <div className="absolute inset-0 bg-[#e5e3df] dark:bg-[#242526] flex items-center justify-center p-4">
                  <div className="text-center space-y-1.5">
                    <MapPin className="w-8 h-8 text-rose-500 mx-auto animate-bounce" />
                    <p className="text-[10px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                      {profile.name} Pin Location
                    </p>
                    <p className="text-[9px] text-slate-400 max-w-[180px] mx-auto truncate">
                      {profile.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column Right: Reviews List */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm space-y-6">
            <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span>Customer Reviews pipeline</span>
              <span className="text-xs bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 px-3 py-1 rounded-full">
                Active Integrations
              </span>
            </h4>

            <div className="space-y-6">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-5 bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/40 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={rev.avatar} alt={rev.author} className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                      <div>
                        <h5 className="font-extrabold text-sm text-slate-850 dark:text-slate-200">{rev.author}</h5>
                        <p className="text-[10px] text-slate-400 font-medium">{rev.relativeTime}</p>
                      </div>
                    </div>

                    <div className="flex text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                    "{rev.text}"
                  </p>

                  {/* Reply Log */}
                  {rev.reply ? (
                    <div className="ml-6 p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/30 dark:border-indigo-900/30 text-xs text-indigo-900 dark:text-indigo-300 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px] text-indigo-600 dark:text-indigo-400">
                        <Sparkles className="w-3 h-3 animate-pulse" />
                        <span>Owner Response</span>
                      </div>
                      <p className="font-medium italic">"{rev.reply}"</p>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={replyInput[rev.id] || ""}
                        onChange={(e) => setReplyInput({ ...replyInput, [rev.id]: e.target.value })}
                        placeholder="Write owner response..."
                        className="flex-grow px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-transparent text-slate-800 dark:text-slate-100 focus:outline-none"
                      />
                      <button
                        onClick={() => handleSendReply(rev.id)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" />
                        <span>Send</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-12 text-center shadow-sm flex flex-col items-center justify-center space-y-4">
          <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-3xl w-fit">
            <MessageSquareQuote className="w-10 h-10 text-indigo-500 animate-bounce" />
          </div>
          <div className="space-y-1 max-w-md">
            <h4 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">Claim your Google Listing</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Complete your Business Profile to configure local geocoding pins, and pull incoming Google Reviews directly from Google Maps.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
