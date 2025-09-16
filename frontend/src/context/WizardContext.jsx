import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { fetchStockSymbols, fetchStockQuote } from "../api/finnhub";

// Base key for localStorage
const WIZARD_STORAGE_BASE_KEY = 'trackMint_wizardData';

// Get user-specific storage key
const getWizardStorageKey = (userId) => {
  return userId ? `${WIZARD_STORAGE_BASE_KEY}_${userId}` : WIZARD_STORAGE_BASE_KEY;
};

// Load initial state from localStorage or use default
const loadInitialState = (userId = null) => {
  try {
    const storageKey = getWizardStorageKey(userId);
    const savedState = localStorage.getItem(storageKey);
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.error('Error loading wizard state from localStorage:', error);
  }
  
  return {
    currentStep: 1,
    totalSteps: 5,
    userData: {
      income: {
        monthly: 0,
        annual: 0,
        source: 'salary',
      },
      budgetRule: '50-30-20',
      customBudget: {
        needs: 50,
        wants: 30,
        savings: 20,
      },
      expenses: {
        needs: [],
        wants: [],
        totalNeeds: 0,
        totalWants: 0,
      },
      riskAppetite: 'Balanced',
      investmentGoals: [],
      recommendations: {
        stocks: [],
        mutualFunds: [],
        bonds: [],
      },
    },
    isComplete: false,
  };
};

// Action types
const WIZARD_ACTIONS = {
  NEXT_STEP: 'NEXT_STEP',
  PREV_STEP: 'PREV_STEP',
  UPDATE_INCOME: 'UPDATE_INCOME',
  UPDATE_BUDGET_RULE: 'UPDATE_BUDGET_RULE',
  UPDATE_CUSTOM_BUDGET: 'UPDATE_CUSTOM_BUDGET',
  UPDATE_EXPENSES: 'UPDATE_EXPENSES',
  UPDATE_RISK_APPETITE: 'UPDATE_RISK_APPETITE',
  UPDATE_GOALS: 'UPDATE_GOALS',
  SET_RECOMMENDATIONS: 'SET_RECOMMENDATIONS',
  COMPLETE_WIZARD: 'COMPLETE_WIZARD',
  RESET_WIZARD: 'RESET_WIZARD',
};

// Save state to localStorage
const saveStateToStorage = (state, userId = null) => {
  try {
    const storageKey = getWizardStorageKey(userId);
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving wizard state to localStorage:', error);
  }
};

