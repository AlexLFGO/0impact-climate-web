export interface NodeType {
  type: 'ØG Chain' | 'ØG Storage' | 'ØG DA' | 'ØG Compute' | 'Alignment Node';
  category: 'Validator' | 'Storage Node' | 'Storage KV' | 'DA Node' | 'DA Retriever' | 'DA Encoder' | 'DA Client' | 'Alignment';
  memory: string;
  cpu: string;
  disk: string;
  bandwidth: string;
  power: number; // Watts
}

export interface NodeLocation {
  id: string;
  lat: number;
  lng: number;
  city: string;
  country: string;
  carbonIntensity: number; // kg CO₂/kWh
  renewablePercentage: number;
}

export interface NetworkMetrics {
  totalNodes: number;
  totalPower: number; // kW
  totalEmissions: number; // tons CO₂/year
  totalEnergy: number; // MWh/year
  decentralizationScore: number; // percentage
  tps: number; // transactions per second
  dataAvailability: number; // GB/s
  storageCapacity: number; // TB
  computeCapacity: number; // TFLOPS
}

export interface LayerMetrics {
  layer: string;
  nodes: number;
  power: number; // kW
  emissions: number; // tons CO₂/year
  efficiency: number; // performance per watt
  utilization: number; // percentage
}

export interface CommunityNode {
  deviceType: 'laptop' | 'desktop' | 'mobile' | 'cloud';
  power: number; // Watts
  count: number;
  location: NodeLocation;
}

export const NODE_SPECS: Record<string, NodeType> = {
  validator: {
    type: 'ØG Chain',
    category: 'Validator',
    memory: '64 GB',
    cpu: '8 cores',
    disk: '1-4 TB NVMe',
    bandwidth: '100 MBps',
    power: 500
  },
  storageNode: {
    type: 'ØG Storage',
    category: 'Storage Node',
    memory: '16 GB',
    cpu: '4 cores',
    disk: '0.5-1 TB NVMe',
    bandwidth: '500 MBps',
    power: 175
  },
  storageKV: {
    type: 'ØG Storage',
    category: 'Storage KV',
    memory: '4 GB',
    cpu: '2 cores',
    disk: 'Variable',
    bandwidth: '-',
    power: 100
  },
  daNode: {
    type: 'ØG DA',
    category: 'DA Node',
    memory: '16 GB',
    cpu: '8 cores',
    disk: '1 TB NVMe',
    bandwidth: '100 MBps',
    power: 215
  },
  daRetriever: {
    type: 'ØG DA',
    category: 'DA Retriever',
    memory: '8 GB',
    cpu: '2 cores',
    disk: '-',
    bandwidth: '100 MBps',
    power: 80
  },
  daEncoder: {
    type: 'ØG DA',
    category: 'DA Encoder',
    memory: 'GPU (RTX 4090)',
    cpu: '-',
    disk: '-',
    bandwidth: '-',
    power: 525
  },
  daClient: {
    type: 'ØG DA',
    category: 'DA Client',
    memory: '8 GB',
    cpu: '2 cores',
    disk: '-',
    bandwidth: '100 MBps',
    power: 80
  },
  alignmentNode: {
    type: 'Alignment Node',
    category: 'Alignment',
    memory: '64 MB',
    cpu: '1 core',
    disk: '10 GB',
    bandwidth: '10 Mbps',
    power: 25 // Average
  }
};

export const CARBON_INTENSITY_BY_REGION: Record<string, number> = {
  'US-West': 0.35,
  'US-East': 0.45,
  'EU-West': 0.30,
  'EU-Central': 0.40,
  'Asia-Pacific': 0.55,
  'China': 0.65,
  'Japan': 0.48,
  'South America': 0.25,
  'Africa': 0.60,
  'Middle East': 0.70,
  'Nordic': 0.15,
  'Canada': 0.20
};