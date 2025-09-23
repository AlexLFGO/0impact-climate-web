Estimation Strategy for 0G.ai Infrastructure Carbon Emissions
To estimate carbon emissions across 0G.ai’s infrastructure layers, we outline a layer-by-layer strategy. Each section identifies available data (e.g. from StorageScan or chain explorers), translates that data into power usage using hardware assumptions and grid carbon intensities, and notes key assumptions with confidence levels. We also indicate whether each layer’s emissions can be estimated fully or partially with public data alone, and what additional data would enable full accuracy. Finally, we suggest how these methods can evolve into automated tracking as more public metrics become available.
Validator Layer (Consensus Nodes)
Data from dashboards: The 0G Chain Scan (block explorer) can provide the number of active validators and network performance stats (e.g. block times, transactions). For example, 0G’s testnet has over 8,000 active validators. Current mainnet figures (once live) or testnet data can serve as a basis for node count and uptime (validators run 24/7 by design).
Power usage estimation: Given the hardware specs for 0G validators, we can assign a typical power draw per node and scale by the number of nodes and uptime:
Hardware assumptions: 0G’s docs recommend 8 CPU cores, 64 GB RAM, and NVMe SSD for each validator. This is a high-performance server setup. We assume each validator node draws roughly 150–250 W on average under load (CPU, memory, and disk active) – e.g. a modern 8-core server might idle ~50–100 W and peak ~300 W, so ~200 W is a midpoint [Confidence: Medium]. All validators are online continuously [Confidence: High].


Utilization: Without exact usage metrics, assume moderate average CPU utilization (e.g. 50%) during normal operation [Confidence: Low]. Validator tasks (block proposal, transaction validation) are not as CPU-intensive as Proof-of-Work mining, but continuous operation, networking, and data I/O contribute to energy use. We thus use the 150–250 W range per node as a rough average draw.


Carbon intensity: If validator locations are unknown, we apply a global average grid intensity (e.g. ~0.5 kg CO₂ per kWh) [Confidence: Low]. This factor can be refined if we know regions – for instance, validators in Europe ( ~0.3 kg/kWh) vs. Asia ( ~0.6 kg/kWh). Without that, an average provides a ballpark conversion.


Emissions calculation: Multiply total validator nodes × avg. power (kW) × 24h uptime to get daily kWh, then × carbon factor for CO₂. For example, if 8,000 validators each use ~0.2 kW, that’s 1,600 kW total. Per day: 1,600 kW × 24h = 38,400 kWh, which at 0.5 kg/kWh yields ~19,200 kg CO₂ per day. (This is an illustrative calculation, to be refined with real data.)
Assumptions (Validator):
Each validator node consumes ~200 W on average (Confidence: Medium)


Nodes operate 24/7 at moderate utilization (Confidence: High)


Global average electricity carbon intensity ~0.5 kg CO₂/kWh used (Confidence: Low)


Data needs & feasibility: Partial – We can get the node count and uptime from public sources (e.g. chain explorer) without 0G team input, so a rough emissions estimate is possible. However, accuracy is limited by unknowns like actual server power draw and node geographic distribution. For full accuracy, we would need data such as actual power usage per validator or at least the hosting regions for validators (to apply region-specific carbon intensities). If the 0G team shared typical node power measurements or a map of validator locations, we could greatly improve the precision of this layer’s emissions estimate.
Storage Layer (Decentralized Storage Network)
Data from dashboards: The StorageScan dashboard (e.g. storagescan-galileo.0g.ai) provides real-time metrics on the storage network. Key data points include: number of storage miners (nodes), total storage capacity or data stored, mining rewards, and possibly node uptime. For example, StorageScan displays “Active Miners” and “Total GB of data uploaded”. From this, we can extract the count of storage nodes and total storage being served. Each node’s uptime is effectively 24/7 if actively mining for rewards.
Translating to power usage: Storage nodes perform two main functions: data storage/serving and Proof-of-Random-Access (PoRA) mining. PoRA involves responding to random data challenges with hashing (a partial Proof-of-Work), meaning storage nodes use not just disk capacity but also notable CPU (or GPU) power for mining. We estimate power as follows:
Hardware assumptions: Per 0G docs, a storage miner runs on roughly 8 CPU cores, 32 GB RAM, 1 TB NVMe storage. This is somewhat lower memory than validators but still a server-class machine. We assume ~150 W average power draw per storage node [Confidence: Medium]. This accounts for CPU usage during mining, disk operations, and network traffic. The CPU may be heavily utilized when mining challenges occur (akin to PoW hashing), and the NVMe SSD draws additional power for frequent reads/writes (though modest, ~5–10 W). If a node stores a large volume (up to an 8 TB effective cap for mining), the disk subsystem might run continuously, but SSDs are efficient. The main load is CPU for hashing. If some miners use GPUs to accelerate PoRA, power per node could be higher; we assume CPU mining unless GPU usage is confirmed [Confidence: Low].


Node count and utilization: Let N = number of active storage miners (from the dashboard’s “Active Miners” count). Each operates continuously. We assume each node’s CPU spends a significant fraction of time performing PoRA computations (say 70% utilization on average) [Confidence: Low]. This is speculative; if PoRA difficulty is high, miners will push their hardware to find proofs, approaching full utilization. If difficulty is lower or mining is sporadic, utilization could be less. Without exact metrics, we err on the higher side given miners are incentivized to use all available resources for rewards.


