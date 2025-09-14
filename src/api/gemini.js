const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

// Log warning if API key is missing
if (!GEMINI_API_KEY) {
  console.warn('⚠️  Gemini API key not found. AI features will use fallback responses. Please set VITE_GEMINI_API_KEY');
}

export async function askGeminiAdvice(question, userData, stockData = null) {
  // If no API key, return fallback response
  if (!GEMINI_API_KEY) {
    return getFallbackAdvice(question, userData);
  }

  try {
    const userContext = `
User Profile:
- Monthly Income: ₹${userData?.income?.monthly || 'Not provided'}
- Annual Income: ₹${userData?.income?.annual || 'Not provided'}
- Budget Rule: ${userData?.budgetRule || 'Not set'}
- Risk Appetite: ${userData?.riskAppetite || 'Not provided'}
- Investment Goals: ${userData?.investmentGoals?.join(', ') || 'None specified'}

${stockData ? `Current Stock Market Data: ${JSON.stringify(stockData, null, 2)}` : ''}
`;

    const prompt = `
You are a professional financial advisor for TrackMint, a personal finance management app. 
Provide helpful, personalized financial advice based on the user's profile.

${userContext}

User Question: ${question}

Please provide:
1. A clear, actionable answer to their question
2. Personalized recommendations based on their profile
3. If relevant, specific investment or budgeting advice
4. Risk considerations appropriate to their risk appetite
5. Any relevant market insights if stock data is provided

Keep the response conversational, helpful, and under 200 words. Use Indian financial context (₹, NSE, BSE, etc.).
`;

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error asking Gemini:', error);
    // Return fallback response on error
    return getFallbackAdvice(question, userData);
  }
}

// Fallback advice when API is not available
function getFallbackAdvice(question, userData) {
  const income = userData?.income?.monthly || userData?.income?.annual / 12 || 0;
  const riskAppetite = userData?.riskAppetite || 'Balanced';
  
  const fallbackResponses = {
    budget: `Based on your income of ₹${income.toLocaleString()}, I recommend following the 50-30-20 rule: allocate 50% for needs (₹${(income * 0.5).toLocaleString()}), 30% for wants (₹${(income * 0.3).toLocaleString()}), and 20% for savings (₹${(income * 0.2).toLocaleString()}).`,
    
    investment: `With your ${riskAppetite.toLowerCase()} risk profile, consider diversifying across ${riskAppetite === 'Conservative' ? 'government bonds and blue-chip stocks' : riskAppetite === 'Balanced' ? 'a mix of stocks, bonds, and mutual funds' : 'growth stocks and equity mutual funds'}. Start with small amounts and gradually increase your investments.`,
    
    saving: `Aim to build an emergency fund covering 6 months of expenses first. Then consider investing ₹${(income * 0.2).toLocaleString()} monthly in a diversified portfolio matching your risk tolerance.`,
    
    default: `Thank you for your question! While I'm currently running in demo mode, I recommend consulting with a financial advisor for personalized advice. General tips: maintain an emergency fund, diversify investments, and stick to your budget plan.`
  };
  
  // Simple keyword matching for fallback responses
  const questionLower = question.toLowerCase();
  let response = fallbackResponses.default;
  
  if (questionLower.includes('budget') || questionLower.includes('money') || questionLower.includes('spend')) {
    response = fallbackResponses.budget;
  } else if (questionLower.includes('invest') || questionLower.includes('stock') || questionLower.includes('mutual fund')) {
    response = fallbackResponses.investment;
  } else if (questionLower.includes('save') || questionLower.includes('emergency')) {
    response = fallbackResponses.saving;
  }
  
  return {
    candidates: [{
      content: {
        parts: [{
          text: `💡 **Demo Mode Response** 💡\n\n${response}\n\n*Note: This is a fallback response. For AI-powered advice, please configure your Gemini API key.*`
        }]
      }
    }]
  };
}
