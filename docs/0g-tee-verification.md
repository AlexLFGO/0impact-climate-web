What we’re doing
Adding per-inference energy reporting to the 0G Serving Network, with the option for Service Providers to make those numbers TEE-verified so they can be trusted by any user or auditor.

Where it fits in the 0G stack

Service Provider (part of the Decentralized AI Stack in the Serving Network)

Runs the AI model execution inside their Decentralized AI Stack.

In the HTTP response from the Service Endpoint (OpenAI-compatible API), include either:

x-gpu-wh — watt-hours for that inference, or

x-gpu-avg-watts + x-gpu-active-ms — so the Broker can calculate Wh.

If the Service Provider is TEE-enabled (e.g., Intel SGX, AMD SEV, Phala integration), the energy measurement logic runs inside the enclave and is bound to the model execution.

The TEE signs an attestation containing: model ID, I/O hashes, and energy value — making the data tamper-evident.

Broker (in the Serving Network)

In the request/response handling path between getRequestHeaders() and processResponse(), add middleware that:

Reads the energy data from the Service Provider’s response.

Verifies the TEE signature if present.

If no header is sent, estimates Wh from token count + model size class.

Adds x-0g-energy-wh to the outgoing response.

climate.0g.ai (external application)

Calls the Serving Network as normal.

Reads x-0g-energy-wh from responses and displays it in a public dashboard.

Labels values as Verified if TEE-attested, or Estimated if calculated by the Broker.

Aggregates results for network-wide transparency and provider comparisons.

End result
Every inference on the 0G Serving Network can return:

Energy (inference): 0.xx Wh — Verified (TEE)
or
Energy (inference): 0.xx Wh — Estimated

This adds a new, verifiable metric to 0G’s value proposition — combining decentralized AI execution with provable sustainability data.