# Productify

A modern web application built with Next.js, React, featuring a beautiful UI powered by Tailwind CSS and Radix UI components.

## Features

### 🤖 AI-Powered Productivity Assistant
- Intelligent AI assistant that answers questions about your productivity metrics
- Natural language queries about team performance and project status
- Real-time insights and recommendations based on your data

### 📊 Interactive Productivity Dashboard
- Customizable dashboard with drag-and-drop metric cards
- Date range selection for historical data analysis
- Project-based filtering to focus on specific initiatives
- Interactive charts and visualizations for performance metrics
- Real-time data updates and trend analysis

### 👥 User Management
- Complete user profile management (Create, Read, Update, Delete)
- User performance tracking and analytics

### 📈 Performance Analytics
- Sort and filter user performance data
- Customizable performance metrics
- Team and individual performance comparisons

### 📱 Responsive Design
- Seamless experience across all devices
- Mobile-optimized interface
- Touch-friendly interactions
- Adaptive layouts for different screen sizes

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account and project setup

## Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd productify
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your Firebase configuration:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
```

## Running the Application

### Development Mode

To run the application in development mode:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:9002`

### Production Build

To create a production build:

```bash
npm run build
# or
yarn build
```

To start the production server:

```bash
npm run start
# or
yarn start
```

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Tech Stack

- **Framework**: Next.js 15.2.3
- **UI Library**: React 18.3.1
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: Zustand
- **Form Handling**: React Hook Form
- **Charts**: Recharts
- **Drag and Drop**: dnd-kit
- **Type Safety**: TypeScript

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
