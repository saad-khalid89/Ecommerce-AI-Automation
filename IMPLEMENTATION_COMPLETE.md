# AION - Shopify Dashboard Integration

🎉 **Implementation Complete!** Your Next.js dashboard is now connected to Shopify via FastAPI backend.

## ✨ What's New

### Features Implemented:
- ✅ **Secure Authentication** - Login with Shopify credentials
- ✅ **Live Data Integration** - Real-time products, orders, and customers from Shopify
- ✅ **Session Management** - Encrypted cookie-based sessions
- ✅ **Auto-Refresh** - Manual data refresh with loading states
- ✅ **Protected Routes** - Dashboard only accessible when logged in
- ✅ **Clean UI** - Green-accented enterprise SaaS design
- ✅ **Error Handling** - User-friendly error messages

---

## 🚀 Quick Start

### 1. Start the Python Backend

```bash
cd "shopify connection"
python main_minimal.py
```

The backend will start on **http://localhost:8000**

### 2. Start the Next.js Frontend

Open a new terminal:

```bash
npm run dev
```

The frontend will start on **http://localhost:3000**

### 3. Login to Dashboard

1. Navigate to **http://localhost:3000/login**
2. Enter your Shopify credentials:
   - **Shop Domain**: `your-store.myshopify.com`
   - **Access Token**: `shpat_xxxxxxxxxxxxx`
3. Click "Connect Store"

---

## 🔐 Getting Shopify Credentials

### Create a Custom App in Shopify:

1. Go to your Shopify Admin
2. Navigate to **Settings → Apps and sales channels**
3. Click **Develop apps** → **Create an app**
4. Name it (e.g., "AION Dashboard")
5. Go to **Configuration** tab
6. Under **Admin API**, click **Configure**
7. Select these scopes:
   - `read_products`
   - `read_orders`
   - `read_customers`
   - `read_fulfillments`
8. **Install app** and reveal the **Admin API access token**
9. Copy the token (starts with `shpat_`)

---

## 📊 Dashboard Features

### Live KPI Cards:
- **Total Revenue** - Real-time revenue from Shopify orders
- **Total Orders** - Current order count
- **Pending Orders** - Orders needing attention

### At-Risk Orders Table:
- Shows unfulfilled and pending orders
- Click any order to view details
- Auto-updates on refresh

### Refresh Button:
- Manual data sync from Shopify
- Loading indicator during refresh
- Error handling with user feedback

---

## 🛠️ Architecture

```
┌──────────────────────────────────────┐
│   Next.js Frontend (Port 3000)      │
│   - Login Page                        │
│   - Protected Dashboard               │
│   - API Client with Auth             │
└──────────────┬───────────────────────┘
               │ HTTP + Auth Headers
               ↓
┌──────────────────────────────────────┐
│   FastAPI Backend (Port 8000)        │
│   - /v1/shopify/validate             │
│   - /v1/shopify/products             │
│   - /v1/shopify/orders               │
│   - /v1/shopify/customers            │
│   - /v1/shopify/stats                │
└──────────────┬───────────────────────┘
               │ Shopify Admin API
               ↓
┌──────────────────────────────────────┐
│         Shopify Store                 │
│   - Products, Orders, Customers       │
└──────────────────────────────────────┘
```

---

## 📁 New Files Created

### Frontend:
- `lib/api-client.ts` - Type-safe API client
- `lib/session.ts` - Session management utilities
- `app/api/auth/login/route.ts` - Login API endpoint
- `app/api/auth/logout/route.ts` - Logout API endpoint
- `app/api/auth/session/route.ts` - Session check endpoint
- `app/login/page.tsx` - Login page UI
- `components/DashboardWrapper.tsx` - Auth wrapper
- `middleware.ts` - Route protection
- `.env.local` - Frontend environment variables

### Backend:
- `integrations/shopify/simplified_routes.py` - Simplified API routes
- `shopify connection/.env` - Backend environment variables

### Updated Files:
- `shopify connection/main_minimal.py` - Includes Shopify routes
- `components/Dashboard.tsx` - Fetches live data
- `components/layout/Sidebar.tsx` - Adds logout button

---

## 🔧 Configuration

### Frontend (`.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
SESSION_SECRET=your-secret-key-min-32-characters
```

### Backend (`shopify connection/.env`):
```env
PORT=8000
```

---

## 🐛 Troubleshooting

### "Failed to fetch data"
- ✅ Ensure Python backend is running on port 8000
- ✅ Check if Shopify credentials are correct
- ✅ Verify shop domain format: `store.myshopify.com`

### "Invalid Shopify credentials"
- ✅ Token must start with `shpat_`
- ✅ Token must have proper API scopes
- ✅ Shop domain should not include `https://`

### CORS Errors
- ✅ Backend CORS is configured for `localhost:3000`
- ✅ Check both servers are running

---

## 🎯 Next Steps

### Recommended Enhancements:
1. **Database Integration** - Cache Shopify data locally
2. **Webhook Handlers** - Real-time updates from Shopify
3. **AI Conversations** - Connect live chat to customer data
4. **Product Management** - Add/edit products from dashboard
5. **Analytics Charts** - Add Recharts visualizations
6. **Auto-refresh** - Periodic data updates

---

## 📚 API Endpoints

### Authentication:
- `POST /api/auth/login` - Create session
- `POST /api/auth/logout` - Destroy session
- `GET /api/auth/session` - Check session status

### Shopify Data:
- `POST /v1/shopify/validate` - Validate credentials
- `GET /v1/shopify/shop` - Get shop info
- `GET /v1/shopify/products` - List products
- `GET /v1/shopify/orders` - List orders
- `GET /v1/shopify/customers` - List customers
- `GET /v1/shopify/stats` - Dashboard statistics

---

## 🎨 UI Features

- **Green Accent Theme** - Professional SaaS aesthetic
- **Soft Shadows** - Modern card design
- **Loading States** - Skeleton placeholders
- **Error Boundaries** - User-friendly error messages
- **Responsive Layout** - Mobile-ready design
- **Smooth Animations** - Polished interactions

---

## 🔒 Security

- ✅ Credentials encrypted in session cookies
- ✅ HTTP-only cookies (XSS protection)
- ✅ Route protection middleware
- ✅ No credentials in localStorage
- ✅ Session expiry (7 days)

---

## 📦 Dependencies Added

```json
{
  "iron-session": "^8.0.1",
  "zod": "^3.22.4"
}
```

---

## 💡 Tips

1. **Development**: Use default credentials in `.env.local` to skip login
2. **Production**: Set `SESSION_SECRET` to a random 32+ character string
3. **Testing**: Use Shopify's test store for development
4. **Performance**: Implement caching for frequently accessed data

---

## 🎉 You're All Set!

Your dashboard is now fully connected to Shopify. Start by logging in with your store credentials and explore the live data!

For questions or issues, check the troubleshooting section above.

**Happy building! 🚀**
