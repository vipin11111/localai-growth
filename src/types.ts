/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BusinessProfile {
  id?: string;
  name: string;
  category: string;
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  openingHours: string;
  logoUrl?: string;
  imageUrls?: string[];
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Lead {
  id?: string;
  name: string;
  email: string;
  phone: string;
  status: "new" | "contacted" | "qualified" | "closed_won" | "closed_lost";
  notes: string;
  userId: string;
  createdAt: string;
}

export interface GeneratedWebsite {
  homepage: {
    heroTitle: string;
    heroSubtitle: string;
    ctaText: string;
    features: string[];
  };
  about: {
    title: string;
    story: string;
    mission: string;
  };
  services: Array<{
    name: string;
    description: string;
    price: string;
  }>;
  contact: {
    email: string;
    phone: string;
    address: string;
    whatsapp: string;
  };
  faq: Array<{
    question: string;
    answer: string;
  }>;
}

export interface GeneratedContent {
  id?: string;
  contentType: "Instagram" | "Facebook" | "WhatsApp" | "Blog" | "Product Description";
  title: string;
  content: string;
  hashtags: string;
  createdAt: string;
}

export interface MarketingStrategy {
  googleAds: {
    headlines: string[];
    descriptions: string[];
    keywords: string[];
  };
  strategy: string[];
  scoreSuggestions: {
    seo: string[];
    marketing: string[];
  };
}

export interface ChatMessage {
  sender: "user" | "advisor";
  text: string;
  timestamp: string;
}
