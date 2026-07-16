import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { BusinessProfile } from "../types";
import { Store, MapPin, Phone, Mail, Clock, ShieldCheck, Sparkles, AlertCircle } from "lucide-react";

interface BusinessOnboardingProps {
  userId: string;
  onProfileUpdated: (profile: BusinessProfile) => void;
  initialProfile: BusinessProfile | null;
}

export default function BusinessOnboarding({
  userId,
  onProfileUpdated,
  initialProfile
}: BusinessOnboardingProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [openingHours, setOpeningHours] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (initialProfile) {
      setName(initialProfile.name || "");
      setCategory(initialProfile.category || "");
      setAddress(initialProfile.address || "");
      setPhone(initialProfile.phone || "");
      setEmail(initialProfile.email || "");
      setWhatsapp(initialProfile.whatsapp || "");
      setOpeningHours(initialProfile.openingHours || "");
      setLogoUrl(initialProfile.logoUrl || "");
      setImageUrls(initialProfile.imageUrls || []);
    }
  }, [initialProfile]);

  const handleAddImage = () => {
    if (imageUrlInput.trim()) {
      setImageUrls([...imageUrls, imageUrlInput.trim()]);
      setImageUrlInput("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !category.trim()) {
      setError("Business Name and Category are required.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    const updatedProfile: BusinessProfile = {
      name,
      category,
      address,
      phone,
      email,
      whatsapp,
      openingHours,
      logoUrl: logoUrl || "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=120&auto=format&fit=crop&q=60",
      imageUrls: imageUrls.length > 0 ? imageUrls : [
        "https://images.unsplash.com/photo-1542744094-3a31f103e35f?w=600&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=60"
      ],
      userId
    };

    try {
      // Save directly to businesses collection indexed by userId
      await setDoc(doc(db, "businesses", userId), updatedProfile);
      onProfileUpdated(updatedProfile);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      console.error("Error saving business profile:", err);
      setError("Failed to save profile. Please check your network or try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSample = () => {
    setName("Peak Fitness Hub");
    setCategory("Fitness Center & Gym");
    setDescription("A premium local fitness center offering personalized cross-fit training, yoga workshops, and elite coaching services to level up your strength.");
    setAddress("404 Active Lane, Silicon Valley, CA 94025");
    setPhone("+1 (555) 482-1920");
    setEmail("contact@peakfitnesshub.com");
    setWhatsapp("+15554821920");
    setOpeningHours("Mon - Fri: 6:00 AM - 10:00 PM, Sat - Sun: 8:00 AM - 8:00 PM");
    setLogoUrl("https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=120&auto=format&fit=crop&q=60");
    setImageUrls([
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&auto=format&fit=crop&q=60"
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 text-white rounded-3xl p-6 md:p-8 shadow-xl shadow-indigo-500/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Google Business Sync
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Your Business Profile</h2>
          <p className="text-indigo-100 max-w-xl text-sm">
            Set up or sync your core business metadata. This profile powers all AI website generation, social media post crafting, and advisor services.
          </p>
        </div>
        <button
          onClick={handleLoadSample}
          className="px-5 py-2.5 bg-white text-indigo-700 hover:bg-slate-50 active:bg-slate-100 rounded-full text-xs font-semibold tracking-wide shadow-sm hover:shadow transition-all"
        >
          Auto-Fill Sample Data
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Basic Info */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">1. Core Information</h3>
              <p className="text-xs text-slate-400">Establish your business brand name and market segment.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Business Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Apex Consulting, Sparkle Bakery"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-all"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Business Category *</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Fitness Center, Digital Marketing Agency, Cafe"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-all"
                required
              />
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Short Business Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Describe your value proposition, products, services, and target customers..."
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Contact Info */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">2. Contact & Geolocation</h3>
              <p className="text-xs text-slate-400">Help local customers discover your physical and digital location.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Physical Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street Name, Suite, City, State, ZIP"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +1 (555) 000-0000"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. contact@yourbusiness.com"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">WhatsApp Number (International Format)</label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="e.g. +15554821920"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-all"
              />
              <p className="text-[10px] text-slate-400 font-medium">Used for direct instant messaging connections.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Opening Hours</label>
              <input
                type="text"
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
                placeholder="e.g. Mon - Fri: 9:00 AM - 6:00 PM"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-all"
              />
            </div>
          </div>
        </div>

        {/* Step 3: Media */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">3. Brand Assets & Media</h3>
              <p className="text-xs text-slate-400">Add logos and pictures that represent your brand.</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Logo Image URL</label>
              <input
                type="url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://example.com/images/logo.png"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Showcase Image Gallery URLs</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="https://example.com/images/storefront.jpg"
                  className="flex-grow px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-all"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-5 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-2xl transition-all text-sm flex-shrink-0"
                >
                  Add Image
                </button>
              </div>

              {imageUrls.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-3">
                  {imageUrls.map((url, i) => (
                    <div key={i} className="relative group aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                      <img src={url} alt={`Showcase ${i + 1}`} className="w-full h-full object-cover" onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1542744094-3a31f103e35f?w=600&auto=format&fit=crop&q=60";
                      }} referrerPolicy="no-referrer" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(i)}
                        className="absolute top-1.5 right-1.5 bg-black/60 text-white p-1 rounded-full hover:bg-red-600 transition-all"
                      >
                        <AlertCircle className="w-4 h-4 rotate-45" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200/50 dark:border-rose-950/50 text-rose-700 dark:text-rose-400 flex items-center gap-2.5 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-950/50 text-emerald-700 dark:text-emerald-400 flex items-center gap-2.5 text-sm">
            <ShieldCheck className="w-5 h-5 flex-shrink-0" />
            <span>Profile saved successfully! Your AI engines are refreshed.</span>
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            id="onboarding-save-btn"
            className="w-full md:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-slate-400 text-white rounded-full font-bold tracking-wide shadow-md hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                <span>Save Business Profile</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