// Reducer function
function wizardReducer(state, action) {
  let newState;
  
  switch (action.type) {
    case WIZARD_ACTIONS.NEXT_STEP:
      newState = {
        ...state,
        currentStep: Math.min(state.currentStep + 1, state.totalSteps),
      };
      break;
    
    case WIZARD_ACTIONS.PREV_STEP:
      newState = {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 1),
      };
      break;
    
    case WIZARD_ACTIONS.UPDATE_INCOME:
      newState = {
        ...state,
        userData: {
          ...state.userData,
          income: { ...state.userData.income, ...action.payload },
        },
      };
      break;
    
    case WIZARD_ACTIONS.UPDATE_BUDGET_RULE:
      newState = {
        ...state,
        userData: {
          ...state.userData,
          budgetRule: action.payload,
        },
      };
      break;
    
    case WIZARD_ACTIONS.UPDATE_CUSTOM_BUDGET:
      newState = {
        ...state,
        userData: {
          ...state.userData,
          customBudget: { ...state.userData.customBudget, ...action.payload },
        },
      };
      break;
    
    case WIZARD_ACTIONS.UPDATE_EXPENSES:
      newState = {
        ...state,
        userData: {
          ...state.userData,
          expenses: { ...state.userData.expenses, ...action.payload },
        },
      };
      break;
    
    case WIZARD_ACTIONS.UPDATE_RISK_APPETITE:
      newState = {
        ...state,
        userData: {
          ...state.userData,
          riskAppetite: action.payload,
        },
      };
      break;
    
    case WIZARD_ACTIONS.UPDATE_GOALS:
      newState = {
        ...state,
        userData: {
          ...state.userData,
          investmentGoals: action.payload,
        },
      };
      break;
    
    case WIZARD_ACTIONS.SET_RECOMMENDATIONS:
      newState = {
        ...state,
        userData: {
          ...state.userData,
          recommendations: action.payload,
        },
      };
      break;
    
    case WIZARD_ACTIONS.COMPLETE_WIZARD:
      newState = {
        ...state,
        isComplete: true,
      };
      saveStateToStorage(newState, action.userId);
      return newState;
    
    case WIZARD_ACTIONS.RESET_WIZARD:
      // If payload contains newState and userId, use that (for user switching)
      if (action.payload?.newState && action.payload?.userId) {
        return action.payload.newState;
      }
      
      // Otherwise, reset to default state
      newState = {
        currentStep: 1,
        totalSteps: 5,
        userData: {
          income: {
            monthly: 0,
            annual: 0,
            source: 'salary',
          },
          budgetRule: '50-30-20',
          customBudget: {
            needs: 50,
            wants: 30,
            savings: 20,
          },
          expenses: {
            needs: [],
            wants: [],
            totalNeeds: 0,
            totalWants: 0,
          },
          riskAppetite: 'Balanced',
          investmentGoals: [],
          recommendations: {
            stocks: [],
            mutualFunds: [],
            bonds: [],
          },
        },
        isComplete: false,
      };
      saveStateToStorage(newState, action.userId);
      return newState;
    
    default:
      return state;
  }

  // Save to localStorage for all state updates except COMPLETE_WIZARD and RESET_WIZARD (handled above)
  saveStateToStorage(newState, action.userId);
  return newState;
}

// Create context
const WizardContext = createContext();

// Provider component
export function WizardProvider({ children, userId }) {
  // Clean up old global wizard data on first load
  useEffect(() => {
    // Remove old non-user-specific wizard data
    const oldGlobalData = localStorage.getItem(WIZARD_STORAGE_BASE_KEY);
    if (oldGlobalData) {
      localStorage.removeItem(WIZARD_STORAGE_BASE_KEY);
    }
  }, []);

  // Create user-specific initial state
  const getUserSpecificInitialState = () => {
    return loadInitialState(userId);
  };

  const [state, dispatch] = useReducer(wizardReducer, getUserSpecificInitialState());

  // Effect to reinitialize state when userId changes
  useEffect(() => {
    if (userId) {
      const newState = loadInitialState(userId);
      dispatch({ type: WIZARD_ACTIONS.RESET_WIZARD, payload: { newState, userId } });
    }
  }, [userId]);

  // Create enhanced dispatch that includes userId
  const enhancedDispatch = (action) => {
    dispatch({ ...action, userId });
  };

  const value = {
    ...state,
    dispatch: enhancedDispatch,
    actions: WIZARD_ACTIONS,
  };

  return (
    <WizardContext.Provider value={value}>
      {children}
    </WizardContext.Provider>
  );
}

// Custom hook to use the wizard context
export function useWizard() {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
}

