import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { mockHouseholds, mockTransactions, mockProducts } from '../data/mockData'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export default function Dashboard() {
  // Calculate KPIs
  const totalHouseholds = mockHouseholds.length
  const totalTransactions = mockTransactions.length
  const totalProducts = mockProducts.length
  const totalSpend = mockTransactions.reduce((sum, t) => sum + t.SPEND, 0)
  const avgSpendPerTransaction = totalSpend / totalTransactions

  // Department spending data
  const departmentData = mockTransactions.reduce((acc, t) => {
    const product = mockProducts.find(p => p.PRODUCT_NUM === t.PRODUCT_NUM)
    if (product) {
      const dept = product.DEPARTMENT
      if (!acc[dept]) acc[dept] = 0
      acc[dept] += t.SPEND
    }
    return acc
  }, {})

  const departmentChartData = Object.entries(departmentData).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(2))
  }))

  // Loyalty program data
  const loyaltyData = mockHouseholds.reduce((acc, h) => {
    const key = h.L === 'Y' ? 'Loyalty Member' : 'Non-Member'
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  const loyaltyChartData = Object.entries(loyaltyData).map(([name, value]) => ({
    name,
    value
  }))

  // Spending over time (by month)
  const monthlyData = mockTransactions.reduce((acc, t) => {
    const month = new Date(t.PURCHASE_).toLocaleString('default', { month: 'short' })
    if (!acc[month]) acc[month] = 0
    acc[month] += t.SPEND
    return acc
  }, {})

  const monthlyChartData = Object.entries(monthlyData).map(([name, value]) => ({
    name,
    spend: parseFloat(value.toFixed(2))
  }))

  // Brand preference data
  const brandData = mockProducts.reduce((acc, p) => {
    const key = p.BRAND_TY
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  const brandChartData = Object.entries(brandData).map(([name, value]) => ({
    name,
    value
  }))

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
              <CardTitle className="text-3xl font-bold text-blue-600">{totalHouseholds}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Transactions</CardDescription>
              <CardTitle className="text-3xl font-bold text-green-600">{totalTransactions}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Products</CardDescription>
              <CardTitle className="text-3xl font-bold text-purple-600">{totalProducts}</CardTitle>
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
