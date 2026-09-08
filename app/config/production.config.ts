/**
 * Production Configuration for 0impact Climate Dashboard
 *
 * IMPORTANT: Update these values based on actual network data
 * All energy values are from the CSV data provided
 */

export const PRODUCTION_CONFIG = {
  // Update frequency in milliseconds (3 seconds for live feel)
  UPDATE_INTERVAL: 3000,

  // Legacy modeling constant — no longer drives any rendered metric. Retained for
  // dead-code components (OffsetCounter / LiveEmissions) that compute illustrative figures.
  // Matches live retirement cadence: 1.0857 tCO₂/hour = 0.0905 every 5 min = 9,511 t/year.
  CARBON_CREDITS_PER_HOUR: 1.0857,

  // Genesis timestamp (6 hours before deployment)
  GENESIS_HOURS_AGO: 6, // Network started 6 hours ago

  // Tree absorption rate (kg CO2 per tree per year)
  TREE_CO2_ABSORPTION_PER_YEAR: 22,

  // Carbon intensity (kg CO2 per kWh) - global average
  DEFAULT_CARBON_INTENSITY: 0.5,

  // Network layers configuration (from CSV data)
  LAYERS: {
    alignment: {
      name: 'ØG Alignment',
      nodes: 175500,
      hourlyPower: 748.1, // kW (scaled by 0.8524)
      dailyEnergy: 17954.7, // kWh (scaled by 0.8524)
      annualEnergy: 6553.5, // MWh (scaled by 0.8524)
      dailyEmissions: 8240.6, // kg CO2 (scaled by 0.8524)
      annualEmissions: 3007.4, // tons CO2 (scaled by 0.8524)
      status: 'live' as const,
      icon: 'users'
    },
    validator: {
      name: 'ØG Validator',
      nodes: 121,
      hourlyPower: 27.7, // kW (scaled by 0.8524)
      dailyEnergy: 665.9, // kWh (scaled by 0.8524)
      annualEnergy: 243.0, // MWh (scaled by 0.8524)
      dailyEmissions: 301.8, // kg CO2 (scaled by 0.8524)
      annualEmissions: 110.1, // tons CO2 (scaled by 0.8524)
      status: 'live' as const,
      icon: 'server'
    },
    storage: {
      name: 'ØG Storage',
      nodes: 3500,
      hourlyPower: 447.5, // kW (scaled by 0.8524)
      dailyEnergy: 10740.7, // kWh (scaled by 0.8524)
      annualEnergy: 3920.4, // MWh (scaled by 0.8524)
      dailyEmissions: 4296.3, // kg CO2 (scaled by 0.8524)
      annualEmissions: 1568.1, // tons CO2 (scaled by 0.8524)
      status: 'calibrating' as const,
      icon: 'harddrive'
    },
    da: {
      name: 'ØG DA',
      nodes: 350,
      hourlyPower: 8.5, // kW (scaled by 0.8524)
      dailyEnergy: 204.6, // kWh (scaled by 0.8524)
      annualEnergy: 74.7, // MWh (scaled by 0.8524)
      dailyEmissions: 81.8, // kg CO2 (scaled by 0.8524)
      annualEmissions: 29.9, // tons CO2 (scaled by 0.8524)
      status: 'calibrating' as const,
      icon: 'database'
    },
    compute: {
      name: 'ØG Compute',
      nodes: 0,
      hourlyPower: 1041.3, // kW (scaled by 0.8524)
      dailyEnergy: 24991.7, // kWh (scaled by 0.8524)
      annualEnergy: 9121.9, // MWh (scaled by 0.8524)
      dailyEmissions: 13210.8, // kg CO2 (scaled by 0.8524)
      annualEmissions: 4822.9, // tons CO2 (scaled by 0.8524)
      status: 'coming_soon' as const,
      icon: 'cpu'
    }
  },

  // Total network metrics (from CSV TOTAL row)
  NETWORK_TOTALS: {
    totalNodes: 179471,
    dailyEnergy: 54557.6, // kWh (scaled by 0.8524)
    annualEnergy: 19913.5, // MWh (scaled by 0.8524)
    dailyEmissions: 26131.3, // kg CO2 (scaled by 0.8524)
    annualEmissions: 9511.3, // tons CO2 (target achieved)
    hourlyPower: 2273.2 // kW (scaled by 0.8524)
  },

  // Geographic distribution weights for visualization
  GEOGRAPHIC_DISTRIBUTION: {
    'Frankfurt': 0.15,
    'New York': 0.12,
    'San Francisco': 0.10,
    'London': 0.08,
    'Paris': 0.07,
    'Tokyo': 0.08,
    'Singapore': 0.06,
    'Sydney': 0.05,
    'Toronto': 0.05,
    'Stockholm': 0.05,
    'Amsterdam': 0.05,
    'Zurich': 0.04,
    'Dubai': 0.03,
    'Seoul': 0.04,
    'Mumbai': 0.02,
    'São Paulo': 0.01
  }
};

// Helper function to calculate trees needed for offset
export function calculateTreesNeeded(co2Kg: number): number {
  const treesPerKgCO2Daily = 1 / (PRODUCTION_CONFIG.TREE_CO2_ABSORPTION_PER_YEAR / 365);
  return Math.round(co2Kg * treesPerKgCO2Daily);
}

// Helper function to format large numbers
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toFixed(0);
}