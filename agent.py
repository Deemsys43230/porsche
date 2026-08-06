import logging
from dataclasses import dataclass, field
from typing import Optional

from dotenv import load_dotenv

from livekit import agents
from livekit.agents import (
    Agent,
    AgentSession,
    JobContext,
    RunContext,
    WorkerOptions,
    cli,
    function_tool,
    inference,
    TurnHandlingOptions
)
from livekit.plugins import google

from livekit.agents.inference import TurnDetector
from livekit.plugins import deepgram

import mock_data
from prompts import AGENT_INSTRUCTIONS, GREETING_INSTRUCTIONS

load_dotenv()

logger = logging.getLogger("porsche-voice-agent")
logger.setLevel(logging.INFO)


from tools import CallState, PorscheAssistant

# ---------------------------------------------------------------------------
# Entrypoint
# ---------------------------------------------------------------------------

async def entrypoint(ctx: JobContext):
    await ctx.connect()

    session = AgentSession[CallState](
        userdata=CallState(),
        llm=google.realtime.RealtimeModel(
            model="gemini-3.1-flash-live-preview",
            voice="Aoede",
            temperature=0.7,
        ),
    )

    # session = AgentSession[CallState](
    # userdata=CallState(),
    # stt=deepgram.STTv2(
    #     model="flux-general-en",
    #     eager_eot_threshold=0.4,
    #     eot_threshold=0.5,
    #     eot_timeout_ms=700,
    # ),

    # llm=inference.LLM(
    #     model="google/gemini-3.1-flash-lite",
    # ),

    # tts=deepgram.TTS(
    #     model="aura-2-aries-en",
    # ),

    # turn_handling=TurnHandlingOptions(
    #     turn_detection="stt",
    #     endpointing={
    #         "min_delay": 0.1,
    #         "max_delay": 1.5,
    #     },
    #     preemptive_generation={
    #         "enabled": True,
    #         "preemptive_tts": True,
    #     },
    # ),
    # max_tool_steps=10,
    # )

    await session.start(
        room=ctx.room,
        agent=PorscheAssistant(),
    )

    # await session.generate_reply(instructions=GREETING_INSTRUCTIONS)


if __name__ == "__main__":
    cli.run_app(
        WorkerOptions(
            agent_name="porsche-inbound-agent",
            entrypoint_fnc=entrypoint
        )
    )
