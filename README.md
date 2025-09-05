# City Country Quest

A web application that allows users to find the country of any city using Google Maps Geocoding API. Features real-time autocomplete suggestions and normalized city/country information.

## 🌍 Live Demo

- **Lovable Preview**: [https://lovable.dev/projects/f6295844-2065-4ed1-9740-964901c9808b](https://lovable.dev/projects/f6295844-2065-4ed1-9740-964901c9808b)
- **GitHub Repository**: [https://github.com/sems-polat/city-country-quest](https://github.com/sems-polat/city-country-quest)
- **Netlify Deployment**: [Your Netlify URL here]

## 👥 Contributors

| Name | GitHub Username | Harvard Email | Role |
|------|----------------|---------------|------|
| Sems Polat | [@sems-polat](https://github.com/sems-polat) | semspolat@college.harvard.edu | Full-stack Developer |

## 🛠️ Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase Edge Functions (Deno)
- **APIs**: Google Maps Geocoding API, Google Places API
- **Deployment**: Netlify
- **Development Platform**: Lovable (used instead of Bolt due to existing subscription)

## ✨ Features

- **Real-time City Autocomplete**: Powered by Google Places API
- **Country Resolution**: Get accurate country information for any city
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Error Handling**: Comprehensive error messages and loading states
- **SEO Optimized**: Proper meta tags and semantic HTML

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- Google Maps API Key with the following APIs enabled:
  - Places API (New)
  - Geocoding API
  - Maps JavaScript API

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sems-polat/city-country-quest.git
   cd city-country-quest
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Supabase:
   - Create a Supabase project
   - Add your Google Maps API key as a Supabase secret named `GOOGLE_MAPS_API_KEY`

4. Start the development server:
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── AutocompleteDropdown.tsx
│   ├── CitySearch.tsx      # Main search component
│   └── SearchResult.tsx    # Results display
├── pages/
│   └── Index.tsx          # Home page
├── integrations/
│   └── supabase/          # Supabase client configuration
└── assets/                # Static assets

supabase/
└── functions/
    ├── autocomplete-cities/  # City autocomplete API
    └── resolve-city/        # City resolution API
```

## 🎯 What Was Built

- **Frontend Components**: 
  - Responsive city search interface with autocomplete
  - Real-time search suggestions dropdown
  - Results display with city and country information
  - Loading states and error handling

- **Backend Services**:
  - Supabase Edge Functions for Google Maps API integration
  - CORS-enabled API endpoints
  - Error handling and logging

- **Deployment Configuration**:
  - Netlify deployment setup with SPA routing
  - Build optimization and environment configuration

## 🐛 Issues Encountered & Solutions

### 1. Netlify Deployment Issues
**Problem**: The application worked perfectly in Lovable's preview environment but showed a blank page when deployed to Netlify.

**Root Cause**: Missing SPA (Single Page Application) redirect configuration for client-side routing.

**Solution**: 
- Added `public/_redirects` file with `/*    /index.html   200`
- Created `netlify.toml` with proper build configuration and redirect rules
- Configured proper build directory (`dist`) and build command

### 2. Google Maps API Configuration
**Problem**: Setting up Google Maps API restrictions and enabling the correct APIs took significant time.

**Solution**: 
- Enabled all required APIs: Places API (New), Geocoding API, Maps JavaScript API
- Configured HTTP referrer restrictions for both development and production domains
- Added proper API key management through Supabase secrets

### 3. CORS Configuration
**Problem**: Initial edge function calls were blocked by CORS policies.

**Solution**: Implemented proper CORS headers in all Supabase Edge Functions with preflight request handling.

## ⏱️ Development Time

**Total Time Invested**: 2 hours

**Time Breakdown**:
- Initial setup and basic functionality: 45 minutes
- Google Maps API integration and configuration: 30 minutes  
- Deployment troubleshooting and Netlify setup: 30 minutes
- Testing, debugging, and final touches: 15 minutes

## 🚀 Deployment

The application is deployed on Netlify with automatic builds from the GitHub repository. The deployment includes:

- Optimized production build
- SPA routing configuration
- Proper environment variable handling
- CDN distribution

## 📝 Development Notes

- **Platform Choice**: Used Lovable instead of Bolt as I already have an active subscription and didn't want to pay for another similar platform
- **API Strategy**: Leveraged Supabase Edge Functions to securely handle Google Maps API calls without exposing API keys to the client
- **Performance**: Implemented debounced autocomplete to reduce API calls and improve user experience

## 🤝 Support

If you encounter any issues or have questions, please open an issue on the GitHub repository.

---

*Built with ❤️ using Lovable, React, and Supabase*
