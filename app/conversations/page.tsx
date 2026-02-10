'use client'

import { useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import AuthenticatedLayout from '@/components/AuthenticatedLayout'
import { MessageSquare, Phone, Clock, AlertTriangle, Send, Bot, Package, CheckCircle, MessageCircle } from 'lucide-react'

interface Customer {
    id: string
    name: string
    phone: string
    status: 'online' | 'waiting' | 'cod-pending' | 'delayed'
    lastMessage: string
    time: string
    unread: number
    orderValue: string
}

const mockCustomers: Customer[] = [
    { id: '1', name: 'Fatima Khan', phone: '+92 300 1234567', status: 'waiting', lastMessage: 'Is COD available?', time: '2 min ago', unread: 2, orderValue: 'PKR 8,500' },
    { id: '2', name: 'Ahmed Ali', phone: '+92 301 9876543', status: 'cod-pending', lastMessage: 'When will it arrive?', time: '5 min ago', unread: 1, orderValue: 'PKR 12,300' },
    { id: '3', name: 'Sara Malik', phone: '+92 333 4567890', status: 'online', lastMessage: 'Thank you!', time: '10 min ago', unread: 0, orderValue: 'PKR 6,700' },
    { id: '4', name: 'Bilal Hassan', phone: '+92 345 2345678', status: 'delayed', lastMessage: 'Payment issue', time: '15 min ago', unread: 3, orderValue: 'PKR 15,900' },
    { id: '5', name: 'Aisha Noor', phone: '+92 320 8765432', status: 'waiting', lastMessage: 'Can I change address?', time: '22 min ago', unread: 1, orderValue: 'PKR 4,200' },
]

// Different conversations for each customer
const customerConversations: { [key: string]: Array<{ id: number, sender: string, text: string, time: string }> } = {
    '1': [
        { id: 1, sender: 'customer', text: 'Assalam o Alaikum, is COD available for this order?', time: '10:24 AM' },
        { id: 2, sender: 'ai', text: 'Walaikum Assalam! Yes, Cash on Delivery is available. Your order #3421 for PKR 8,500 is confirmed. Estimated delivery: 2-3 days.', time: '10:24 AM' },
        { id: 3, sender: 'customer', text: 'Great! When exactly will it arrive?', time: '10:26 AM' },
        { id: 4, sender: 'ai', text: 'Based on our delivery partner, your order will arrive between Jan 9-10. You\'ll receive tracking updates via WhatsApp.', time: '10:26 AM' },
    ],
    '2': [
        { id: 1, sender: 'customer', text: 'Mera order kab aaye ga?', time: '9:15 AM' },
        { id: 2, sender: 'ai', text: 'Apka order #3418 kal tak pohanch jaye ga. Tracking number: TCS-4829. Koi aur sawal?', time: '9:16 AM' },
        { id: 3, sender: 'customer', text: 'COD confirm hai na?', time: '9:18 AM' },
        { id: 4, sender: 'ai', text: 'Ji haan, Cash on Delivery confirmed hai. PKR 12,300 delivery ke waqt payment kar sakte hain.', time: '9:18 AM' },
    ],
    '3': [
        { id: 1, sender: 'customer', text: 'Order received! Product is perfect!', time: '8:45 AM' },
        { id: 2, sender: 'ai', text: 'That\'s wonderful to hear! Thank you for your purchase. Would you like to rate your experience?', time: '8:46 AM' },
        { id: 3, sender: 'customer', text: 'Yes, 5 stars! Will order again soon.', time: '8:48 AM' },
        { id: 4, sender: 'ai', text: 'Thank you so much! 🌟 We\'ve added a 10% discount code to your WhatsApp: RETURN10', time: '8:48 AM' },
    ],
    '4': [
        { id: 1, sender: 'customer', text: 'Payment nahi ho raha, card decline ho gaya', time: '7:30 AM' },
        { id: 2, sender: 'ai', text: 'No worries! Main COD option activate kar deta hoon. You can pay PKR 15,900 when order arrives.', time: '7:31 AM' },
        { id: 3, sender: 'customer', text: 'Thank you! Kab tak aaye ga?', time: '7:33 AM' },
        { id: 4, sender: 'ai', text: 'Order today confirmed. Delivery estimated: Jan 10-11. I\'ll send you tracking via WhatsApp tomorrow.', time: '7:34 AM' },
    ],
    '5': [
        { id: 1, sender: 'customer', text: 'Can I change my delivery address?', time: '6:50 AM' },
        { id: 2, sender: 'ai', text: 'Of course! Please share your new address and I\'ll update order #3407 immediately.', time: '6:51 AM' },
        { id: 3, sender: 'customer', text: 'House 45, Street 7, F-10 Markaz, Islamabad', time: '6:53 AM' },
        { id: 4, sender: 'ai', text: 'Address updated successfully! ✅ Order will be delivered to F-10 Markaz. You\'ll get WhatsApp updates.', time: '6:53 AM' },
    ],
}

function ConversationsContent() {
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
    const [messageInput, setMessageInput] = useState('')

    const currentMessages = selectedCustomer ? (customerConversations[selectedCustomer.id] || customerConversations['1']) : []

    const getStatusColor = (status: Customer['status']) => {
        switch (status) {
            case 'online': return 'bg-status-success'
            case 'waiting': return 'bg-status-warning'
            case 'cod-pending': return 'bg-blue-500'
            case 'delayed': return 'bg-status-danger'
        }
    }

    const getStatusText = (status: Customer['status']) => {
        switch (status) {
            case 'online': return 'Online'
            case 'waiting': return 'Waiting'
            case 'cod-pending': return 'COD Pending'
            case 'delayed': return 'Delayed'
        }
    }

    return (
        <div className="min-h-screen bg-white flex">
            <Sidebar activePage="Conversations" />

            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="px-8 py-8 bg-white shadow-sm border-b border-border">
                    <div>
                        <h1 className="text-text-primary text-2xl font-bold tracking-tight">WhatsApp Conversations</h1>
                        <p className="text-text-secondary text-sm mt-1.5">
                            AI-powered chat center for customer support
                        </p>
                    </div>
                </header>

                <div className="flex-1 flex overflow-hidden">
                    {/* Customer List */}
                    <div className="w-80 lg:w-80 md:w-64 sm:w-20 bg-white border-r border-border flex flex-col shadow-sm">
                        <div className="p-5 border-b border-border">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-[#25D366] flex items-center justify-center shadow-sm">
                                    <MessageCircle className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-text-primary text-lg font-bold">WhatsApp Center</h2>
                            </div>
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                className="w-full px-3 py-2 bg-white border border-border rounded-lg text-xs text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-primary transition-all"
                            />
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {mockCustomers.map((customer) => (
                                <div
                                    key={customer.id}
                                    onClick={() => setSelectedCustomer(customer)}
                                    className={`p-4 border-b border-border cursor-pointer transition-all duration-150 ${selectedCustomer?.id === customer.id
                                        ? 'bg-surface-base/50 border-l-4 border-l-accent-primary'
                                        : 'hover:bg-surface-base/30'
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-primary to-accent-hover flex items-center justify-center">
                                                <span className="text-white text-sm font-bold">
                                                    {customer.name.split(' ').map(n => n[0]).join('')}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-text-primary text-sm font-semibold">{customer.name}</p>
                                                <p className="text-text-subtle text-xs">{customer.phone}</p>
                                            </div>
                                        </div>
                                        {customer.unread > 0 && (
                                            <span className="bg-accent-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                                {customer.unread}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-text-muted text-sm mb-2 truncate">{customer.lastMessage}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-text-subtle text-xs">{customer.time}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(customer.status)} text-white font-medium`}>
                                            {getStatusText(customer.status)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chat Window */}
                    <div className="flex-1 flex flex-col bg-white overflow-hidden">
                        {!selectedCustomer ? (
                            /* Empty State */
                            <div className="flex-1 flex flex-col items-center justify-center p-8">
                                <div className="w-16 h-16 rounded-lg bg-white border border-border flex items-center justify-center mb-5">
                                    <MessageCircle className="w-8 h-8 text-accent-primary" />
                                </div>
                                <h3 className="text-text-primary text-xl font-semibold mb-2">WhatsApp Chat Center</h3>
                                <p className="text-text-secondary text-xs text-center max-w-md mb-5">
                                    Select a customer conversation from the left panel to view messages and manage orders through AI-powered assistance.
                                </p>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#25D366]/10 rounded-lg border border-[#25D366]/30">
                                    <div className="w-4 h-4 rounded-full bg-[#25D366] flex items-center justify-center">
                                        <MessageCircle className="w-2.5 h-2.5 text-white" />
                                    </div>
                                    <span className="text-xs text-[#25D366] font-medium">Connected to WhatsApp Business API</span>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Chat Header */}
                                <div className="p-5 bg-white border-b border-border flex-shrink-0">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-primary to-accent-hover flex items-center justify-center">
                                                <span className="text-white text-sm font-bold">
                                                    {selectedCustomer.name.split(' ').map(n => n[0]).join('')}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-text-primary font-semibold">{selectedCustomer.name}</p>
                                                    <div className="w-4 h-4 rounded-full bg-[#25D366] flex items-center justify-center">
                                                        <MessageCircle className="w-2.5 h-2.5 text-white" />
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-3 h-3 text-text-subtle" />
                                                    <p className="text-text-subtle text-sm">{selectedCustomer.phone}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <span className={`text-xs px-3 py-1.5 rounded-full ${getStatusColor(selectedCustomer.status)} text-white font-medium`}>
                                            {getStatusText(selectedCustomer.status)}
                                        </span>
                                    </div>
                                </div>

                                {/* Input - Moved to top */}
                                <div className="p-4 bg-white border-b border-border flex-shrink-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-4 h-4 rounded-full bg-[#25D366] flex items-center justify-center">
                                            <MessageCircle className="w-2.5 h-2.5 text-white" />
                                        </div>
                                        <span className="text-xs text-text-tertiary font-medium">Connected via WhatsApp Business API</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="text"
                                            value={messageInput}
                                            onChange={(e) => setMessageInput(e.target.value)}
                                            placeholder="AI assistant will respond to customer..."
                                            className="flex-1 px-3 py-2 bg-white border border-border rounded-lg text-xs text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-primary transition-all"
                                        />
                                        <button className="bg-accent-primary hover:bg-accent-hover text-white p-3 rounded-xl transition-all shadow-sm btn-press flex items-center gap-2">
                                            <Bot className="w-4 h-4" />
                                            <Send className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                    {currentMessages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`flex ${message.sender === 'customer' ? 'justify-start' : 'justify-end'}`}
                                        >
                                            <div className={`max-w-md ${message.sender === 'customer' ? 'order-2' : 'order-1'}`}>
                                                {message.sender === 'ai' && (
                                                    <div className="flex items-center gap-1.5 mb-1">
                                                        <Bot className="w-3.5 h-3.5 text-accent-primary" />
                                                        <span className="text-accent-primary text-xs font-semibold">AION AI • WhatsApp</span>
                                                    </div>
                                                )}
                                                <div
                                                    className={`p-3 rounded-lg ${message.sender === 'customer'
                                                        ? 'bg-white border border-border'
                                                        : 'bg-accent-primary text-white'
                                                        }`}
                                                >
                                                    <p className="text-xs leading-relaxed">{message.text}</p>
                                                    <p
                                                        className={`text-xs mt-2 ${message.sender === 'customer' ? 'text-text-subtle' : 'text-white/70'
                                                            }`}
                                                    >
                                                        {message.time}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Order Info Panel - Only show when customer is selected */}
                    {selectedCustomer && (
                        <div className="w-80 lg:w-80 md:w-64 hidden lg:block bg-white border-l border-border p-5 overflow-y-auto">
                            <h3 className="text-text-primary text-sm font-semibold mb-4">Order Information</h3>

                            <div className="space-y-4 animate-fade-in-up">
                                <div className="bg-white p-4 rounded-lg border border-border shadow-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Package className="w-4 h-4 text-accent-primary" />
                                        <p className="text-text-tertiary text-xs font-medium">Active Order</p>
                                    </div>
                                    <p className="text-text-primary text-lg font-semibold mb-1 tabular-nums">{selectedCustomer.orderValue}</p>
                                    <p className="text-text-secondary text-xs">Order #3421</p>
                                </div>

                                <div>
                                    <p className="text-text-tertiary text-xs font-medium mb-3">Status</p>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-status-success" />
                                            <span className="text-sm text-text-secondary">Order Confirmed</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-status-success" />
                                            <span className="text-sm text-text-secondary">Payment: COD</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-status-warning" />
                                            <span className="text-sm text-text-secondary">Preparing to ship</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-text-tertiary text-xs font-medium mb-3">AI Risk Score</p>
                                    <div className="bg-status-successLight p-3 rounded-lg border border-status-success/30">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-status-success font-bold text-2xl">8.5/10</span>
                                            <span className="text-xs px-2 py-1 bg-status-success text-white rounded-full font-medium">Low Risk</span>
                                        </div>
                                        <p className="text-status-success text-xs">Verified customer, good order history</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-text-tertiary text-xs font-medium mb-3">Customer History</p>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-text-muted">Previous Orders</span>
                                            <span className="text-text-primary font-semibold">3</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-text-muted">Success Rate</span>
                                            <span className="text-status-success font-semibold">100%</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-text-muted">Total Spent</span>
                                            <span className="text-text-primary font-semibold">PKR 24,300</span>
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full bg-accent-primary hover:bg-accent-hover text-white font-semibold py-3 rounded-xl transition-all shadow-sm btn-press">
                                    View Full Order
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

export default function ConversationsPage() {
    return (
        <AuthenticatedLayout>
            <ConversationsContent />
        </AuthenticatedLayout>
    )
}
