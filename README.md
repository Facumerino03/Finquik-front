# Finquik 💰

A modern personal finance management mobile application built with React Native and Expo. Track your income, expenses, accounts, and visualize your financial health with beautiful, interactive charts.

## ✨ Features

### 📊 Financial Overview
- **Interactive Dashboard**: Visualize your financial health with a semi-circle chart showing income, expenses, and balance
- **Real-time Updates**: All data automatically refreshes after changes
- **Recent Transactions**: Quick access to your latest financial activities

### 💸 Transaction Management
- **Create Transactions**: Add income or expenses with custom categories
- **Search & Filter**: Find transactions by description, date range, account, category, or type
- **Edit & Delete**: Modify or remove transactions with ease
- **Transaction Details**: View comprehensive information for each transaction

### 🏦 Multi-Account Support
- **Multiple Account Types**: Bank accounts, cash, and credit cards
- **Custom Icons & Colors**: Personalize each account with 85 icons and 10 color palettes
- **Balance Tracking**: Monitor balances across all your accounts
- **Visual Distribution**: Bar chart showing money distribution

### 🏷️ Smart Categories
- **Pre-defined Categories**: Start with common income and expense categories
- **Custom Categories**: Create your own with custom icons and colors
- **Category Analytics**:
  - Pie charts showing expense/income distribution
  - Amount and percentage breakdowns
  - Transaction count per category

### 🔍 Advanced Filtering
- **Combined Filters**: Apply multiple filters simultaneously
- **Date Range Selection**: Filter by custom date ranges
- **Quick Search**: Find transactions by description
- **Visual Indicators**: Know when filters are active

### 🎨 Personalization
- **85 Lucide Icons**: Wide variety of icons for categories and accounts
- **10 Color Palettes**: Color-code your finances (Zinc, Blue, Sky, Green, Orange, Red, Pink, Purple, Violet, Indigo)
- **Semantic Colors**:
  - Green for income
  - Red for expenses
  - Blue for accounts

### 🔐 Security
- **JWT Authentication**: Secure token-based authentication
- **Encrypted Storage**: Tokens stored securely using expo-secure-store
- **Password Reset**: Secure password recovery flow

## 🛠️ Tech Stack

### Core
- **React Native**: 0.79.2
- **React**: 19.0.0
- **Expo SDK**: ~53.0.9
- **TypeScript**: ~5.8.3

### Navigation & Routing
- **Expo Router**: ~5.0.6 (File-based routing with typed routes)
- **React Navigation**: ^7.1.6

### Styling
- **NativeWind**: ^4.1.23 (Tailwind CSS for React Native)
- **Custom Fonts**: Inter & Geist

### State Management
- **React Context API**: Global state management
- **Custom Hooks**: Business logic encapsulation

### API & Data
- **Axios**: ^1.10.0 (HTTP client with interceptors)
- **JWT**: Token-based authentication
- **Backend**: Spring Boot REST API

### UI Components & Icons
- **Lucide React Native**: ^0.513.0 (85+ icons)
- **React Native SVG**: 15.11.2 (Custom charts)
- **React Native Gifted Charts**: ^1.4.61 (Bar charts)

### Additional Features
- **Date/Time Picker**: @react-native-community/datetimepicker
- **Haptic Feedback**: expo-haptics
- **Linear Gradients**: expo-linear-gradient
- **Blur Effects**: expo-blur

## 📁 Project Structure

```
Finquik-front/
├── app/                          # Expo Router file-based routing
│   ├── (auth)/                  # Authentication flow
│   │   ├── onboarding.tsx
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── reset-password.tsx
│   ├── (tabs)/                  # Main app tabs
│   │   ├── index.tsx           # Dashboard
│   │   ├── add.tsx             # Add transaction
│   │   ├── incomes.tsx         # Income analysis
│   │   ├── expenses.tsx        # Expense analysis
│   │   └── accounts.tsx        # Account management
│   ├── all-transactions.tsx    # All transactions view
│   └── edit-transaction.tsx    # Edit transaction
├── components/                   # Reusable UI components
│   ├── accounts/               # Account components
│   ├── categories/             # Category components
│   ├── charts/                 # Chart components
│   ├── layout/                 # Layout components
│   ├── modal/                  # Modal components
│   ├── transactions/           # Transaction components
│   └── common/                 # Shared components
├── core/                        # Business logic
│   ├── contexts/               # React Context providers
│   │   ├── AuthContext.tsx
│   │   └── TransactionsContext.tsx
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAccounts.ts
│   │   ├── useTransactions.ts
│   │   ├── useCreateTransaction.ts
│   │   └── ...
│   ├── services/               # API service layer
│   │   ├── api.ts             # Axios instance + interceptors
│   │   ├── transactions.ts
│   │   ├── accounts.ts
│   │   ├── categories.ts
│   │   └── user.ts
│   ├── types/                  # TypeScript definitions
│   │   ├── transactions.ts
│   │   └── auth.ts
│   └── constants/              # App constants
│       ├── availableIcons.ts  # 85 Lucide icons
│       └── availableColors.ts # 10 color palettes
├── docs/                        # Documentation
│   ├── README.md
│   ├── frontend-architecture-flow.puml
│   └── architecture-layers.puml
└── shared/                      # Static assets
    └── assets/
        ├── fonts/
        ├── icons/
        └── images/
```

