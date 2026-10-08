# BGMCS Cyber Club

The official platform of the **BGMCS Cyber Club** — an elite student-led collegiate cybersecurity research cell and defense laboratory.

## About BGMCS Cyber Club

BGMCS Cyber Club trains members in defensive systems architecture, offensive security operations, reverse engineering, applied cryptography, and threat intelligence. 

### Core Divisions
1. **Offensive Security & Exploitation**: Vulnerability discovery, ROP chaining, binary analysis, and kernel exploration.
2. **Defensive Architecture & Telemetry**: Zero-trust networking, eBPF telemetry, and persistent threat detection.
3. **Applied Cryptography & Protocols**: Post-quantum algorithms, lattice cryptography, and side-channel analysis.
4. **Competitive Wargames & CTF**: Collegiate cyber defense exercises and red/blue wargames.

---

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: JWT & HTTP-only sessions
- **Typography**: Instrument Serif, IBM Plex Mono, Plus Jakarta Sans

---

## Getting Started

### 1. Prerequisites
- Node.js 20+
- PostgreSQL database

### 2. Installation
```bash
npm install
```

### 3. Environment Setup
Copy `.env.example` to `.env` and configure your credentials:
```bash
cp .env.example .env
```

### 4. Database Setup
```bash
npx prisma generate
npx prisma db push
```

### 5. Running the Application
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the portal.