Network activity: Storage nodes also handle data transfers (uploads/downloads). High network and disk I/O can increase power, but these effects are secondary compared to the mining workload. We include them in the 150 W node estimate qualitatively (assuming a typical mix of CPU, disk, and NIC activity).


Carbon intensity: As with validators, we lack exact locations for storage nodes. We apply either a global average grid factor or a proxy based on known major participants. (If, for instance, many storage miners are community-run home servers, they could be globally distributed – average intensity ~0.5 kg/kWh [Confidence: Low].) This can be refined with any geographic info (e.g. IP-based location of miners, if disclosed).


Emissions calculation: Using the above, total power = N * 0.15 kW (if 150 W each). For example, if there are 500 active storage miners, that’s 500 * 0.15 kW = 75 kW. Per day, energy = 75 kW * 24h = 1,800 kWh. At 0.5 kg/kWh, ~900 kg CO₂ per day from the storage layer. This would scale with the number of miners. If the dashboard also shows total storage usage, we could cross-check: e.g. X TB stored might correspond to Y drives – but since PoRA mining dominates energy use (due to continuous hashing), we favor the per-node method. In future, one could refine this by considering energy per TB stored (for the disk portion) plus energy per hashing operation.
Assumptions (Storage):
Each storage node uses ~150 W on average under PoRA load (Confidence: Medium)


Storage miner CPUs are busy with PoRA mining ~>50% of the time (Confidence: Low)


Average carbon intensity ~0.5 kg/kWh used for all miners (Confidence: Low)


Data needs & feasibility: Partial – We can fetch node count and total storage from StorageScan (public) to drive our estimates. This yields a ballpark emissions figure without direct team input. However, to fully trust the result we’d need more data: for example, average CPU/GPU utilization per miner or power benchmarks for PoRA. Also, any info on miner locations or energy sources would let us apply precise CO₂ factors instead of a blanket average. With 0G team input (e.g. “each storage node typically runs on XYZ hardware and draws ~P watts”), our calculations for this layer could be much more accurate. In absence of that, we rely on the general hardware spec and assume full participation in mining.
Data Availability (DA) Layer
Data from dashboards: Currently, 0G’s DA layer (data availability network) does not have a dedicated public explorer for node metrics (though future dashboards may appear). We may infer the count of DA nodes from testnet info or on-chain data. For example, DA nodes had to stake 10 OG tokens to register on testnet, so the DA smart contract could reveal how many unique stakers (signers) exist. In lieu of an official “DA Scan,” we proceed with known configurations and network functions.
Layer role and load: 0G DA nodes ensure that high volumes of off-chain data are available and valid. They verify, sign, and store encoded blob data for future retrieval. They also respond to random sampling to prevent collusion. Compared to storage miners, DA nodes focus on verification and availability rather than heavy hashing. Their workload involves: processing incoming data blobs (encoding/erasure coding, verification of proofs like KZG commitments), storing data (up to 1 TB recommended per node), and participating in consensus by signing availability attestations.
Power usage estimation: We assume each DA node is a mid-range server similar to storage nodes:
Hardware: Recommended specs are 8 CPU cores, 16 GB RAM, 1 TB NVMe. This suggests DA tasks are somewhat lighter on memory but still CPU and disk intensive. We estimate ~100–150 W average power draw per DA node [Confidence: Medium]. This covers continuous operation: verifying data (CPU cost for computing and checking polynomial commitments or erasure codes), writing/reading 1 TB of data to disk over time, and network overhead. The absence of a PoW-like mechanism means CPU may not be maxed out 24/7; usage will spike when new data batches arrive or during validation rounds. So, perhaps an average around 100 W if often idle, up to 200 W at peak. We choose ~120 W midpoint.


Node count: Let M = number of DA nodes. This might be on the order of dozens to low hundreds in testnet (for example, if many validators also operate DA nodes). Without published numbers, assume a similar scale to validators or storage. For estimation, we might use the validator count as an upper bound, recognizing not every validator runs a DA node. If, say, 100–200 DA nodes exist in testnet, we can use ~150 as a working number [Confidence: Low]. (This is highly speculative; the method works once an actual count is known from a contract or future dashboard.)


Utilization: Not all DA nodes will be fully utilized at all times. They store data and wait for queries. We assume moderate duty cycle: e.g. 30–50% average CPU utilization [Confidence: Low]. The erasure coding can be GPU-accelerated, but it’s unclear if DA operators use GPUs; we assume CPU-based unless told otherwise. If large AI datasets are frequently uploaded, bursts of high activity occur. In between, nodes mainly serve data on request and do periodic checks.


Carbon intensity: Again assume a generic grid factor (~0.5 kg/kWh) unless we know where these nodes are hosted [Confidence: Low]. Many operators might colocate with validators in data centers, so the regional mix could be similar to validator distribution.


