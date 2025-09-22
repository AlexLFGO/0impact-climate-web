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
  // Based on actual network data from CSV
  const validators = 121;
  const storageNodes = 3500;
  const daNodes = 350; // DA Verifiers (100) + Retrievers (250)
  const computeNodes = 0; // No node count in CSV for compute
  const alignmentNodes = 175500;

  const totalNodes = validators + storageNodes + daNodes + computeNodes + alignmentNodes;

  // Power consumption from CSV (Daily kWh converted to kW)
  const validatorPower = 781.18 / 24; // ~32.5 kW
  const storagePower = 12600 / 24; // 525 kW
  const daPower = 240 / 24; // 10 kW (combined verifiers and retrievers)
  const computePower = 29315.07 / 24; // ~1221.5 kW
  const alignmentPower = 21060 / 24; // 877.5 kW

  const totalPower = validatorPower + storagePower + daPower + computePower + alignmentPower;

  // Daily emissions from CSV (in tCO2, convert to kg)
  const dailyEmissionsKg = 30.658 * 1000; // Convert tCO2 to kg (30.658 from CSV TOTAL)

  // Annual energy from CSV (MWh/year)
  const totalEnergy = 23358.629; // 23,358.629 MWh/year from CSV TOTAL
  
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

// Generate metrics for each layer based on actual CSV data
export function generateLayerMetrics(): LayerMetrics[] {
  // Trees saved calculation: 1 tree absorbs ~22kg CO2/year
  // We show trees that would be needed to offset daily emissions
  const treesPerKgCO2Daily = 1 / (22 / 365); // ~0.0164 trees per kg CO2 per day

  return [
    {
      layer: 'ØG Alignment',
      nodes: 175500,
      power: 877.5, // kW hourly
      emissions: 9667, // kg CO2/day
      dailyEnergy: 21060, // kWh/day
      annualEnergy: 7686.9, // MWh/year
      annualEmissions: 3528.3, // tons CO2/year
      efficiency: 0, // deprecated
      utilization: 77,
      treesSaved: Math.round(9667 * treesPerKgCO2Daily),
      status: 'live'
    },
    {
      layer: 'ØG Validator',
      nodes: 121,
      power: 32.5, // kW hourly
      emissions: 354, // kg CO2/day
      dailyEnergy: 781.2, // kWh/day
      annualEnergy: 285.1, // MWh/year
      annualEmissions: 129.1, // tons CO2/year
      efficiency: 0, // deprecated
      utilization: 60,
      treesSaved: Math.round(354 * treesPerKgCO2Daily),
      status: 'live'
    },
    {
      layer: 'ØG Storage',
      nodes: 3500,
      power: 525, // kW hourly
      emissions: 5040, // kg CO2/day
      dailyEnergy: 12600, // kWh/day
      annualEnergy: 4599, // MWh/year
      annualEmissions: 1839.6, // tons CO2/year
      efficiency: 0, // deprecated
      utilization: 80,
      treesSaved: Math.round(5040 * treesPerKgCO2Daily),
      status: 'calibrating'
    },
    {
      layer: 'ØG DA',
      nodes: 350, // Combined DA Verifiers (100) + Retrievers (250)
      power: 10, // kW hourly (5 + 5)
      emissions: 96, // kg CO2/day (0.048 + 0.048 tCO2)
      dailyEnergy: 240, // kWh/day (120 + 120)
      annualEnergy: 87.6, // MWh/year (43.8 + 43.8)
      annualEmissions: 35.04, // tons CO2/year (17.52 + 17.52)
      efficiency: 0, // deprecated
      utilization: 67,
      treesSaved: Math.round(96 * treesPerKgCO2Daily),
      status: 'calibrating'
    },
    {
      layer: 'ØG Compute',
      nodes: 0, // No node count provided in CSV
      power: 1221.5, // kW hourly
      emissions: 15501, // kg CO2/day
      dailyEnergy: 29315.1, // kWh/day
      annualEnergy: 10700, // MWh/year
      annualEmissions: 5658, // tons CO2/year
      efficiency: 0, // deprecated
      utilization: 0,
      comingSoon: true
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
  const validators = distributeNodes(121, CITY_LOCATIONS);
  const storage = distributeNodes(3500, CITY_LOCATIONS);
  const da = distributeNodes(350, CITY_LOCATIONS);
  const compute = distributeNodes(0, CITY_LOCATIONS);
  const alignment = distributeNodes(175500, CITY_LOCATIONS);
  
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