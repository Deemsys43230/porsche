import random
import string
from datetime import datetime, timedelta
from typing import Optional

# ---------------------------------------------------------------------------
# Seed data
# ---------------------------------------------------------------------------

CUSTOMERS = {
    "C1001": {
        "customer_id": "C1001",
        "name": "Pedro Rosario",
        "phone": "2125550148",
        "vehicles": ["V2001"],
        "past_inquiries": [{"model": "Taycan", "date": "2026-05-14"}],
    },
    "C1002": {
        "customer_id": "C1002",
        "name": "Carolina Santos",
        "phone": "3105550193",
        "vehicles": ["V2002"],
        "past_inquiries": [],
    },
    "C1003": {
        "customer_id": "C1003",
        "name": "Michael Chen",
        "phone": "4155550267",
        "vehicles": ["V2003"],
        "past_inquiries": [{"model": "911", "date": "2026-03-02"}],
    },
}

VEHICLES = {
    "V2001": {
        "vin": "WP0AB2A99PS784521",
        "vin_last4": "4521",
        "model": "Cayenne S",
        "customer_id": "C1001",
        "last_service_date": "2026-02-10",
        "next_service_due": "2026-09-20",
        "next_service_type": "30,000-mile scheduled service",
        "mileage": 28500,
    },
    "V2002": {
        "vin": "WP0ZZZ95ZKS123456",
        "vin_last4": "3456",
        "model": "Macan",
        "customer_id": "C1002",
        "last_service_date": "2026-06-01",
        "next_service_due": "2026-12-01",
        "next_service_type": "Annual inspection",
        "mileage": 12000,
        "lease_end_date": "2026-08-15",
    },
    "V2003": {
        "vin": "WP0CA29968S780999",
        "vin_last4": "0999",
        "model": "911 Carrera",
        "customer_id": "C1003",
        "last_service_date": "2025-11-15",
        "next_service_due": "2026-08-10",
        "next_service_type": "Brake fluid + inspection",
        "mileage": 19200,
    },
}

MODEL_CATALOG = {
    "taycan": {
        "model": "Taycan",
        "trims": ["Taycan", "Taycan 4S", "Taycan GTS", "Taycan Turbo S"],
        "starting_price": "starting around $99,800, before options and destination",
        "range": "up to 320 miles on a full charge, depending on trim",
        "acceleration": "as quick as 2.4 seconds 0 to 60 mph on the Turbo S",
    },
    "cayenne": {
        "model": "Cayenne",
        "trims": ["Cayenne", "Cayenne S", "Cayenne GTS", "Cayenne Turbo GT"],
        "starting_price": "starting around $78,900, before options and destination",
        "range": "not applicable, gasoline and hybrid variants available",
        "acceleration": "as quick as 3.1 seconds 0 to 60 mph on the Turbo GT",
    },
    "macan": {
        "model": "Macan",
        "trims": ["Macan", "Macan S", "Macan GTS", "Macan Electric"],
        "starting_price": "starting around $62,600, before options and destination",
        "range": "electric variant offers up to 315 miles",
        "acceleration": "as quick as 3.3 seconds 0 to 60 mph on the GTS",
    },
    "911": {
        "model": "911",
        "trims": ["Carrera", "Carrera S", "Carrera GTS", "Turbo S", "GT3"],
        "starting_price": "starting around $118,900, before options and destination",
        "range": "not applicable, gasoline variant",
        "acceleration": "as quick as 2.6 seconds 0 to 60 mph on the Turbo S",
    },
    "panamera": {
        "model": "Panamera",
        "trims": ["Panamera", "Panamera 4", "Panamera 4S", "Panamera Turbo S"],
        "starting_price": "starting around $99,400, before options and destination",
        "range": "hybrid variant offers up to 55 miles electric-only range",
        "acceleration": "as quick as 3.0 seconds 0 to 60 mph on the Turbo S",
    },
}

INVENTORY = {
    "taycan 4s": {"model": "Taycan 4S", "units_in_stock": 2, "test_drive_available": True},
    "macan gts": {"model": "Macan GTS", "units_in_stock": 1, "test_drive_available": True},
    "911 carrera s": {"model": "911 Carrera S", "units_in_stock": 0, "test_drive_available": True},
    "cayenne s": {"model": "Cayenne S", "units_in_stock": 3, "test_drive_available": True},
    "panamera 4s": {"model": "Panamera 4S", "units_in_stock": 1, "test_drive_available": False},
}

# Runtime state — populated as the demo call progresses
APPOINTMENTS: dict[str, dict] = {}
LEADS: dict[str, dict] = {}
SMS_LOG: list[dict] = []


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _new_id(prefix: str) -> str:
    return f"{prefix}{random.randint(10000, 99999)}"


def _normalize_phone(phone: str) -> str:
    return "".join(ch for ch in phone if ch.isdigit())[-10:]


def find_customer_by_phone(phone: str) -> Optional[dict]:
    norm = _normalize_phone(phone)
    for cust in CUSTOMERS.values():
        if cust["phone"] == norm:
            return cust
    return None


def find_customer_by_name(name: str) -> Optional[dict]:
    name_lower = name.strip().lower()
    for cust in CUSTOMERS.values():
        if cust["name"].lower() == name_lower or name_lower in cust["name"].lower():
            return cust
    return None


def get_vehicle_for_customer(customer_id: str) -> Optional[dict]:
    cust = CUSTOMERS.get(customer_id)
    if not cust or not cust["vehicles"]:
        return None
    return VEHICLES.get(cust["vehicles"][0])


def get_vehicle_by_vin_suffix(vin_last4: str) -> Optional[dict]:
    for v in VEHICLES.values():
        if v["vin_last4"] == vin_last4:
            return v
    return None


def days_until(date_str: str) -> int:
    target = datetime.strptime(date_str, "%Y-%m-%d")
    return (target - datetime.now()).days


def generate_slots(n: int = 3) -> list[str]:
    """Return n plausible upcoming appointment slots as human-readable strings."""
    options = []
    base = datetime.now() + timedelta(days=2)
    times = ["10:00 AM", "12:30 PM", "2:00 PM", "4:00 PM"]
    for i in range(n):
        day = base + timedelta(days=i * 2)
        options.append(f"{day.strftime('%A, %B %d')} at {random.choice(times)}")
    return options


def create_appointment(
    customer_id: str,
    appt_type: str,
    details: str,
    slot: str,
    vin: Optional[str] = None,
    model: Optional[str] = None,
    loaner: bool = False,
) -> dict:
    appt_id = _new_id("A")
    appt = {
        "appointment_id": appt_id,
        "customer_id": customer_id,
        "type": appt_type,          # "service" | "test_drive"
        "details": details,
        "slot": slot,
        "vin": vin,
        "model": model,
        "loaner_reserved": loaner,
        "status": "confirmed",
    }
    APPOINTMENTS[appt_id] = appt
    return appt


def create_lead(name: str, phone: str, intent: str) -> dict:
    lead_id = _new_id("L")
    lead = {"lead_id": lead_id, "name": name, "phone": phone, "intent": intent}
    LEADS[lead_id] = lead
    return lead


def log_sms(to_phone: str, message: str) -> None:
    SMS_LOG.append({"to": to_phone, "message": message, "sent_at": datetime.now().isoformat()})