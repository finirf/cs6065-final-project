import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { useState, useEffect } from 'react'

export default function DataPull({ hshdNum = 10 }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Need to pad with zeros since DB stores HSHD_NUM as string (e.g., "0010" not "10")
        const paddedHshdNum = String(hshdNum).padStart(4, '0')
        const response = await fetch(`https://finirf-retail-api-baaea0fva6dddpfu.westus3-01.azurewebsites.net/api/search?hshdNum=${paddedHshdNum}`)
        const result = await response.json()
        setData(Array.isArray(result) ? result : [])
      } catch (error) {
        console.error('Error fetching data:', error)
        setData([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [hshdNum])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Sample Data Pull for HSHD_NUM #{hshdNum}</CardTitle>
            <CardDescription>
              Transaction data linking Households, Transactions, and Products tables
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading data...
              </div>
            ) : data.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border border-slate-300 px-4 py-2 text-left font-semibold">HSHD_NUM</th>
                      <th className="border border-slate-300 px-4 py-2 text-left font-semibold">BASKET_NUM</th>
                      <th className="border border-slate-300 px-4 py-2 text-left font-semibold">DATE</th>
                      <th className="border border-slate-300 px-4 py-2 text-left font-semibold">PRODUCT_NUM</th>
                      <th className="border border-slate-300 px-4 py-2 text-left font-semibold">DEPARTMENT</th>
                      <th className="border border-slate-300 px-4 py-2 text-left font-semibold">COMMODITY</th>
                      <th className="border border-slate-300 px-4 py-2 text-left font-semibold">SPEND</th>
                      <th className="border border-slate-300 px-4 py-2 text-left font-semibold">UNITS</th>
                      <th className="border border-slate-300 px-4 py-2 text-left font-semibold">STORE_REGION</th>
                      <th className="border border-slate-300 px-4 py-2 text-left font-semibold">BRAND_TYPE</th>
                      <th className="border border-slate-300 px-4 py-2 text-left font-semibold">NATURAL_ORGANIC_FLAG</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                        <td className="border border-slate-300 px-4 py-2">{row.HSHD_NUM}</td>
                        <td className="border border-slate-300 px-4 py-2">{row.BASKET_NUM}</td>
                        <td className="border border-slate-300 px-4 py-2">{row.DATE}</td>
                        <td className="border border-slate-300 px-4 py-2">{row.PRODUCT_NUM}</td>
                        <td className="border border-slate-300 px-4 py-2">{row.DEPARTMENT || 'N/A'}</td>
                        <td className="border border-slate-300 px-4 py-2">{row.COMMODITY || 'N/A'}</td>
                        <td className="border border-slate-300 px-4 py-2">${row.SPEND?.toFixed(2) || '0.00'}</td>
                        <td className="border border-slate-300 px-4 py-2">{row.UNITS || 0}</td>
                        <td className="border border-slate-300 px-4 py-2">{row.STORE_REGION || 'N/A'}</td>
                        <td className="border border-slate-300 px-4 py-2">{row.BRAND_TYPE || 'N/A'}</td>
                        <td className="border border-slate-300 px-4 py-2">{row.NATURAL_ORGANIC_FLAG || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No transaction data found for household #{hshdNum}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
