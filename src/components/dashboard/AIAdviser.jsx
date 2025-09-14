import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader, TrendingUp, DollarSign, CheckCircle, AlertCircle, Lightbulb } from 'lucide-react';
import { askGeminiAdvice } from '../../api/gemini';
import { fetchStockQuote } from '../../api/finnhub';

const AIAdviser = ({ userData }) => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Welcome message
        const welcomeMessage = {
            id: Date.now(),
            type: 'bot',
            content: `👋 Hello! I'm your AI Financial Advisor powered by Gemini AI. I can help you with:\n\n• Investment advice based on your risk profile\n• Budget optimization tips\n• Market analysis and stock insights\n• Financial goal planning\n• Personal finance questions\n\nFeel free to ask me anything about your finances!`,
            timestamp: new Date()
        };
        setMessages([welcomeMessage]);
    }, []);

    const extractStockSymbols = (text) => {
        const stockPattern = /\b[A-Z]{1,5}\b/g;
        const matches = text.match(stockPattern) || [];
        return matches.filter(symbol => symbol.length <= 5);
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: inputMessage,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            // Check if user is asking about specific stocks
            const stockSymbols = extractStockSymbols(inputMessage);
            let stockData = null;

            if (stockSymbols.length > 0) {
                try {
                    const stockQuotes = await Promise.all(
                        stockSymbols.map(async (symbol) => {
                            const quote = await fetchStockQuote(symbol);
                            return { symbol, ...quote };
                        })
                    );
                    stockData = stockQuotes;
                } catch (error) {
                    console.log('Could not fetch stock data:', error);
                }
            }

            const aiResponse = await askGeminiAdvice(inputMessage, userData, stockData);
            
            // Extract text from Gemini response
            let responseText = '';
            if (aiResponse?.candidates?.[0]?.content?.parts?.[0]?.text) {
                responseText = aiResponse.candidates[0].content.parts[0].text;
            } else if (typeof aiResponse === 'string') {
                responseText = aiResponse;
            } else {
                responseText = 'I received your question but had trouble processing it. Could you try rephrasing?';
            }

            const botMessage = {
                id: Date.now() + 1,
                type: 'bot',
                content: responseText,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('AI Adviser error:', error);
            const errorMessage = {
                id: Date.now() + 1,
                type: 'bot',
                content: 'I apologize, but I encountered an error while processing your request. Please try again or ask a different question.',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const quickQuestions = [
        "How should I diversify my portfolio?",
        "What's a good emergency fund amount?",
        "Should I invest in mutual funds or stocks?",
        "How can I reduce my expenses?",
        "What's the best way to save for retirement?"
    ];

    const handleQuickQuestion = (question) => {
        setInputMessage(question);
    };

    return (
        <div className="h-full flex flex-col bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 md:p-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                        <Bot size={24} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg md:text-xl font-bold">AI Financial Advisor</h2>
                        <p className="text-blue-100 text-sm">Powered by Gemini AI</p>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 max-h-[500px] md:max-h-[600px]">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        {message.type === 'bot' && (
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <Bot size={16} className="text-white" />
                            </div>
                        )}
                        <div
                            className={`max-w-[80%] p-3 md:p-4 rounded-2xl ${
                                message.type === 'user'
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white ml-auto'
                                    : 'bg-slate-50 text-slate-800'
                            }`}
                        >
                            <div className="whitespace-pre-wrap text-sm md:text-base">
                                {message.content}
                            </div>
                            <div className={`text-xs mt-2 ${
                                message.type === 'user' ? 'text-blue-100' : 'text-slate-500'
                            }`}>
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                        {message.type === 'user' && (
                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <User size={16} className="text-white" />
                            </div>
                        )}
                    </div>
                ))}
                
                {isLoading && (
                    <div className="flex gap-3 justify-start">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <Bot size={16} className="text-white" />
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl">
                            <div className="flex items-center gap-2">
                                <Loader size={16} className="animate-spin text-blue-600" />
                                <span className="text-slate-600 text-sm">Thinking...</span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {messages.length <= 1 && (
                <div className="p-4 border-t border-slate-200">
                    <p className="text-sm text-slate-600 mb-3">Quick questions to get started:</p>
                    <div className="flex flex-wrap gap-2">
                        {quickQuestions.map((question, index) => (
                            <button
                                key={index}
                                onClick={() => handleQuickQuestion(question)}
                                className="text-xs md:text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg transition-colors duration-200"
                            >
                                {question}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Input */}
            <div className="p-4 md:p-6 border-t border-slate-200 bg-white/50">
                <div className="flex gap-3">
                    <textarea
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask me about your finances, investments, or financial planning..."
                        className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={1}
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={isLoading || !inputMessage.trim()}
                        className="px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={20} />
                    </button>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                    💡 Tip: Ask about specific stocks, investment strategies, or your financial goals for personalized advice.
                </p>
            </div>
        </div>
    );
};

export default AIAdviser;
