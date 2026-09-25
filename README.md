# ØG Climate Impact Monitor

A real-time dashboard showcasing the environmental impact and carbon footprint of ØG's decentralized AI infrastructure.

## Overview

This dashboard provides transparent, data-driven insights into ØG's carbon emissions across all network layers, demonstrating our commitment to building sustainable AI infrastructure. Built with Next.js 15 and TypeScript, it features real-time metrics, beautiful visualizations, and comprehensive emissions tracking.

## Features

- **Live Network Impact**: Real-time tracking of credit retirements, clean energy usage, and documented climate accounting
- **Layer-by-Layer Analysis**: Detailed metrics for each ØG network layer (Chain, Storage, DA, Compute, Alignment)
- **Emissions Tracking**: Historical data visualization showing trends and improvements
- **Carbon-Aware Consensus**: Explanation of how ØG's consensus mechanism automatically offsets emissions
- **Energy Source Breakdown**: Visualization of renewable vs. non-renewable energy usage

## Technology Stack

- **Framework**: Next.js 15.4.5 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/0g-labs/0impact-climate.git
cd 0impact-climate
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

### Configuration

- `IMPACT_API_BASE_URL` (server-side only, optional): upstream worker for the `/api/impact` proxy.
  Defaults to `https://api.0impact.ai`; set e.g. `http://localhost:8787` to test against a local
  worker. Must be a plain http(s) URL (no credentials, query or fragment); an invalid value makes
  the proxy return HTTP 500. The proxy only forwards the allow-listed read-only endpoints
  (`/status`, `/transactions`, `/certificates`, `/certificate`, `/daily-summary`, `/consumption`,
  `/health`).

### Tests

```bash
npm test
```

The tests import the `.ts` sources directly, so they need Node.js 22.18 or later. To also check the
retirement-reason parser against the Mode D conformance vectors, set
`MODE_D_VECTORS=/path/to/mode-d-conformance/vectors/test_vectors.json`.

## Data Sources & Methodology

The emissions calculations are based on:

- **StorageScan**: Real-time data on 928 active storage miners
- **Testnet Metrics**: 63 validators currently active
- **Hardware Assumptions**: Conservative power estimates per node type
- **Carbon Intensity**: Global average of 0.5 kg CO₂/kWh

See `docs/strategy.md` for the complete emissions estimation methodology.

## Project Structure

```
0impact-climate/
├── app/
│   ├── components/        # React components
│   ├── lib/              # Data models and utilities
│   ├── globals.css       # Global styles with ØG design system
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main dashboard page
├── public/
│   ├── images/           # Static images
│   └── videos/           # Background videos
├── docs/                 # Documentation and methodology
└── README.md
```

## Design System

The dashboard follows ØG's official design system with:
- Purple gradient color palette (#b75fff to #320071)
- Dark theme with high contrast
- Geist font family
- Glass morphism effects on cards

## Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- ØG Labs for providing the infrastructure and data
- The ØG community for supporting sustainable AI development

---

Built with 💜 by ØG Labs - Building AI That Puts Our Planet First