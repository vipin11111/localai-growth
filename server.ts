import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Google GenAI Client
let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not set. AI features will fallback to high-quality mock data.");
      throw new Error("GEMINI_API_KEY is required for AI features. Please set it in your environment or Secrets tab.");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// Clean model output to ensure valid JSON parsing
function cleanJsonResponse(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  return cleaned.trim();
}

// -------------------------------------------------------------
// API ENDPOINTS
// -------------------------------------------------------------

// 1. Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 2. AI Website Generator
app.post("/api/generate-website", async (req, res) => {
  const { name, type, description, services } = req.body;

  if (!name || !type) {
    return res.status(400).json({ error: "Business name and type are required." });
  }

  try {
    const ai = getAIClient();
    const prompt = `You are an expert copywriter and web designer. Generate a fully-fleshed web presence in JSON format for a business with the following info:
Name: ${name}
Type: ${type}
Description: ${description || "A modern business."}
Services: ${services || "A list of standard quality services."}

The JSON must strictly contain the following keys and structure:
{
  "homepage": {
    "heroTitle": "Catchy headline promoting the business's main value",
    "heroSubtitle": "Subheading elaborating on the value proposition",
    "ctaText": "Primary call to action (e.g. Book Consultation, Shop Now)",
    "features": ["Feature or unique selling point 1", "Feature 2", "Feature 3"]
  },
  "about": {
    "title": "Our Story",
    "story": "An engaging, emotional, and inspiring history or summary of why this business exists and how it helps customers.",
    "mission": "Our core mission statement focusing on customer satisfaction and excellence."
  },
  "services": [
    { "name": "Service 1 Name", "description": "Compelling service description", "price": "Standard price or 'Contact for Quote'" },
    { "name": "Service 2 Name", "description": "Compelling service description", "price": "Standard price or 'Contact for Quote'" },
    { "name": "Service 3 Name", "description": "Compelling service description", "price": "Standard price or 'Contact for Quote'" }
  ],
  "contact": {
    "email": "Contact email based on business name",
    "phone": "A representative placeholder phone number",
    "address": "A professional placeholder address",
    "whatsapp": "WhatsApp dynamic join link or number"
  },
  "faq": [
    { "question": "Frequently asked question 1?", "answer": "Informative and reassuring answer." },
    { "question": "Frequently asked question 2?", "answer": "Informative and reassuring answer." }
  ]
}

Ensure the output is ONLY valid JSON. No markdown blocks outside. Do not explain anything, just output the JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "{}";
    const parsedData = JSON.parse(cleanJsonResponse(text));
    res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error("AI Website Generation error:", error);
    // Fallback to high-quality mock data if API key is missing or failed
    const mockData = {
      homepage: {
        heroTitle: `Welcome to ${name} — Expert ${type} Solutions`,
        heroSubtitle: description || `Your trusted partner for premium ${type} services tailored to your needs.`,
        ctaText: "Get Started Now",
        features: ["Premium Quality Guarantee", "Experienced Professionals", "Customer-First Approach"]
      },
      about: {
        title: "About Us",
        story: `${name} was founded with a clear vision: to deliver exceptional ${type} services that make a real difference. Guided by expertise and passion, we serve our local community with pride.`,
        mission: "To provide reliable, high-quality, and innovative solutions that exceed client expectations every day."
      },
      services: [
        { name: "Premium Consultation", description: "Get custom guidance and strategic solutions directly from our top specialists.", price: "$150/hr" },
        { name: "Standard Full-Service", description: "Comprehensive execution of our flagship service with end-to-end management.", price: "$499/setup" },
        { name: "Express Support Package", description: "Quick response, troubleshooting, and optimization for sudden business needs.", price: "$99/mo" }
      ],
      contact: {
        email: `info@${name.toLowerCase().replace(/[^a-z0-9]/g, "") || "business"}.com`,
        phone: "+1 (555) 019-2834",
        address: "100 Innovation Way, Suite A, Metropolis",
        whatsapp: "+15550192834"
      },
      faq: [
        { question: `What makes ${name} the best choice for ${type}?`, answer: "We combine years of hands-on experience, cutting-edge technology, and customized personal attention to deliver outstanding results." },
        { question: "How can I book an appointment or order a service?", answer: "Click on our primary Call to Action, fill out the simple contact form, or reach out directly via WhatsApp for instant communication!" }
      ]
    };
    res.json({ success: false, data: mockData, message: error.message || "Failed to contact Gemini API. Provided high-quality fallback template." });
  }
});

// 3. AI Content Generator
app.post("/api/generate-content", async (req, res) => {
  const { name, type, description, contentType } = req.body;

  if (!name || !type || !contentType) {
    return res.status(400).json({ error: "Business name, type, and content type are required." });
  }

  try {
    const ai = getAIClient();
    const prompt = `Generate highly engaging professional marketing copy for: ${contentType}.
Business details:
Name: ${name}
Type: ${type}
Description: ${description || "Premium service provider"}

Return a JSON object containing:
{
  "title": "A catchy title, header, or subject line",
  "content": "The actual generated text copy, fully written, rich in persuasive copy, emojis, spaced formatting, and call to action",
  "hashtags": "Recommended hashtags separated by spaces (e.g. #Business #SaaS)"
}

Ensure the output is ONLY valid JSON. No conversational text around it.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "{}";
    const parsedData = JSON.parse(cleanJsonResponse(text));
    res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error("AI Content Generation error:", error);
    // Fallback data
    const mockContent: Record<string, any> = {
      Instagram: {
        title: "Elevate Your Day 🚀",
        content: `Looking for top-tier ${type} services? At ${name}, we bring passion and professional excellence straight to you. Let's build something incredible together! 🌟\n\nDM us to learn how we can take your project to the next level.`,
        hashtags: `#${name.replace(/\s+/g, "")} #${type.replace(/\s+/g, "")} #SmallBusiness #LocalGrowth #PremiumServices #SaaS`
      },
      Facebook: {
        title: "Discover the Difference with Us!",
        content: `Did you know that ${name} is dedicated to offering the finest ${type} support in town? Whether you're a long-time customer or looking to start your journey, our experienced team is here to guide you every step of the way.\n\n💼 Visit our website today to explore our custom packages!`,
        hashtags: `#${name.replace(/\s+/g, "")} #BusinessSupport #LocalBusiness #CustomerSatisfaction`
      },
      WhatsApp: {
        title: "🔥 Special Promotion!",
        content: `Hello! 👋 We are excited to offer an exclusive promotion from ${name}.\n\nGet 15% off any of our professional ${type} packages this week only! Just reply with 'GROW' to claim your special code and get started. 📈`,
        hashtags: ""
      },
      Blog: {
        title: `The Ultimate Guide to Maximizing ${type} Success`,
        content: `In today’s fast-paced market, businesses are constantly searching for ways to streamline operations and deliver consistent results. In this article, the team at ${name} shares three critical steps to achieving excellence in ${type}:\n\n1. Establish Clear Milestones: Always start with an overarching vision.\n2. Leverage Expert Partnerships: Working with specialized teams ensures maximum efficiency.\n3. Keep Customers at the Core: Every choice should simplify your client's path.\n\nImplementing these habits will establish durable success!`,
        hashtags: `#Education #Strategy #Leadership #SaaS`
      },
      "Product Description": {
        title: `Standard ${type} Suite`,
        content: `Unchain your potential with the flagship ${type} suite by ${name}. Engineered for maximum reliability, modern compatibility, and tailored flexibility, this package is designed to solve your most pressuring pain points effortlessly.`,
        hashtags: `#Innovation #Product #Launch`
      }
    };
    const data = mockContent[contentType] || mockContent["Instagram"];
    res.json({ success: false, data, message: error.message || "Failed to contact Gemini API. Loaded template content." });
  }
});

