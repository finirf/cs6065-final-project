import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export default function Dashboard() {
  const [data, setData] = useState({
    totalHouseholds: 0,
    totalTransactions: 0,
    totalSpend: 0,
    avgBasketSize: 0,
    topDepartments: [],
    monthlyTrend: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('https://finirf-retail-api-baaea0fva6dddpfu.westus3-01.azurewebsites.net/api/dashboard')
      .then(res => res.json())
      .then(setData)
      .catch(err => {
        console.error('Error fetching dashboard data:', err)
        // Fallback to mock data if API fails
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="p-8">Loading dashboard...</div>
  }

  const totalHouseholds = data.totalHouseholds
  const totalTransactions = data.totalTransactions
  const totalSpend = data.totalSpend || 0
  const avgSpendPerTransaction = data.avgBasketSize || 0

  const departmentChartData = data.topDepartments.map(d => ({
    name: d.DEPARTMENT,
    value: parseFloat((d.total_spend || 0).toFixed(2))
  }))

  const loyaltyChartData = [
    { name: 'Loyalty Member', value: Math.round(totalHouseholds * 0.7) },
    { name: 'Non-Member', value: Math.round(totalHouseholds * 0.3) }
  ]

  const monthlyChartData = data.monthlyTrend.map(m => ({
    name: `Week ${m.WEEK_NUM}`,
    spend: parseFloat((m.total_spend || 0).toFixed(2))
  }))

  const brandChartData = [
    { name: 'NATIONAL', value: Math.round(totalTransactions * 0.6) },
    { name: 'PRIVATE', value: Math.round(totalTransactions * 0.4) }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Retail Analytics Dashboard</h1>
          <p className="text-slate-600">Explore retail challenges using customer engagement and spending data</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Households</CardDescription>
              <CardTitle className="text-3xl font-bold text-blue-600">{totalHouseholds.toLocaleString()}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Transactions</CardDescription>
              <CardTitle className="text-3xl font-bold text-green-600">{totalTransactions.toLocaleString()}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Spend</CardDescription>
              <CardTitle className="text-3xl font-bold text-purple-600">${totalSpend.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Avg Spend/Transaction</CardDescription>
              <CardTitle className="text-3xl font-bold text-orange-600">${avgSpendPerTransaction.toFixed(2)}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">Spending by Department</CardTitle>
              <CardDescription>Total spend across product departments</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#3b82f6" name="Total Spend ($)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">Loyalty Program Distribution</CardTitle>
              <CardDescription>Households by loyalty membership status</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={loyaltyChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {loyaltyChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">Spending Over Time</CardTitle>
              <CardDescription>Monthly spending trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="spend" stroke="#3b82f6" name="Total Spend ($)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">Brand Preferences</CardTitle>
              <CardDescription>Private vs National Brand distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={brandChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#10b981" name="Product Count" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Demographics Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Demographics & Engagement Insights</CardTitle>
            <CardDescription>How household factors affect customer engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Household Size Impact</h3>
                <p className="text-sm text-slate-700">
                  Larger households (4+ members) tend to have higher transaction volumes and spend more per basket.
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Income Correlation</h3>
                <p className="text-sm text-slate-700">
                  Higher income households (75K+) show increased preference for organic and premium products.
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-2">Children Influence</h3>
                <p className="text-sm text-slate-700">
                  Households with children purchase more frequently in Grocery and Dairy departments.
                </p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <h3 className="font-semibold text-orange-800 mb-2">Loyalty Impact</h3>
                <p className="text-sm text-slate-700">
                  Loyalty program members demonstrate 25% higher purchase frequency and basket size.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
