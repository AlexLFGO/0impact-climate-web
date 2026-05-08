export interface SystemStatus {
  dailyRetired: string;
  maxDaily: string;
  canRetire: boolean;
  recentTransactions: Transaction[];
  currentBatchRotation?: {
    batchDenoms: string[];
    lastUsed: string;
    nextBatch: string;
  };
}

export interface Transaction {
  id: number;
  tx_hash: string;
  wallet_address: string;
  batch_denom: string;
  amount: string;
  reason: string;
  jurisdiction: string;
  status: string;
  error_message?: string | null;
  gas_used: number;
  gas_wanted: number;
  height: number;
  created_at: string;
  completed_at?: string;
  certificate_id: string;
  project_name: string;
  project_id: string;
  credit_class?: string;
  credit_class_id?: string;
  co2e_tons: string;
  retired_by?: string;
  retirement_date?: string;
  blockchain_record?: string;
  vintage_year?: string;
  certificate_generated?: number;
}

export interface DailySummary {
  date: string;
  total_credits_retired: string;
  transaction_count: number;
  last_updated?: string;
}

export interface ConsumptionTracking {
  timestamp: string;
  consumption_rate: number;
  expected_offset: number;
  actual_offset: number;
  deficit: number;
  surplus: number;
}

export interface ConsumptionResponse {
  tracking: ConsumptionTracking[];
  stats?: {
    total_expected: string;
    total_actual: string;
    net_deficit: number;
  };
  consumptionRate?: string;
  offsetMode?: string;
}

export interface Certificate {
  certificate_id: string;
  retirement_date: string;
  blockchain_record: string;
  tx_hash: string;
  co2e_tons: string;
  number_of_credits: string;
  project_name: string;
  project_id: string;
  credit_class: string;
  credit_class_id: string;
  retired_by: string;
  retirement_reason: string;
  vintage_year: string;
  batch_denom: string;
  created_at: string;
  height: number;
}

export interface CertificateListResponse {
  certificates: Array<{
    certificate_id: string;
    retirement_date: string;
    co2e_tons: string;
    project_name: string;
    project_id: string;
    batch_denom: string;
    tx_hash: string;
    created_at: string;
  }>;
  total: number;
  limit: number;
  offset: number;
}

const API_BASE_URL = 'https://api.0impact.ai';

class ImpactAPI {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTimeout = 30000; // 30 seconds cache
  private useProxy = typeof window !== 'undefined'; // Use proxy when in browser

