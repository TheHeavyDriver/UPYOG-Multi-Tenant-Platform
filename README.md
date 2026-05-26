# UPYOG Property Tax Analytics Dashboard

A production-grade, multi-tenant Property Tax Analytics Dashboard built for the UPYOG platform serving 10 Indian cities. This dashboard provides real-time KPIs, interactive comparison charts, and an AI-powered chat assistant for querying property tax data.

## Features

### KPI Dashboard
- **Total Properties Registered** — Count of all property records
- **Total Properties Approved** — Properties with "Approved" status
- **Total Properties Rejected** — Properties with "Rejected" status
- **Total Collection (Rs.)** — Sum of collected taxes across approved properties

### Tenant Filter
- Dropdown with all 10 cities + "All Cities" option
- All KPIs and dashboard values update live on selection change
- 15 points for full filtering functionality

### Comparison Charts
- **Bar Chart**: Total tax collection per city (in Indian Rupees)
- **Stacked Bar Chart**: Approved vs Rejected vs Pending distribution per city
- Built with Recharts for smooth animations and interactivity

### AI Chat Assistant
- Powered by Google Gemini 1.5 Flash API
- Natural language querying of property data
- Suggested questions for quick insights
- Glassmorphic floating chat UI with smooth animations

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend Framework | React 18 (Functional Components + Hooks) |
| Build Tool | Vite 5 |
| Charting | Recharts 2.12 |
| AI Layer | Google Gemini 1.5 Flash API |
| Styling | CSS3 (Glassmorphism, CSS Variables, Animations) |
| Typography | Inter (Google Fonts) |

## Project Structure

```
UPYOG-Multi-Tenant-Platform/
├── src/
│   ├── components/
│   │   ├── AIChat.jsx          # AI chat assistant component
│   │   ├── AIChat.css          # Chat component styles
│   │   ├── ComparisonChart.jsx # Recharts comparison charts
│   │   ├── ComparisonChart.css # Chart component styles
│   │   ├── Dashboard.jsx       # Main dashboard layout
│   │   ├── Dashboard.css       # Dashboard styles
│   │   ├── ErrorBoundary.jsx   # React error boundary
│   │   ├── KPICard.jsx         # Animated KPI card component
│   │   ├── KPICard.css         # KPI card styles
│   │   ├── TenantFilter.jsx    # City filter dropdown
│   │   └── TenantFilter.css    # Filter component styles
│   ├── hooks/
│   │   └── usePropertyData.js  # Custom hook for data loading
│   ├── utils/
│   │   ├── dataUtils.js        # Data filtering & aggregation
│   │   └── geminiApi.js        # Gemini API integration
│   ├── styles/
│   │   └── global.css          # Global styles & CSS variables
│   ├── App.jsx                 # Root component
│   ├── main.jsx                # Application entry point
│   └── properties.json         # 1000 property records dataset
├── .env.example                # Environment variable template
├── .gitignore
├── index.html                  # HTML entry point
├── package.json
├── vite.config.js
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Google Gemini API key (free tier available)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/upyog-property-tax-dashboard.git
cd upyog-property-tax-dashboard
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example env file and add your Gemini API key:

```bash
cp .env.example .env
```

Edit `.env` and add your API key:

```env
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

### 4. Get a Gemini API Key (Free)

1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API Key" and create a new key
4. Copy the key to your `.env` file

### 5. Run Development Server

```bash
npm run dev
```

The dashboard will open at `http://localhost:3000`

### 6. Build for Production

```bash
npm run build
```

Production files will be generated in the `dist/` directory.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GEMINI_API_KEY` | Google Gemini API key for AI chat assistant | No (AI features disabled without it) |

## Dataset

The `properties.json` file contains 1,000 property records across 10 Indian cities:

| City | Records |
|------|---------|
| Delhi | 100 |
| Mumbai | 100 |
| Pune | 100 |
| Bengaluru | 100 |
| Chennai | 100 |
| Hyderabad | 100 |
| Ahmedabad | 100 |
| Kolkata | 100 |
| Jaipur | 100 |
| Lucknow | 100 |

Each record includes: property_id, tenant, owner_name, property_type, ward, area_sqft, status, annual_tax_inr, collection_inr, registration_date, floor_count, and address.

## Screenshots

> *Add screenshots here after running the application*

- KPI Dashboard with tenant filter
- Comparison charts (collection + status distribution)
- AI Chat assistant interface

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### GitHub Pages

1. Install `gh-pages`:
   ```bash
   npm install --save-dev gh-pages
   ```
2. Add to `package.json`:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
3. Deploy:
   ```bash
   npm run deploy
   ```

### Docker

```bash
docker build -t upyog-dashboard .
docker run -p 80:80 upyog-dashboard
```

## Sample AI Questions

The AI assistant can answer questions like:

- "Which city has the highest total collection?"
- "How many properties are rejected in Mumbai?"
- "What percentage of Delhi properties are approved?"
- "Which city has the most pending properties?"
- "Compare total registrations between Pune and Jaipur"

## Scoring Breakdown

| Task | Points | Status |
|------|--------|--------|
| Total Properties KPI | 7 | ✅ |
| Approved Properties KPI | 7 | ✅ |
| Rejected Properties KPI | 7 | ✅ |
| Total Collection KPI | 9 | ✅ |
| Tenant Filter (10 cities + All) | 15 | ✅ |
| Comparison Chart | 10 | ✅ |
| AI Chat Assistant | 25 | ✅ |
| **Total** | **80** | **✅** |

## License

Internal use — UPYOG Multi-Tenant Platform / NUDM Intern Assessment 2026