// 4. AI Marketing Strategy
app.post("/api/generate-marketing", async (req, res) => {
  const { name, type, description } = req.body;

  if (!name || !type) {
    return res.status(400).json({ error: "Business name and type are required." });
  }

  try {
    const ai = getAIClient();
    const prompt = `Develop a targeted AI marketing strategy and Google Ads copy for:
Business Name: ${name}
Business Type: ${type}
Description: ${description || "High-quality provider"}

Return a JSON object containing:
{
  "googleAds": {
    "headlines": ["Headline 1 (max 30 chars)", "Headline 2", "Headline 3"],
    "descriptions": ["Description 1 (max 90 chars)", "Description 2"],
    "keywords": ["keyword1", "keyword2", "keyword3", "keyword4"]
  },
  "strategy": [
    "Phase 1: Clear, actionable marketing milestone",
    "Phase 2: Clear, actionable marketing milestone",
    "Phase 3: Clear, actionable marketing milestone"
  ],
  "scoreSuggestions": {
    "seo": ["Actionable improvement to boost SEO", "Another actionable SEO improvement"],
    "marketing": ["Actionable social media or promo advice", "Another marketing optimization idea"]
  }
}

Ensure the output is ONLY valid JSON. No markdown blocks outside.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "{}";
    const parsedData = JSON.parse(cleanJsonResponse(text));
    res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error("AI Marketing Strategy error:", error);
    // Fallback data
    const mockStrategy = {
      googleAds: {
        headlines: [`Top ${type} Services`, `Affordable ${name}`, `Professional ${type} Solutions`],
        descriptions: [
          `Experience premium quality with ${name}. Book your appointment or consultation today!`,
          `Trusted local specialists. Customized plans designed to fit your unique requirements.`
        ],
        keywords: [type.toLowerCase(), `${name.toLowerCase()} services`, `best ${type.toLowerCase()}`, `hire local ${type.toLowerCase()}`]
      },
      strategy: [
        "Phase 1 (Setup): Optimize your Google Business profile, claim listings, and publish your generated landing page.",
        "Phase 2 (Acquisition): Run targeted local search advertisements focusing on high-intent keywords and set up a dynamic WhatsApp lead capture.",
        "Phase 3 (Retention): Launch email newsletter campaigns offering seasonal discounts and ask happy clients to leave 5-star Google reviews."
      ],
      scoreSuggestions: {
        seo: [
          "Include location-specific search keywords in your homepage headings (e.g., 'Metropolis Best Services').",
          "Add structured schema markup to your website to appear in Google search rich snippets."
        ],
        marketing: [
          "Offer an exclusive 15% discount for first-time WhatsApp inquiries to build your list fast.",
          "Post 2 high-quality project showcase reels per week on Instagram and Facebook."
        ]
      }
    };
    res.json({ success: false, data: mockStrategy, message: error.message || "Failed to contact Gemini API. Provided mock strategy." });
  }
});

// 5. AI Business Advisor Chat
app.post("/api/advisor-chat", async (req, res) => {
  const { name, type, description, message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  try {
    const ai = getAIClient();
    const prompt = `You are LocalAI Advisor, a friendly, professional, senior small business advisor and marketing growth expert.
Context about the business:
Name: ${name || "Unconfigured Business"}
Type: ${type || "Standard Category"}
Description: ${description || "No description provided."}

User Question: "${message}"

Provide a highly actionable, structured, and encouraging response with practical steps, formatting tips, bullet points, and specific advice. Limit your response to 400 words.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.json({ success: true, answer: response.text || "I apologize, I could not generate an answer." });
  } catch (error: any) {
    console.error("AI Advisor Chat error:", error);
    // Fallback advice
    const genericAdvice = `### Hello from LocalAI Advisor!\n\nI encountered a technical issue connecting to my core brain, but I'm happy to provide expert guidance anyway! Here are 3 quick actions you can take today to grow your **${type || "business"}**:\n\n1. **Leverage Social Proof**: Reach out to 3 recent clients and ask them to write a review on Google. Social proof increases lead conversion by up to 40%!\n2. **Optimize Contact Channels**: Ensure your WhatsApp and email links are prominently displayed on your homepage. The easier you are to reach, the higher your sales.\n3. **Content Consistency**: Post informative tips about ${type || "your services"} on social channels once a week to establish expert authority.\n\n*How can I help you optimize your pricing or team operations next? Let me know!*`;
    res.json({ success: false, answer: genericAdvice, message: error.message || "Failed to contact Gemini API. Loaded standby advisor content." });
  }
});

// Serve Vite-managed app
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();
