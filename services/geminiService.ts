import { GoogleGenAI, Type } from "@google/genai";
import { UsageMetric, Plan } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export interface UserRequirements {
  description: string;
  budget?: number;
  features?: string;
  usageHistory?: UsageMetric[];
  availablePlans: Plan[];
}

export const getPlanRecommendation = async (requirements: UserRequirements): Promise<{ recommendedPlanId: string; reasoning: string }> => {
  if (!apiKey) {
    return {
      recommendedPlanId: 'plan_pro',
      reasoning: "API Key is missing. Defaulting to Pro plan as a balanced option."
    };
  }

  // Analyze usage history if provided
  let usageContext = "No historical usage data available.";
  if (requirements.usageHistory && requirements.usageHistory.length > 0) {
    const totalBandwidth = requirements.usageHistory.reduce((acc, curr) => acc + curr.bandwidth, 0);
    const avgBandwidth = totalBandwidth / requirements.usageHistory.length;
    const estMonthlyBandwidth = (avgBandwidth * 30).toFixed(0);
    
    usageContext = `
    User Usage Analysis (Past 7 days):
    - Estimated Monthly Bandwidth: ~${estMonthlyBandwidth} GB
    - Daily Average: ${avgBandwidth.toFixed(1)} GB
    - Context: 
      - < 100GB/mo: Low usage (Casual)
      - 100-500GB/mo: Moderate usage (Regular HD)
      - > 500GB/mo: High usage (4K/Heavy streaming)
    `;
  }

  const plansJson = JSON.stringify(requirements.availablePlans.map(p => ({ 
    id: p.id, 
    name: p.name, 
    priceMonthly: p.priceMonthly, 
    priceYearly: p.priceYearly,
    features: p.features, 
    recommendedFor: p.recommendedFor 
  })));

  const prompt = `
    You are a sales expert for AuraStream.
    Available Plans: ${plansJson}
    
    User Profile & Requirements:
    - User Query/Needs: "${requirements.description || 'Not specified'}"
    - Max Monthly Budget: ${requirements.budget ? '$' + requirements.budget : 'Flexible'}
    - Desired Features: "${requirements.features || 'Any'}"
    ${usageContext}
    
    Task: Recommend the single best plan ID based on the user's constraints and usage patterns.
    
    Decision Logic:
    1. Budget Check: If a budget is set, strictly try to respect it.
    2. Usage Check: 
       - If estimated usage is HIGH (>500GB/mo), strongly lean towards 'Enterprise' (Ultra Stream) or at least 'Pro' to avoid quality throttling, unless the budget strictly forbids it.
       - If usage is MODERATE, 'Pro' is usually best.
       - If usage is LOW, 'Basic' is sufficient.
    3. Feature Check: If specific features (4K, multiple users) are requested, prioritize the plan that has them.
    
    Output:
    Provide a JSON object with:
    - recommendedPlanId: The ID of the plan.
    - reasoning: A persuasive, friendly sentence explaining why this plan fits their specific needs (mention their usage stats if relevant, e.g., "Given your high monthly usage of X GB...").
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedPlanId: { type: Type.STRING },
            reasoning: { type: Type.STRING }
          },
          required: ["recommendedPlanId", "reasoning"]
        }
      }
    });

    const text = response.text;
    if (text) {
      return JSON.parse(text);
    }
    throw new Error("No response text");
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      recommendedPlanId: 'plan_pro',
      reasoning: "We encountered an error analyzing your request, but the Pro plan is our most popular choice."
    };
  }
};