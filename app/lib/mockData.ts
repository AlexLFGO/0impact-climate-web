import { NODE_SPECS, CARBON_INTENSITY_BY_REGION, NodeLocation, NetworkMetrics, LayerMetrics, CommunityNode } from './types';

// Major cities with their coordinates and carbon intensity
const CITY_LOCATIONS: NodeLocation[] = [
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
  { id: 'sao', lat: -23.5505, lng: -46.6333, city: 'São Paulo', country: 'Brazil', carbonIntensity: 0.25, renewablePercentage: 80 },
];

// Generate random distribution of nodes across locations
function distributeNodes(nodeCount: number, locations: NodeLocation[]): Map<string, number> {
  const distribution = new Map<string, number>();
  
  // Favor certain locations for realism
  const weights = {
    'fra': 0.15, 'nyc': 0.12, 'sfo': 0.10, 'lon': 0.08, 'par': 0.07,
    'tok': 0.08, 'sin': 0.06, 'syd': 0.05, 'tor': 0.05, 'sto': 0.05,
    'ams': 0.05, 'zur': 0.04, 'dub': 0.03, 'seo': 0.04, 'mum': 0.02, 'sao': 0.01
  };
  
  locations.forEach(loc => {
    const weight = weights[loc.id as keyof typeof weights] || 0.01;
    const count = Math.floor(nodeCount * weight + Math.random());
    distribution.set(loc.id, count);
  });
  
  return distribution;
}

// Calculate emissions for a set of nodes
function calculateEmissions(nodeCount: number, powerPerNode: number, carbonIntensity: number): number {
  const hoursPerYear = 8760;
  const pue = 1.3; // Power Usage Effectiveness for datacenters
  return (nodeCount * powerPerNode * hoursPerYear * carbonIntensity * pue) / 1000000; // Convert to tons
}

// Generate projected metrics based on strategy.md estimations
export function generateNetworkMetrics(): NetworkMetrics {
  // Based on strategy.md:
  // Validators: 63 on current testnet (8000+ possible on mainnet)
  // Storage: 928 active miners from StorageScan
  // DA: ~150 estimated
  // Compute: ~50 GPUs estimated
  // Alignment: 1000 estimated active (from 175,500 sold)
  
  const validators = 63;
  const storageNodes = 928; // Active miners from StorageScan
  const daNodes = 150; // Estimated
  const computeNodes = 50; // Estimated GPUs
  const alignmentNodes = 1000; // Estimated active
  
  const totalNodes = validators + storageNodes + daNodes + computeNodes + alignmentNodes;
  
  // Calculate power (in kW) based on strategy.md assumptions
  const validatorPower = validators * 0.2; // 200W per validator
  const storagePower = storageNodes * 0.15; // 150W per storage node (PoRA mining)
  const daPower = daNodes * 0.12; // 120W per DA node
  const computePower = computeNodes * 0.15; // 150W average per GPU (30% utilization)
  const alignmentPower = alignmentNodes * 0.1; // 100W per alignment node
  
  const totalPower = validatorPower + storagePower + daPower + computePower + alignmentPower;
  
  // Calculate daily emissions (kg CO2) using 0.5 kg/kWh global average
  const carbonIntensity = 0.5; // kg CO2 per kWh
  const dailyEmissionsKg = totalPower * 24 * carbonIntensity;
  
  // Calculate annual energy (MWh/year)
  const totalEnergy = totalPower * 8760 / 1000;
  
  // Decentralization score (percentage of community nodes)
  const decentralizationScore = (alignmentNodes / totalNodes) * 100;
  
  return {
    totalNodes,
    totalPower: Math.round(totalPower * 10) / 10,
    totalEmissions: Math.round(dailyEmissionsKg), // Daily kg CO2
    totalEnergy: Math.round(totalEnergy),
    decentralizationScore: Math.round(decentralizationScore),
    tps: 2500 + Math.floor(Math.random() * 100),
    dataAvailability: 50 + Math.random() * 2,
    storageCapacity: Math.round(storageNodes * 0.75 * 1000) / 1000, // TB
    computeCapacity: computeNodes * 120 + Math.random() * 10 // TFLOPS
  };
}

