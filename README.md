# Porsche Voice Agent — POC Backend (LiveKit Agents)

Inbound-only voice agent POC demonstrating:
1. Caller identification + service history lookup
2. Service appointment booking, with proactive "you're due for service
   soon" nudges surfaced naturally inside the call
3. New car sales inquiry + test drive booking

**Nothing here calls a real CRM, DMS, or SMS gateway.** All of that is
mocked in `mock_data.py` as an in-memory dataset, so you can demo this
end-to-end with zero integration setup. Swap `mock_data.py` for real API
calls when you're ready to move past the POC — every tool function is
already shaped like a real integration call (clear inputs/outputs), so
that swap shouldn't touch your prompt or conversation design at all.

This is **backend only** — connect to it using your own LiveKit
playground / Agent Console / custom frontend. No frontend is included
here.

---

## 1. Project structure

```
porsche-voice-agent/
├── agent.py          # entrypoint + Agent class + all function tools
├── prompts.py         # persona / system instructions
├── mock_data.py        # in-memory "CRM/DMS/inventory" + helper functions
├── requirements.txt
├── .env.example
└── README.md
```

## 2. Prerequisites

- Python 3.9+
- A LiveKit Cloud project (or self-hosted LiveKit server) — you said you
  already have a playground, so you likely have this already
- A Google Gemini API key (`GOOGLE_API_KEY` used for Gemini Multimodal Live API in this POC)

## 3. Setup

```bash
cd porsche-voice-agent

# create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# install dependencies
pip install -r requirements.txt

# copy the env template and fill in your keys
cp .env.example .env
```

Edit `.env`:

```bash
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your-livekit-api-key
LIVEKIT_API_SECRET=your-livekit-api-secret
GOOGLE_API_KEY=your-google-api-key
```

Download the local model files needed for VAD (Silero) and turn
detection (only needs to be done once):

```bash
python agent.py download-files
```

## 4. Run it

**Quick local test (terminal, no playground needed):**

```bash
python agent.py console
```

Talk into your mic or press `Ctrl+T` to type. Good for sanity-checking
the prompt and tool calls before connecting a frontend.

**Connect from your own LiveKit playground:**

```bash
python agent.py dev
```

This starts the worker in dev mode and registers it with your LiveKit
project. Open your playground, connect to the same project, and the
agent will join automatically (this uses automatic dispatch — no
`agent_name` configuration needed on your end). You should see
`registered worker` in the terminal once it's ready.

> If you're using LiveKit's newer Agent Console (explicit dispatch by
> agent name), add `agent_name="porsche-assist"` to the session
> registration and select that name in the console. The default setup
> here uses automatic dispatch so it works with any playground without
> extra config.

## 5. Test data (for your demo)

Three mock customers are seeded in `mock_data.py`. Say any of these when
the agent asks for your name or number:

Calling with any other name/number triggers the **new lead** path
instead of a CRM match — useful for demoing that flow too.

Model info and inventory are seeded for: Taycan, Cayenne, Macan, 911,
Panamera (see `mock_data.MODEL_CATALOG` / `mock_data.INVENTORY`).

## 6. Suggested demo script

This mirrors the single-call narrative used to design the prompt — say
these to walk the full flow:

1. *"Hi, this is Arjun Sharma."*
2. *"I need to book a service, my check engine light came on."*
   → agent checks slots, and should also proactively surface the 30K
   service being due, offering to combine visits
3. *"Let's combine them"* → pick a slot → *"yes"* to the loaner offer
4. Let the agent pivot to the Taycan inquiry on file, or ask directly:
   *"Actually, tell me about the Taycan"*
5. *"Book me a test drive"* → pick a slot
6. *"That's all, thanks"* → agent should summarize both bookings and
   confirm an SMS was sent

Check your terminal logs — every tool call is logged, including the
mock SMS content, so you can show the underlying "integration calls"
happening even though nothing leaves your machine.

## 7. Swapping mock data for real integrations later

Every tool in `agent.py` calls a function in `mock_data.py`. To go from
POC to production:

- Replace `find_customer_by_phone` / `find_customer_by_name` with a CRM
  API call (e.g. Salesforce, HubSpot, or your DMS's customer API)
- Replace `generate_slots` / `create_appointment` with your DMS
  scheduling API
- Replace `log_sms` with a real Twilio/WhatsApp Business API call
- Replace `MODEL_CATALOG` / `INVENTORY` with your OEM configurator API
  or dealer inventory feed

The tool function signatures in `agent.py` (what the LLM sees) shouldn't
need to change — only what's inside them.


