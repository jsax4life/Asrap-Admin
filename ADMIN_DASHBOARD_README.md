# Asrapa Music Admin Dashboard

A production-grade administrator dashboard for Asrapa Music streaming platform, built with React, TypeScript, and modern web technologies.

## 🚀 Features

### ✅ Implemented Features

- **🔐 Authentication System**
  - JWT-based authentication with refresh tokens
  - Protected routes with role-based access control
  - Secure token storage and automatic logout on expiry
  - Login page with form validation

- **🎨 Modern UI/UX**
  - Beautiful dark theme with Asrapa Music branding
  - Light/dark theme toggle
  - Responsive design for all screen sizes
  - Professional dashboard layout with collapsible sidebar

- **📊 Dashboard Overview**
  - Key metrics display (revenue, users, songs, etc.)
  - Top artists and songs tables
  - Real-time data visualization ready

- **🔧 Architecture & State Management**
  - Zustand for global state management
  - React Query for API data fetching and caching
  - TypeScript for type safety
  - Modular component architecture

- **🛡️ Security & Access Control**
  - Role-based menu system (Super Admin, Admin, Moderator, Analyst)
  - Protected routes with automatic redirects
  - Unauthorized access handling

### 🚧 Ready for Implementation

- **👥 User Management**
  - User listing with search and filters
  - User creation, editing, and deletion
  - Bulk operations support

- **🎵 Music Management**
  - Artist management
  - Song upload approval system
  - Playlist management
  - Music analytics

- **📈 Analytics & Reporting**
  - Revenue analytics
  - User engagement metrics
  - Stream analytics
  - Custom date range filtering

- **💰 Payment Management**
  - Payment processing
  - Revenue tracking
  - Payout management

## 🏗️ Architecture

### Folder Structure

```
client/
├── components/
│   ├── common/           # Reusable components
│   │   ├── DataTable.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── PageHeader.tsx
│   │   ├── Pagination.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── SearchBar.tsx
│   │   └── ThemeToggle.tsx
│   ├── ui/              # UI component library
│   └── [existing components]
├── layouts/
│   ├── AuthLayout.tsx
│   └── DashboardLayout.tsx
├── pages/
│   ├── auth/
│   │   └── Login.tsx
│   ├── dashboard/
│   │   └── Dashboard.tsx
│   ├── users/           # Ready for implementation
│   ├── artists/         # Ready for implementation
│   ├── songs/           # Ready for implementation
│   └── settings/        # Ready for implementation
├── services/
│   ├── apiClient.ts     # Axios instance with interceptors
│   └── authService.ts   # Authentication service
├── store/
│   ├── authStore.ts     # Authentication state
│   └── themeStore.ts    # Theme state
├── hooks/
│   ├── useAuth.ts       # Authentication hook
│   └── useTheme.ts      # Theme hook
├── types/
│   └── index.ts         # TypeScript interfaces
├── constants/
│   └── index.ts         # App constants and configuration
└── utils/
    └── [utility functions]
```

### Key Components

#### 1. Authentication System
- **AuthStore**: Manages user authentication state
- **AuthService**: Handles API calls for login/logout
- **ProtectedRoute**: Wraps routes requiring authentication
- **useAuth**: Hook for authentication state and actions

#### 2. Theme System
- **ThemeStore**: Manages theme state (light/dark)
- **ThemeToggle**: Component for switching themes
- **CSS Variables**: Dynamic theming with CSS custom properties

#### 3. API Layer
- **ApiClient**: Centralized HTTP client with interceptors
- **Error Handling**: Automatic token refresh and error management
- **Type Safety**: Full TypeScript support for API responses

#### 4. UI Components
- **DataTable**: Reusable table with sorting and pagination
- **SearchBar**: Search input with clear functionality
- **Pagination**: Complete pagination component
- **LoadingSpinner**: Loading states

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

### User Roles

The system supports four user roles:

1. **Super Admin**: Full access to all features
2. **Admin**: Access to most features except admin user management
3. **Moderator**: Access to content management and user management
4. **Analyst**: Read-only access to analytics and reports

### Menu Configuration

Menu items are configured in `constants/index.ts` with role-based access:

```typescript
export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'Home',
    path: '/dashboard',
    roles: ['super_admin', 'admin', 'moderator', 'analyst'],
  },
  // ... more items
];
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

1. Install dependencies:
```bash
npm install
# or
pnpm install
```

2. Start the development server:
```bash
npm run dev
# or
pnpm dev
```

3. Open [http://localhost:8080](http://localhost:8080) in your browser

### Default Login

For development, you can use these test credentials:
- **Email**: admin@asrapa.com
- **Password**: password123

*Note: These are mock credentials. Replace with real authentication when backend is ready.*

## 📱 Responsive Design

The dashboard is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

### Mobile Features
- Collapsible sidebar with overlay
- Touch-friendly interface
- Optimized table scrolling
- Responsive typography

## 🎨 Theming

### Dark Theme (Default)
- Primary background: `#131313` (asra-dark)
- Card background: `#2B2B2B` (asra-gray-1)
- Text colors: White and gray variants
- Accent color: `#C40505` (asra-red)

### Light Theme
- Primary background: White
- Card background: Light gray
- Text colors: Dark gray and black
- Same accent color: `#C40505` (asra-red)

## 🔌 API Integration

### Authentication Endpoints

```typescript
// Login
POST /api/v1/auth/login
{
  "email": "admin@asrapa.com",
  "password": "password123"
}

// Get Profile
GET /api/v1/auth/profile
Authorization: Bearer <token>

// Logout
POST /api/v1/auth/logout
Authorization: Bearer <token>
```

### Dashboard Endpoints

```typescript
// Get Dashboard Metrics
GET /api/v1/dashboard/metrics

// Get Top Artists
GET /api/v1/dashboard/top-artists

// Get Top Songs
GET /api/v1/dashboard/top-songs
```

## 🧪 Testing

Run tests with:
```bash
npm test
# or
pnpm test
```

## 📦 Building for Production

```bash
npm run build
# or
pnpm build
```

The built files will be in the `dist/` directory.

## 🚀 Deployment

The application can be deployed to:
- **Netlify**: Use the Netlify MCP integration
- **Vercel**: Use the Vercel MCP integration
- **Any static hosting**: Upload the `dist/` folder

## 🔮 Future Enhancements

### Phase 2: Content Management
- [ ] User management interface
- [ ] Artist management
- [ ] Song upload approval system
- [ ] Playlist management

### Phase 3: Analytics
- [ ] Advanced analytics dashboard
- [ ] Revenue reporting
- [ ] User engagement metrics
- [ ] Export functionality

### Phase 4: Advanced Features
- [ ] Real-time notifications
- [ ] Bulk operations
- [ ] Advanced search and filtering
- [ ] Data export/import
- [ ] Audit logging

## 🤝 Contributing

1. Follow the existing code structure
2. Use TypeScript for all new code
3. Add proper error handling
4. Include loading states
5. Test on multiple screen sizes
6. Follow the established naming conventions

## 📄 License

This project is proprietary to Asrapa Music.

---

**Built with ❤️ for Asrapa Music**
