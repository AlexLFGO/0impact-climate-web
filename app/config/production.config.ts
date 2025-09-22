/**
 * Production Configuration for 0impact Climate Dashboard
 *
 * IMPORTANT: Update these values based on actual network data
 * All energy values are from the CSV data provided
 */

export const PRODUCTION_CONFIG = {
  // Update frequency in milliseconds (3 seconds for live feel)
  UPDATE_INTERVAL: 3000,

  // Carbon credit purchase rate for carbon neutrality
  // Annual emissions: 11,190 tCO₂
  // To offset 100%: 11,190 tCO₂/year ÷ 365 days ÷ 24 hours = 1.2774 tCO₂/hour
  // 1 carbon credit = 1 tCO₂ removed
  CARBON_CREDITS_PER_HOUR: 1.2774, // Carbon credits (tCO₂) purchased per hour

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
      hourlyPower: 877.5, // kW
      dailyEnergy: 21060, // kWh
      annualEnergy: 7686.9, // MWh
      dailyEmissions: 9667, // kg CO2
      annualEmissions: 3528.3, // tons CO2
      status: 'live' as const,
      icon: 'users'
    },
    validator: {
      name: 'ØG Validator',
      nodes: 121,
      hourlyPower: 32.5, // kW
      dailyEnergy: 781.2, // kWh
      annualEnergy: 285.1, // MWh
      dailyEmissions: 354, // kg CO2
      annualEmissions: 129.1, // tons CO2
      status: 'live' as const,
      icon: 'server'
    },
    storage: {
      name: 'ØG Storage',
      nodes: 3500,
      hourlyPower: 525, // kW
      dailyEnergy: 12600, // kWh
      annualEnergy: 4599, // MWh
      dailyEmissions: 5040, // kg CO2
      annualEmissions: 1839.6, // tons CO2
      status: 'calibrating' as const,
      icon: 'harddrive'
    },
    da: {
      name: 'ØG DA',
      nodes: 350,
      hourlyPower: 10, // kW
      dailyEnergy: 240, // kWh
      annualEnergy: 87.6, // MWh
      dailyEmissions: 96, // kg CO2
      annualEmissions: 35.04, // tons CO2
      status: 'calibrating' as const,
      icon: 'database'
    },
    compute: {
      name: 'ØG Compute',
      nodes: 0,
      hourlyPower: 1221.5, // kW
      dailyEnergy: 29315.1, // kWh
      annualEnergy: 10700, // MWh
      dailyEmissions: 15501, // kg CO2
      annualEmissions: 5658, // tons CO2
      status: 'coming_soon' as const,
      icon: 'cpu'
    }
  },

  // Total network metrics (from CSV TOTAL row)
  NETWORK_TOTALS: {
    totalNodes: 179471,
    dailyEnergy: 63996.24, // kWh
    annualEnergy: 23358.629, // MWh
    dailyEmissions: 30658, // kg CO2
    annualEmissions: 11190, // tons CO2
    hourlyPower: 2666.5 // kW
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