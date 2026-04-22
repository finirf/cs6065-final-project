# Retail Analytics Platform

A comprehensive data science and analytics web application built with Azure Cloud Computing Technologies for analyzing retail customer engagement and spending behaviors.

## Project Overview

This project applies cloud computing, data engineering, and data science skills using Azure Cloud Technologies to analyze real-world retail data from 84.51°/Kroger. The platform provides insights on customer engagement, spending patterns, and predictive analytics through interactive dashboards and machine learning models.

## Features

- **Login Page**: Secure authentication with username, password, and email fields
- **Data Pull Display**: View sample transaction data for specific households
- **Interactive Search**: Search and filter transaction data by household number
- **Data Loading**: Upload CSV files for Transactions, Households, and Products
- **Dashboard**: Comprehensive retail KPIs with interactive visualizations
- **ML Models**: 
  - Linear Regression for Customer Lifetime Value (CLV) prediction
  - Market Basket Analysis for cross-selling opportunities
  - Churn Prediction for customer retention strategies

## Tech Stack

### Frontend
- **React 18** with Vite
- **TailwindCSS** for styling
- **React Router** for navigation
- **Recharts** for data visualization
- **Lucide React** for icons

### Backend (Planned)
- **Node.js** with Express
- **Azure SQL Database** (Free Tier F0)
- **Azure Blob Storage** for file uploads

### Cloud Deployment
- **Azure Static Web Apps** (Free Tier)
- **Azure SQL Database** (Free Tier F0 - 32GB)
- **Azure Blob Storage** (Free Tier)

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open http://localhost:5173 in your browser

## Project Structure

```
windsurf-project/
├── src/
│   ├── components/
│   │   └── ui/          # Reusable UI components (Button, Card, Input, Label)
│   ├── data/
│   │   └── mockData.js  # Mock data for development
│   ├── lib/
│   │   └── utils.js     # Utility functions
│   ├── ml/
│   │   ├── basketAnalysis.js      # Market basket analysis
│   │   ├── churnPrediction.js     # Churn prediction model
│   │   └── clvPrediction.js      # Customer lifetime value prediction
│   ├── pages/
│   │   ├── Dashboard.jsx          # Main dashboard with KPIs
│   │   ├── DataLoading.jsx        # CSV upload interface
│   │   ├── DataPull.jsx           # Sample data display
│   │   ├── Login.jsx              # Login page
│   │   └── Search.jsx             # Transaction search
│   ├── App.jsx                    # Main app with routing
│   ├── index.css                  # Global styles with Tailwind
│   └── main.jsx                   # React entry point
├── database-schema.sql            # Azure SQL database schema
├── ML-MODEL-WRITEUP.md           # ML model documentation
├── AZURE-DEPLOYMENT.md          # Azure deployment guide
└── package.json
```

## Database Schema

The application uses Azure SQL Database with three main tables matching the actual CSV file structure from the assignment:

- **Households**: Household demographics and loyalty information
  - Column names match CSV: `L` (loyalty flag), `AGE_RANGE`, `MARITAL`, `INCOME_RANGE`, etc.
  - Most demographic fields are null in the anonymized sample data
  
- **Products**: Product details including department, commodity, brand type
  - Column names match CSV: `BRAND_TY` (brand type), `NATURAL_ORGANIC_FLAG`
  
- **Transactions**: Transaction data linking households and products
  - Column names match CSV: `PURCHASE_` (date), `STORE_R` (store region), `WEEK_NUM`, `YEAR`
  - IDs are strings (VARCHAR) to match CSV format

See `database-schema.sql` for the complete schema with actual column names from the assignment.

## ML Models

### Linear Regression (CLV Prediction)
Predicts Customer Lifetime Value based on purchase frequency and spending patterns to prioritize high-value customers.

### Market Basket Analysis
Uses association rule mining (Apriori algorithm) to identify commonly purchased product combinations for cross-selling opportunities.

### Churn Prediction
Analyzes customer engagement metrics to identify customers at risk of disengaging and provides retention strategies.

See `ML-MODEL-WRITEUP.md` for detailed model descriptions.

## Deployment

### Live URLs

- **Frontend (Azure Static Web Apps)**: https://calm-mushroom-03389961e.7.azurestaticapps.net
- **Backend API (Azure Functions)**: https://finirf-retail-api-baaea0fva6dddpfu.westus3-01.azurewebsites.net
- **Database**: Azure SQL Database (Free Tier F0)

### Azure Deployment

Follow the comprehensive deployment guide in `AZURE-DEPLOYMENT.md` to deploy to:

1. Azure Static Web Apps (Free Tier)
2. Azure SQL Database (Free Tier F0)
3. Azure Functions (Node.js 22 LTS)

### Alternative Deployment

- **Vercel**: `npm i -g vercel && vercel`
- **Netlify**: Connect GitHub repository to Netlify

## Design Philosophy

The application features a modern, clean, and approachable design with:
- Light color palette
- Rounded corners
- Soft shadows
- Clear, readable typography
- Spaced UI elements for clarity
- Visually distinct cards and panels

## Requirements Coverage

✅ Write-Up on ML Models (Linear Regression, Random Forest, Gradient Boosting)  
✅ Web Server Setup with login page  
✅ Datastore and Data Loading (Azure SQL)  
✅ Interactive Web Page for data pulls  
✅ Data Loading Web App  
✅ Dashboard with retail KPIs  
✅ ML Model Application (Basket Analysis)  
✅ Churn Prediction  

## License

This project is created for educational purposes for the CS6065 Data Science and Analytics course.

## Contact

For questions or support, please refer to the course materials or Azure documentation.
