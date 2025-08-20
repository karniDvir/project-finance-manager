# Project Finance Manager - Flow Documentation

## Overview
The Project Finance Manager is a budget management web application with a modern, secure authentication system. This documentation covers the implemented features: the login screen and basic application structure.

## Table of Contents
1. [Authentication Flow](#authentication-flow)
2. [Application Structure](#application-structure)
3. [Design System](#design-system)

---

## Authentication Flow

### Login Screen (`/auth/signin`)
**Purpose**: Secure user authentication entry point with modern UI/UX

#### Visual Design
- **Theme**: Modern dark theme with gradient background (slate-900 to slate-800)
- **Layout**: Centered glass morphism card with backdrop blur effect
- **Geometry**: Sharp-edged design elements (no rounded corners)
- **Background**: Static geometric shapes with grid pattern overlay
- **Typography**: Clean, professional font hierarchy

#### Interactive Elements
- **Google OAuth Button**: 
  - Dark theme design (slate background, white text)
  - Hover effects with blue shadow glow
  - Proper cursor pointer indication
  - Scale animation on click
  - Official Google logo integration

#### Security Features
- **SSL Encryption**: Visual indicator for secure connection
- **OAuth 2.0**: Authentication protocol badge
- **Terms & Privacy**: Links to legal documentation
- **Support**: Help contact information

#### User Journey
1. **Entry Point**: User visits any route in the application
2. **Redirect**: Unauthenticated users automatically redirected to `/auth/signin`
3. **Clean Interface**: Login page displays without navigation bar for focused experience
4. **Authentication**: User clicks "Continue with Google" button
5. **OAuth Flow**: Completes Google authentication process
6. **Success**: Redirected to main application dashboard

#### Technical Implementation
- **Framework**: Next.js with NextAuth.js
- **Provider**: Google OAuth 2.0
- **Session**: JWT token-based authentication
- **Middleware**: Automatic redirect handling
- **Styling**: Tailwind CSS with custom animations

---

## Application Structure

### Main Dashboard (`/`)
**Purpose**: Landing page after successful authentication

#### Features
- **Authentication Guard**: Redirects unauthenticated users to login
- **Loading State**: Displays loading indicator while checking authentication
- **Welcome Interface**: Basic project information and navigation
- **Session Management**: Proper user session handling

#### User Flow
1. **Authentication Check**: System verifies user session
2. **Loading Display**: Shows loading state during verification
3. **Dashboard Access**: Authenticated users see main interface
4. **Automatic Redirect**: Users are automatically redirected to projects page

### Projects Page (`/projects`)
**Purpose**: Main project management interface with folder-style display

#### Visual Design
- **Folder Interface**: Projects displayed as interactive folder cards
- **Grid Layout**: Responsive grid system (1-4 columns based on screen size)
- **Create Button**: Prominent dashed-border card for new project creation
- **Hover Effects**: Scale and glow animations on interaction
- **Empty State**: Encouraging message when no projects exist

#### Interactive Elements
- **Project Folders**: 
  - Folder icon with emerald gradient
  - Project name and description display
  - Budget and creation date information
  - Hover effects with scale and shadow animations
- **Create Project Button**:
  - Plus icon with blue gradient
  - Dashed border styling
  - Hover effects with scale animation
- **Enhanced Modal Interface**:
  - Glass morphism design
  - Project name input field
  - Description textarea field
  - Budget number input field
  - Cancel and create buttons
  - Form validation
  - Auto-navigation to created project

#### User Journey
1. **Page Load**: Fetch existing projects from API
2. **Display Projects**: Show projects in folder-style grid
3. **Create New**: Click create button opens modal
4. **Project Creation**: Enter name and submit
5. **Update Display**: New project added to grid
6. **Project Access**: Click folder to navigate to project details

#### Technical Implementation
- **API Integration**: GET /api/projects for listing, POST for creation
- **State Management**: React hooks for projects, loading, and modal states
- **Component Architecture**: Reusable BackgroundLayout and Modal components
- **Form Handling**: Controlled inputs with validation
- **Navigation**: Next.js router for project access

### Project Detail Page (`/projects/[id]`)
**Purpose**: Individual project dashboard with financial overview and management capabilities

#### Visual Design
- **Header Section**: Large project title with description and metadata
- **Action Grid**: Three prominent action buttons in responsive grid layout
- **Financial Cards**: Three-column layout showing fund breakdowns
- **Glass Morphism**: Consistent with overall design theme
- **Color Coding**: Green for income, red for expenses, blue for repayments

#### Interactive Elements
- **Back Navigation**: Return to projects list with arrow icon
- **Edit Button**: Opens modal to modify project name and description
- **Action Buttons**:
  - **Income Button**: Green gradient with plus icon and hover effects
  - **Expense Button**: Red gradient with minus icon and hover effects  
  - **Repay Button**: Blue gradient with return arrow icon and hover effects
- **Edit Modal**: 
  - Project name input field
  - Description textarea field
  - Save and cancel buttons
  - Form validation

#### Financial Overview
- **Balance Section**:
  - Total available balance
  - Amount spent from balance
  - Remaining balance funds
  - Emerald color theme with dollar icon
- **Loans Section**:
  - Total borrowed amount
  - Amount repaid
  - Outstanding loan balance
  - Orange color theme with wallet icon
- **Investments Section**:
  - Total investment funds
  - Investment expenses (placeholder)
  - Remaining investment funds
  - Purple color theme with trending icon

#### User Journey
1. **Navigation**: Access from projects list or direct URL
2. **Data Loading**: Fetch project details and financial statistics
3. **Dashboard View**: Display project information and financial overview
4. **Edit Capability**: Modify project name and description via modal
5. **Action Planning**: Visual buttons for future income/expense/repay actions
6. **Financial Monitoring**: Real-time view of fund allocation and usage

#### Technical Implementation
- **API Integration**: 
  - GET /api/projects/[id] for project details
  - PUT /api/projects/[id] for project updates
  - GET /api/projects/[id]/dashboard for financial statistics
- **Data Transformation**: Convert API response to frontend interface format
- **State Management**: React hooks for project data, stats, and modal states
- **Error Handling**: Fallback values and user-friendly error messages
- **Responsive Design**: Mobile-first approach with grid layouts

### Navigation Bar
**Purpose**: Consistent navigation and user management across authenticated pages

#### Features
- **Logo/Brand**: Finance Manager branding with icon
- **Navigation Links**: Projects, Beneficiaries, Payments, Loans
- **User Profile**: Dropdown with user info and settings
- **Sign Out**: Secure logout functionality
- **Responsive**: Hidden on mobile, collapsible menu

#### User Experience
- **Profile Dropdown**: User name, email, and account options
- **Hover States**: Smooth transitions on all interactive elements
- **Glass Morphism**: Consistent with overall design theme
- **Accessibility**: Proper focus states and keyboard navigation

### Layout System
**Purpose**: Conditional navigation and consistent styling

#### Features
- **Conditional Navbar**: Hidden on authentication pages, visible on main app
- **Responsive Design**: Mobile-friendly layout system
- **Font Integration**: Geist Sans and Geist Mono fonts
- **Global Styling**: Consistent theme across application

---

## Design System

### Color Palette
- **Primary Background**: Gradient from slate-900 to slate-800
- **Card Background**: Semi-transparent white (5% opacity) with backdrop blur
- **Text Colors**: White for headings, slate-400 for secondary text
- **Accent Colors**: Blue and purple gradients for interactive elements
- **Border Colors**: Semi-transparent white for subtle definition

### Typography
- **Primary Font**: Geist Sans (clean, modern)
- **Monospace Font**: Geist Mono (for technical elements)
- **Heading Hierarchy**: Bold weights with proper spacing
- **Body Text**: Medium weight with good readability

### Interactive States
- **Hover Effects**: Smooth transitions with color and shadow changes
- **Active States**: Scale animations for tactile feedback
- **Focus States**: Proper accessibility indicators
- **Loading States**: Clear visual feedback during operations

### Responsive Behavior
- **Mobile First**: Designed for mobile devices primarily
- **Tablet Adaptation**: Proper scaling for medium screens
- **Desktop Enhancement**: Optimized for larger displays
- **Touch Friendly**: Appropriate touch targets and spacing

---

## Current Implementation Status

### ✅ Completed Features
- Modern login screen with Google OAuth
- Authentication flow and redirects
- Responsive design system
- Clean UI/UX with sharp edges
- Session management
- Modern navigation bar with user profile
- Loading states
- Projects management interface
- Folder-style project display
- Enhanced project creation modal with budget and description
- Individual project dashboard
- Project editing capabilities
- Financial overview with balance, loans, and investments
- Action buttons for income, expense, and repay operations
- Real-time financial statistics integration
- Reusable UI components
- Component-based architecture

### 🔄 Basic Structure
- API endpoint structure
- Database schema (Prisma)
- Shared UI components (BackgroundLayout, Modal, Navbar)

### 📋 Future Development
- Beneficiary management
- Payment tracking
- Loan management
- Financial reporting
- File attachments
- Advanced dashboard features

---

## Technical Stack

- **Frontend**: Next.js 15 with React
- **Styling**: Tailwind CSS with custom animations
- **Authentication**: NextAuth.js with Google OAuth
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Ready for modern hosting platforms
- **TypeScript**: Full type safety throughout application

This documentation will be expanded as new features are implemented and additional screens are developed.
