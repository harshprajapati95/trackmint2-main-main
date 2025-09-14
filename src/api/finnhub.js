const FINNHUB_API_KEY = import.meta.env.VITE_FINNHUB_API_KEY || 'demo';
const BASE_URL = "https://finnhub.io/api/v1";

// Log warning if using demo key
if (FINNHUB_API_KEY === 'demo') {
  console.warn('⚠️  Using demo Finnhub API key. Please set VITE_FINNHUB_API_KEY for production use');
}

export async function fetchStockSymbols(limit = 10) {
  try {
    const res = await fetch(`${BASE_URL}/stock/symbol?exchange=US&token=${FINNHUB_API_KEY}`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    if (data?.error) {
      throw new Error(`API Error: ${data.error}`);
    }
    return data.slice(0, limit);
  } catch (error) {
    console.error("Error fetching stock symbols:", error);
    throw error;
  }
}

export async function fetchStockQuote(symbol) {
  try {
    const res = await fetch(`${BASE_URL}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    if (data?.error) {
      throw new Error(`API Error: ${data.error}`);
    }
    return data;
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error);
    throw error;
  }
}
