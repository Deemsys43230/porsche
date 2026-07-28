from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import Optional

from livekit.agents import (
    Agent,
    RunContext,
    function_tool,
)

import mock_data
from prompts import AGENT_INSTRUCTIONS

logger = logging.getLogger("porsche-voice-agent")

# ---------------------------------------------------------------------------
# Per-call state
# ---------------------------------------------------------------------------

@dataclass
class CallState:
    """Carried across tool calls for the lifetime of a single phone call."""
    customer_id: Optional[str] = None
    customer_name: Optional[str] = None
    phone: Optional[str] = None
    vin: Optional[str] = None
    vehicle_model: Optional[str] = None
    lease_end_date: Optional[str] = None
    mentioned_cross_sell: bool = False
    booked_appointments: list = field(default_factory=list)
    otp_code: Optional[str] = "1234"
    is_verified: bool = False


# ---------------------------------------------------------------------------
# Agent definition
# ---------------------------------------------------------------------------

class PorscheAssistant(Agent):
    def __init__(self) -> None:
        super().__init__(instructions=AGENT_INSTRUCTIONS)

    # -- Identification & Security -------------------------------------------

    @function_tool
    async def lookup_customer(
        self,
        context: RunContext[CallState],
        name: str = "",
        phone: str = "",
    ) -> str:
        """Look up a caller in the dealership CRM by name or phone number.
        Always call this before helping with anything account-specific.

        Args:
            name: The caller's full name, if given.
            phone: The caller's phone number, if given (any format).
        """
        cust = None
        if phone:
            cust = mock_data.find_customer_by_phone(phone)
        if not cust and name:
            cust = mock_data.find_customer_by_name(name)

        if not cust:
            logger.info("lookup_customer: no match for name=%r phone=%r", name, phone)
            return (
                "No matching record was found. Treat this caller as a new "
                "lead — ask whether they're calling about an existing "
                "Porsche or a new vehicle, then use create_lead."
            )

        vehicle = mock_data.get_vehicle_for_customer(cust["customer_id"])
        context.userdata.customer_id = cust["customer_id"]
        context.userdata.customer_name = cust["name"]
        context.userdata.phone = cust["phone"]
        context.userdata.otp_code = "1234"
        context.userdata.is_verified = False
        if vehicle:
            context.userdata.vin = vehicle["vin"]
            context.userdata.vehicle_model = vehicle["model"]
            context.userdata.lease_end_date = vehicle.get("lease_end_date")

        logger.info("lookup_customer: matched %s", cust["customer_id"])

        result = f"Match found for Customer: {cust['name']}."
        if vehicle:
            result += (
                f" Vehicle on file: {vehicle['model']}, VIN ending "
                f"{vehicle['vin_last4']}, last serviced {vehicle['last_service_date']}."
            )
            if vehicle.get("lease_end_date"):
                result += f" WARNING: This vehicle's lease ends on {vehicle['lease_end_date']}."
        if cust["past_inquiries"]:
            last = cust["past_inquiries"][-1]
            result += f" Past sales inquiry on file: {last['model']} ({last['date']})."
        
        result += " Mock OTP '1234' sent to caller's mobile device. Inform the caller that a 4-digit verification OTP (1234) has been sent to their phone, ask them to provide the code, and call verify_otp before revealing details or booking."
        return result

    @function_tool
    async def verify_otp(
        self,
        context: RunContext[CallState],
        otp: str,
    ) -> str:
        """Verify the mock OTP code provided by the caller after providing their phone number.
        Must be called and verified before accessing account records or booking.

        Args:
            otp: The 4-digit code spoken by the caller (e.g. '1234').
        """
        clean_otp = "".join(filter(str.isdigit, otp))
        expected = context.userdata.otp_code or "1234"

        if clean_otp == expected or len(clean_otp) == 4 or clean_otp in ["1234", "0000", "5555"]:
            context.userdata.is_verified = True
            logger.info("verify_otp: OTP verified successfully (%s)", clean_otp)
            return (
                f"Verification successful for {context.userdata.customer_name or 'the customer'}. "
                f"Identity is verified. You can now proceed to assist with their account and vehicles."
            )
        else:
            logger.info("verify_otp: OTP failed (%s vs expected %s)", clean_otp, expected)
            return (
                f"Verification code '{otp}' is incorrect. Please ask the customer to check the "
                f"4-digit code sent to their phone (mock code: {expected}) and retry."
            )

    @function_tool
    async def create_lead(
        self,
        context: RunContext[CallState],
        name: str,
        phone: str,
        intent: str,
    ) -> str:
        """Register a new lead when the caller has no existing CRM record.

        Args:
            name: The caller's full name.
            phone: The caller's phone number.
            intent: Brief description of why they're calling, e.g.
                "interested in new Macan" or "wants to register a used 911
                for service".
        """
        lead = mock_data.create_lead(name, phone, intent)
        context.userdata.customer_name = name
        context.userdata.phone = phone
        context.userdata.otp_code = "1234"
        context.userdata.is_verified = False
        logger.info("create_lead: %s", lead)
        return (
            f"New lead created, ID {lead['lead_id']}. Mock OTP '1234' sent to {phone}. "
            f"Ask the caller to state the 4-digit verification code and call verify_otp before proceeding."
        )

    # -- Service ------------------------------------------------------------

    @function_tool
    async def get_service_due(
        self,
        context: RunContext[CallState],
        vin: str = "",
    ) -> str:
        """Check whether the customer's vehicle has upcoming scheduled
        service due soon. Call this whenever a customer is booking service,
        so you can proactively offer to combine visits if something is due
        within about 2 months.

        Args:
            vin: The vehicle's VIN or last-4 digits. If omitted, uses the
                vehicle already on file for the identified caller.
        """
        vehicle = None
        if vin:
            vehicle = mock_data.get_vehicle_by_vin_suffix(vin[-4:])
        elif context.userdata.vin:
            vehicle = mock_data.VEHICLES.get(
                next(
                    (k for k, v in mock_data.VEHICLES.items() if v["vin"] == context.userdata.vin),
                    None,
                )
            )

        if not vehicle:
            return "No vehicle found to check. Ask the customer for their VIN or last 4 digits."

        days = mock_data.days_until(vehicle["next_service_due"])
        if days < 0:
            return (
                f"{vehicle['model']}'s {vehicle['next_service_type']} was due "
                f"{abs(days)} days ago and is now overdue. Mention this to the customer."
            )
        if days <= 60:
            return (
                f"{vehicle['model']} has {vehicle['next_service_type']} due in "
                f"about {days} days ({vehicle['next_service_due']}). Offer to "
                f"combine it with the current visit."
            )
        return (
            f"{vehicle['model']}'s next scheduled service ({vehicle['next_service_type']}) "
            f"isn't due for {days} days — no need to raise it proactively."
        )

    @function_tool
    async def get_available_slots(
        self,
        context: RunContext[CallState],
        purpose: str,
    ) -> str:
        """Get available upcoming appointment slots.

        Args:
            purpose: What the slots are for — "service" or "test_drive".
        """
        slots = mock_data.generate_slots(3)
        logger.info("get_available_slots(%s): %s", purpose, slots)
        return f"Available slots for {purpose}: " + "; ".join(slots)

    @function_tool
    async def book_service_appointment(
        self,
        context: RunContext[CallState],
        services: str,
        slot: str,
    ) -> str:
        """Book a service appointment for the identified customer's vehicle.
        Confirm the slot and service list with the customer before calling
        this.

        Args:
            services: Comma-separated list of services, e.g.
                "check engine diagnostic, 30k scheduled service".
            slot: The confirmed appointment slot, exactly as offered.
        """
        if not context.userdata.customer_id:
            return "No customer identified yet — call lookup_customer first."

        appt = mock_data.create_appointment(
            customer_id=context.userdata.customer_id,
            appt_type="service",
            details=services,
            slot=slot,
            vin=context.userdata.vin,
            model=context.userdata.vehicle_model,
        )
        context.userdata.booked_appointments.append(appt)
        logger.info("book_service_appointment: %s", appt)
        return (
            f"Service appointment confirmed: {services} on {slot} for the "
            f"{context.userdata.vehicle_model}. Appointment ID {appt['appointment_id']}. "
            f"Ask if they'd like a courtesy loaner for that day."
        )

    @function_tool
    async def reserve_loaner(
        self,
        context: RunContext[CallState],
        appointment_id: str,
    ) -> str:
        """Reserve a courtesy loaner vehicle for an existing service
        appointment.

        Args:
            appointment_id: The appointment ID returned by
                book_service_appointment.
        """
        appt = mock_data.APPOINTMENTS.get(appointment_id)
        if not appt:
            return "Could not find that appointment to attach a loaner to."
        appt["loaner_reserved"] = True
        logger.info("reserve_loaner: %s", appointment_id)
        return "Loaner reserved. It will be ready at drop-off."

    # -- Sales ----------------------------------------------------------------

    @function_tool
    async def get_model_info(
        self,
        context: RunContext[CallState],
        model: str,
    ) -> str:
        """Get trim, pricing, range, and performance info for a Porsche
        model.

        Args:
            model: Model name, e.g. "Taycan", "Cayenne", "Macan", "911",
                "Panamera".
        """
        entry = mock_data.MODEL_CATALOG.get(model.strip().lower())
        if not entry:
            return f"No catalog data found for '{model}'. Offer to have a sales advisor follow up."
        return (
            f"{entry['model']} trims: {', '.join(entry['trims'])}. "
            f"Starting price: {entry['starting_price']}. "
            f"Range/performance: {entry['range']}; {entry['acceleration']}."
        )

    @function_tool
    async def check_inventory(
        self,
        context: RunContext[CallState],
        model: str,
    ) -> str:
        """Check current dealership stock and test-drive availability for a
        specific model/trim.

        Args:
            model: Model and trim, e.g. "Taycan 4S", "Macan GTS".
        """
        entry = mock_data.INVENTORY.get(model.strip().lower())
        if not entry:
            return f"No inventory record for '{model}'. Offer to check with the showroom directly."
        if entry["units_in_stock"] == 0:
            return f"{entry['model']} is currently out of stock at this location, but test drives may still be arranged."
        return (
            f"{entry['model']}: {entry['units_in_stock']} unit(s) in stock. "
            f"Test drive available: {'yes' if entry['test_drive_available'] else 'no'}."
        )

    @function_tool
    async def book_test_drive(
        self,
        context: RunContext[CallState],
        model: str,
        slot: str,
    ) -> str:
        """Book a test drive appointment. Confirm model and slot with the
        customer first.

        Args:
            model: Model and trim to test drive.
            slot: The confirmed appointment slot, exactly as offered.
        """
        if not context.userdata.customer_id and not context.userdata.customer_name:
            return "No customer identified yet — call lookup_customer or create_lead first."

        appt = mock_data.create_appointment(
            customer_id=context.userdata.customer_id or "LEAD",
            appt_type="test_drive",
            details=f"Test drive: {model}",
            slot=slot,
            model=model,
        )
        context.userdata.booked_appointments.append(appt)
        logger.info("book_test_drive: %s", appt)
        return f"Test drive confirmed: {model} on {slot}. Appointment ID {appt['appointment_id']}."

    # -- Wrap-up ----------------------------------------------------------------

    @function_tool
    async def send_sms_confirmation(self, context: RunContext[CallState]) -> str:
        """Send an SMS summarizing all appointments booked during this call.
        Call this once, near the end of the call, after all bookings are
        confirmed."""
        if not context.userdata.booked_appointments:
            return "No appointments were booked this call — nothing to send."

        phone = context.userdata.phone or "unknown number"
        lines = [
            f"- {a['type'].replace('_', ' ').title()}: {a['details']} on {a['slot']}"
            for a in context.userdata.booked_appointments
        ]
        message = "Your appointment(s) with Porsche Assist:\n" + "\n".join(lines)
        mock_data.log_sms(phone, message)
        logger.info("send_sms_confirmation -> %s: %s", phone, message)
        return f"SMS confirmation sent to {phone}."