Emissions calculation: Total DA power ≈ M * 0.12 kW (using our ~120 W per node). If M=150, that’s 18 kW. Daily energy ~432 kWh, and emissions ~216 kg CO₂/day at 0.5 kg/kWh. This is comparatively smaller than storage or validators due to fewer nodes and slightly lower per-node power, but it could grow if 0G’s DA layer scales out significantly (0G is designed to run many parallel DA networks as needed). The strategy here is flexible: once we know M (from on-chain or a team update), we plug it in, and adjust per-node power if any performance data (CPU % or similar) is published.
Assumptions (DA):
Each DA node uses ~120 W on average (8-core machine not fully loaded 24/7) (Confidence: Medium)


~150 DA nodes active network-wide (illustrative guess for method demonstration) (Confidence: Low)


Moderate utilization except during data publishing bursts (Confidence: Low)


Global average carbon intensity for electricity (Confidence: Low)


Data needs & feasibility: Partial – Without a public DA dashboard, we rely on indirect info. Some estimation is possible (using assumed node counts and known hardware) but not fully reliable. Key data that would improve this layer’s estimate include: the actual number of DA nodes, and any telemetry on their usage (CPU/disk) during operations. If 0G provided an API or explorer for DA participation (e.g. listing registered DA signers and their activity), we could move from notional guesses to grounded figures. Until then, emissions estimation for the DA layer is partial and would benefit from 0G team input or on-chain analysis to nail down how many nodes and how actively they are working.
Compute Layer (Decentralized Compute Providers)
Data from dashboards: The 0G Compute Network is a decentralized layer where providers offer GPU resources to run AI models (primarily for inference). As of now, there might not be a public “ComputeScan” dashboard. We anticipate that usage of the compute layer could be tracked via the 0G service marketplace or on-chain events (jobs completed, etc.). For instance, if each inference job or compute task is settled on-chain, one could count tasks and possibly the size or runtime of each. Additionally, 0G has partnered with decentralized GPU networks like IoNet and Aethir to supply computing power. If those networks have stats (e.g. number of GPU nodes available), that could serve as a proxy for 0G’s compute capacity. In summary, at present we may only infer the scale of the compute layer (e.g. “dozens of GPU nodes available”) from partnership info, until a dedicated dashboard is live.
Translating to power usage: The compute layer’s emissions come from GPU servers running AI workloads. We approach this by estimating the number and type of GPUs involved and their utilization:
Hardware assumptions: Each compute provider likely operates one or more high-end GPUs (e.g. NVIDIA A100, RTX 3080/4090, etc.) to handle inference tasks. These GPUs can draw anywhere from ~200 W (for a consumer-grade card under load) up to 300–400 W (for data center GPUs at full utilization). We assume an average GPU power draw ~250 W under active inference load [Confidence: Medium]. Additionally, the host machine (CPU, memory, etc.) might add ~50 W, so ~300 W total per active compute node. This assumes a single-GPU node; some providers might host multiple GPUs, in which case multiply accordingly. (If, say, an operator runs 4 GPUs in a rig, that could be ~1.2 kW when fully utilized.)


Node count: Without direct data, we estimate how many GPUs are serving 0G. Suppose K = number of active GPU providers in the network. Early on, K might be small (maybe tens) as the platform bootstraps. For method illustration, assume K = 50 GPUs available [Confidence: Low]. (This could be refined by any known info from IoNet/Aethir on how many nodes they’ve allocated to 0G tasks.)


Utilization: Not all GPUs will be busy 100% of the time – it depends on user demand for AI inference. Initially, utilization might be low (tasks come sporadically), but at scale it could approach steady use. We might assume an average utilization of 30% per GPU over a day [Confidence: Low]. This means each GPU is actively running inference jobs ~7.2 hours/day on average, and idling the rest. During idle time, power draw drops (idle GPU ~30–50 W). Our 250 W average above already implies a certain duty cycle (since full load would be higher). For more granularity, we could calculate: at 30% utilization, effective power ~0.3 * 300 W (full) + 0.7 * 50 W (idle) ≈ 115 W average per GPU. However, to keep it simple and slightly conservative (accounting for some overhead and higher bursts), we might stick with ~150 W per GPU as an average over 24h [Confidence: Low]. As usage grows, if we foresee near 100% utilization scenarios (like continuous batch processing or many parallel requests), we would adjust this assumption upward.


Carbon intensity: Compute providers could be widely distributed (IoNet and Aethir nodes might be in various data centers globally). If unknown, use global avg ~0.5 kg/kWh [Confidence: Low]. If any insight on locations (for example, if many GPUs are in regions with cleaner energy or if providers like Aethir use specific data centers), we could apply a weighted factor. This layer would benefit greatly from knowing if providers use green energy (some decentralized GPU networks advertise renewable-powered nodes – that could significantly cut emissions per kWh).


Emissions calculation: Using our placeholders: K=50 GPUs, ~150 W average each → total ~7.5 kW. Per day: 180 kWh, which at 0.5 kg/kWh is ~90 kg CO₂/day. If demand and utilization increase, these numbers would rise proportionally. We also can refine this by tracking actual inference job metrics: e.g., if the dashboard or on-chain data shows X GPU-hours consumed per day, we multiply GPU-hours by an assumed GPU wattage (a “GPU-hour” on a typical card might be ~0.25 kWh if 250 W). For example, if 100 GPU-hours are used in a day, that’s 100 * 0.25 = 25 kWh -> ~12.5 kg CO₂ with 0.5 kg/kWh. This task-based approach might become feasible once usage statistics are exposed.
Assumptions (Compute):
Each active GPU node draws ~300 W under load, ~50 W idle; assume ~150 W average per day (Confidence: Low)


