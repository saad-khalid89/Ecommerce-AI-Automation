'use client'

import { useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import AuthenticatedLayout from '@/components/AuthenticatedLayout'
import { Sparkles, Copy, Send, TrendingUp, FileText, MessageCircle, Instagram, Zap, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

type CampaignTab = 'whatsapp' | 'sms' | 'instagram'
type ContentType = 'product-desc' | 'promo' | 're-engage' | 'festival' | 'new-arrival'

interface GeneratedCampaign {
    whatsapp: string
    sms: string
    instagram: string
}

const mockProducts = [
    'Premium Leather Wallet',
    'Wireless Earbuds Pro',
    'Smart Watch Series 5',
    'Designer Sunglasses',
    'Organic Face Cream',
]

const mockContentLibrary = [
    {
        type: 'Product Description' as const,
        product: 'Premium Leather Wallet',
        content: 'Handcrafted genuine leather wallet with RFID protection. Slim design fits 8 cards + cash. Perfect for daily use.',
        clicks: 342,
        orders: 28,
    },
    {
        type: 'Promo Message' as const,
        product: 'Wireless Earbuds Pro',
        content: '🎧 50% OFF Flash Sale! Premium sound quality, 24hr battery. Limited stock. Order now!',
        clicks: 567,
        orders: 43,
    },
    {
        type: 'Re-engagement' as const,
        product: 'Smart Watch Series 5',
        content: 'Still thinking about it? 🤔 Your Smart Watch is waiting! Use code WELCOME10 for extra 10% off.',
        clicks: 234,
        orders: 19,
    },
    {
        type: 'Festival Sale' as const,
        product: 'Designer Sunglasses',
        content: '☀️ Summer Sale! Get 40% off on premium sunglasses. UV protection + style. Shop now before stock runs out!',
        clicks: 445,
        orders: 35,
    },
    {
        type: 'New Arrival' as const,
        product: 'Organic Face Cream',
        content: '✨ NEW! Organic Face Cream now available. Natural ingredients, visible results in 7 days. Try it today!',
        clicks: 289,
        orders: 22,
    },
]

const mockBlogs = [
    {
        title: '5 Best Leather Wallets for Men in 2026',
        keyword: 'leather wallet pakistan',
        product: 'Premium Leather Wallet',
        status: 'Published',
        traffic: 1247,
        revenue: 34500,
    },
    {
        title: 'Top Wireless Earbuds Under PKR 5000',
        keyword: 'wireless earbuds pakistan',
        product: 'Wireless Earbuds Pro',
        status: 'Published',
        traffic: 2134,
        revenue: 58900,
    },
    {
        title: 'Smart Watch Buying Guide 2026',
        keyword: 'smart watch pakistan',
        product: 'Smart Watch Series 5',
        status: 'Draft',
        traffic: 0,
        revenue: 0,
    },
]

export default function MarketingPage() {
    const [selectedProduct, setSelectedProduct] = useState(mockProducts[0])
    const [discount, setDiscount] = useState('20')
    const [audience, setAudience] = useState('All')
    const [language, setLanguage] = useState('English')
    const [generatedCampaign, setGeneratedCampaign] = useState<GeneratedCampaign | null>(null)
    const [activeTab, setActiveTab] = useState<CampaignTab>('whatsapp')
    const [isGenerating, setIsGenerating] = useState(false)

    // Blog generator state
    const [blogProduct, setBlogProduct] = useState(mockProducts[0])
    const [keyword, setKeyword] = useState('')
    const [blogLanguage, setBlogLanguage] = useState('English')
    const [tone, setTone] = useState('Informative')
    const [generatedBlog, setGeneratedBlog] = useState<any>(null)
    const [isGeneratingBlog, setIsGeneratingBlog] = useState(false)

    const handleGenerateCampaign = () => {
        setIsGenerating(true)
        setTimeout(() => {
            setGeneratedCampaign({
                whatsapp: `🎉 *${selectedProduct}* - Special ${discount}% OFF!\n\n${language === 'Urdu' ? 'خاص رعایت صرف آج کے لیے' : language === 'Roman Urdu' ? 'Khaas riyayat sirf aaj ke liye' : 'Limited time offer - Today only!'}\n\n💰 Original: PKR 2,999\n✨ Sale: PKR ${Math.round(2999 * (1 - parseInt(discount) / 100))}\n\n${language === 'English' ? '⏰ Hurry! Only 5 left in stock' : '⏰ Jaldi karein! Sirf 5 baqi hain'}\n\n🚚 Free delivery on COD\n📞 Order now: wa.me/923001234567`,
                sms: `${selectedProduct} ${discount}% OFF! PKR ${Math.round(2999 * (1 - parseInt(discount) / 100))} only. Limited stock. Order: wa.me/923001234567`,
                instagram: `✨ FLASH SALE ALERT ✨\n\n${selectedProduct} 🔥\n${discount}% OFF - Today Only!\n\nWas: PKR 2,999\nNow: PKR ${Math.round(2999 * (1 - parseInt(discount) / 100))} 💸\n\n⏰ Limited Stock\n🚚 Free Delivery\n📦 COD Available\n\n🛒 Order via WhatsApp (link in bio)\n\n#Sale #Shopping #Pakistan #OnlineShopping #COD #FreeDelivery`
            })
            setIsGenerating(false)
        }, 1500)
    }

    const handleGenerateBlog = () => {
        setIsGeneratingBlog(true)
        setTimeout(() => {
            setGeneratedBlog({
                title: `Complete Guide to ${blogProduct} - Reviews & Buying Tips 2026`,
                meta: `Looking to buy ${blogProduct.toLowerCase()}? Read our expert review, price comparison, and buying guide for Pakistan. Free delivery available.`,
                headings: [
                    'Introduction',
                    `What is ${blogProduct}?`,
                    'Key Features & Benefits',
                    'Price & Where to Buy',
                    'Customer Reviews',
                    'Final Verdict',
                ],
                content: `# Complete Guide to ${blogProduct} - Reviews & Buying Tips 2026\n\nLooking for the perfect ${blogProduct.toLowerCase()}? You've come to the right place.\n\n## What is ${blogProduct}?\n\nThe ${blogProduct} is one of the most popular products in Pakistan right now. With its premium quality and affordable price, it's the perfect choice for anyone looking for value and style.\n\n## Key Features & Benefits\n\n✅ Premium quality materials\n✅ Affordable pricing\n✅ Free delivery across Pakistan\n✅ Cash on Delivery (COD) available\n✅ 100% genuine product\n\n## Price & Where to Buy\n\nThe ${blogProduct} is available for just **PKR 2,999** with free delivery. You can order directly via WhatsApp for the fastest service.\n\n## Customer Reviews\n\nOver 500+ satisfied customers have given this product a 4.8/5 star rating. Customers love the quality, fast delivery, and excellent customer service.\n\n## Final Verdict\n\nIf you're looking for ${keyword || 'quality products'} in Pakistan, the ${blogProduct} is an excellent choice. Order now and get free delivery!`
            })
            setIsGeneratingBlog(false)
        }, 2000)
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast.success('Copied to clipboard')
    }

    return (
        <AuthenticatedLayout>
            <div className="min-h-screen bg-white flex">
                <Sidebar activePage="Marketing" />

                <main className="flex-1 overflow-auto">
                    {/* Header */}
                    <header className="px-8 py-8 bg-white shadow-sm border-b border-border">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-text-primary text-2xl font-bold tracking-tight">Marketing & Content</h1>
                                <p className="text-text-secondary text-sm mt-1.5">
                                    AI-powered campaigns that drive sales
                                </p>
                            </div>

                            {/* Performance Snapshot */}
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-text-tertiary text-xs font-medium">Last 30 Days</p>
                                    <p className="text-text-primary text-sm font-semibold mt-1 tabular-nums">${(147500 * 0.0036).toFixed(0)}</p>
                                    <p className="text-status-success text-xs font-medium mt-0.5">↑ Revenue Generated</p>
                                </div>
                                <div className="w-px h-10 bg-border" />
                                <div className="text-right">
                                    <p className="text-text-tertiary text-xs font-medium">Messages Sent</p>
                                    <p className="text-text-primary text-sm font-semibold mt-1 tabular-nums">1,247</p>
                                </div>
                                <div className="w-px h-10 bg-border" />
                                <div className="text-right">
                                    <p className="text-text-tertiary text-xs font-medium">Blog Visits</p>
                                    <p className="text-text-primary text-sm font-semibold mt-1 tabular-nums">3,381</p>
                                </div>
                                <div className="w-px h-10 bg-border" />
                                <div className="text-right">
                                    <p className="text-text-tertiary text-xs font-medium">Orders</p>
                                    <p className="text-text-primary text-sm font-semibold mt-1 tabular-nums">147</p>
                                </div>
                            </div>
                        </div>
                    </header>

                    <div className="px-8 py-8 space-y-6">
                        {/* 1. Campaign Generator */}
                        <div className="bg-white rounded-lg shadow-sm hover:shadow transition-all duration-150 card-hover border border-border p-5 animate-fade-in-up">
                            <div className="flex items-center gap-2.5 mb-5">
                                <Zap className="w-4 h-4 text-text-tertiary" />
                                <h2 className="text-text-primary text-sm font-semibold">Generate a WhatsApp Sales Campaign</h2>
                            </div>

                            <div className="grid grid-cols-4 gap-3 mb-5">
                                <div>
                                    <label className="text-text-tertiary text-xs font-medium mb-2 block">Product</label>
                                    <select
                                        value={selectedProduct}
                                        onChange={(e) => setSelectedProduct(e.target.value)}
                                        className="w-full px-3 py-2 bg-white border border-border rounded-lg text-xs text-text-primary focus:outline-none focus:border-accent-primary"
                                    >
                                        {mockProducts.map((p) => (
                                            <option key={p} value={p}>{p}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-text-tertiary text-xs font-medium mb-2 block">Discount (%)</label>
                                    <input
                                        type="number"
                                        value={discount}
                                        onChange={(e) => setDiscount(e.target.value)}
                                        className="w-full px-3 py-2 bg-white border border-border rounded-lg text-xs text-text-primary focus:outline-none focus:border-accent-primary"
                                    />
                                </div>

                                <div>
                                    <label className="text-text-tertiary text-xs font-medium mb-2 block">Audience</label>
                                    <select
                                        value={audience}
                                        onChange={(e) => setAudience(e.target.value)}
                                        className="w-full px-3 py-2 bg-white border border-border rounded-lg text-xs text-text-primary focus:outline-none focus:border-accent-primary"
                                    >
                                        <option>All</option>
                                        <option>COD Customers</option>
                                        <option>New Visitors</option>
                                        <option>Cart Abandoners</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-text-tertiary text-xs font-medium mb-2 block">Language</label>
                                    <select
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                        className="w-full px-3 py-2 bg-white border border-border rounded-lg text-xs text-text-primary focus:outline-none focus:border-accent-primary"
                                    >
                                        <option>English</option>
                                        <option>Urdu</option>
                                        <option>Roman Urdu</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                onClick={handleGenerateCampaign}
                                disabled={isGenerating}
                                className="bg-accent-primary hover:bg-accent-hover text-white font-medium text-xs px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {isGenerating ? (
                                    <>
                                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-3.5 h-3.5" />
                                        Generate Campaign
                                    </>
                                )}
                            </button>

                            {/* Generated Campaign */}
                            {generatedCampaign && (
                                <div className="mt-5 border-t border-border pt-5">
                                    {/* Tabs */}
                                    <div className="flex gap-2 mb-4">
                                        <button
                                            onClick={() => setActiveTab('whatsapp')}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-xs transition-colors ${activeTab === 'whatsapp'
                                                ? 'bg-accent-primary text-white'
                                                : 'bg-white text-text-secondary border border-border hover:shadow-sm'
                                                }`}
                                        >
                                            <MessageCircle className="w-3.5 h-3.5" />
                                            WhatsApp Message
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('sms')}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-xs transition-colors ${activeTab === 'sms'
                                                ? 'bg-accent-primary text-white'
                                                : 'bg-white text-text-secondary border border-border hover:shadow-sm'
                                                }`}
                                        >
                                            <Send className="w-3.5 h-3.5" />
                                            SMS
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('instagram')}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-xs transition-colors ${activeTab === 'instagram'
                                                ? 'bg-accent-primary text-white'
                                                : 'bg-white text-text-secondary border border-border hover:shadow-sm'
                                                }`}
                                        >
                                            <Instagram className="w-3.5 h-3.5" />
                                            Instagram Caption
                                        </button>
                                    </div>

                                    {/* Content */}
                                    <div className="bg-surface-base/50 rounded-lg p-4 border border-border">
                                        <pre className="text-text-primary text-xs whitespace-pre-wrap font-sans leading-relaxed">
                                            {generatedCampaign[activeTab]}
                                        </pre>
                                        <div className="flex gap-2 mt-3">
                                            <button
                                                onClick={() => copyToClipboard(generatedCampaign[activeTab])}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-border rounded-lg text-xs font-medium text-text-secondary hover:shadow-sm transition-colors"
                                            >
                                                <Copy className="w-3.5 h-3.5" />
                                                Copy
                                            </button>
                                            <button
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-primary hover:bg-accent-hover text-white rounded-lg text-xs font-medium transition-colors"
                                            >
                                                <Send className="w-3.5 h-3.5" />
                                                Send to {activeTab === 'whatsapp' ? 'WhatsApp' : activeTab === 'sms' ? 'SMS' : 'Instagram'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 2. AI Content Library */}
                        <div className="bg-white rounded-lg shadow-sm hover:shadow transition-all duration-150 card-hover border border-border p-5 animate-fade-in-up">
                            <div className="flex items-center gap-2.5 mb-5">
                                <FileText className="w-4 h-4 text-text-tertiary" />
                                <h2 className="text-text-primary text-sm font-semibold">AI-Generated Marketing Content</h2>
                            </div>

                            <div className="space-y-2.5">
                                {mockContentLibrary.map((item, i) => (
                                    <div key={i} className="bg-surface-base/50 rounded-lg p-4 border border-border hover:border-accent-primary/50 hover:shadow-sm transition-all duration-150 card-hover">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <span className="text-accent-primary text-xs font-semibold">{item.type}</span>
                                                    <span className="text-text-tertiary text-xs">•</span>
                                                    <span className="text-text-tertiary text-xs">{item.product}</span>
                                                </div>
                                                <p className="text-text-primary text-xs leading-relaxed mb-2">{item.content}</p>
                                                <div className="flex items-center gap-3 text-xs text-text-tertiary">
                                                    <span className="flex items-center gap-1">
                                                        <TrendingUp className="w-3 h-3" />
                                                        {item.clicks} clicks
                                                    </span>
                                                    <span>•</span>
                                                    <span className="font-medium text-accent-primary">{item.orders} orders</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => copyToClipboard(item.content)}
                                                    className="p-2 bg-white border border-border rounded-lg hover:shadow-sm transition-all btn-press"
                                                    title="Copy"
                                                >
                                                    <Copy className="w-3.5 h-3.5 text-text-secondary" />
                                                </button>
                                                <button
                                                    className="p-2 bg-accent-primary hover:bg-accent-hover text-white rounded-lg transition-all shadow-sm btn-press"
                                                    title="Send"
                                                >
                                                    <Send className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 3. Content & SEO (Blog Generator) */}
                        <div className="bg-white rounded-lg shadow-sm hover:shadow transition-all duration-150 card-hover border border-border p-5 animate-fade-in-up">
                            <div className="flex items-center gap-2.5 mb-5">
                                <FileText className="w-4 h-4 text-text-tertiary" />
                                <h2 className="text-text-primary text-sm font-semibold">Content & SEO - AI Blog Generator</h2>
                            </div>

                            {!generatedBlog ? (
                                <>
                                    <div className="grid grid-cols-4 gap-3 mb-5">
                                        <div>
                                            <label className="text-text-tertiary text-xs font-medium mb-2 block">Product</label>
                                            <select
                                                value={blogProduct}
                                                onChange={(e) => setBlogProduct(e.target.value)}
                                                className="w-full px-3 py-2 bg-white border border-border rounded-lg text-xs text-text-primary focus:outline-none focus:border-accent-primary"
                                            >
                                                {mockProducts.map((p) => (
                                                    <option key={p} value={p}>{p}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-text-tertiary text-xs font-medium mb-2 block">Target Keyword</label>
                                            <input
                                                type="text"
                                                value={keyword}
                                                onChange={(e) => setKeyword(e.target.value)}
                                                placeholder="e.g. leather wallet pakistan"
                                                className="w-full px-3 py-2 bg-white border border-border rounded-lg text-xs text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-primary"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-text-tertiary text-xs font-medium mb-2 block">Language</label>
                                            <select
                                                value={blogLanguage}
                                                onChange={(e) => setBlogLanguage(e.target.value)}
                                                className="w-full px-3 py-2 bg-white border border-border rounded-lg text-xs text-text-primary focus:outline-none focus:border-accent-primary"
                                            >
                                                <option>English</option>
                                                <option>Urdu</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-text-tertiary text-xs font-medium mb-2 block">Tone</label>
                                            <select
                                                value={tone}
                                                onChange={(e) => setTone(e.target.value)}
                                                className="w-full px-3 py-2 bg-white border border-border rounded-lg text-xs text-text-primary focus:outline-none focus:border-accent-primary"
                                            >
                                                <option>Informative</option>
                                                <option>Sales</option>
                                                <option>Review</option>
                                            </select>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleGenerateBlog}
                                        disabled={isGeneratingBlog}
                                        className="bg-accent-primary hover:bg-accent-hover text-white font-medium text-xs px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {isGeneratingBlog ? (
                                            <>
                                                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Generating Article...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="w-3.5 h-3.5" />
                                                Generate Article
                                            </>
                                        )}
                                    </button>

                                    {/* Published Articles Table */}
                                    <div className="mt-6 border-t border-border pt-5">
                                        <h3 className="text-text-primary text-xs font-semibold mb-3">Published Articles</h3>
                                        <div className="overflow-hidden rounded-lg border border-border">
                                            <table className="w-full">
                                                <thead className="bg-surface-base/50">
                                                    <tr>
                                                        <th className="text-left text-xs text-text-tertiary font-medium py-2.5 px-3">Title</th>
                                                        <th className="text-left text-xs text-text-tertiary font-medium py-2.5 px-3">Keyword</th>
                                                        <th className="text-left text-xs text-text-tertiary font-medium py-2.5 px-3">Product</th>
                                                        <th className="text-left text-xs text-text-tertiary font-medium py-2.5 px-3">Status</th>
                                                        <th className="text-left text-xs text-text-tertiary font-medium py-2.5 px-3">Traffic</th>
                                                        <th className="text-left text-xs text-text-tertiary font-medium py-2.5 px-3">Revenue</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-border bg-white">
                                                    {mockBlogs.map((blog, i) => (
                                                        <tr key={i} className="hover:bg-surface-base/30 transition-colors">
                                                            <td className="text-xs text-text-primary py-2.5 px-3 font-medium">{blog.title}</td>
                                                            <td className="text-xs text-text-secondary py-2.5 px-3">{blog.keyword}</td>
                                                            <td className="text-xs text-text-secondary py-2.5 px-3">{blog.product}</td>
                                                            <td className="py-2.5 px-3">
                                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${blog.status === 'Published'
                                                                    ? 'bg-status-success/10 text-status-success'
                                                                    : 'bg-status-warning/10 text-status-warning'
                                                                    }`}>
                                                                    {blog.status}
                                                                </span>
                                                            </td>
                                                            <td className="text-xs text-text-secondary py-2.5 px-3 font-medium tabular-nums">{blog.traffic.toLocaleString()}</td>
                                                            <td className="text-xs text-accent-primary py-2.5 px-3 font-semibold tabular-nums">
                                                                {blog.revenue > 0 ? `$${(blog.revenue * 0.0036).toFixed(0)}` : '-'}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-5">
                                    {/* Generated Blog */}
                                    <div className="bg-surface-base/50 rounded-lg p-5 border border-border">
                                        <div className="mb-3">
                                            <label className="text-text-tertiary text-xs font-medium mb-2 block">Title</label>
                                            <p className="text-text-primary text-sm font-semibold">{generatedBlog.title}</p>
                                        </div>
                                        <div className="mb-3">
                                            <label className="text-text-tertiary text-xs font-medium mb-2 block">Meta Description</label>
                                            <p className="text-text-secondary text-xs">{generatedBlog.meta}</p>
                                        </div>
                                        <div className="mb-3">
                                            <label className="text-text-tertiary text-xs font-medium mb-2 block">Headings</label>
                                            <ul className="space-y-1">
                                                {generatedBlog.headings.map((h: string, i: number) => (
                                                    <li key={i} className="text-text-secondary text-xs">• {h}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="border-t border-border pt-3 mt-3">
                                            <label className="text-text-tertiary text-xs font-medium mb-3 block">Full Article</label>
                                            <div className="prose prose-sm max-w-none text-text-secondary">
                                                {generatedBlog.content.split('\n').map((line: string, i: number) => {
                                                    if (line.startsWith('# ')) return <h1 key={i} className="text-text-primary text-lg font-bold mb-3">{line.substring(2)}</h1>
                                                    if (line.startsWith('## ')) return <h2 key={i} className="text-text-primary text-sm font-bold mt-4 mb-2">{line.substring(3)}</h2>
                                                    if (line.trim() === '') return <div key={i} className="h-2" />
                                                    return <p key={i} className="mb-2 text-xs leading-relaxed">{line}</p>
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => copyToClipboard(generatedBlog.content)}
                                            className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-lg text-xs font-medium text-text-secondary hover:shadow-sm transition-colors"
                                        >
                                            <Copy className="w-3.5 h-3.5" />
                                            Copy Article
                                        </button>
                                        <button
                                            className="flex items-center gap-2 px-4 py-2 bg-accent-primary hover:bg-accent-hover text-white rounded-lg text-xs font-medium transition-colors"
                                        >
                                            <ExternalLink className="w-3.5 h-3.5" />
                                            Publish to Blog
                                        </button>
                                        <button
                                            onClick={() => setGeneratedBlog(null)}
                                            className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-lg text-xs font-medium text-text-secondary hover:shadow-sm transition-colors ml-auto"
                                        >
                                            ← Generate Another
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </AuthenticatedLayout>
    )
}