## 🏗️ Architecture

Finquik follows a clean, layered architecture:

```
┌─────────────────────────────────────┐
│   UI Layer (Screens + Components)  │  ← User interaction
├─────────────────────────────────────┤
│   Business Logic (Custom Hooks)    │  ← Reusable logic
├─────────────────────────────────────┤
│   State Management (Context)       │  ← Global state
├─────────────────────────────────────┤
│   API Layer (Services + Client)    │  ← HTTP calls
├─────────────────────────────────────┤
│   Backend (Spring Boot REST API)   │  ← Data persistence
└─────────────────────────────────────┘
```

### Key Patterns

1. **Separation of Concerns**
   - UI components only handle presentation
   - Custom hooks encapsulate business logic
   - Services handle pure API calls

2. **Context + Hooks Pattern**
   - Global state in React Context
   - Business logic in custom hooks
   - Automatic component re-renders

3. **Type Safety**
   - Full TypeScript coverage
   - Shared type definitions
   - Strict mode enabled

4. **Token Management**
   - JWT stored in expo-secure-store
   - Auto-injected by Axios interceptor
   - Automatic token refresh handling

### Data Flow Example

```
User Action (Click "Add Transaction")
    ↓
Screen validates and calls custom hook
    ↓
Hook calls service function
    ↓
Service makes API call via Axios
    ↓
Axios adds JWT token automatically
    ↓
Backend processes and responds
    ↓
Hook updates Context with new data
    ↓
Context notifies all subscribers
    ↓
UI components re-render automatically
```

See [Architecture Diagrams](docs/) for detailed flow diagrams.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac), Android Studio or Expo Go
- Running backend API (Spring Boot)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Finquik-front
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory:
   ```env
   EXPO_PUBLIC_API_URL=http://your-backend-url:8080
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app for physical device

## 📜 Available Scripts

```bash
npm start          # Start Expo development server
npm run android    # Run on Android emulator
npm run ios        # Run on iOS simulator
npm run web        # Run in web browser
npm run lint       # Run ESLint
```

## 🔧 Configuration

### Backend Connection

Update the API URL in `.env`:
```env
EXPO_PUBLIC_API_URL=http://localhost:8080
```

## 🎯 Core Features Implementation

### Authentication Flow
- Token stored in secure storage
- Auto-redirect based on auth state
- JWT included in all API requests
- Password reset with email verification

### Transaction Management
- Create with validation
- Edit with pre-filled data
- Delete with confirmation
- Real-time balance updates

### Data Synchronization
- Optimistic UI updates
- Automatic data refresh after mutations
- Error handling with user feedback
- Loading states throughout

### Visual Analytics
- Custom SVG charts (semi-circle, pie, bar)
- Interactive touch handlers
- Dynamic color coding
- Empty state handling

## 🤝 API Integration

This frontend connects to a Spring Boot backend. Required endpoints:

### Authentication
- `POST /api/users/register`
- `POST /api/users/login`
- `POST /api/users/forgot-password`
- `POST /api/users/reset-password`

### Transactions
- `GET /api/transactions` (paginated)
- `GET /api/transactions/summary`
- `POST /api/transactions`
- `PUT /api/transactions/:id`
- `DELETE /api/transactions/:id`

### Accounts
- `GET /api/accounts`
- `POST /api/accounts`
- `PUT /api/accounts/:id`
- `DELETE /api/accounts/:id`

### Categories
- `GET /api/categories`
- `GET /api/categories?type=INCOME|EXPENSE`
- `POST /api/categories`
- `PUT /api/categories/:id`
- `DELETE /api/categories/:id`