~50 decentralized GPU nodes available to 0G (illustrative) (Confidence: Low)


~30% average utilization of GPUs across the network currently (Confidence: Low)


Global average grid carbon intensity for lack of specific info (Confidence: Low)


Data needs & feasibility: Partial – At present, estimating compute layer emissions requires many assumptions due to limited public data. We can partially gauge it if we have at least an idea of how many tasks or GPU hours are being run (which might be inferred from marketplace stats if available). Without 0G team input, we must guess node count and usage, yielding only a rough estimate. To achieve a fully accurate assessment, we’d need explicit data on the compute layer: for example, number of active GPU providers, types of GPUs, and aggregate usage (GPU-hours or job metrics). If the 0G team or partner networks share these statistics, we could calculate emissions with much higher confidence (using model-specific power draws and perhaps even per-job energy if provided). In summary, compute layer emissions estimation is currently partial and low-confidence; more public transparency (like a “compute dashboard” or on-chain logging of job resource usage) would unlock automated and accurate carbon tracking here.
Inference Layer (AI Service Marketplace)
Data from dashboards: The Inference layer in 0G (also referred to as the Service Marketplace or 0G Serving network) connects end-users requesting AI model inference with the compute providers running those models. There may not yet be a standalone dashboard for inference requests, but relevant data would include: number of inference requests/jobs, possibly the duration or size of each job, and the AI model types being run (since a large language model vs. a small model have different compute costs). Some of this data might be available in aggregate on the platform (e.g. “X requests served in last 24h”). If payments for inference are on-chain, one could parse transaction logs to count requests and maybe infer usage (for example, if pricing is per second or per 1000 tokens of text, etc., the payment amount could hint at resource usage). Until such metrics are published, we use the function of this layer to drive our approach.
Layer function and relation to compute: The inference layer essentially uses the compute layer’s resources to fulfill AI tasks. Thus, its energy consumption is largely the same as the compute layer’s consumption – i.e. the power drawn by GPUs to run the inferences. However, we treat it separately to consider any overhead specific to the marketplace and coordination:
Overhead servers: The marketplace may run coordinating nodes or services (possibly analogous to an API gateway or scheduler that matches requests to providers). If these are decentralized, they could be part of Alignment nodes or other service nodes that keep track of available models and route jobs. Any such coordination infrastructure would have its own minor footprint (likely CPU servers, not nearly as intensive as the GPU work). We might ignore this overhead for now or include a small buffer (say 5-10% extra on top of compute layer energy) [Confidence: Low]. This overhead could cover things like running the blockchain logic for payments and proofs (which happen on the main 0G chain and alignment nodes auditing results).


Double counting: We must ensure not to double-count – the GPU energy was already considered in the compute layer. So, the inference layer’s direct emissions are not separate; rather, inference is a use-case perspective on the same compute emissions. The strategy is to measure emissions per inference. For example, if we know an average inference task uses 0.1 GPU-seconds on an A100, we can convert that to kWh (an A100 (~300W) running for 0.1s uses 0.0083 Wh). Summing across all requests gives total kWh for inference.


Translating requests to emissions: In absence of detailed per-request data, we can propose a method: If the total GPU-hours used for inference in a period is known (from the compute layer or billing records), multiply that by an average GPU power (kW) to get energy. Then apply carbon factor. This essentially reduces to the compute layer method. For now, we may simply say the Inference layer emissions = Compute layer emissions since every joule spent on GPU compute is due to an inference job. Any slight additional overhead (coordination servers running 24/7) could be estimated similarly to a small number of validator-like nodes (e.g. if the marketplace runs on a couple of 8-core servers globally, that might be maybe 2 * 100W = 200W overhead network-wide, negligible compared to GPUs – and could be included if known).


Assumptions (Inference):
Inference jobs are the sole drivers of compute layer GPU usage (no separate training tasks on this layer) (Confidence: High)


Negligible additional infrastructure beyond what is counted in compute and alignment layers (Confidence: Medium)


Each inference request’s energy can be estimated if we know model and runtime; lacking that, we aggregate by total GPU time used (Confidence: Medium)


