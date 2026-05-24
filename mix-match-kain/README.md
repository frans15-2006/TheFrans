# Mix & Match Kain — Food Ordering System

A web-based food ordering system built for a real restaurant in Palawan, Philippines. Customers order from their own phones via QR code. The backend runs locally on-site — no cloud, no external dependency, no data leaving the premises.

Deployed during a live restaurant event that exceeded expected order volume. The system remained operational throughout service, including during a network outage mid-event.

---

## The Problem

The restaurant had no digital ordering system. Staff were taking orders manually, tracking stock by memory, and handling cash payments with no running total. The process was slow, error-prone, and impossible to track across a busy service.

The goal was to fix three things:
- Speed up ordering so customers didn't wait
- Track stock in real time so the kitchen knew what was available
- Give staff a clear view of running totals instead of mental math

---

## How It Works

Customers scan a QR code on their table → browse the menu on their own phone → build a cart → submit an order. The backend receives the order, records it, updates stock, and logs the payment. Staff see incoming orders in real time.

No app install. No account required.

---

## Stack

- **Frontend** — Vanilla JS, HTML, CSS — served locally during the event
- **Backend** — Node.js + Express — localhost, LAN only
- **Real-time** — WebSockets for live order updates
- **Storage** — Local — no external database dependency

---

## Architecture

```
Customer phone (restaurant WiFi)
        ↓
   Menu & cart
        ↓
  QR checkout — order encoded, QR generated
        ↓
[ Local network — no internet required ]
        ↓
  Node.js / Express — localhost:3000
     ↓         ↓         ↓
Payments   Orders    Stock updates
```

The decision to run the backend on LAN only was intentional. Keeping the system local meant minimal latency on order submission, no dependency on external services, and reduced exposure if the network was compromised.

---

## What Broke in Production

Two issues surfaced during the live event and were fixed on the spot.

**1. QR codes not loading** — Under real load, the QR generation was failing silently on some devices. Diagnosed and patched in approximately 30 minutes while service was running. Root cause was a rendering timing issue — the QR was being generated before the DOM element was ready.

**2. Order total calculations were wrong** — The running totals on the staff view were drifting from actual orders. Fixed during service. The bug was a state synchronization issue between concurrent order submissions hitting the same total.

Both fixes were deployed live without taking the system offline.

---

## What I'd Redesign

**Error handling.** Bugs were found because customers hit them, not because the system caught them first. A proper error logging layer would have surfaced these before the event.

**Order state management.** The total calculation bug came from concurrent writes not being properly sequenced. A queue or atomic update pattern would have prevented it.

**Deployment process.** The backend setup before the event was manual. A proper startup script and environment config would have reduced pre-event stress.

One unexpected outcome: a glitch in the stock sync during peak load accidentally locked certain items from being ordered. In practice this prevented over-ordering when the kitchen was already at capacity. Unintentional, but it worked. A proper stock ceiling feature is on the backlog.

---

## Known Limitations

- Backend requires manual startup on a local machine — not self-hosted
- No authentication on the admin view
- No persistent database — data does not survive a server restart
- No offline fallback if the local server goes down
- Payment recording is manual confirmation, not automated verification

---

## Screenshots

_Add screenshots to `/assets/screenshots/` and link them here._

- Customer ordering interface
- QR checkout flow
- Admin order queue
- Live stock view

## Repo Structure

```
/frontend    — HTML, CSS, JS — customer ordering interface
/backend     — Node.js / Express — order handling, stock, payments
/assets      — Icons, images, QR generation assets
```

## Setup

```bash
# Clone the repo
git clone https://github.com/frans15-2006/mix-match-kain

# Install dependencies
cd backend
npm install

# Start the backend
node server.js
# Backend runs at localhost:3000

# Frontend
# Open index.html directly in a browser, or serve with any static file server
# Customers access via the host machine's LAN IP on the restaurant network
```

Create a `.env` file in the backend directory:

```
PORT=3000
```

---

## Deployment Notes

Both frontend and backend ran locally on the same machine during the event, connected to the restaurant's WiFi. Customers accessed the ordering interface from their own phones via the local network — no internet connection required.

During the event, the internet went down. The system continued functioning without interruption because there was no external dependency to lose. Orders were still submitted, stock still updated, and the staff view continued receiving live updates. The local-first architecture allowed the system to continue operating when the internet dropped.

---

## Future Improvements

- Persistent database (MongoDB or SQLite)
- Admin authentication
- Automated payment verification
- Proper error logging and monitoring
- Self-contained deployment — Raspberry Pi or low-cost local server
- Offline resilience if LAN drops mid-service
