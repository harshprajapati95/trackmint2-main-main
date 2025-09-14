import React, { createContext, useContext, useState, useEffect } from 'react';

// Create Budget Context
const BudgetContext = createContext();

// Budget storage key
const BUDGET_STORAGE_KEY = 'trackMint_budgetTracking';

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};

export const BudgetProvider = ({ children, userData }) => {
  const [budgetBalance, setBudgetBalance] = useState(() => {
    // Load from localStorage or initialize
    const saved = localStorage.getItem(BUDGET_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    
    // Calculate initial allocation from userData
    const monthlyIncome = userData?.income?.monthly || 0;
    return {
      needs: {
        allocated: 0,
        spent: 0,
        remaining: 0
      },
      wants: {
        allocated: 0,
        spent: 0,
        remaining: 0
      },
      savings: {
        allocated: 0,
        invested: 0,
        remaining: 0
      },
      lastReset: new Date().getMonth(), // Track month for monthly reset
    };
  });

  // Calculate budget allocation based on user's rules
  const calculateBudgetAllocation = () => {
    if (!userData?.income?.monthly) return { needs: 0, wants: 0, savings: 0 };

    const monthlyIncome = userData.income.monthly;
    
    if (userData.budgetRule === '50-30-20') {
      return {
        needs: monthlyIncome * 0.5,
        wants: monthlyIncome * 0.3,
        savings: monthlyIncome * 0.2,
      };
    } else if (userData.budgetRule === '60-20-20') {
      return {
        needs: monthlyIncome * 0.6,
        wants: monthlyIncome * 0.2,
        savings: monthlyIncome * 0.2,
      };
    } else if (userData.budgetRule === 'custom' && userData.customBudget) {
      return {
        needs: monthlyIncome * (userData.customBudget.needs / 100),
        wants: monthlyIncome * (userData.customBudget.wants / 100),
        savings: monthlyIncome * (userData.customBudget.savings / 100),
      };
    }
    
    return { needs: 0, wants: 0, savings: 0 };
  };

  // Reset budget monthly
  const resetBudgetIfNewMonth = () => {
    const currentMonth = new Date().getMonth();
    if (budgetBalance.lastReset !== currentMonth) {
      const allocation = calculateBudgetAllocation();
      setBudgetBalance({
        needs: {
          allocated: allocation.needs,
          spent: 0,
          remaining: allocation.needs
        },
        wants: {
          allocated: allocation.wants,
          spent: 0,
          remaining: allocation.wants
        },
        savings: {
          allocated: allocation.savings,
          invested: 0,
          remaining: allocation.savings
        },
        lastReset: currentMonth,
      });
    }
  };

  // Initialize or update budget allocation when userData changes
  useEffect(() => {
    resetBudgetIfNewMonth();
    
    const allocation = calculateBudgetAllocation();
    setBudgetBalance(prev => ({
      ...prev,
      needs: {
        ...prev.needs,
        allocated: allocation.needs,
        remaining: allocation.needs - prev.needs.spent
      },
      wants: {
        ...prev.wants,
        allocated: allocation.wants,
        remaining: allocation.wants - prev.wants.spent
      },
      savings: {
        ...prev.savings,
        allocated: allocation.savings,
        remaining: allocation.savings - prev.savings.invested
      }
    }));
  }, [userData]);

  // Save to localStorage whenever budget changes
  useEffect(() => {
    localStorage.setItem(BUDGET_STORAGE_KEY, JSON.stringify(budgetBalance));
  }, [budgetBalance]);

  // Add expense and reduce from appropriate budget
  const addExpense = (amount, category) => {
    setBudgetBalance(prev => {
      const newBalance = { ...prev };
      
      if (category === 'needs' || category === 'wants') {
        newBalance[category] = {
          ...newBalance[category],
          spent: newBalance[category].spent + amount,
          remaining: newBalance[category].remaining - amount
        };
      }
      
      return newBalance;
    });
  };

  // Remove expense and add back to budget
  const removeExpense = (amount, category) => {
    setBudgetBalance(prev => {
      const newBalance = { ...prev };
      
      if (category === 'needs' || category === 'wants') {
        newBalance[category] = {
          ...newBalance[category],
          spent: Math.max(0, newBalance[category].spent - amount),
          remaining: newBalance[category].remaining + amount
        };
      }
      
      return newBalance;
    });
  };

  // Add investment and reduce from savings
  const addInvestment = (amount) => {
    setBudgetBalance(prev => ({
      ...prev,
      savings: {
        ...prev.savings,
        invested: prev.savings.invested + amount,
        remaining: prev.savings.remaining - amount
      }
    }));
  };

  // Remove investment and add back to savings
  const removeInvestment = (amount) => {
    setBudgetBalance(prev => ({
      ...prev,
      savings: {
        ...prev.savings,
        invested: Math.max(0, prev.savings.invested - amount),
        remaining: prev.savings.remaining + amount
      }
    }));
  };

  // Get current budget status
  const getBudgetStatus = () => {
    const allocation = calculateBudgetAllocation();
    
    return {
      needs: {
        allocated: allocation.needs,
        spent: budgetBalance.needs.spent,
        remaining: budgetBalance.needs.remaining,
        percentage: allocation.needs > 0 ? (budgetBalance.needs.spent / allocation.needs) * 100 : 0
      },
      wants: {
        allocated: allocation.wants,
        spent: budgetBalance.wants.spent,
        remaining: budgetBalance.wants.remaining,
        percentage: allocation.wants > 0 ? (budgetBalance.wants.spent / allocation.wants) * 100 : 0
      },
      savings: {
        allocated: allocation.savings,
        invested: budgetBalance.savings.invested,
        remaining: budgetBalance.savings.remaining,
        percentage: allocation.savings > 0 ? (budgetBalance.savings.invested / allocation.savings) * 100 : 0
      }
    };
  };

  const value = {
    budgetBalance,
    setBudgetBalance,
    addExpense,
    removeExpense,
    addInvestment,
    removeInvestment,
    getBudgetStatus,
    resetBudgetIfNewMonth
  };

  return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>;
};
