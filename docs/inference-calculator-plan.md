# ØG AI Inference Carbon Calculator - Implementation Plan

## Executive Summary

The current dashboard displays **inaccurate inference emissions data** (0.002 kg CO₂/inference), which is 10-100x lower than industry benchmarks. This undermines credibility when compared to real-world measurements showing 0.3-5g CO₂ per AI query¹.

**Key Advantage**: ØG's blockchain architecture provides **verifiable historical inference data** unavailable to Web2 AI providers, enabling the first cryptographically proven AI carbon accounting system.

## Current Issues

1. **Unrealistic emissions**: 0.002 kg CO₂ vs. industry standard 0.001-0.005 kg CO₂
2. **Mathematical inconsistency**: Dashboard shows 0.48 kWh/inference (would equal ~240g CO₂, not 2g)
3. **No model differentiation**: GPT-3.5 uses 6x less energy than GPT-4²
4. **Static estimates**: No connection to actual ØG compute metrics

## Proposed Solution

### Phase 1: Immediate Fixes (Week 1)
- **Update baseline values** based on ØG's confirmed models⁷:
  - Llama-3.3-70B-Instruct: 3-5g CO₂/inference
  - DeepSeek-R1-70B: 3-5g CO₂/inference
  - Future 100B+ models: 5-8g CO₂/inference
- **Apply RTX 4090 power profile** (ØG's tested GPU⁷):
  - TDP: 450W max, ~250W average inference load
  - More efficient than A100/H100 for inference
- **Fix mathematical consistency** between kWh and CO₂ calculations
- **Add confidence intervals** to show these are estimates

### Phase 2: Blockchain Data Integration (Weeks 2-4)
**Leverage ØG's On-Chain & Network Advantages:**
- **Historical data from archive nodes** (we run one):
  - All inference transactions recorded on-chain
  - Model identifiers (Llama-70B, DeepSeek-70B)
  - Input/output token pricing (provider-set)
  - Provider wallet addresses (for geographic mapping)
  
- **SDK Integration** (0g-compute-sdk⁶):
  - Track prepaid compute consumption ($10/TB storage cost)
  - Monitor TEE/CVM verification for secure compute
  - Aggregate inference requests by model type
  - Calculate actual vs. estimated emissions
  
- **Network Scale Data** (from 0g.ai⁷):
  - 8,000+ validators on testnet
  - 1,591 active storage miners
  - 2,500 TPS consensus throughput

**Implementation:**
```
Accurate CO₂ = (GPU Power × Runtime × Utilization × Carbon Intensity × PUE) / 3,600,000

Where Runtime can be derived from:
- On-chain settlement data (input/output processing costs)
- Historical inference patterns from archive node
- Service metadata from SDK
```

### Phase 3: Real-time + Historical Analytics (Month 2)
- **Dual data sources**:
  - Real-time: SDK service monitoring
  - Historical: Blockchain transaction analysis
- **Unique capabilities** (unavailable to Web2 AI):
  - Verifiable emissions per wallet address
  - Historical emissions trends from genesis
  - Transparent model usage distribution
- Regional carbon intensity mapping (0.15-0.70 kg CO₂/kWh by region³)

## Validation Metrics

| Provider/Model | Current Research (2024) | Source |
|----------|------------------------|---------|
| GPT-3.5 | 0.003g CO₂/query | Tilburg.ai² |
| GPT-4 | 0.019-4.32g CO₂/query | Tilburg.ai² / Columbia⁴ |
| Llama-70B (est.) | 3-4g CO₂/query | Based on GPT-4 equivalent |
| ChatGPT avg | 0.3-5g CO₂/query | Nature⁵ |
| Google Search | 0.2g CO₂/query | Google |

**ØG Specific Metrics:**
- RTX 4090 efficiency: ~30% better than A100 for inference
- Network scale: 8,000+ validators, 1,591 storage miners⁷
- Throughput: 2,500 TPS consensus, 50 GB/s data availability⁷

## Resource Requirements

- **Engineering**: 1 developer for 2 weeks initial implementation
- **Data Sources**: 
  - Archive node access (already available)
  - 0g-compute-sdk integration
  - Compute marketplace telemetry
- **Validation**: On-chain inference transactions provide ground truth data

## Expected Outcomes

1. **Credible emissions data** aligned with peer-reviewed research
2. **Blockchain-verified emissions** - First AI platform with cryptographically proven carbon accounting
3. **Historical analysis** - Complete emissions history from network genesis
4. **Wallet-level tracking** - Enable users/developers to see their exact carbon footprint
5. **Competitive advantage** - Transparency unavailable in closed Web2 AI systems

## Risk Mitigation

- If telemetry unavailable: Use conservative estimates with clear disclaimers
- If GPU data incomplete: Apply RTX 4090 profile (450W TDP) as ØG's tested baseline⁷
- If regional data missing: Use global average (0.5 kg CO₂/kWh) with plans to refine
- Model assumptions: Start with 70B models (confirmed support) then expand range

---

### References

¹ Smartly.AI (2024). "The Carbon Footprint of ChatGPT"
² Tilburg.ai (Sept 2024). "CO₂ ChatGPT Emissions Monitor"
³ IEA (2024). "Global Energy & CO₂ Status Report"
⁴ Columbia Climate School (2023). "AI's Growing Carbon Footprint"
⁵ Nature Scientific Reports (2024). "Carbon emissions of AI vs humans"
⁶ 0G Documentation. "Compute Network SDK" - https://docs.0g.ai/developer-hub/building-on-0g/compute-network/sdk
⁷ 0G.ai Official Site (2025). Network specifications, model support, and hardware requirements

### Next Steps

1. Approve Phase 1 implementation (immediate)
2. Schedule meeting with ØG engineering for API requirements
3. Define SLA for emissions data accuracy (±10% target)

**Contact**: [Your Name] - Climate Dashboard Lead
**Timeline**: 6-8 weeks for full implementation
**Budget**: Minimal (uses existing infrastructure)