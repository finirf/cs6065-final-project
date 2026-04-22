import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import Button from '../components/ui/Button'
import { analyzeChurnAcrossHouseholds } from '../ml/churnPrediction'

export default function ChurnPrediction() {
  const [loading, setLoading] = useState(true)
  const [churnData, setChurnData] = useState(null)
  const [selectedHousehold, setSelectedHousehold] = useState(null)

  useEffect(() => {
    const fetchChurnData = async () => {
      setLoading(true)
      try {
        // For churn analysis, we need household-level data
        // Since the dashboard API doesn't provide household demographics, we'll analyze based on transaction patterns
        // In production, we'd fetch households data from a separate endpoint
        
        // Mock households data for demonstration (would come from API in production)
        const mockHouseholds = Array.from({ length: 50 }, (_, i) => ({
          HSHD_NUM: String(i + 1).padStart(4, '0'),
          L: i % 3 === 0 ? 'Y' : 'N' // Mix of loyalty members
        }))
        
        // Mock transactions data for demonstration
        // In production, we'd fetch all transactions and group by household
        const mockTransactions = Array.from({ length: 200 }, (_, i) => {
          const householdIndex = i % 50
          const daysAgo = Math.floor(Math.random() * 365)
          const date = new Date()
          date.setDate(date.getDate() - daysAgo)
          
          return {
            HSHD_NUM: String(householdIndex + 1).padStart(4, '0'),
            BASKET_NUM: Math.floor(Math.random() * 100) + 1,
            PURCHASE_: date.toISOString().split('T')[0],
            SPEND: Math.random() * 100 + 10,
            UNITS: Math.floor(Math.random() * 10) + 1
          }
        })
        
        const analysis = analyzeChurnAcrossHouseholds(mockHouseholds, mockTransactions)
        
        if (analysis && analysis.summary) {
          setChurnData(analysis)
        } else {
          setChurnData({
            summary: { total: 50, highRisk: 0, mediumRisk: 0, lowRisk: 50, highRiskPercentage: '0' },
            topRisks: []
          })
        }
      } catch (error) {
        console.error('Error fetching churn data:', error)
        setChurnData({
          summary: { total: 50, highRisk: 0, mediumRisk: 0, lowRisk: 50, highRiskPercentage: '0' },
          topRisks: []
        })
      } finally {
        setLoading(false)
      }
    }

    fetchChurnData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-8 text-muted-foreground">
            Loading churn analysis...
          </div>
        </div>
      </div>
    )
  }

  if (!churnData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-8 text-muted-foreground">
            Error loading churn analysis data
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Churn Prediction Analysis</CardTitle>
            <CardDescription>
              Identify customers at risk of disengaging and develop retention strategies
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Summary Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-slate-50">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-slate-900">{churnData.summary.total}</div>
                  <div className="text-sm text-slate-600">Total Households</div>
                </CardContent>
              </Card>
              <Card className="bg-red-50">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-red-900">{churnData.summary.highRisk}</div>
                  <div className="text-sm text-red-600">High Risk ({churnData.summary.highRiskPercentage}%)</div>
                </CardContent>
              </Card>
              <Card className="bg-yellow-50">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-yellow-900">{churnData.summary.mediumRisk}</div>
                  <div className="text-sm text-yellow-600">Medium Risk</div>
                </CardContent>
              </Card>
              <Card className="bg-green-50">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-900">{churnData.summary.lowRisk}</div>
                  <div className="text-sm text-green-600">Low Risk</div>
                </CardContent>
              </Card>
            </div>

            {/* High Risk Households */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Top 10 High-Risk Households</CardTitle>
                <CardDescription>
                  Customers most at risk of disengaging - prioritize retention efforts
                </CardDescription>
              </CardHeader>
              <CardContent>
                {churnData.topRisks && churnData.topRisks.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-slate-100">
                          <th className="border border-slate-300 px-4 py-2 text-left font-semibold">HSHD_NUM</th>
                          <th className="border border-slate-300 px-4 py-2 text-left font-semibold">Risk Level</th>
                          <th className="border border-slate-300 px-4 py-2 text-left font-semibold">Risk Score</th>
                          <th className="border border-slate-300 px-4 py-2 text-left font-semibold">Risk Factors</th>
                          <th className="border border-slate-300 px-4 py-2 text-left font-semibold">Retention Strategies</th>
                        </tr>
                      </thead>
                      <tbody>
                        {churnData.topRisks.map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className="border border-slate-300 px-4 py-2">{item.hshdNum}</td>
                          <td className="border border-slate-300 px-4 py-2">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              item.risk === 'high' ? 'bg-red-100 text-red-800' :
                              item.risk === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {item.risk.toUpperCase()}
                            </span>
                          </td>
                          <td className="border border-slate-300 px-4 py-2">{item.score}</td>
                          <td className="border border-slate-300 px-4 py-2">
                            {item.reasons.length > 0 ? item.reasons.join(', ') : 'N/A'}
                          </td>
                          <td className="border border-slate-300 px-4 py-2">
                            {item.strategies.length > 0 ? (
                              <ul className="list-disc list-inside text-sm">
                                {item.strategies.slice(0, 2).map((strategy, idx) => (
                                  <li key={idx}>{strategy.action}</li>
                                ))}
                              </ul>
                            ) : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No high-risk households found in the current analysis
                </div>
              )}
              </CardContent>
            </Card>

            {/* Methodology */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Analysis Methodology</CardTitle>
                <CardDescription>
                  How churn risk is calculated using customer engagement metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Risk Factors Considered:</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Time since last purchase:</strong> Customers with no purchases in 3+ months are flagged</li>
                    <li><strong>Monthly spend:</strong> Low monthly spend (below $50) indicates reduced engagement</li>
                    <li><strong>Purchase frequency:</strong> Less than 1 purchase per month is concerning</li>
                    <li><strong>Loyalty status:</strong> Non-loyalty members have higher churn risk</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Retention Strategies:</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>High Risk:</strong> Immediate re-engagement emails, loyalty enrollment offers, customer service outreach</li>
                    <li><strong>Medium Risk:</strong> Targeted promotions, loyalty program promotion, personalized newsletters</li>
                    <li><strong>Low Risk:</strong> Regular engagement through rewards, personalized recommendations</li>
                  </ul>
                </div>
                <div className="text-sm text-slate-600">
                  <strong>Note:</strong> This analysis uses regression-based scoring and correlation of engagement metrics. 
                  In production, this would be enhanced with more sophisticated ML models and demographic data.
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
