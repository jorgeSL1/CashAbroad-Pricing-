# CashAbroad - Pricing & Timeline Calculator

A modern, responsive web application for calculating US immigration visa costs and timelines. Built with React, Vite, and Tailwind CSS.

## 🎯 Features

- **Interactive Quiz**: Step-by-step questionnaire for visa type, country, status, dependents, and premium processing
- **Dynamic Timeline**: Visual timeline with optimistic, intermediate, and pessimistic scenarios
- **Real-time Cost Calculator**: Instant cost breakdown with animated charts
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile
- **Smooth Animations**: Powered by Framer Motion for fluid transitions
- **Data Visualization**: Interactive charts using Recharts

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Navigate to the project directory
cd cashabroad-pricing

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 🛠️ Tech Stack

- **React 18** - UI library
- **Vite** - Build tool with SWC
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Recharts** - Charting library
- **Lucide React** - Icon library

## 📁 Project Structure

```
cashabroad-pricing/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Header.jsx      # Navigation header
│   │   ├── Quiz.jsx        # Interactive questionnaire
│   │   ├── Timeline.jsx    # Timeline visualization
│   │   ├── PricingChart.jsx # Cost breakdown & charts
│   │   ├── Footer.jsx      # Site footer
│   │   └── index.js        # Component exports
│   ├── App.jsx             # Main application
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## 🎨 Design System

### Colors

- **Primary (Dark Blue)**: `#1a1f4e` - Main brand color
- **Accent Blue**: `#3b82f6` - Interactive elements
- **Accent Teal**: `#14b8a6` - Success states
- **Neutral palette** - Grays for text and backgrounds

### Typography

- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

## ⚙️ Configuration

### Tailwind CSS

Custom configuration in `tailwind.config.js`:
- Extended color palette
- Custom animations
- Shadow utilities

### Vite

- SWC enabled for fast compilation
- React plugin with automatic JSX runtime

## 📊 Visa Types Supported

- EB-1A (Extraordinary Ability)
- EB-2 NIW (National Interest Waiver)
- O-1A (Extraordinary Ability - Non-immigrant)
- O-1B (Arts & Entertainment)
- H-1B (Specialty Occupation)
- L-1 (Intracompany Transfer)

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- Design inspired by [Tukki.ai](https://tukki.ai)
- Built for [CashAbroad](https://www.cashabroad.one)

---

Made with ❤️ in Mexico
