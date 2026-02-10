'use client'

import { useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import AuthenticatedLayout from '@/components/AuthenticatedLayout'
import { Settings as SettingsIcon, Store, Zap, Shield, Bell, Globe, Key, CreditCard, User, Mail, Phone, MapPin, Save, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

function SettingsContent() {
    const [activeTab, setActiveTab] = useState<'general' | 'store' | 'ai' | 'notifications' | 'security'>('general')
    const [isSaving, setIsSaving] = useState(false)

    // General Settings
    const [storeName, setStoreName] = useState('My eCommerce Store')
    const [storeEmail, setStoreEmail] = useState('store@example.com')
    const [storePhone, setStorePhone] = useState('+92 300 1234567')
    const [storeAddress, setStoreAddress] = useState('Karachi, Pakistan')

    // AI Settings
    const [aiEnabled, setAiEnabled] = useState(true)
    const [autoRespond, setAutoRespond] = useState(true)
    const [fraudDetection, setFraudDetection] = useState(true)
    const [language, setLanguage] = useState('english')

    // Notification Settings
    const [emailNotifications, setEmailNotifications] = useState(true)
    const [smsNotifications, setSmsNotifications] = useState(false)
    const [whatsappNotifications, setWhatsappNotifications] = useState(true)

    const handleSave = () => {
        setIsSaving(true)
        setTimeout(() => {
            setIsSaving(false)
            toast.success('Settings saved successfully')
        }, 1000)
    }

    const tabs = [
        { id: 'general' as const, label: 'General', icon: Store },
        { id: 'store' as const, label: 'Store Info', icon: Globe },
        { id: 'ai' as const, label: 'AI Settings', icon: Zap },
        { id: 'notifications' as const, label: 'Notifications', icon: Bell },
        { id: 'security' as const, label: 'Security', icon: Shield },
    ]

    return (
        <div className="min-h-screen bg-white flex">
            <Sidebar activePage="Settings" />

            <main className="flex-1 overflow-auto">
                {/* Header */}
                <header className="px-8 py-8 bg-white shadow-sm border-b border-border">
                    <div>
                        <h1 className="text-text-primary text-2xl font-bold tracking-tight">Settings</h1>
                        <p className="text-text-secondary text-sm mt-1.5">
                            Manage your store preferences and configurations
                        </p>
                    </div>
                </header>

                <div className="px-8 py-8">
                    <div className="flex gap-6">
                        {/* Tabs */}
                        <div className="w-64 space-y-2 animate-fade-in-up">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-lg text-xs font-medium transition-all duration-150 ${activeTab === tab.id
                                            ? 'bg-white text-text-primary border border-border shadow-sm'
                                            : 'text-text-tertiary hover:text-text-primary hover:bg-white/50'
                                        }`}
                                >
                                    <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-text-primary' : 'text-text-tertiary'}`} />
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            {activeTab === 'general' && (
                                <div className="space-y-6 animate-fade-in-up">
                                    <div className="bg-white border border-border rounded-lg p-5 shadow-sm">
                                        <div className="flex items-center gap-2.5 mb-4">
                                            <Store className="w-4 h-4 text-text-tertiary" />
                                            <h2 className="text-text-primary text-sm font-semibold">General Information</h2>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-text-tertiary text-xs font-medium mb-2 block">Store Name</label>
                                                <input
                                                    type="text"
                                                    value={storeName}
                                                    onChange={(e) => setStoreName(e.target.value)}
                                                    className="w-full px-3 py-2 bg-white border border-border rounded-lg text-text-primary text-xs focus:outline-none focus:border-accent-primary transition-all"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-text-tertiary text-xs font-medium mb-2 block">Contact Email</label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary" />
                                                    <input
                                                        type="email"
                                                        value={storeEmail}
                                                        onChange={(e) => setStoreEmail(e.target.value)}
                                                        className="w-full pl-9 pr-3 py-2 bg-white border border-border rounded-lg text-text-primary text-xs focus:outline-none focus:border-accent-primary transition-all"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-text-tertiary text-xs font-medium mb-2 block">Phone Number</label>
                                                <div className="relative">
                                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary" />
                                                    <input
                                                        type="tel"
                                                        value={storePhone}
                                                        onChange={(e) => setStorePhone(e.target.value)}
                                                        className="w-full pl-9 pr-3 py-2 bg-white border border-border rounded-lg text-text-primary text-xs focus:outline-none focus:border-accent-primary transition-all"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-text-tertiary text-xs font-medium mb-2 block">Business Address</label>
                                                <div className="relative">
                                                    <MapPin className="absolute left-3 top-3 w-3.5 h-3.5 text-text-tertiary" />
                                                    <textarea
                                                        value={storeAddress}
                                                        onChange={(e) => setStoreAddress(e.target.value)}
                                                        rows={3}
                                                        className="w-full pl-9 pr-3 py-2 bg-white border border-border rounded-lg text-text-primary text-xs focus:outline-none focus:border-accent-primary transition-all resize-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white border border-border rounded-lg p-5 shadow-sm">
                                        <div className="flex items-center gap-2.5 mb-4">
                                            <Globe className="w-4 h-4 text-text-tertiary" />
                                            <h2 className="text-text-primary text-sm font-semibold">Regional Settings</h2>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-text-tertiary text-xs font-medium mb-2 block">Currency</label>
                                                <select className="w-full px-3 py-2 bg-white border border-border rounded-lg text-text-primary text-xs focus:outline-none focus:border-accent-primary transition-all">
                                                    <option value="PKR">PKR - Pakistani Rupee</option>
                                                    <option value="USD">USD - US Dollar</option>
                                                    <option value="EUR">EUR - Euro</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="text-text-tertiary text-xs font-medium mb-2 block">Time Zone</label>
                                                <select className="w-full px-3 py-2 bg-white border border-border rounded-lg text-text-primary text-xs focus:outline-none focus:border-accent-primary transition-all">
                                                    <option value="Asia/Karachi">Asia/Karachi (PKT)</option>
                                                    <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                                                    <option value="UTC">UTC</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'ai' && (
                                <div className="space-y-6 animate-fade-in-up">
                                    <div className="bg-white border border-border rounded-lg p-5 shadow-sm">
                                        <div className="flex items-center gap-2.5 mb-4">
                                            <Zap className="w-4 h-4 text-text-tertiary" />
                                            <h2 className="text-text-primary text-sm font-semibold">AI Features</h2>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-3 bg-surface-base/50 rounded-lg border border-border">
                                                <div className="flex-1">
                                                    <p className="text-text-primary text-xs font-semibold mb-0.5">Enable AION AI</p>
                                                    <p className="text-text-secondary text-xs">Activate AI-powered automation and insights</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={aiEnabled}
                                                        onChange={(e) => setAiEnabled(e.target.checked)}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
                                                </label>
                                            </div>

                                            <div className="flex items-center justify-between p-3 bg-surface-base/50 rounded-lg border border-border">
                                                <div className="flex-1">
                                                    <p className="text-text-primary text-xs font-semibold mb-0.5">Auto-Respond to Customers</p>
                                                    <p className="text-text-secondary text-xs">AI automatically replies to customer queries on WhatsApp</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={autoRespond}
                                                        onChange={(e) => setAutoRespond(e.target.checked)}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
                                                </label>
                                            </div>

                                            <div className="flex items-center justify-between p-3 bg-surface-base/50 rounded-lg border border-border">
                                                <div className="flex-1">
                                                    <p className="text-text-primary text-xs font-semibold mb-0.5">Fraud Detection</p>
                                                    <p className="text-text-secondary text-xs">AI blocks suspicious orders automatically</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={fraudDetection}
                                                        onChange={(e) => setFraudDetection(e.target.checked)}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
                                                </label>
                                            </div>

                                            <div>
                                                <label className="text-text-tertiary text-xs font-medium mb-2 block">Default Language</label>
                                                <select
                                                    value={language}
                                                    onChange={(e) => setLanguage(e.target.value)}
                                                    className="w-full px-3 py-2 bg-white border border-border rounded-lg text-text-primary text-xs focus:outline-none focus:border-accent-primary transition-all"
                                                >
                                                    <option value="english">English</option>
                                                    <option value="urdu">Urdu</option>
                                                    <option value="roman">Roman Urdu</option>
                                                    <option value="auto">Auto-detect</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'notifications' && (
                                <div className="space-y-6 animate-fade-in-up">
                                    <div className="bg-white border border-border rounded-lg p-5 shadow-sm">
                                        <div className="flex items-center gap-2.5 mb-4">
                                            <Bell className="w-4 h-4 text-text-tertiary" />
                                            <h2 className="text-text-primary text-sm font-semibold">Notification Preferences</h2>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-3 bg-surface-base/50 rounded-lg border border-border">
                                                <div className="flex-1">
                                                    <p className="text-text-primary text-xs font-semibold mb-0.5">Email Notifications</p>
                                                    <p className="text-text-secondary text-xs">Receive important updates via email</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={emailNotifications}
                                                        onChange={(e) => setEmailNotifications(e.target.checked)}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
                                                </label>
                                            </div>

                                            <div className="flex items-center justify-between p-3 bg-surface-base/50 rounded-lg border border-border">
                                                <div className="flex-1">
                                                    <p className="text-text-primary text-xs font-semibold mb-0.5">SMS Notifications</p>
                                                    <p className="text-text-secondary text-xs">Get critical alerts via SMS</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={smsNotifications}
                                                        onChange={(e) => setSmsNotifications(e.target.checked)}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
                                                </label>
                                            </div>

                                            <div className="flex items-center justify-between p-3 bg-surface-base/50 rounded-lg border border-border">
                                                <div className="flex-1">
                                                    <p className="text-text-primary text-xs font-semibold mb-0.5">WhatsApp Notifications</p>
                                                    <p className="text-text-secondary text-xs">Receive updates via WhatsApp Business</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={whatsappNotifications}
                                                        onChange={(e) => setWhatsappNotifications(e.target.checked)}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'security' && (
                                <div className="space-y-6 animate-fade-in-up">
                                    <div className="bg-white border border-border rounded-lg p-5 shadow-sm">
                                        <div className="flex items-center gap-2.5 mb-4">
                                            <Shield className="w-4 h-4 text-text-tertiary" />
                                            <h2 className="text-text-primary text-sm font-semibold">Security Settings</h2>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="p-3 bg-status-successLight border border-status-success/30 rounded-lg">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Shield className="w-4 h-4 text-status-success" />
                                                    <p className="text-status-success text-xs font-semibold">Account Secured</p>
                                                </div>
                                                <p className="text-status-success text-xs">Your account is protected with Shopify authentication</p>
                                            </div>

                                            <div>
                                                <label className="text-text-tertiary text-xs font-medium mb-2 block">Shopify Store Domain</label>
                                                <input
                                                    type="text"
                                                    value="your-store.myshopify.com"
                                                    disabled
                                                    className="w-full px-3 py-2 bg-surface-base/50 border border-border rounded-lg text-text-tertiary text-xs cursor-not-allowed"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-text-tertiary text-xs font-medium mb-2 block">API Access</label>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="password"
                                                        value="••••••••••••••••"
                                                        disabled
                                                        className="flex-1 px-3 py-2 bg-surface-base/50 border border-border rounded-lg text-text-tertiary text-xs cursor-not-allowed"
                                                    />
                                                    <button className="px-3 py-2 bg-accent-primary hover:bg-accent-hover text-white text-xs font-medium rounded-lg transition-all shadow-sm">
                                                        Regenerate
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'store' && (
                                <div className="space-y-6 animate-fade-in-up">
                                    <div className="bg-white border border-border rounded-lg p-5 shadow-sm">
                                        <div className="flex items-center gap-2.5 mb-4">
                                            <CreditCard className="w-4 h-4 text-text-tertiary" />
                                            <h2 className="text-text-primary text-sm font-semibold">Store Information</h2>
                                        </div>

                                        <div className="p-3 bg-surface-base/50 border border-border rounded-lg">
                                            <p className="text-text-secondary text-xs">Store information is managed through your Shopify admin dashboard. Please visit your Shopify store settings to update store details, payment methods, and shipping configuration.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Save Button */}
                            <div className="flex justify-end gap-3 mt-8">
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="flex items-center gap-2 px-6 py-3 bg-accent-primary hover:bg-accent-hover text-white font-semibold rounded-xl transition-all shadow-sm disabled:opacity-50 btn-press"
                                >
                                    {isSaving ? (
                                        <>
                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default function SettingsPage() {
    return (
        <AuthenticatedLayout>
            <SettingsContent />
        </AuthenticatedLayout>
    )
}