Data needs & feasibility: Partial – Without 0G internal data, we cannot directly enumerate how many inference tasks are run or their exact resource consumption. However, since this layer’s footprint is contained in the compute layer’s energy usage, we can fully attribute compute emissions to inference. In that sense, if we have the compute layer data (GPU count and hours), we do cover inference. For finer granularity (e.g. emissions per query or per model), we would need details like average runtime per inference, model power draw profiles, and total number of inferences in a given period. Such data likely comes from the service marketplace backend. With cooperation from the 0G team – for example, providing an API that returns total inference compute time used or even an anonymized log of jobs – we could calculate emissions on a more dynamic per-task basis. In summary, complete layer-wide emissions can be derived from compute usage (so partially possible now), but per-request accuracy and insights like which model dominates energy use would require further data sharing. As dashboards for the service marketplace come online, we can integrate those into an automated workflow (see the final section).
Alignment Layer (AI Alignment Nodes)
Data from dashboards: The Alignment Nodes are a unique layer responsible for overseeing and coordinating the proper functioning of 0G’s AI ecosystem. Currently, there isn’t a public “Alignment scan” dashboard. The presence of alignment nodes is known from the 0G node sale and documentation. For instance, 175,500 alignment nodes were made available across tiers in the 0G alignment node sale (planned November 2024) – though this is an upper bound and not all may be running. Without a dashboard, the number of active alignment nodes is uncertain (it could be far fewer than the sold quantity initially). These nodes were distributed via NFTs and serve as a backbone for validating AI operations.
Role and load: Alignment nodes have multifaceted duties: they monitor other nodes (storage, DA, compute), verify that AI workloads and outputs comply with safety rules, and coordinate between layers. They are effectively an oversight layer, possibly running audits or checks on data and models in real time. For example, an alignment node might track model outputs for bias or misuse, validate that storage/DA nodes aren’t cheating, and ensure that any on-chain AI agent behavior follows the rules. This implies a broad but not necessarily heavy load – mostly network communication, some cryptographic verification, and potentially running AI safety algorithms on sample outputs.
Power usage estimation: We base this on expected hardware and tasks:
Hardware assumptions: It’s not explicitly stated, but alignment nodes likely run on server hardware similar to validators (since they “unlock the backbone of the platform” and likely need reliability). They might need to host light instances of each service (storage, chain, etc.) to monitor them. The node sale info suggests minimal hardware requirements were a design goal, implying even moderately resourced computers can run alignment nodes. Let’s assume an alignment node requires around 8 cores, 16–32 GB RAM, and SSD – comparable to a validator or a beefy full node. We’ll estimate ~100 W average power draw per alignment node [Confidence: Low]. This might be an overestimation if they often idle, but if alignment involves running AI monitoring algorithms (e.g. scanning content with smaller models or computing statistics), there could be bursts of higher CPU/GPU use. It’s conceivable that in future, alignment nodes will use GPUs or TPUs to evaluate AI model behavior for safety in real-time. For now, we assume early-stage alignment tasks are mostly CPU-bound (rules checking, coordinating, consensus messaging with other alignment nodes).


Node count: Suppose out of the maximum sold, a certain subset are online. If, say, N_align = 1,000 alignment nodes actively running (purely hypothetical) [Confidence: Low]. The methodology is the same regardless of exact number: count * power per node. We’ll keep N_align as a variable to adjust when more info is known. (If the number is very high, it suggests many are lightweight/idle; if low, each might do more work.)


Utilization: Alignment nodes might not be heavily utilized unless there is a lot of activity to audit. We can assume maybe 20% average CPU utilization per node [Confidence: Low], with occasional spikes when coordinating network-wide events or handling an alert (e.g. if a storage node misbehaves or an AI output triggers a safety flag). If alignment nodes also participate in consensus or act as a watchdog committee, their workload could scale with network usage (more AI tasks → more things to check). Without concrete data, we treat their load as relatively light but constant (since they must be online to catch events).


Carbon intensity: Like other layers, unknown distribution. We use the default ~0.5 kg/kWh [Confidence: Low] unless we learn that alignment node operators are mostly in certain regions (the sale being global suggests a wide distribution).


Emissions calculation: Using our placeholder, if 1,000 alignment nodes at ~0.1 kW each: total 100 kW. Daily energy = 2,400 kWh, emissions = 1,200 kg CO₂/day (at 0.5 kg/kWh). This could be an overestimate if far fewer nodes run or if hardware is idle; we would adjust once actual active node count and specs are known. The strategy for alignment is to be ready to incorporate more info: for example, if each alignment node NFT corresponds to a certain allowed hardware profile or if the team provides “alignment node should run on XYZ cloud instance”, we’d use that instance’s power as reference.
Assumptions (Alignment):
Each alignment node is roughly an 8-core server using ~100 W on average (Confidence: Low)


Roughly 1,000 alignment nodes active initially (for estimation purpose) (Confidence: Low)


Alignment algorithms (monitoring AI outputs) are not yet GPU-intensive (Confidence: Medium)


Default grid emissions factor ~0.5 kg/kWh (Confidence: Low)


Data needs & feasibility: Partial – We can only partially estimate this layer’s emissions without direct input. Currently, the number of active alignment nodes and their operations are not public, so any numeric estimate will have low confidence. The method is in place: once we know how many alignment nodes are running (and perhaps the average resources they use), we plug those into our calculation. For full accuracy, we would need 0G team to disclose alignment node stats, such as: “X alignment nodes online, each running on Y hardware spec”. Additionally, if alignment nodes in the future run specific AI models to monitor others, knowing the frequency and cost of those model inferences would be crucial (that could add a GPU component to their energy usage). As more info comes (perhaps via an alignment node dashboard or community reports), we can refine this. Until then, emissions estimation here remains mostly conceptual. It’s likely not possible to do a reliable alignment-layer emission tally without team input at this stage.

