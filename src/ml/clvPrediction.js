// Customer Lifetime Value (CLV) Prediction using Linear Regression
// This module implements a simple linear regression model to predict customer lifetime value

export class LinearRegression {
  constructor() {
    this.slope = 0
    this.intercept = 0
  }

  // Fit the linear regression model
  fit(X, y) {
    const n = X.length
    if (n === 0) return

    // Calculate means
    const meanX = X.reduce((sum, x) => sum + x, 0) / n
    const meanY = y.reduce((sum, val) => sum + val, 0) / n

    // Calculate slope and intercept
    let numerator = 0
    let denominator = 0

    for (let i = 0; i < n; i++) {
      numerator += (X[i] - meanX) * (y[i] - meanY)
      denominator += (X[i] - meanX) ** 2
    }

    this.slope = denominator !== 0 ? numerator / denominator : 0
    this.intercept = meanY - this.slope * meanX
  }

  // Predict using the fitted model
  predict(x) {
    return this.intercept + this.slope * x
  }

  // Calculate R-squared
  rSquared(X, y) {
    const predictions = X.map(x => this.predict(x))
    const meanY = y.reduce((sum, val) => sum + val, 0) / y.length

    const ssRes = y.reduce((sum, val, i) => sum + (val - predictions[i]) ** 2, 0)
    const ssTot = y.reduce((sum, val) => sum + (val - meanY) ** 2, 0)

    return ssTot !== 0 ? 1 - (ssRes / ssTot) : 0
  }
}

// Calculate CLV for a household based on transaction history
export function calculateCLV(transactions, household) {
  if (!transactions || transactions.length === 0) return 0

  // Features for CLV prediction
  const totalSpend = transactions.reduce((sum, t) => sum + t.SPEND, 0)
  const avgBasketSize = transactions.reduce((sum, t) => sum + t.UNITS, 0) / transactions.length
  const purchaseFrequency = transactions.length
  
  // Calculate time span in months
  const dates = transactions.map(t => new Date(t.PURCHASE_))
  const minDate = new Date(Math.min(...dates))
  const maxDate = new Date(Math.max(...dates))
  const monthsSpan = Math.max(1, (maxDate - minDate) / (1000 * 60 * 60 * 24 * 30))
  
  const monthlySpend = totalSpend / monthsSpan
  
  // Simple CLV calculation (can be enhanced with ML model)
  // In production, this would use the trained Linear Regression model
  const clv = monthlySpend * 12 * 3 // Project 3 years based on monthly spend
  
  return {
    clv: parseFloat(clv.toFixed(2)),
    totalSpend: parseFloat(totalSpend.toFixed(2)),
    avgBasketSize: parseFloat(avgBasketSize.toFixed(2)),
    purchaseFrequency,
    monthlySpend: parseFloat(monthlySpend.toFixed(2)),
    monthsSpan: parseFloat(monthsSpan.toFixed(1))
  }
}

// Train CLV model on historical data
export function trainCLVModel(households, allTransactions) {
  const model = new LinearRegression()
  
  // Prepare training data
  const X = []
  const y = []
  
  households.forEach(household => {
    const householdTransactions = allTransactions.filter(t => t.HSHD_NUM === household.HSHD_NUM)
    if (householdTransactions.length > 0) {
      const clvData = calculateCLV(householdTransactions, household)
      // Use purchase frequency as feature
      X.push(clvData.purchaseFrequency)
      y.push(clvData.totalSpend)
    }
  })
  
  model.fit(X, y)
  
  return {
    model,
    rSquared: model.rSquared(X, y),
    featureCount: X.length
  }
}
