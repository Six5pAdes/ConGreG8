# ConGreG8

**Find Your Perfect Church Community**

ConGreG8 is a comprehensive web application designed to help individuals discover their ideal church community. By analyzing factors such as congregation size, age demographics, ethnic diversity, language preferences, denomination, and service opportunities, we match you with churches that align with your values and community goals.

## Live Link

https://congreg8.onrender.com/

## What ConGreG8 Does

ConGreG8 bridges the gap between church seekers and faith communities by providing:

- **Smart Matching**: Algorithm-based church recommendations based on your preferences
- **Comprehensive Profiles**: Detailed church information including services, demographics, and community features
- **Community Reviews**: Authentic feedback from church members and visitors
- **Volunteer Opportunities**: Discover ways to serve and get involved
- **Interactive Maps**: Visual church discovery with location-based search
- **Personalized Experience**: Save favorites and track your church exploration journey

## Repository Structure

```
ConGreG8/
├── backend/                 # Node.js/Express API server
│   ├── config/             # Database configuration
│   ├── controllers/        # API route handlers
│   ├── middleware/         # Authentication & error handling
│   ├── models/            # MongoDB/Mongoose schemas
│   ├── routes/            # API endpoint definitions
│   ├── scripts/           # Database utilities
│   ├── server/            # Main server entry point
│   └── utils/             # Helper functions
├── frontend/              # React/Vite client application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route components
│   │   ├── store/         # Zustand state management
│   │   └── ui/            # UI component library
│   └── vite.config.js     # Vite configuration
└── db_diagram.txt         # Database schema documentation
```

## Key Features

### For Church Seekers

- **Personalized Preferences**: Set your ideal church characteristics (size, age group, denomination, etc.)
- **Smart Matching**: Get church recommendations based on your preferences
- **Church Reviews**: Read and write reviews to help others make informed decisions
- **Interactive Map**: Discover churches in your area with visual mapping
- **Save Favorites**: Bookmark churches for later comparison
- **Volunteer Discovery**: Find service opportunities that match your interests

### For Church Representatives

- **Church Profiles**: Create and manage detailed church information
- **Attribute Management**: Set congregation demographics and characteristics
- **Service Opportunities**: Post volunteer and ministry opportunities
- **Community Engagement**: Respond to reviews and connect with potential members

### Core Functionality

- **User Authentication**: Secure login/signup with JWT tokens
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Dynamic content updates without page refreshes
- **Search & Filter**: Advanced filtering by multiple criteria
- **Dark/Light Mode**: User preference for interface themes

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Google Maps API key (for map functionality)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Six5pAdes/CongreG8.git
   cd ConGreG8
   ```

2. **Install dependencies**

   ```bash
   # Install backend dependencies
   npm install

   # Install frontend dependencies
   cd frontend
   npm install
   cd ..
   ```

3. **Environment Setup**

   Create a `.env` file in the root directory:

   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string

   # JWT
   JWT_SECRET=your_jwt_secret_key

   # Google Maps (for frontend)
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

   # Optional: Production settings
   NODE_ENV=development
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start the development servers**

   **Option A: Run both servers simultaneously**

   ```bash
   npm run dev
   ```

   **Option B: Run servers separately**

   ```bash
   # Terminal 1 - Backend (runs on port 5000)
   npm run dev

   # Terminal 2 - Frontend (runs on port 5173)
   cd frontend
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

### Production Build

```bash
# Build the entire application
npm run build

# Start production server
npm start
```

## 🛠️ Technology Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Chakra UI** - Component library
- **React Router** - Client-side routing
- **Zustand** - State management
- **Axios** - HTTP client
- **React Google Maps** - Map integration
- **Framer Motion** - Animations

## Database Schema

The application uses MongoDB with the following main collections:

- **Users** - User accounts and authentication
- **Churches** - Church profiles and information
- **ChurchAttributes** - Demographic and characteristic data
- **UserPreferences** - User preference settings
- **Reviews** - Church reviews and ratings
- **SavedChurches** - User's saved/favorite churches
- **ServiceOpportunities** - Volunteer and ministry opportunities

## License

This project is licensed under the ISC License.

---

**Built with ❤️ for faith communities everywhere**
