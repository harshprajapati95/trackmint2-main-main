import axios from 'axios';

// Create axios instance with base configuration
const baseURL = import.meta.env.VITE_API_URL || (
  import.meta.env.DEV ? 'http://localhost:3001/api' : '/api'
);

console.log('🌐 API Base URL:', baseURL);
console.log('🔧 Environment Variables:', {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  DEV: import.meta.env.DEV,
  MODE: import.meta.env.MODE
});

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle responses and token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Auth API methods
export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await api.put('/auth/change-password', passwordData);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  }
};

// Expenses API methods
export const expensesAPI = {
  getExpenses: async (params = {}) => {
    const response = await api.get('/expenses', { params });
    return response.data;
  },

  getExpenseById: async (id) => {
    const response = await api.get(`/expenses/${id}`);
    return response.data;
  },

  createExpense: async (expenseData) => {
    const response = await api.post('/expenses', expenseData);
    return response.data;
  },

  updateExpense: async (id, expenseData) => {
    const response = await api.put(`/expenses/${id}`, expenseData);
    return response.data;
  },

  deleteExpense: async (id) => {
    const response = await api.delete(`/expenses/${id}`);
    return response.data;
  },

  getExpenseStats: async (period = 'month') => {
    const response = await api.get('/expenses/stats', { params: { period } });
    return response.data;
  }
};

// Goals API methods
export const goalsAPI = {
  getGoals: async (params = {}) => {
    const response = await api.get('/goals', { params });
    return response.data;
  },

  getGoalById: async (id) => {
    const response = await api.get(`/goals/${id}`);
    return response.data;
  },

  createGoal: async (goalData) => {
    const response = await api.post('/goals', goalData);
    return response.data;
  },

  updateGoal: async (id, goalData) => {
    const response = await api.put(`/goals/${id}`, goalData);
    return response.data;
  },

  deleteGoal: async (id) => {
    const response = await api.delete(`/goals/${id}`);
    return response.data;
  },

  addContribution: async (id, contributionData) => {
    const response = await api.post(`/goals/${id}/contribute`, contributionData);
    return response.data;
  },

  getGoalStats: async () => {
    const response = await api.get('/goals/stats');
    return response.data;
  }
};

// Portfolio API methods
export const portfolioAPI = {
  getPortfolio: async (includeWatchlist = false) => {
    const response = await api.get('/portfolio', { params: { includeWatchlist } });
    return response.data;
  },

  getPortfolioItem: async (id) => {
    const response = await api.get(`/portfolio/${id}`);
    return response.data;
  },

  addToPortfolio: async (portfolioData) => {
    const response = await api.post('/portfolio', portfolioData);
    return response.data;
  },

  updatePortfolioItem: async (id, portfolioData) => {
    const response = await api.put(`/portfolio/${id}`, portfolioData);
    return response.data;
  },

  removeFromPortfolio: async (id) => {
    const response = await api.delete(`/portfolio/${id}`);
    return response.data;
  },

  addTransaction: async (id, transactionData) => {
    const response = await api.post(`/portfolio/${id}/transaction`, transactionData);
    return response.data;
  },

  updatePrice: async (id, currentPrice) => {
    const response = await api.put(`/portfolio/${id}/price`, { currentPrice });
    return response.data;
  },

  getPortfolioStats: async () => {
    const response = await api.get('/portfolio/stats');
    return response.data;
  },

  getWatchlist: async () => {
    const response = await api.get('/portfolio/watchlist');
    return response.data;
  },

  toggleWatchlist: async (id) => {
    const response = await api.put(`/portfolio/${id}/watchlist`);
    return response.data;
  }
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw new Error('API health check failed');
  }
};

// Default export for the axios instance
export default api;