// Helper functions for calculations
export const calculateBudgetAllocation = (income, budgetRule, customBudget) => {
  // Ensure we have valid income data
  if (!income || (!income.monthly && !income.annual)) {
    console.warn("No valid income data provided");
    return { needs: 0, wants: 0, savings: 0 };
  }
  
  const monthlyIncome = income.monthly || (income.annual ? income.annual / 12 : 0);
  
  if (budgetRule === '50-30-20') {
    const allocation = {
      needs: monthlyIncome * 0.5,
      wants: monthlyIncome * 0.3,
      savings: monthlyIncome * 0.2,
    };
    return allocation;
  } else if (budgetRule === '60-20-20') {
    const allocation = {
      needs: monthlyIncome * 0.6,
      wants: monthlyIncome * 0.2,
      savings: monthlyIncome * 0.2,
    };
    return allocation;
  } else if (budgetRule === 'custom') {
    if (!customBudget) {
      console.warn("Custom budget rule selected but no customBudget provided");
      return { needs: 0, wants: 0, savings: 0 };
    }
    const allocation = {
      needs: monthlyIncome * ((customBudget.needs || 0) / 100),
      wants: monthlyIncome * ((customBudget.wants || 0) / 100),
      savings: monthlyIncome * ((customBudget.savings || 0) / 100),
    };
    return allocation;
  }
  
  console.warn("Unknown budget rule:", budgetRule, "falling back to default");
  return { needs: 0, wants: 0, savings: 0 };
};

