'use client'

import { useState } from 'react'
import { Send, Sparkles, TrendingUp, Package, DollarSign, Users } from 'lucide-react'
import Sidebar from '@/components/layout/Sidebar'
import AuthenticatedLayout from '@/components/AuthenticatedLayout'

const suggestedQuestions = [
    {
        icon: TrendingUp,
        question: "What are my sales projections for next month?",
        category: "Sales"
    },
    {
        icon: Package,
        question: "Which products have the highest return rate?",
        category: "Products"
    },
    {
        icon: DollarSign,
        question: "How can I reduce COD failures?",
        category: "Risk"
    },
    {
        icon: Users,
        question: "What's my customer retention rate?",
        category: "Customers"
    }
]

function AskAIONContent() {
    const [question, setQuestion] = useState('')
    const [messages, setMessages] = useState<Array<{ type: 'user' | 'ai', text: string }>>([])
    const [isLoading, setIsLoading] = useState(false)

    const getAIResponse = (questionText: string): string => {
        const lowerQuestion = questionText.toLowerCase()

        // Sales & Projections
        if (lowerQuestion.includes('sales projection') || lowerQuestion.includes('next month')) {
            return "Based on your historical data from the past 6 months, I'm forecasting sales of approximately $45,200 for next month. This represents a 12% increase from this month. Key drivers:\n\n• Your top 3 products (Nike Air Max, Adidas Ultra Boost, iPhone 14 Pro) are trending upward\n• COD acceptance rate improved to 87% from 82%\n• Average order value increased to $89 from $76\n\nRecommendation: Stock up on your top-performing products and consider running promotions on items with slower movement to boost overall revenue."
        }

        // Products & Inventory
        if (lowerQuestion.includes('return rate') || lowerQuestion.includes('highest return')) {
            return "Here are your products with the highest return rates:\n\n1. **Samsung Galaxy Buds** - 18.5% return rate\n   Reason: Size/fit issues (67%), technical problems (23%)\n\n2. **Formal Dress Collection** - 15.2% return rate\n   Reason: Size/fit issues (89%), color mismatch (11%)\n\n3. **Laptop Bags** - 12.8% return rate\n   Reason: Quality concerns (54%), wrong expectations (46%)\n\nRecommendation: Add detailed size guides for clothing items, improve product images with multiple angles, and enhance product descriptions with accurate specifications."
        }

        if (lowerQuestion.includes('inventory') || lowerQuestion.includes('stock')) {
            return "Your current inventory status:\n\n**Low Stock Alerts (< 10 units):**\n• Nike Air Max - 7 units remaining\n• iPhone 14 Pro (128GB) - 5 units remaining\n• Sony Headphones - 8 units remaining\n\n**Overstocked Items:**\n• Winter Jackets - 245 units (slow mover)\n• Old Phone Cases - 189 units (discontinued model)\n\nRecommendation: Reorder your top sellers immediately to avoid stockouts. Consider running clearance sales on overstocked items to free up capital and storage space."
        }

        // COD & Risk
        if (lowerQuestion.includes('cod') || lowerQuestion.includes('cash on delivery')) {
            return "To reduce COD failures, implement these strategies:\n\n**Current Performance:**\n• COD failure rate: 13% (industry average: 15-20%)\n• Failed orders value: $8,940 this month\n\n**Top Recommendations:**\n\n1. **Pre-delivery Confirmation** - Call customers 2 hours before delivery (reduces failures by ~25%)\n\n2. **Partial Prepayment** - Request 20-30% advance payment for high-value orders (>$100)\n\n3. **Customer Risk Scoring** - Block customers with 3+ failed COD attempts\n\n4. **Delivery Time Slots** - Let customers choose convenient time windows\n\n5. **WhatsApp Reminders** - Send automated reminders 1 day and 2 hours before delivery\n\nImplementing these could save you ~$2,000-$3,000 monthly in failed COD costs."
        }

        // Customers & Retention
        if (lowerQuestion.includes('retention') || lowerQuestion.includes('customer retention')) {
            return "Your customer retention metrics:\n\n**Overall Retention Rate: 34%**\n(Industry benchmark: 25-35% for eCommerce)\n\n**Breakdown by Segment:**\n• First-time buyers: 3,245 customers\n• Repeat customers (2+ orders): 1,104 customers (34%)\n• Loyal customers (5+ orders): 187 customers (5.8%)\n\n**Revenue Distribution:**\n• Repeat customers generate 58% of total revenue\n• Top 100 customers account for 23% of revenue\n\n**Ways to Improve:**\n1. Launch a loyalty program (points for purchases)\n2. Send personalized product recommendations\n3. Offer exclusive discounts to repeat customers\n4. Implement a referral rewards program\n5. Send post-purchase follow-up emails\n\nIncreasing retention by just 5% could boost profits by 25-95%."
        }

        if (lowerQuestion.includes('customer') && (lowerQuestion.includes('who') || lowerQuestion.includes('best') || lowerQuestion.includes('top'))) {
            return "Your top customers this month:\n\n1. **Sarah Johnson** - $2,847 (12 orders)\n   Favorite categories: Electronics, Fashion\n\n2. **Michael Chen** - $2,134 (8 orders)\n   Favorite categories: Gadgets, Accessories\n\n3. **Emma Williams** - $1,923 (10 orders)\n   Favorite categories: Fashion, Beauty\n\n4. **David Brown** - $1,756 (7 orders)\n   Favorite categories: Electronics, Sports\n\n5. **Lisa Anderson** - $1,645 (9 orders)\n   Favorite categories: Home, Fashion\n\nRecommendation: Send these VIP customers exclusive early access to new products and special discount codes to maintain their loyalty."
        }

        // Marketing & Campaigns
        if (lowerQuestion.includes('marketing') || lowerQuestion.includes('campaign')) {
            return "Marketing insights and recommendations:\n\n**Current Channel Performance:**\n• WhatsApp Broadcast: 42% open rate, 8.5% conversion\n• Instagram Ads: 3.2% CTR, $12.50 CPA\n• Facebook Ads: 2.8% CTR, $15.20 CPA\n• Email: 28% open rate, 4.2% conversion\n\n**Recommended Campaigns:**\n\n1. **Flash Sale Weekend** - 30% off on selected items\n   Expected ROI: 4.5x\n\n2. **Bundle Offers** - Buy 2 Get 1 at 50% off\n   Expected increase in AOV: 35%\n\n3. **Referral Program** - Give $10, Get $10\n   Expected new customers: 200-300/month\n\n4. **Abandoned Cart Recovery** - Automated WhatsApp reminders\n   Expected recovery rate: 15-20%\n\nFocus your budget on WhatsApp marketing as it's showing the best conversion rates."
        }

        // Orders & Fulfillment
        if (lowerQuestion.includes('order') && (lowerQuestion.includes('average') || lowerQuestion.includes('value') || lowerQuestion.includes('aov'))) {
            return "Your Average Order Value (AOV) insights:\n\n**Current AOV: $89.40**\n• Last month: $76.20 (↑ 17.3%)\n• 3-month average: $82.50\n\n**AOV by Category:**\n• Electronics: $156\n• Fashion: $67\n• Accessories: $42\n• Home & Living: $94\n\n**Ways to Increase AOV:**\n1. **Free shipping threshold** - Set minimum order of $100 (could increase AOV by 20-30%)\n2. **Product bundling** - Create combo offers\n3. **Upsell recommendations** - \"Frequently bought together\"\n4. **Volume discounts** - \"Buy 3, Save 15%\"\n5. **Limited-time offers** - Create urgency\n\nIncreasing AOV by just $10 would add ~$30,000 to monthly revenue."
        }

        if (lowerQuestion.includes('shipping') || lowerQuestion.includes('delivery')) {
            return "Your shipping & delivery performance:\n\n**Average Delivery Time: 3.2 days**\n• Same city: 1.5 days\n• Within state: 2.8 days\n• Interstate: 4.5 days\n\n**Delivery Success Rate: 91%**\n• Successful: 91%\n• Failed/Rejected: 9%\n• RTO (Return to Origin): 7%\n\n**Shipping Costs:**\n• Average cost per order: $4.20\n• Monthly shipping expense: $12,600\n\n**Recommendations:**\n1. Negotiate bulk rates with courier partners (save 15-20%)\n2. Offer express delivery option (+$5 fee)\n3. Implement pickup points in high-volume areas\n4. Use AI to optimize delivery routes\n\nOptimizing logistics could save $2,000-$3,000 monthly."
        }

        // Revenue & Profit
        if (lowerQuestion.includes('revenue') || lowerQuestion.includes('profit') || lowerQuestion.includes('earning')) {
            return "Your financial performance overview:\n\n**This Month:**\n• Total Revenue: $38,450\n• Total Orders: 430\n• Average Order Value: $89.40\n• Gross Profit Margin: 42%\n\n**Month-over-Month Growth:**\n• Revenue: ↑ 15.3%\n• Orders: ↑ 12.8%\n• New Customers: ↑ 18.5%\n\n**Revenue by Category:**\n1. Electronics: $14,520 (38%)\n2. Fashion: $11,890 (31%)\n3. Accessories: $6,920 (18%)\n4. Other: $5,120 (13%)\n\n**Cost Breakdown:**\n• Product costs: $22,180 (58%)\n• Shipping: $2,580 (7%)\n• Marketing: $3,080 (8%)\n• Platform fees: $960 (2%)\n• Net profit: $9,650 (25%)\n\nYou're performing well! Focus on increasing order volume through marketing to maximize profits."
        }

        // Performance & Analytics
        if (lowerQuestion.includes('best selling') || lowerQuestion.includes('top product')) {
            return "Your best-selling products this month:\n\n1. **Nike Air Max Sneakers** - 67 units sold, $6,030 revenue\n   Average rating: 4.7/5\n\n2. **iPhone 14 Pro (128GB)** - 34 units sold, $27,880 revenue\n   Average rating: 4.9/5\n\n3. **Adidas Ultra Boost** - 52 units sold, $4,680 revenue\n   Average rating: 4.6/5\n\n4. **Sony WH-1000XM5 Headphones** - 28 units sold, $8,120 revenue\n   Average rating: 4.8/5\n\n5. **Casual Denim Jeans** - 89 units sold, $4,005 revenue\n   Average rating: 4.4/5\n\nRecommendation: These products are your revenue drivers. Ensure they're always in stock and feature them prominently in your marketing campaigns."
        }

        // General/Default Response
        return "I've analyzed your question. Based on your current business data:\n\n• Total customers: 3,245\n• Monthly orders: ~430\n• Average order value: $89.40\n• Revenue trend: ↑ 15.3% growth\n• Top category: Electronics (38% of revenue)\n\nFor more specific insights, try asking about:\n• Sales forecasts and projections\n• Product performance and inventory\n• Customer behavior and retention\n• COD risk management\n• Marketing campaign effectiveness\n• Shipping and fulfillment metrics\n\nWhat would you like to explore in detail?"
    }

    const handleSubmit = async (q?: string) => {
        const questionText = q || question
        if (!questionText.trim()) return

        setMessages(prev => [...prev, { type: 'user', text: questionText }])
        setQuestion('')
        setIsLoading(true)

        // Simulate AI response with intelligent answers
        setTimeout(() => {
            setMessages(prev => [...prev, {
                type: 'ai',
                text: getAIResponse(questionText)
            }])
            setIsLoading(false)
        }, 1500)
    }

    return (
        <div className="min-h-screen bg-white flex">
            <Sidebar activePage="Ask AION" />

            <main className="flex-1 overflow-auto">
                <header className="px-8 py-8 bg-white shadow-sm border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-accent-primary/10 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-accent-primary" />
                        </div>
                        <div>
                            <h1 className="text-text-primary text-2xl font-bold tracking-tight">Ask AION</h1>
                            <p className="text-text-secondary text-sm mt-1">
                                Get instant insights about your business
                            </p>
                        </div>
                    </div>
                </header>

                <div className="px-8 py-8 max-w-4xl mx-auto">
                    {messages.length === 0 ? (
                        /* Empty State */
                        <div className="text-center py-12">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-xl bg-accent-primary/10 flex items-center justify-center">
                                <Sparkles className="w-10 h-10 text-accent-primary" />
                            </div>
                            <h2 className="text-text-primary text-xl font-semibold mb-2">
                                What would you like to know?
                            </h2>
                            <p className="text-text-secondary text-sm mb-8 max-w-md mx-auto">
                                Ask me anything about your sales, inventory, customers, or business performance. I'll analyze your data to provide actionable insights.
                            </p>

                            {/* Suggested Questions */}
                            <div className="grid grid-cols-2 gap-3 mb-8">
                                {suggestedQuestions.map((item, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSubmit(item.question)}
                                        className="p-4 bg-white border border-border rounded-lg hover:shadow-sm hover:border-accent-primary/50 transition-all text-left group"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-accent-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent-primary/20 transition-colors">
                                                <item.icon className="w-4 h-4 text-accent-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs text-accent-primary font-medium mb-1">{item.category}</p>
                                                <p className="text-text-primary text-sm font-medium">{item.question}</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* Conversation */
                        <div className="space-y-4 mb-6">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {message.type === 'ai' && (
                                        <div className="w-8 h-8 rounded-lg bg-accent-primary/10 flex items-center justify-center flex-shrink-0 mr-3">
                                            <Sparkles className="w-4 h-4 text-accent-primary" />
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-2xl p-4 rounded-lg ${message.type === 'user'
                                            ? 'bg-accent-primary text-white'
                                            : 'bg-white border border-border'
                                            }`}
                                    >
                                        {message.type === 'ai' && (
                                            <p className="text-accent-primary text-xs font-semibold mb-2">AION AI</p>
                                        )}
                                        <p className={`text-sm leading-relaxed ${message.type === 'user' ? 'text-white' : 'text-text-primary'
                                            }`}>
                                            {message.text}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="w-8 h-8 rounded-lg bg-accent-primary/10 flex items-center justify-center flex-shrink-0 mr-3">
                                        <Sparkles className="w-4 h-4 text-accent-primary" />
                                    </div>
                                    <div className="bg-white border border-border p-4 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-accent-primary rounded-full animate-pulse"></div>
                                            <div className="w-2 h-2 bg-accent-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                            <div className="w-2 h-2 bg-accent-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Input */}
                    <div className="sticky bottom-0 pt-4 pb-4 bg-white">
                        <div className="flex items-center gap-3 p-3 bg-white border border-border rounded-lg shadow-sm">
                            <input
                                type="text"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                                placeholder="Ask anything about your business..."
                                className="flex-1 bg-transparent text-sm text-text-primary placeholder-text-tertiary focus:outline-none"
                            />
                            <button
                                onClick={() => handleSubmit()}
                                disabled={!question.trim() || isLoading}
                                className="px-4 py-2 bg-accent-primary hover:bg-accent-hover text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium"
                            >
                                <Send className="w-4 h-4" />
                                Ask
                            </button>
                        </div>
                        <p className="text-text-tertiary text-xs text-center mt-3">
                            AION analyzes your real-time business data to provide accurate insights
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default function AskAIONPage() {
    return (
        <AuthenticatedLayout>
            <AskAIONContent />
        </AuthenticatedLayout>
    )
}