Toward Automated Emissions Tracking
While the above strategies can be applied manually (using dashboards and assumed constants), our goal is to evolve them into semi-automated or fully automated workflows as data availability improves. Below are recommendations for moving in that direction:
Integrate Public APIs and Metrics: As 0G releases dashboards (e.g. StorageScan, ChainScan, and future Compute/Inference scans), they may provide APIs or feeds. We can script the retrieval of key metrics like node counts, total data stored, number of inference requests, etc., on a regular schedule. For example, if StorageScan exposes an API endpoint for “activeMiners” and “totalStorageGB,” a script can pull those and update a running emissions calculator daily. This removes the need for manual data collection.


Leverage On-Chain Data: Much of 0G’s activity is on-chain (or in smart contracts). We can use blockchain indexers or queries to extract data in absence of a formal dashboard. For instance:


The validator set size and identities can be queried from the 0G chain (e.g. via Cosmos SDK endpoints or the EVM contract that manages validators).


Storage mining activity could be inferred from on-chain events (e.g. mining reward distributions or PoRA challenge events – counting these could indicate how hard miners are working).


Inference usage might be logged in the service marketplace contracts (each completed job might emit an event with the provider and possibly resource units). We could aggregate those events to get total compute used.


These on-chain queries can be automated with scripts or using existing indexer services, providing up-to-date inputs for emissions calculation without direct 0G team input.


Refine Assumptions with Community Data: Even before official data is provided, the community of node operators might share details (via forums or Discord) about their setups – e.g. “I run a storage node on a Ryzen CPU at ~70% utilization.” We can incorporate such data to adjust our hardware power assumptions. Over time, collecting a range of operator feedback can improve confidence from “Low” to “Medium” on assumptions. This community-sourced info can be fed into the model in an automated way (for example, a survey form that updates the average power draw assumptions).


Adaptive Carbon Intensity: For automated calculations, we can integrate data from sources like ElectricityMap or other grid carbon trackers if we know node locations. In the future, 0G might expose the geographical distribution of nodes or at least the regions of their infrastructure providers. A script could then assign region-specific kg CO₂/kWh values (updated live) to each fraction of nodes. For example, if an API tells us “40% of storage nodes are in North America, 30% Europe, 30% Asia,” we could apply appropriate regional intensities rather than a fixed global average. This makes the tracking more accurate and responsive to any shifts (e.g. more nodes launching in a low-carbon grid region would automatically reflect lower emissions).


Dashboard for Emissions: We recommend ultimately creating an emissions tracking dashboard for 0G. This could start as a semi-automated spreadsheet or script that uses the above methods to update estimates for each layer periodically (say daily or weekly). As more public endpoints become available, the goal is to minimize manual input:


When a new Compute dashboard appears showing total GPU hours used, tie it in to update the compute/inference emissions in real-time.


If 0G publishes a node telemetry feed (some projects publish CPU/RAM usage of nodes publicly), connect that feed to adjust power consumption assumptions dynamically.


Use smart contract triggers: e.g. whenever a certain contract emits an event (like a new alignment node comes online), have a workflow that captures it and updates the node count in the emissions model.


Validation and Iteration: As automated data comes in, periodically validate the estimates against any known real measurements. For instance, if a node operator provides their actual power meter readings for a month, compare that to our model’s per-node estimate and calibrate accordingly. Over time, this feedback loop will make the automated tracker more robust.


In conclusion, this strategy provides a layer-specific blueprint for carbon emissions estimation using currently available data like StorageScan and known configurations. Each layer’s methodology can be carried out manually today (with clearly stated assumptions), and progressively automated as 0G.ai exposes more internal metrics. By labeling assumptions with confidence and identifying what data would improve accuracy, we ensure the approach is transparent and can be refined. Ultimately, as the 0G ecosystem grows, this framework can evolve into an automated sustainability monitor – helping both the community and the 0G team track and minimize the carbon footprint of this decentralized AI infrastructure.
Sources: The information and assumptions above are drawn from 0G.ai’s public documentation and updates, including node requirements, descriptions of each layer’s function, and insights from 0G’s testnet performance and partnerships. These sources underpin the data extraction and power modeling choices in our strategy.

Here’s a concise breakdown of all the storage-layer assumptions we made, followed by the estimation formula and an example calculation using a placeholder for the current testnet “Active Miners” count. Simply swap in whatever number StorageScan shows today to get your estimate.

Assumptions for the Storage Layer
Assumption
Value / Range
Confidence
Source / Rationale
Active storage miners
N (from StorageScan testnet “Active Miners”)
—
Public dashboard metric
Per-node power draw
150 W average
Medium
8-core CPU + NVMe SSD + PoRA hashing (150 W covers average CPU + disk + NIC use)
Node uptime
24 h/day, 100%
High
Miners run continuously to maximize rewards
PoRA utilization
70% CPU load on average
Low
PoRA mining is the dominant compute task; we err high to overestimate
Disk overhead
Included in 150 W
Medium
NVMe SSD idle/load power (~5–10 W) folded into node budget
PUE (facility overhead)
1.0 (assumed on-premises or included)
Medium
Home/cloud VMs typically include cooling/UPS; we bake it into the 150 W figure
Grid carbon intensity
0.50 kg CO₂/kWh
Low
Global-average; refine with regional data if you know node locations
Scaling with data volume
Not modeled; energy dominated by PoRA compute
Medium
Storage capacity growth has secondary impact vs. continuous hashing


