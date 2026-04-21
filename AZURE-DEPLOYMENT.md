# Azure Deployment Guide

## Overview
This guide explains how to deploy the Retail Analytics application to Azure Cloud using free/low-cost services.

## Architecture
```
React Frontend (Vite + TailwindCSS)
    ↓
Azure Static Web Apps (Free Tier)
    ↓
Azure SQL Database (Free Tier F0 - 32GB)
    ↓
Azure Blob Storage (Free Tier - for CSV uploads)
```

## Prerequisites
- Azure account (free tier available)
- Node.js installed locally
- Git repository

## Step 1: Create Azure SQL Database

1. **Create SQL Database**
   - Go to Azure Portal → SQL Databases → Create
   - Select "Free F0" tier (32GB storage, 5 DTUs)
   - Create a new server or use existing
   - Set firewall rules to allow your IP and Azure services

2. **Run Database Schema**
   - Download and install SSMS (SQL Server Management Studio) from Microsoft
   - Connect to your Azure SQL database using the server name and credentials
   - Open `database-schema.sql` in SSMS
   - Execute the script to create empty table structures
   - Note: This creates the tables but does not populate them with data

3. **Load CSV Data into Tables**
   - The schema created empty tables in Step 2. This step populates them with actual data.
   - Files to load:
     - `400_households.csv` → Households table (401 records)
     - `400_products.csv` → Products table (67,285 records)
     - `400_transactions.csv` → Transactions table (922,009 records)
   - Important column mappings:
     - Households: `L` (loyalty flag), not `LOYALTY_FLAG`
     - Products: `BRAND_TY` (brand type), not `BRAND_TYPE`
     - Transactions: `PURCHASE_` (date), not `DATE`; `STORE_R` (region), not `STORE_REGION`

   **Method: Generate and Run INSERT Statements**
   - BULK INSERT has known compatibility issues with Azure SQL Database (OLE DB provider errors)
   - INSERT statements are the reliable method for Azure SQL Database
   - Two approaches: Online tool or Python script

   **Option A: Online Conversion Tool (Recommended for Households and Products)**
   1. Go to https://www.convertcsv.com/csv-to-sql.htm
   2. Upload the CSV file
   3. Configure settings:
      - Table name: Households, Products, or Transactions
      - Uncheck "Create Table/View IF NOT EXISTS" (tables already exist)
      - Check "Use NULL for Empty Field"
      - Keep original field names
   4. Download the generated SQL file
   5. Open in SSMS and execute

   **Option B: Python Script (Recommended for Transactions - large file)**
   ```python
   import csv
   import sys

   def csv_to_insert(csv_file, table_name, output_file):
       with open(csv_file, 'r') as f, open(output_file, 'w') as out:
           reader = csv.DictReader(f)
           columns = reader.fieldnames
           for row in reader:
               values = []
               for col in columns:
                   val = row[col].strip()
                   if val == '' or val.lower() == 'null':
                       values.append('NULL')
                   else:
                       # Escape single quotes
                       val = val.replace("'", "''")
                       values.append(f"'{val}'")
               out.write(f"INSERT INTO {table_name} ({', '.join(columns)}) VALUES ({', '.join(values)});\n")

   # Usage: python script.py input.csv TableName output.sql
   csv_to_insert(sys.argv[1], sys.argv[2], sys.argv[3])
   ```
   - Run for transactions: `python script.py 400_transactions.csv Transactions insert_transactions.sql`
   - Redirect output to file to handle large datasets

   **Execution Order:**
   1. Generate INSERT statements for households (401 records) - use online tool or Python
   2. Execute households INSERT statements in SSMS
   3. Generate INSERT statements for products (67,285 records) - use Python script
   4. Execute products INSERT statements in SSMS
   5. Generate INSERT statements for transactions (922,009 records) - use Python script with output file
   6. Execute transactions INSERT statements in SSMS (may take several minutes)

5. **Get Connection String**
   - Navigate to your database in Azure Portal
   - Go to "Connection strings"
   - Copy the ADO.NET connection string
   - Replace `{password}` with your database password

