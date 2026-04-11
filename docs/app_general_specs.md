# PT Design: WonderPay General Specifications

## 1. Project Overview
**PT Design (WonderPay)** is a premium financial management dashboard built for real-time tracking, auditing, and verification of payment transactions. It features a high-fidelity "Dark × Orange" aesthetic with a core focus on smooth interactions and data integrity.

## 2. Core Features & Functional Modules

### A. Transaction Management
- **Audit Logging**: Create, edit, and archive payment records with real-time state persistence.
- **Worker Assignment**: Integrated Staff Directory link for identity-verified payments.
- **Financial Tracking**: Real-time amount calculation and currency management in GHS (₵).
- **Data Safety**: Multi-step deletion process with confirmation safeguards and a 5-second "Undo" recovery window.

### B. Employee Management (Staff Directory)
- **Centralized Registry**: Dedicated personnel management tab for adding, editing, and tracking workers.
- **Dynamic Integration**: Real-time synchronization between the Employee list and the Payment creation workflow.
- **Data Integrity**: Ensures payments are only recorded for verified system personnel.

### C. Advanced Search & Filtering 2.0
- **Multi-Criteria System**: Precise filtering by Date Range (Literal Text), Amount Thresholds (Literal Text), specific Worker, Payment Method, and Status.
- **Interactive Dashboard Sync**: Clickable **Status Analytics Cards** automatically apply and synchronize filters across the entire application.
- **Persistent State**: Filters maintain their strict configuration across session views for consistent auditing.

### D. Advanced Reporting Engine
- **Professional XLSX Export**: Native Excel workbook generation with multiple sheets:
    - **Transaction Audit**: Itemized record list with bold formatting and currency alignment.
    - **Executive Summary**: Aggregated totals, transaction counts, and method usage per worker.
- **Formal PDF Generation**: High-fidelity printable reports with "Zero-Clutter" mode (automatically excludes Sidebar/Header) and integrated digital signatures.

### E. Verification System
- **Signature Capture**: High-performance "Silky Smooth" drawing canvas utilizing Coalesced Events for zero-latency verification.
- **Secure View**: Modal-based signature asset viewer for secondary audit verification.

### F. Navigation & UI
- **Collapsible Sidebar**: Space-efficient navigation with Favicon-triggered expansion and integrated settings.
- **Dynamic Widgets**:
    - **Wallet Balance**: At-a-glance financial summary.
    - **System Health**: Real-time heartbeat indicator confirming active background processing (Data Sync, Analytics recalculation, and System Optimization). The "Activity Pulse" animation serves as a visual guarantee that the LocalStorage persistence engine is live and tracking every transaction.

## 3. Design Philosophy
- **Aesthetic**: Modern Glassmorphism (Backdrop Blurs, Semi-transparency, Layered Depths).
- **Identity**: Dark backgrounds with high-contrast Orange (`#ff4d00`) accenting.
- **Interaction**: High-performance animations and tactile micro-interactions.

## 4. Technical Architecture
- **Framework**: React + Vite (Single Page Application).
- **Styling**: Tailwind CSS for high-fidelity responsive layout.
- **Data Handling**: Synchronous state management with LocalStorage persistence.
- **Performance**: Optimized canvas drawing and virtualized component rendering for large datasets.
