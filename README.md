# Horizon - Premium Research Dashboard

![Status](https://img.shields.io/badge/status-live-success) ![Version](https://img.shields.io/badge/version-v1.0.0-blue)

**Horizon** is a state-of-the-art academic dashboard designed to visualize, monitor, and manage research group data. Built for strict adherence to Agile standards and premium UX principles, it provides a centralized platform for tracking research outputs, leadership dynamics, and institutional impact.

🔗 **Live Demo:** [https://ifesserra-lab.github.io/horizon_dashboard/](https://ifesserra-lab.github.io/horizon_dashboard/)

---

## 🚀 Key Features

### 🔍 Unified Smart Search
A powerful, real-time filtering engine that allows users to instantly find research groups by:
- **Name**
- **Campus**
- **Knowledge Area**
- **Leader Name**

### 📊 Premium UI/UX
- **Glassmorphism Design**: Modern, clean aesthetics with translucent cards and vibrant gradients.
- **Responsive Layout**: Fully optimized for desktop, tablet, and mobile devices.
- **Dark Mode Native**: Built from the ground up with a sophisticated dark theme.

### 🔄 CI/CD Automation
- **Automated Deployment**: Zero-touch deployment to GitHub Pages via GitHub Actions.
- **Robust Routing**: Dynamic base path handling for subdirectory hosting.

---

## 🛠️ Technology Stack

- **Framework**: [Astro](https://astro.build/) (Static Site Generation)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Custom CSS Variables
- **Icons**: Lucide React / Heroicons
- **Deployment**: GitHub Actions + GitHub Pages
- **Process**: Agile (Scrum/Kanban) with strict project governance

---

## 📂 Project Structure

```text
/
├── public/             # Static assets
├── src/
│   ├── components/     # Reusable UI components (Breadcrumbs, Search, Cards)
│   ├── layouts/        # Global layouts (Layout.astro)
│   ├── pages/          # Application routes
│   │   ├── groups/     # Group listing and details
│   │   └── index.astro # Dashboard Home
│   └── data/           # Canonical JSON data sources
├── docs/               # Project Documentation (PM & SI)
└── astro.config.mjs    # Astro configuration
```

## ⚡ Getting Started

### Prerequisites
- Node.js v18+
- npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ifesserra-lab/horizon_dashboard.git
   cd horizon_dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```
   Access the app at `http://localhost:4321/horizon_dashboard/`.

4. **Build for production**
   ```bash
   npm run build
   ```

---

## 📚 Documentation

Detailed project documentation is maintained in the `docs/` folder:
- **`docs/1 - projeto/`**: Governance, Plans, and Status Reports.
- **`docs/2 - implementacao/`**: Requirements, Architecture, and Design specs.

---

## 🤝 Contributing

This project follows a strict **GitFlow** workflow.
1. Create a feature branch from `developing` (`feat/my-feature`).
2. Commit your changes adhering to conventional commits.
3. Open a Pull Request via GitHub.
4. Deployment to `main` is automated upon merge.

---

<p align="center">
  Built with ❤️ by the Horizon Team
</p>