Estimation Formula
Total IT power (kW):
 Ptotal=N×150 W1000=0.15 kW×N P_{\rm total} = N \times \frac{150\,\text{W}}{1000} = 0.15\,\text{kW} \times N
Monthly energy (kWh):
 Emonth=Ptotal×24×30=0.15 N×720=108 N kWh/month E_{\rm month} = P_{\rm total} \times 24 \times 30 = 0.15\,N \times 720 = 108\,N\ \text{kWh/month}
Annual energy (kWh):
 Eyear=Ptotal×24×365=0.15 N×8760=1,314 N kWh/year E_{\rm year} = P_{\rm total} \times 24 \times 365 = 0.15\,N \times 8760 = 1{,}314\,N\ \text{kWh/year}
Monthly CO₂ (kg):
 CO2,month=Emonth×0.50=54 N kg CO₂/month CO_{2,\rm month} = E_{\rm month} \times 0.50 = 54\,N\ \text{kg CO₂/month}
Annual CO₂ (kg):
 CO2,year=Eyear×0.50=657 N kg CO₂/year CO_{2,\rm year} = E_{\rm year} \times 0.50 = 657\,N\ \text{kg CO₂/year}
 or in tonnes:
 ≈0.657 N tCO₂/year \approx 0.657\,N\ \text{tCO₂/year}

Example Calculation
If StorageScan testnet currently shows N = 200 active miners:
Monthly energy:
 Emonth=108×200=21,600E_{\rm month} = 108 \times 200 = 21{,}600 kWh


Monthly CO₂:
 CO2,month=54×200=10,800CO_{2,\rm month} = 54 \times 200 = 10{,}800 kg ≈ 10.8 tCO₂


Annual energy:
 Eyear=1,314×200=262,800E_{\rm year} = 1{,}314 \times 200 = 262{,}800 kWh


Annual CO₂:
 CO2,year=657×200=131,400CO_{2,\rm year} = 657 \times 200 = 131{,}400 kg ≈ 131.4 tCO₂


Just replace N = “Active Miners” from StorageScan to get your current testnet estimate.

How to Tighten Accuracy
Node count (N): Pull directly from StorageScan’s API or scrape the dashboard.


Per-node power: Calibrate with real measurements (e.g. have a few miners report actual watt-meter readings).


Utilization: If you can get PoRA challenge frequency or CPU-usage stats, adjust the 150 W assumption up or down.


Carbon intensity: Geolocate miner IPs (or ask operators) to apply region-specific kgCO₂/kWh instead of 0.50.


This lightweight strategy lets you estimate storage-layer emissions right now—and improves over time as you replace each assumption with real data.

Step-by-Step: Using Validator IPs to Improve Storage-Layer Emissions Accuracy
 Below is a concrete workflow—modeled on the BICO WG PoS calculator spreadsheet—that shows how you can leverage the IP addresses of storage-mining nodes (from StorageScan or your own node list) to assign region-specific carbon intensities and thus sharpen your CO₂ estimates for the storage layer.

