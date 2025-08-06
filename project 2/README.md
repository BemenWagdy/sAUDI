# Visit Saudi Concierge

An AI-powered travel itinerary generator for Saudi Arabia, built with Next.js 14, TypeScript, and Groq AI.

## Features

- **AI-Generated Itineraries**: Personalized travel plans using Groq AI
- **Real-time Weather**: Live weather forecasts with visual charts
- **Cultural Guidance**: Respectful travel tips and visa information
- **Restaurant Recommendations**: Curated dining experiences
- **Car Rental Integration**: Transportation options and pricing
- **PDF Export**: Download complete itineraries
- **Responsive Design**: Optimized for mobile and desktop

## Technologies

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion
- **AI**: Groq API with Llama 3 models
- **APIs**: Open-Meteo (weather), ExchangeRate.host (currency)
- **UI Components**: shadcn/ui, Lucide React icons
- **PDF Generation**: html2canvas + jsPDF

## Getting Started

### Prerequisites

- Node.js 18+ (Node 20 recommended)
- Groq API key (free at groq.com)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd visit-saudi-concierge

# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local
```

### Environment Setup

Create `.env.local` with:

```env
GROQ_API_KEY=your_groq_api_key_here
OPEN_METEO_URL=https://api.open-meteo.com/v1/forecast
EXCHANGE_URL=https://api.exchangerate.host/convert
QUICKCHART_URL=https://quickchart.io/chart
WEBOOK_BASE=https://webook.com
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### Build & Deploy

```bash
# Build for production
npm run build

# Deploy to Vercel (recommended)
vercel --prod
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── compile/route.ts    # AI itinerary generation
│   │   └── weather/route.ts    # Weather data API
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── questionnaire-form.tsx  # Multi-step form
│   └── itinerary-display.tsx   # Results display
├── lib/
│   ├── schemas.ts              # Zod validation schemas
│   ├── currency.ts             # Currency conversion
│   ├── weather.ts              # Weather utilities
│   └── car-rental.ts           # Car rental logic
└── data/
    ├── restaurants.json        # Restaurant database
    └── cultural-tips.ts        # Cultural guidance
```

## Key Features Explained

### Multi-Step Questionnaire
- Origin country with currency detection
- Travel dates with validation
- Party size and budget conversion to SAR
- Interest selection with visual checkboxes
- Preference settings (food, mobility, transport)

### AI Itinerary Generation
- Groq AI with streaming responses
- Context-aware recommendations
- Cultural sensitivity integration
- Real-time data incorporation

### Weather Integration
- 7-day forecasts for major Saudi cities
- Visual weather charts via QuickChart
- Temperature and precipitation data

### Cultural Guidance
- Visa requirements by nationality
- Religious and cultural etiquette
- Local customs and expectations
- Practical travel tips

## Common Issues & Solutions

### SWC Download Failures
```bash
npm install -D @next/swc-wasm-nodejs
```

### Node Version Issues
```bash
nvm use 20
```

### API Rate Limits
- Groq: 30 requests/minute (free tier)
- Open-Meteo: No rate limits
- ExchangeRate.host: 1000 requests/month (free)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- GitHub Issues: Create an issue in the repository
- Documentation: Check the inline code comments
- API Documentation: Refer to individual API provider docs

---

Built with ❤️ for Saudi Arabia tourism