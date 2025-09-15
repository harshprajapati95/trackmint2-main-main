import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader, TrendingUp, DollarSign, CheckCircle, AlertCircle, Lightbulb, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { askGeminiAdvice } from '../../api/gemini';
import { fetchStockQuote } from '../../api/finnhub';
import { expensesAPI, goalsAPI, portfolioAPI } from '../../api/client';

const AIAdviser = ({ userData }) => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voiceEnabled, setVoiceEnabled] = useState(false);
    const [userFinancialData, setUserFinancialData] = useState(null);
    const [lastInputMethod, setLastInputMethod] = useState('text'); // 'text' or 'voice'
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);
    const speechSynthesisRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Fetch user financial data for personalized advice
    const fetchUserFinancialData = async () => {
        try {
            const [expenseStats, goalStats, portfolioStats, recentExpenses, goals, portfolio] = await Promise.all([
                expensesAPI.getExpenseStats('month'),
                goalsAPI.getGoalStats(),
                portfolioAPI.getPortfolioStats(),
                expensesAPI.getExpenses({ limit: 10 }),
                goalsAPI.getGoals(),
                portfolioAPI.getPortfolio(true)
            ]);

            setUserFinancialData({
                expenseStats: expenseStats.data,
                goalStats: goalStats.data,
                portfolioStats: portfolioStats.data,
                recentExpenses: recentExpenses.data,
                goals: goals.data,
                portfolio: portfolio.data
            });
        } catch (error) {
            console.error('Error fetching user financial data:', error);
            // Continue without user data - AI can still provide general advice
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Check if browser supports speech recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';
            recognitionRef.current.maxAlternatives = 1;

            recognitionRef.current.onstart = () => {
                setIsListening(true);
            };

            recognitionRef.current.onresult = (event) => {
                if (event.results.length > 0) {
                    const transcript = event.results[0][0].transcript;
                    setInputMessage(transcript);
                    setLastInputMethod('voice'); // Track that this was voice input
                }
                setIsListening(false);
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
                
                // Handle different types of errors
                let errorMessage = '';
                switch (event.error) {
                    case 'network':
                        errorMessage = 'Network error: Please check your internet connection and try again.';
                        break;
                    case 'not-allowed':
                        errorMessage = 'Microphone access denied. Please allow microphone permissions in your browser settings.';
                        break;
                    case 'no-speech':
                        errorMessage = 'No speech detected. Please try speaking again.';
                        break;
                    case 'aborted':
                        // Don't show error for user-initiated stops
                        return;
                    default:
                        errorMessage = 'Speech recognition error. Please try again or use text input.';
                }
                
                // Show error message briefly
                if (errorMessage) {
                    setTimeout(() => {
                        alert(errorMessage);
                    }, 100);
                }
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };

            setVoiceEnabled(true);
        } else {
            console.log('Speech recognition not supported in this browser');
            setVoiceEnabled(false);
        }

        // Check if browser supports speech synthesis
        if ('speechSynthesis' in window) {
            speechSynthesisRef.current = window.speechSynthesis;
        }

        // Welcome message
        const welcomeMessage = {
            id: Date.now(),
            type: 'bot',
            content: `👋 Hello! I'm your AI Financial Advisor powered by Gemini AI. I can help you with:\n\n• Investment advice based on your risk profile\n• Budget optimization tips\n• Market analysis and stock insights\n• Financial goal planning\n• Personal finance questions\n\n${voiceEnabled ? '🎤 Voice chat is available! Click "Voice On" to enable speaking and listening features. Then use the microphone button to speak your questions.' : '📝 Voice chat is not available in your browser, but you can still type your questions and I\'ll provide detailed financial advice.'}\n\n🔍 I'm now fetching your financial data to provide personalized advice...\n\nFeel free to ask me anything about your finances!`,
            timestamp: new Date()
        };
        setMessages([welcomeMessage]);

        // Fetch user financial data for personalized advice
        fetchUserFinancialData();

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            if (speechSynthesisRef.current) {
                speechSynthesisRef.current.cancel();
            }
        };
    }, [voiceEnabled]);

    const extractStockSymbols = (text) => {
        const stockPattern = /\b[A-Z]{1,5}\b/g;
        const matches = text.match(stockPattern) || [];
        return matches.filter(symbol => symbol.length <= 5);
    };

    const speakText = (text) => {
        if (speechSynthesisRef.current && text) {
            // Cancel any ongoing speech
            speechSynthesisRef.current.cancel();
            
            // Clean text for better speech
            const cleanText = text
                .replace(/[#*`]/g, '') // Remove markdown
                .replace(/\n\n/g, '. ') // Replace double newlines with periods
                .replace(/\n/g, ' ') // Replace newlines with spaces
                .replace(/•/g, '') // Remove bullet points
                .trim();

            const utterance = new SpeechSynthesisUtterance(cleanText);
            utterance.rate = 0.9;
            utterance.pitch = 1.0;
            utterance.volume = 0.8;

            utterance.onstart = () => {
                setIsSpeaking(true);
            };

            utterance.onend = () => {
                setIsSpeaking(false);
            };

            utterance.onerror = () => {
                setIsSpeaking(false);
            };

            speechSynthesisRef.current.speak(utterance);
        }
    };

    const stopSpeaking = () => {
        if (speechSynthesisRef.current) {
            speechSynthesisRef.current.cancel();
            setIsSpeaking(false);
        }
    };

    const startListening = () => {
        if (recognitionRef.current && !isListening) {
            try {
                // Start recognition directly without requesting media permissions
                // The browser will handle permission requests automatically
                recognitionRef.current.start();
                setIsListening(true);
            } catch (error) {
                console.error('Speech recognition error:', error);
                setIsListening(false);
                
                // Handle specific error cases
                if (error.name === 'InvalidStateError') {
                    // Recognition is already running, stop and restart
                    recognitionRef.current.stop();
                    setTimeout(() => {
                        try {
                            recognitionRef.current.start();
                            setIsListening(true);
                        } catch (retryError) {
                            console.error('Retry failed:', retryError);
                            alert('Unable to start voice recognition. Please try again or use text input.');
                        }
                    }, 100);
                } else {
                    alert('Speech recognition is not available. Please use text input instead.');
                }
            }
        }
    };

    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    };

    const toggleVoice = () => {
        setVoiceEnabled(!voiceEnabled);
        if (isSpeaking) {
            stopSpeaking();
        }
        if (isListening) {
            stopListening();
        }
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        // Remember the input method for this message
        const currentInputMethod = lastInputMethod;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: inputMessage,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);
        
        // Reset input method to text for next message
        setLastInputMethod('text');

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

            // Combine userData with financial data for comprehensive AI advice
            const enhancedUserData = {
                ...userData,
                financialData: userFinancialData
            };

            const aiResponse = await askGeminiAdvice(inputMessage, enhancedUserData, stockData);
            
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
            
            // Only speak the bot response if the user used voice input and voice is enabled
            if (voiceEnabled && responseText && currentInputMethod === 'voice') {
                speakText(responseText);
            }
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
            setLastInputMethod('text'); // Mark as text input
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
        setLastInputMethod('text'); // Mark as text input
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
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 max-h-[500px] md:max-h-[600px] bg-gradient-to-b from-blue-50/30 to-white/50">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        {message.type === 'bot' && (
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                                <Bot size={18} className="text-white" />
                            </div>
                        )}
                        <div
                            className={`max-w-[85%] p-4 md:p-5 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl ${
                                message.type === 'user'
                                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white ml-auto'
                                    : 'bg-white border-2 border-blue-200 text-slate-800 relative animate-fade-in'
                            }`}
                        >
                            {message.type === 'bot' && (
                                <div className="absolute -top-2 -left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-md">
                                    AI Financial Advisor
                                </div>
                            )}
                            <div className={`whitespace-pre-wrap leading-relaxed ${
                                message.type === 'bot' 
                                    ? 'text-base md:text-lg font-medium text-slate-800 mt-2' 
                                    : 'text-sm md:text-base'
                            }`}>
                                {message.content}
                            </div>
                            <div className={`text-xs mt-3 flex items-center gap-2 ${
                                message.type === 'user' ? 'text-emerald-100' : 'text-slate-500'
                            }`}>
                                {message.type === 'bot' && (
                                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                                        ✨ Powered by Gemini AI
                                    </span>
                                )}
                                <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>
                        {message.type === 'user' && (
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                                <User size={18} className="text-white" />
                            </div>
                        )}
                    </div>
                ))}
                
                {isLoading && (
                    <div className="flex gap-3 justify-start">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                            <Bot size={18} className="text-white" />
                        </div>
                        <div className="bg-white border-2 border-blue-100 p-5 rounded-2xl shadow-lg">
                            <div className="flex items-center gap-3">
                                <Loader size={20} className="animate-spin text-blue-600" />
                                <span className="text-slate-700 font-medium">AI is analyzing your question...</span>
                            </div>
                            <div className="mt-2">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                </div>
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
                {/* Voice Controls */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleVoice}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                                voiceEnabled 
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg hover:shadow-xl' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {voiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                            Voice {voiceEnabled ? 'On' : 'Off'}
                        </button>
                        
                        {voiceEnabled && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={isListening ? stopListening : startListening}
                                    className={`p-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg ${
                                        isListening
                                            ? 'bg-gradient-to-r from-red-500 to-red-600 text-white animate-pulse'
                                            : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
                                    }`}
                                    title={isListening ? 'Stop listening' : 'Start voice input'}
                                >
                                    {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                                </button>
                                
                                {isSpeaking && (
                                    <button
                                        onClick={stopSpeaking}
                                        className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg"
                                        title="Stop speaking"
                                    >
                                        <VolumeX size={20} />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                    
                    {isListening && (
                        <div className="flex items-center gap-2 text-sm font-medium text-red-600 bg-red-50 px-3 py-1 rounded-full">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            Listening...
                        </div>
                    )}
                    
                    {isSpeaking && (
                        <div className="flex items-center gap-2 text-sm font-medium text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                            Speaking...
                        </div>
                    )}
                </div>

                <div className="flex gap-3">
                    <textarea
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={voiceEnabled ? "Type your question or click the microphone to speak..." : "Ask me about your finances, investments, or financial planning..."}
                        className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={2}
                        disabled={isLoading}
                    />
                    <button
                        onClick={() => {
                            setLastInputMethod('text'); // Mark as text input
                            handleSendMessage();
                        }}
                        disabled={isLoading || !inputMessage.trim()}
                        className="px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={20} />
                    </button>
                </div>
                
                <div className="mt-3 text-xs text-slate-500">
                    <div className="flex flex-wrap items-center gap-4">
                        <span>💡 Ask about stocks, investments, or financial planning</span>
                        {voiceEnabled && (
                            <span className="flex items-center gap-1 text-blue-600 font-medium">
                                🎤 Voice chat is active - click the blue microphone to speak!
                            </span>
                        )}
                        {!voiceEnabled && (
                            <span className="text-gray-500">
                                🔊 Enable voice for hands-free chat
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIAdviser;