export async function generateRecommendations(riskAppetite, allocation) {
  try {
    
    // Enhanced fallback data with realistic prices
    const getFallbackStocks = (riskLevel) => {
      const stocks = {
        Conservative: [
          { symbol: "AAPL", displaySymbol: "AAPL", description: "Apple Inc", currentPrice: 175.23, change: 2.50, changePercent: 1.45 },
          { symbol: "MSFT", displaySymbol: "MSFT", description: "Microsoft Corporation", currentPrice: 345.67, change: -1.20, changePercent: -0.35 },
          { symbol: "JNJ", displaySymbol: "JNJ", description: "Johnson & Johnson", currentPrice: 162.84, change: 0.89, changePercent: 0.55 },
          { symbol: "PG", displaySymbol: "PG", description: "Procter & Gamble Co", currentPrice: 148.92, change: 1.23, changePercent: 0.83 },
          { symbol: "KO", displaySymbol: "KO", description: "Coca-Cola Co", currentPrice: 59.45, change: -0.32, changePercent: -0.54 }
        ],
        Balanced: [
          { symbol: "AAPL", displaySymbol: "AAPL", description: "Apple Inc", currentPrice: 175.23, change: 2.50, changePercent: 1.45 },
          { symbol: "GOOGL", displaySymbol: "GOOGL", description: "Alphabet Inc Class A", currentPrice: 142.87, change: 3.80, changePercent: 2.73 },
          { symbol: "MSFT", displaySymbol: "MSFT", description: "Microsoft Corporation", currentPrice: 345.67, change: -1.20, changePercent: -0.35 },
          { symbol: "AMZN", displaySymbol: "AMZN", description: "Amazon.com Inc", currentPrice: 156.92, change: 4.12, changePercent: 2.70 },
          { symbol: "TSLA", displaySymbol: "TSLA", description: "Tesla Inc", currentPrice: 248.50, change: 8.30, changePercent: 3.46 },
          { symbol: "NVDA", displaySymbol: "NVDA", description: "NVIDIA Corporation", currentPrice: 825.43, change: 15.67, changePercent: 1.94 },
          { symbol: "META", displaySymbol: "META", description: "Meta Platforms Inc", currentPrice: 425.18, change: -2.45, changePercent: -0.57 },
          { symbol: "V", displaySymbol: "V", description: "Visa Inc", currentPrice: 264.75, change: 1.85, changePercent: 0.70 }
        ],
        Aggressive: [
          { symbol: "TSLA", displaySymbol: "TSLA", description: "Tesla Inc", currentPrice: 248.50, change: 8.30, changePercent: 3.46 },
          { symbol: "NVDA", displaySymbol: "NVDA", description: "NVIDIA Corporation", currentPrice: 825.43, change: 15.67, changePercent: 1.94 },
          { symbol: "AMD", displaySymbol: "AMD", description: "Advanced Micro Devices", currentPrice: 142.33, change: 6.89, changePercent: 5.08 },
          { symbol: "NFLX", displaySymbol: "NFLX", description: "Netflix Inc", currentPrice: 487.21, change: 12.45, changePercent: 2.62 },
          { symbol: "SHOP", displaySymbol: "SHOP", description: "Shopify Inc", currentPrice: 78.92, change: 3.45, changePercent: 4.57 },
          { symbol: "SQ", displaySymbol: "SQ", description: "Block Inc", currentPrice: 68.44, change: 2.89, changePercent: 4.41 },
          { symbol: "ROKU", displaySymbol: "ROKU", description: "Roku Inc", currentPrice: 65.23, change: 4.12, changePercent: 6.74 },
          { symbol: "PLTR", displaySymbol: "PLTR", description: "Palantir Technologies", currentPrice: 23.87, change: 1.23, changePercent: 5.44 },
          { symbol: "COIN", displaySymbol: "COIN", description: "Coinbase Global Inc", currentPrice: 198.76, change: 8.94, changePercent: 4.71 },
          { symbol: "RBLX", displaySymbol: "RBLX", description: "Roblox Corporation", currentPrice: 45.67, change: 2.34, changePercent: 5.40 }
        ]
      };
      return stocks[riskLevel] || stocks.Balanced;
    };

    const fallbackRecommendations = {
      stocks: getFallbackStocks(riskAppetite),
      mutualFunds: generateMutualFundRecommendations(riskAppetite),
      bonds: generateBondRecommendations(riskAppetite),
    };

    // Try to fetch real data from API
    try {
      const symbolList = await fetchStockSymbols(20);

      if (!symbolList || symbolList.length === 0) {
        return fallbackRecommendations;
      }

      // Filter symbols based on risk appetite
      let recommendedStocks = [];
      
      if (riskAppetite === 'Conservative') {
        // Pick stable, large-cap stocks
        recommendedStocks = symbolList
          .filter(stock => stock.description && (
            stock.description.includes('Inc') || 
            stock.description.includes('Corp') ||
            stock.description.includes('Company')
          ))
          .slice(0, 5);
      } else if (riskAppetite === 'Balanced') {
        // Mix of growth and stable stocks
        recommendedStocks = symbolList.slice(0, 8);
      } else if (riskAppetite === 'Aggressive') {
        // Include more growth stocks
        recommendedStocks = symbolList.slice(0, 10);
      }

      // If no recommended stocks from API, use fallback
      if (recommendedStocks.length === 0) {
        return fallbackRecommendations;
      }

      // Fetch quotes for recommended stocks with timeout
      const fetchWithTimeout = (promise, timeout = 5000) => {
        return Promise.race([
          promise,
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('API Timeout')), timeout)
          )
        ]);
      };

      const stocksWithQuotes = await Promise.all(
        recommendedStocks.map(async (stock, index) => {
          try {
            const quote = await fetchWithTimeout(fetchStockQuote(stock.symbol));
            
            // Validate quote data
            const currentPrice = quote?.c > 0 ? quote.c : null;
            const change = quote?.d || 0;
            const changePercent = quote?.dp || 0;

            // If API data is invalid, use fallback for this stock
            if (!currentPrice) {
              const fallbackStock = fallbackRecommendations.stocks[index % fallbackRecommendations.stocks.length];
              return {
                ...stock,
                currentPrice: fallbackStock.currentPrice,
                change: fallbackStock.change,
                changePercent: fallbackStock.changePercent,
              };
            }

            return {
              ...stock,
              currentPrice,
              change,
              changePercent,
            };
          } catch (error) {
            console.error(`Error fetching quote for ${stock.symbol}:`, error);
            // Use fallback data for this specific stock
            const fallbackStock = fallbackRecommendations.stocks[index % fallbackRecommendations.stocks.length];
            return {
              ...stock,
              currentPrice: fallbackStock.currentPrice,
              change: fallbackStock.change,
              changePercent: fallbackStock.changePercent,
            };
          }
        })
      );

      return {
        stocks: stocksWithQuotes,
        mutualFunds: generateMutualFundRecommendations(riskAppetite),
        bonds: generateBondRecommendations(riskAppetite),
      };

    } catch (apiError) {
      console.error("API Error, using fallback recommendations:", apiError);
      return fallbackRecommendations;
    }

  } catch (error) {
    console.error("Error generating recommendations:", error);
    // Final fallback with basic stock data
    return {
      stocks: [
        { symbol: "AAPL", displaySymbol: "AAPL", description: "Apple Inc", currentPrice: 175.23, change: 2.50, changePercent: 1.45 },
        { symbol: "MSFT", displaySymbol: "MSFT", description: "Microsoft Corporation", currentPrice: 345.67, change: -1.20, changePercent: -0.35 },
        { symbol: "GOOGL", displaySymbol: "GOOGL", description: "Alphabet Inc", currentPrice: 142.87, change: 3.80, changePercent: 2.73 }
      ],
      mutualFunds: generateMutualFundRecommendations(riskAppetite),
      bonds: generateBondRecommendations(riskAppetite),
    };
  }
}