## Step 2: Deploy Frontend to Azure Static Web Apps

### Option A: Using Azure CLI

```bash
# Install Azure CLI if not installed
# Login to Azure
az login

# Create resource group
az group create --name retail-analytics-rg --location eastus

# Create Static Web App
az staticwebapp create \
  --name retail-analytics-app \
  --resource-group retail-analytics-rg \
  --source https://github.com/yourusername/your-repo \
  --branch main \
  --app-location . \
  --output-location dist
```

### Option B: Using Azure Portal

1. Azure Portal → Static Web Apps → Create
2. Resource group: retail-analytics-rg
3. Name: retail-analytics-app
4. Region: East US (or nearest)
5. Deployment source: GitHub
6. Build presets: Vite
7. App location: `/`
8. Output location: `dist`

### Build Configuration

Add `.github/workflows/azure-static-web-apps.yml`:

```yaml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy_job:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true
      - name: Build And Deploy
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/"
          api_location: ""
          output_location: "dist"
```

## Step 4: Configure Environment Variables

In Azure Static Web Apps Configuration:

```env
VITE_AZURE_SQL_CONNECTION_STRING="your-connection-string"
VITE_AZURE_BLOB_CONNECTION_STRING="your-blob-connection-string"
```

## Step 5: Local Build Test

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Test locally
npm run preview
```

## Step 6: Deploy

```bash
# Commit and push to GitHub
git add .
git commit -m "Initial deployment"
git push origin main

# Azure will automatically deploy from GitHub
```

## Alternative Deployment Options

### Azure Web Apps (with Node.js Backend)

If you need a backend API:

1. **Create Node.js API** in `/server` directory
2. **Deploy to Azure Web Apps**:
   ```bash
   az webapp create \
     --resource-group retail-analytics-rg \
     --name retail-analytics-api \
     --runtime "NODE|18-lts"
   ```
3. **Configure CORS** to allow frontend access

### Vercel/Netlify (Alternative to Azure Static Web Apps)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## Cost Summary (Free Tier)

| Service | Tier | Cost | Limitations |
|---------|------|------|-------------|
| Azure Static Web Apps | Free | $0 | 100 GB bandwidth/month |
| Azure SQL Database | F0 | $0 | 32GB storage, 5 DTUs |
| Azure Blob Storage | Free | $0 | 5GB storage, 20K read/month |
| **Total** | | **$0** | |

## Security Considerations

1. **Never commit connection strings** to Git
2. Use Azure Key Vault for production secrets
3. Enable HTTPS only
4. Configure IP restrictions on SQL Database
5. Use managed identities for Azure services

## Monitoring

- Azure Portal → Static Web Apps → Monitor
- View logs, metrics, and deployment history
- Set up alerts for errors or high latency

## Troubleshooting

**Build fails:**
- Check build logs in Azure Portal
- Ensure `npm run build` works locally
- Verify all dependencies are in package.json

**Database connection fails:**
- Verify firewall rules allow Azure services
- Check connection string format
- Ensure database is not paused

**CORS errors:**
- Add frontend URL to allowed origins
- Configure CORS in Azure SQL or API

## Scaling Beyond Free Tier

When scaling is needed:

1. **SQL Database**: Upgrade to S0 (standard tier)
2. **Static Web Apps**: Upgrade to Standard tier
3. **Add CDN**: Azure CDN for global distribution
4. **Add caching**: Azure Cache for Redis

## Support

- Azure Documentation: https://docs.microsoft.com/azure
- Static Web Apps Docs: https://docs.microsoft.com/azure/static-web-apps
- SQL Database Docs: https://docs.microsoft.com/azure/sql-database

******************************************

Configure the workflow token in Azure:
Go to your Static Web App in Azure Portal
Click "GitHub Actions" or "Workflow"
Copy the API token
Go to your GitHub repository → Settings → Secrets and variables → Actions
Add secret: AZURE_STATIC_WEB_APPS_API_TOKEN with the token value
First deployment:
After pushing, Azure will automatically detect the workflow
Build and deploy will run automatically
Monitor deployment in Azure Portal → Static Web Apps → Workflow
