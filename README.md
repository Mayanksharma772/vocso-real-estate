# Real Estate Explorer

A Next.js application that scrapes real estate projects from MagicBricks and displays them on an interactive map with real-time data loading.

## Features

- **Dynamic Routing**: Access projects by city using `/city/[cityName]` URLs
- **Real-time Scraping**: Live data from MagicBricks with incremental loading
- **Interactive Maps**: Leaflet.js integration with project markers and popups
- **Geocoding**: PositionStack API integration for location coordinates
- **Responsive Design**: Tailwind CSS styling with mobile-friendly interface
- **State Management**: Zustand for real-time data updates

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Scraping**: Puppeteer with stealth mode
- **Maps**: Leaflet.js & React-Leaflet
- **State**: Zustand
- **HTTP**: Axios
- **Parsing**: Cheerio

## Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn
- PositionStack API key

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local` file:
   ```env
   POSITIONSTACK_API_KEY=your_api_key_here
   NEXT_PUBLIC_POSITIONSTACK_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Home Page
- Enter any city name or select from popular cities
- Click "Explore Projects" to start scraping

### City Page
- View real-time scraping progress
- See projects load incrementally
- Click "View on Map" to locate projects
- Interactive map with project details in popups

## API Endpoints

### `GET /api/scrape/[city]`
Scrapes all projects for a city at once.

### `POST /api/scrape/[city]`
Supports pagination for real-time loading:
```json
{
  "offset": 0,
  "limit": 5
}
```

## Project Structure

```
src/
├── app/
│   ├── api/scrape/[city]/route.ts    # Scraping API endpoints
│   ├── city/[cityName]/page.tsx      # Dynamic city pages
│   └── page.tsx                      # Home page
├── components/
│   ├── MapComponent.tsx              # Leaflet map integration
│   ├── ProjectCard.tsx               # Project display cards
│   ├── LoadingSpinner.tsx            # Loading animations
│   └── ProgressBar.tsx               # Progress tracking
├── store/
│   └── projectStore.ts               # Zustand state management
├── types/
│   └── index.ts                      # TypeScript definitions
└── utils/
    ├── scraper.ts                    # MagicBricks scraping logic
    └── geocoding.ts                  # PositionStack integration
```

## Features Implemented

✅ Dynamic routing with `/city/[cityName]`
✅ Real-time MagicBricks scraping with Puppeteer
✅ PositionStack API geocoding integration
✅ Interactive Leaflet maps with markers and popups
✅ Incremental data loading with progress tracking
✅ Responsive Tailwind CSS design
✅ Error handling and loading states
✅ TypeScript support throughout
✅ Zustand state management

## Environment Variables

- `POSITIONSTACK_API_KEY`: Server-side PositionStack API key
- `NEXT_PUBLIC_POSITIONSTACK_API_KEY`: Client-side PositionStack API key

## Scraping Strategy

The application uses multiple fallback strategies:

1. **Primary**: Target MagicBricks-specific selectors
2. **Secondary**: Generic card/project selectors
3. **Fallback**: Mock data for demonstration

This ensures the app works even if MagicBricks changes their HTML structure.

## Notes

- Puppeteer runs in headless mode with stealth plugin to avoid detection
- Mock data is provided as fallback for demonstration purposes
- Real-time updates use polling mechanism with 1-second intervals
- Coordinates are geocoded using PositionStack API with city-based fallbacks

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