  private async fetchWithCache<T>(url: string): Promise<T> {
    const cacheKey = url;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      let fetchUrl = url;

      // Use proxy API route when in browser to avoid CORS issues
      if (this.useProxy) {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;

        const params = new URLSearchParams();
        params.set('endpoint', pathname);

        // Add all query params from the original URL
        urlObj.searchParams.forEach((value, key) => {
          params.set(key, value);
        });

        fetchUrl = `/api/impact?${params.toString()}`;
      }

      const response = await fetch(fetchUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Response Error:', errorText);
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Update cache
      this.cache.set(cacheKey, { data, timestamp: Date.now() });

      return data;
    } catch (error) {
      console.error('API Fetch Error:', error);
      // If CORS error or network error, try to provide more context
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error - please check your connection');
      }
      throw error;
    }
  }

  async getStatus(): Promise<SystemStatus> {
    return this.fetchWithCache<SystemStatus>(`${API_BASE_URL}/status`);
  }

  async getTransactions(limit = 10, offset = 0): Promise<Transaction[]> {
    return this.fetchWithCache<Transaction[]>(
      `${API_BASE_URL}/transactions?limit=${limit}&offset=${offset}`
    );
  }

  async getDailySummary(date?: string): Promise<DailySummary> {
    const url = date
      ? `${API_BASE_URL}/daily-summary?date=${date}`
      : `${API_BASE_URL}/daily-summary`;
    return this.fetchWithCache<DailySummary>(url);
  }

  async getConsumption(hours = 24): Promise<ConsumptionResponse> {
    return this.fetchWithCache<ConsumptionResponse>(
      `${API_BASE_URL}/consumption?hours=${hours}`
    );
  }

  async getCertificate(idOrHash: string, isHash = false): Promise<Certificate> {
    const param = isHash ? `tx_hash=${idOrHash}` : `id=${idOrHash}`;
    return this.fetchWithCache<Certificate>(`${API_BASE_URL}/certificate?${param}`);
  }

  async getCertificates(limit = 10, offset = 0): Promise<CertificateListResponse> {
    return this.fetchWithCache<CertificateListResponse>(
      `${API_BASE_URL}/certificates?limit=${limit}&offset=${offset}`
    );
  }

  async getHealth(): Promise<{ status: string; timestamp: string }> {
    return this.fetchWithCache<{ status: string; timestamp: string }>(
      `${API_BASE_URL}/health`
    );
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const impactApi = new ImpactAPI();

// Constants for the scanner
export const IMPACT_CONSTANTS = {
  CONSUMPTION_RATE: 0.06, // tCO₂/hour
  RETIREMENT_FREQUENCY: 5, // minutes
  PER_TRANSACTION: 0.005, // tCO₂
  DAILY_TARGET: 2, // tCO₂
  WALLET_ADDRESS: 'regen1xfw890d6chkud69c9h3rrhcgjg4zaqaqf0543r',
  BLOCKCHAIN: '0g-Mainnet-Aristotle',
  EXPLORER_BASE: 'https://www.mintscan.io/regen/tx/',
  PROJECTS: [
    {
      id: 'C03-004',
      name: 'Kasigau Corridor REDD+ Phase II',
      batch: 'C03-004-20190101-20191231-001',
    },
    {
      id: 'C03-002',
      name: 'Mai Ndombe REDD+ Project',
      batch: 'C03-002-20190101-20191231-001',
    },
  ],
};

// Helper functions
export function formatCO2(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return num.toFixed(4);
}

export function getExplorerUrl(txHash: string): string {
  return `${IMPACT_CONSTANTS.EXPLORER_BASE}${txHash}`;
}

export function calculateProgress(retired: number | string): number {
  const retiredNum = typeof retired === 'string' ? parseFloat(retired) : retired;
  return (retiredNum / IMPACT_CONSTANTS.DAILY_TARGET) * 100;
}

export function getTimeSinceLastOffset(timestamp: string): string {
  const now = Date.now();

  // Handle different timestamp formats
  // If timestamp doesn't include 'T' or 'Z', assume it's UTC and add them
  let normalizedTimestamp = timestamp;
  if (!timestamp.includes('T') && !timestamp.includes('Z')) {
    // Convert "2025-09-23 09:15:42" to "2025-09-23T09:15:42Z"
    normalizedTimestamp = timestamp.replace(' ', 'T') + 'Z';
  } else if (timestamp.includes('T') && !timestamp.includes('Z')) {
    // Add Z if it has T but no Z
    normalizedTimestamp = timestamp + 'Z';
  }

  const then = new Date(normalizedTimestamp).getTime();
  const diff = now - then;

  // Handle negative diff (future timestamps)
  if (diff < 0) {
    return 'just now';
  }

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return `${seconds}s ago`;
  if (minutes === 1) return '1 minute ago';
  if (minutes < 60) return `${minutes} minutes ago`;
  if (hours === 1) return '1 hour ago';
  if (hours < 24) return `${hours} hours ago`;
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

export function getNextOffsetTime(): string {
  const now = new Date();
  const minutes = now.getMinutes();
  const nextOffset = Math.ceil(minutes / 5) * 5;
  const minutesUntil = nextOffset - minutes;

  if (minutesUntil === 0) return 'any moment';
  if (minutesUntil === 1) return 'in 1 minute';
  return `in ${minutesUntil} minutes`;
}