// Generate metrics for each layer based on strategy.md
export function generateLayerMetrics(): LayerMetrics[] {
  const carbonIntensity = 0.5; // kg CO2/kWh global average
  
  return [
    {
      layer: 'ØG Chain',
      nodes: 63,
      power: 12.6, // 63 * 0.2 kW
      emissions: Math.round(12.6 * 24 * carbonIntensity), // Daily kg CO2
      efficiency: 75 + Math.random() * 10, // vs hyperscaler data centers
      utilization: 50 + Math.random() * 20 // Moderate utilization per strategy.md
    },
    {
      layer: 'ØG Storage',
      nodes: 928,
      power: 139.2, // 928 * 0.15 kW
      emissions: Math.round(139.2 * 24 * carbonIntensity), // ~1,670 kg CO2/day
      efficiency: 80 + Math.random() * 10, // distributed storage vs S3/Azure
      utilization: 70 + Math.random() * 10 // 70% CPU load for PoRA
    },
    {
      layer: 'ØG DA',
      nodes: 150,
      power: 18.0, // 150 * 0.12 kW
      emissions: Math.round(18.0 * 24 * carbonIntensity), // ~216 kg CO2/day
      efficiency: 70 + Math.random() * 10, // vs centralized DA solutions
      utilization: 30 + Math.random() * 20 // 30-50% utilization
    },
    {
      layer: 'ØG Compute',
      nodes: 50,
      power: 7.5, // 50 * 0.15 kW (30% GPU utilization)
      emissions: Math.round(7.5 * 24 * carbonIntensity), // ~90 kg CO2/day
      efficiency: 65 + Math.random() * 15, // vs cloud GPU instances
      utilization: 30 + Math.random() * 10 // 30% average GPU utilization
    },
    {
      layer: 'Alignment Network',
      nodes: 1000,
      power: 100.0, // 1000 * 0.1 kW
      emissions: Math.round(100.0 * 24 * carbonIntensity), // ~1,200 kg CO2/day
      efficiency: 85 + Math.random() * 10, // community devices vs dedicated servers
      utilization: 20 + Math.random() * 10 // 20% utilization for monitoring
    }
  ];
}

// Generate historical data for charts based on strategy.md projections
export function generateHistoricalData(days: number = 30) {
  const data = [];
  const now = new Date();
  
  // Base daily emissions from strategy.md calculations
  const baseEmissionsKg = 3376; // Sum of all layers' daily emissions
  const baseEnergyKWh = baseEmissionsKg / 0.5; // Using 0.5 kg CO2/kWh
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Small daily variations (±5%)
    const variation = (Math.random() - 0.5) * 0.1;
    const dailyEmissions = baseEmissionsKg * (1 + variation);
    const dailyEnergy = baseEnergyKWh * (1 + variation);
    
    data.push({
      date: date.toISOString().split('T')[0],
      emissions: Math.round(dailyEmissions / 1000), // Convert to tons for display
      energy: Math.round(dailyEnergy / 1000), // Convert to MWh
      nodes: 2191 + Math.floor(Math.random() * 50), // Total nodes with small variation
      efficiency: 85 + Math.random() * 10 // Average efficiency
    });
  }
  
  return data;
}

// Generate node distribution data for the map
export function generateNodeDistribution() {
  const validators = distributeNodes(63, CITY_LOCATIONS);
  const storage = distributeNodes(120, CITY_LOCATIONS);
  const da = distributeNodes(45, CITY_LOCATIONS);
  const compute = distributeNodes(30, CITY_LOCATIONS);
  const alignment = distributeNodes(12000, CITY_LOCATIONS);
  
  return CITY_LOCATIONS.map(location => {
    const validatorCount = validators.get(location.id) || 0;
    const storageCount = storage.get(location.id) || 0;
    const daCount = da.get(location.id) || 0;
    const computeCount = compute.get(location.id) || 0;
    const alignmentCount = alignment.get(location.id) || 0;
    
    const totalCount = validatorCount + storageCount + daCount + computeCount + alignmentCount;
    
    // Calculate total power for this location
    const totalPower = 
      validatorCount * NODE_SPECS.validator.power +
      storageCount * NODE_SPECS.storageNode.power +
      daCount * NODE_SPECS.daNode.power +
      computeCount * 500 + // Estimate
      alignmentCount * 25; // Average
    
    const emissions = calculateEmissions(totalCount, totalPower / totalCount, location.carbonIntensity);
    
    return {
      ...location,
      validators: validatorCount,
      storage: storageCount,
      da: daCount,
      compute: computeCount,
      alignment: alignmentCount,
      total: totalCount,
      power: Math.round(totalPower / 1000 * 10) / 10, // kW
      emissions: Math.round(emissions * 10) / 10
    };
  }).filter(loc => loc.total > 0);
}

// Generate comparison data vs traditional AI
export function generateAIComparison() {
  return {
    inference: {
      'ØG': 0.002, // kg CO2 per inference
      'OpenAI': 0.015,
      'Google': 0.012,
      'AWS': 0.018
    },
    training: {
      'ØG': 12, // kg CO2 per training hour
      'OpenAI': 85,
      'Google': 72,
      'AWS': 90
    },
    storage: {
      'ØG': 0.05, // kg CO2 per TB per year
      'S3': 0.35,
      'Azure': 0.32,
      'GCP': 0.30
    }
  };
}

// Simulated data variations (not real-time)
export function subscribeToMetrics(callback: (metrics: NetworkMetrics) => void) {
  const interval = setInterval(() => {
    callback(generateNetworkMetrics());
  }, 30000); // Update every 30 seconds for visual effect only
  
  // Initial call
  callback(generateNetworkMetrics());
  
  // Return cleanup function
  return () => clearInterval(interval);
}