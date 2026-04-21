// Churn Prediction Model
// This module implements churn prediction using customer engagement metrics

export class ChurnPredictor {
  constructor() {
    this.thresholds = {
      lowEngagement: 3, // months without purchase
      lowSpend: 50, // monthly spend threshold
      frequencyDrop: 0.5 // 50% drop in purchase frequency
    }
  }

  // Calculate churn risk for a household
  predictChurnRisk(transactions, household) {
    if (!transactions || transactions.length === 0) {
      return {
        risk: 'high',
        score: 0.9,
        reasons: ['No transaction history found']
      }
    }

    const now = new Date()
    const dates = transactions.map(t => new Date(t.PURCHASE_))
    const lastPurchaseDate = new Date(Math.max(...dates))
    const firstPurchaseDate = new Date(Math.min(...dates))

    // Calculate engagement metrics
    const daysSinceLastPurchase = (now - lastPurchaseDate) / (1000 * 60 * 60 * 24)
    const monthsSinceLastPurchase = daysSinceLastPurchase / 30
    
    const totalMonths = Math.max(1, (now - firstPurchaseDate) / (1000 * 60 * 60 * 24 * 30))
    const purchaseFrequency = transactions.length / totalMonths
    
    const totalSpend = transactions.reduce((sum, t) => sum + t.SPEND, 0)
    const monthlySpend = totalSpend / totalMonths
    
    const avgBasketSize = transactions.reduce((sum, t) => sum + t.UNITS, 0) / transactions.length

    // Calculate risk factors
    const riskFactors = []
    let riskScore = 0

    // Factor 1: Time since last purchase
    if (monthsSinceLastPurchase > this.thresholds.lowEngagement) {
      riskScore += 0.4
      riskFactors.push(`No purchases in ${monthsSinceLastPurchase.toFixed(1)} months`)
    } else if (monthsSinceLastPurchase > this.thresholds.lowEngagement * 0.5) {
      riskScore += 0.2
      riskFactors.push(`No purchases in ${monthsSinceLastPurchase.toFixed(1)} months`)
    }

    // Factor 2: Low monthly spend
    if (monthlySpend < this.thresholds.lowSpend) {
      riskScore += 0.3
      riskFactors.push(`Low monthly spend: $${monthlySpend.toFixed(2)}`)
    }

    // Factor 3: Low purchase frequency
    if (purchaseFrequency < 1) {
      riskScore += 0.2
      riskFactors.push(`Low purchase frequency: ${purchaseFrequency.toFixed(2)}/month`)
    }

    // Factor 4: Loyalty status
    if (household && household.L === 'N') {
      riskScore += 0.1
      riskFactors.push('Not a loyalty program member')
    }

    // Determine risk level
    let riskLevel
    if (riskScore >= 0.6) {
      riskLevel = 'high'
    } else if (riskScore >= 0.3) {
      riskLevel = 'medium'
    } else {
      riskLevel = 'low'
    }

    // Generate retention strategies
    const strategies = this.generateRetentionStrategies(riskLevel, household, {
      monthsSinceLastPurchase,
      monthlySpend,
      purchaseFrequency,
      loyalty: household?.L
    })

    return {
      risk: riskLevel,
      score: parseFloat(riskScore.toFixed(2)),
      reasons: riskFactors,
      metrics: {
        daysSinceLastPurchase: Math.round(daysSinceLastPurchase),
        monthsSinceLastPurchase: parseFloat(monthsSinceLastPurchase.toFixed(1)),
        purchaseFrequency: parseFloat(purchaseFrequency.toFixed(2)),
        monthlySpend: parseFloat(monthlySpend.toFixed(2)),
        totalSpend: parseFloat(totalSpend.toFixed(2)),
        avgBasketSize: parseFloat(avgBasketSize.toFixed(2))
      },
      strategies
    }
  }

  // Generate retention strategies based on risk level
  generateRetentionStrategies(riskLevel, household, metrics) {
    const strategies = []

    if (riskLevel === 'high') {
      strategies.push({
        priority: 'immediate',
        action: 'Send personalized re-engagement email with 20% discount',
        reason: 'Customer at high risk of churn'
      })
      strategies.push({
        priority: 'immediate',
        action: 'Offer loyalty program enrollment with bonus points',
        reason: 'Increase customer retention'
      })
      strategies.push({
        priority: 'high',
        action: 'Schedule follow-up call from customer service',
        reason: 'Personal outreach to understand disengagement'
      })
    } else if (riskLevel === 'medium') {
      strategies.push({
        priority: 'high',
        action: 'Send targeted promotions based on purchase history',
        reason: 'Re-engage with relevant offers'
      })
      if (metrics.loyalty === 'N') {
        strategies.push({
          priority: 'medium',
          action: 'Promote loyalty program benefits',
          reason: 'Increase engagement through membership'
        })
      }
      strategies.push({
        priority: 'medium',
        action: 'Include in monthly newsletter with personalized recommendations',
        reason: 'Maintain brand awareness'
      })
    } else {
      strategies.push({
        priority: 'low',
        action: 'Continue regular engagement through loyalty rewards',
        reason: 'Maintain positive relationship'
      })
      strategies.push({
        priority: 'low',
        action: 'Send personalized product recommendations',
        reason: 'Enhance customer experience'
      })
    }

    return strategies
  }
}

// Analyze churn risk across all households
export function analyzeChurnAcrossHouseholds(households, allTransactions) {
  const predictor = new ChurnPredictor()
  const results = []

  households.forEach(household => {
    const householdTransactions = allTransactions.filter(t => t.HSHD_NUM === household.HSHD_NUM)
    const prediction = predictor.predictChurnRisk(householdTransactions, household)
    
    results.push({
      hshdNum: household.HSHD_NUM,
      ...prediction
    })
  })

  // Summary statistics
  const highRisk = results.filter(r => r.risk === 'high').length
  const mediumRisk = results.filter(r => r.risk === 'medium').length
  const lowRisk = results.filter(r => r.risk === 'low').length

  return {
    results,
    summary: {
      total: results.length,
      highRisk,
      mediumRisk,
      lowRisk,
      highRiskPercentage: ((highRisk / results.length) * 100).toFixed(1)
    },
    topRisks: results
      .filter(r => r.risk === 'high')
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
  }
}