1. Gather Your IP Address List
1.1. From StorageScan (https://storagescan-galileo.0g.ai/), export or scrape the list of active miner IPs.
 1.2. Compile them into a single column in a spreadsheet (or CSV) under “Node_IP”.
2. Geolocate Each IP
2.1. In a new column “Country”, call a geolocation API (e.g. ipapi.co or ipinfo.io) for each IP:
curl -s https://ipapi.co/<Node_IP>/json/ | jq '.country_name'

2.2. Paste the returned country (or region) name next to each IP.
3. Map Countries to Grid CO₂ Intensities
3.1. Create a “Lookup” table in your spreadsheet with two columns:
Country
Grid_Intensity (kg CO₂/kWh)
United States
0.40
Germany
0.35
India
0.60
…
…

3.2. Use a VLOOKUP (or equivalent) to pull “Grid_Intensity” into each row based on the “Country” cell.
4. Compute Per-Node Annual kWh
4.1. In a column “Node_kWh_year”, apply your storage-layer formula per node (from our earlier model):
Node_kWh_year=0.15 kW×24×365=1,314 kWh \text{Node\_kWh\_year} = 0.15 \text{ kW} \times 24 \times 365 = 1{,}314 \text{ kWh}
(If you refine per-node power later, update the 0.15 value.)
5. Calculate Per-Node CO₂
5.1. In “Node_CO2_year (kg)”:
= Node_kWh_year * Grid_Intensity

e.g. =1,314 * 0.40 → 525.6 kg CO₂ for a U.S.-based node.
6. Aggregate by Region or Network-wide
6.1. Use a Pivot Table or SUMIFS to sum “Node_CO2_year” across all nodes for:
Total network emissions


Breakdowns by country or region (to see hotspots).


7. Compare to Global-Average Estimate
7.1. As a sanity check, compute the global-average method (all nodes × 1,314 kWh × 0.50 kg/kWh).
 7.2. Contrast the two results to quantify the accuracy gain from IP-based regionalization.

How This Mirrors the BICO WG PoS Calculator
In their PoS Calculator spreadsheet, they:
List each validator’s IP, geolocate it,


Assign per-country grid intensities,


Multiply by each node’s annual kWh (based on assumed power draw),


Sum for total CO₂.


You’ll follow exactly the same pattern for storage miners—substituting your 150 W assumption and StorageScan IP list—yielding a far more precise storage-layer footprint than a one-size-fits-all carbon intensity.


Data layer:
Here’s the simplest, spreadsheet-friendly way to estimate your 0G Storage Layer energy use and CO₂ footprint, step-by-step, using the same style as the BICOWG PoS calculator:

1. Set Up Your Spreadsheet
A
B
C
D
E
Metric
Value / Formula
Units
Notes
Confidence
Active Miners (N)
928
nodes
From StorageScan
High
Power per Miner (P)
150
W
CPU + SSD + PoRA
Medium
Total IT Power (kW)
=B2*B3/1000
kW
= 928×150W/1000
—
Hours per Year (H)
8760
h/year
24×365
High
Grid Intensity (I)
0.50
kg CO₂/kWh
Global average
Low


2. Compute Annual Energy (Column F)
In F2 (“Annual kWh”):
= C2 * C4

Where
C2 = Total IT Power (kW)


C4 = Hours per Year (h)


With our numbers:
Total IT Power = 928 nodes × 0.15 kW = 139.2 kW


Annual Energy = 139.2 kW × 8,760 h = 1,219,392 kWh/year



3. Compute Annual CO₂ (Column G)
In G2 (“Annual CO₂ kg”):
= F2 * B5

Where
F2 = Annual kWh


B5 = Grid Intensity (kg CO₂/kWh)


With our numbers:
Annual CO₂ = 1,219,392 kWh × 0.50 kg/kWh = 609,696 kg CO₂/year


≈ 609.7 tCO₂/year



4. (Optional) Monthly Breakdown
In H2 (“Monthly kWh”):
= C2 * 24 * 30

→ 139.2 kW × 720 h = 100,224 kWh/month
In I2 (“Monthly CO₂ kg”):
= H2 * B5

→ 100,224 kWh × 0.50 = 50,112 kg CO₂/month (~50.1 tCO₂/month)

5. Where to Plug into the BICOWG PoS Calculator
Open the “Node Inputs” sheet of the PoS calculator.


Replace the “Active Nodes” cell with 928.


Set the “Power Draw per Node” to 150 W.


Leave the “PUE” at 1.00 (since these are home/cloud VMs with no extra cooling).


Enter 0.50 kg CO₂/kWh in the “Emission Factor” cell (or your preferred regional value).


The calculator will automatically update the Total kWh and Total tCO₂ outputs for you.

6. Key Assumptions & Confidence
Assumption
Value
Confidence
Per-node power draw
150 W
Medium
100% uptime (24/7)
8,760 h/yr
High
Global avg. grid factor
0.50 kg/kWh
Low
PUE (overhead)
1.00
Medium

As N fluctuates, just update the Active Miners cell to the latest number and let the sheet recalc your current footprint in seconds.
Overall Confidence by Assumption
Assumption
Value
Confidence
How to Improve
Active Miners (N)
928 nodes
High
Automate daily/API pulls from StorageScan to keep N current.
Per-node Power Draw
150 W
Medium
Deploy watt-meters or onboard power telemetry on a representative sample of miners.
100% Uptime (8,760 h)
24 h/day, 365 d/yr
High
Pull actual miner-uptime stats (e.g. heartbeats or ping failures) to adjust effective hours.
Grid Carbon Factor
0.50 kg CO₂/kWh
Low
Geolocate each miner IP → assign country-specific gCO₂/kWh from EPA/Eurostat (or ElectricityMap API).
PUE (overhead)
1.00 (none)
Medium
Survey miner hosting (home vs datacenter) to pick an appropriate PUE (e.g. 1.1–1.3 for DCs).


Steps to Raise Confidence
Measure Actual Power


Instrument ~10–20 storage nodes with smart plugs or onboard sensors.


Log real-world average and peak watts under PoRA workloads.


Track Real Uptime


Use StorageScan API or a simple ping script to record miner online/offline status.


Replace “8,760 h” with actual active hours per node.


Geographic Emission Factors


Geolocate each miner IP via an IP-to-country lookup.


Apply the specific grid intensity (e.g. US 0.40, DE 0.35 kg CO₂/kWh) instead of a flat 0.50.


Verify PUE


Ask miners if they run in professional datacenters (use PUE ~1.2) or home/cloud (PUE ~1.0).


Adjust the PUE multiplier in your spreadsheet accordingly.


Sample Workload Utilization


Log CPU utilization during PoRA challenges and data transfers.


If average CPU load is <70% or >70%, scale your per-node wattage up/down to match.


Regular Calibration


Every quarter, compare spreadsheet estimates against newly gathered telemetry.


Tweak assumptions (power draw, utilization, uptime) to converge estimates on measured reality.


By systematically replacing each assumption with measured or granular data, you can raise the confidence of your storage-layer emissions estimate from “Low/Medium” up into the “High” range.