function generateMutualFundRecommendations(riskAppetite) {
  const mutualFunds = {
    Conservative: [
      { name: "HDFC Balanced Advantage Fund", category: "Balanced", expectedReturn: "8-10%" },
      { name: "ICICI Prudential Balanced Advantage Fund", category: "Balanced", expectedReturn: "8-10%" },
      { name: "Aditya Birla SL Balanced Advantage Fund", category: "Balanced", expectedReturn: "7-9%" },
    ],
    Balanced: [
      { name: "HDFC Flexi Cap Fund", category: "Equity", expectedReturn: "10-12%" },
      { name: "Parag Parikh Flexi Cap Fund", category: "Equity", expectedReturn: "11-13%" },
      { name: "ICICI Prudential Bluechip Fund", category: "Large Cap", expectedReturn: "9-11%" },
      { name: "SBI Small Cap Fund", category: "Small Cap", expectedReturn: "12-15%" },
    ],
    Aggressive: [
      { name: "Parag Parikh Flexi Cap Fund", category: "Equity", expectedReturn: "12-15%" },
      { name: "SBI Small Cap Fund", category: "Small Cap", expectedReturn: "15-18%" },
      { name: "HDFC Mid-Cap Opportunities Fund", category: "Mid Cap", expectedReturn: "13-16%" },
      { name: "Axis Growth Opportunities Fund", category: "Multi Cap", expectedReturn: "12-15%" },
      { name: "DSP Emerging Markets Fund", category: "International", expectedReturn: "10-14%" },
    ],
  };

  return mutualFunds[riskAppetite] || mutualFunds.Balanced;
}

function generateBondRecommendations(riskAppetite) {
  const bonds = {
    Conservative: [
      { name: "Government of India Bonds", yield: "6-7%", duration: "10-30 years", rating: "AAA" },
      { name: "State Development Loans", yield: "6.5-7.5%", duration: "5-15 years", rating: "AA+" },
      { name: "HDFC Bank Bonds", yield: "7-8%", duration: "3-7 years", rating: "AAA" },
    ],
    Balanced: [
      { name: "Corporate Bonds (AAA rated)", yield: "7.5-8.5%", duration: "3-10 years", rating: "AAA" },
      { name: "Tax-free Bonds", yield: "5.5-6.5%", duration: "10-20 years", rating: "AAA" },
      { name: "Infrastructure Bonds", yield: "8-9%", duration: "5-15 years", rating: "AA+" },
    ],
    Aggressive: [
      { name: "High-yield Corporate Bonds", yield: "9-11%", duration: "3-8 years", rating: "AA" },
      { name: "Convertible Bonds", yield: "7-9%", duration: "3-7 years", rating: "AA+" },
      { name: "Infrastructure Bonds", yield: "8.5-10%", duration: "5-12 years", rating: "AA" },
    ],
  };

  return bonds[riskAppetite] || bonds.Balanced;
}
