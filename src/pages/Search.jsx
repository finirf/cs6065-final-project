import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import Input from '../components/ui/Input'
import Label from '../components/ui/Label'
import Button from '../components/ui/Button'
import { getTransactionDetails } from '../data/mockData'

export default function Search() {
  const [hshdNum, setHshdNum] = useState('')
  const [results, setResults] = useState([])
  const [searched, setSearched] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    if (hshdNum) {
      const data = getTransactionDetails(hshdNum)
      setResults(data)
      setSearched(true)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Search Transaction Data</CardTitle>
            <CardDescription>
              Search for data pulls based on HSHD_NUM
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-4 items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="hshdNum">Household Number (HSHD_NUM)</Label>
                <Input
                  id="hshdNum"
                  type="text"
                  placeholder="Enter household number (e.g., 0577)"
                  value={hshdNum}
                  onChange={(e) => setHshdNum(e.target.value)}
                />
              </div>
              <Button type="submit" size="lg">
                Search
              </Button>
            </form>
          </CardContent>
        </Card>

        {searched && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Results for HSHD_NUM #{hshdNum}
              </CardTitle>
              <CardDescription>
                Sorted by HSHD_NUM, BASKET_NUM, DATE, PRODUCT_NUM, DEPARTMENT, COMMODITY
              </CardDescription>
            </CardHeader>
            <CardContent>
              {results.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="border border-slate-300 px-4 py-2 text-left font-semibold">HSHD_NUM</th>
                        <th className="border border-slate-300 px-4 py-2 text-left font-semibold">BASKET_NUM</th>
                        <th className="border border-slate-300 px-4 py-2 text-left font-semibold">PURCHASE_</th>
                        <th className="border border-slate-300 px-4 py-2 text-left font-semibold">PRODUCT_NUM</th>
                        <th className="border border-slate-300 px-4 py-2 text-left font-semibold">DEPARTMENT</th>
                        <th className="border border-slate-300 px-4 py-2 text-left font-semibold">COMMODITY</th>
                        <th className="border border-slate-300 px-4 py-2 text-left font-semibold">SPEND</th>
                        <th className="border border-slate-300 px-4 py-2 text-left font-semibold">UNITS</th>
                        <th className="border border-slate-300 px-4 py-2 text-left font-semibold">STORE_R</th>
                        <th className="border border-slate-300 px-4 py-2 text-left font-semibold">BRAND_TY</th>
                        <th className="border border-slate-300 px-4 py-2 text-left font-semibold">ORGANIC</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((row, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className="border border-slate-300 px-4 py-2">{row.HSHD_NUM}</td>
                          <td className="border border-slate-300 px-4 py-2">{row.BASKET_NUM}</td>
                          <td className="border border-slate-300 px-4 py-2">{row.DATE}</td>
                          <td className="border border-slate-300 px-4 py-2">{row.PRODUCT_NUM}</td>
                          <td className="border border-slate-300 px-4 py-2">{row.DEPARTMENT}</td>
                          <td className="border border-slate-300 px-4 py-2">{row.COMMODITY}</td>
                          <td className="border border-slate-300 px-4 py-2">${row.SPEND.toFixed(2)}</td>
                          <td className="border border-slate-300 px-4 py-2">{row.UNITS}</td>
                          <td className="border border-slate-300 px-4 py-2">{row.STORE_REGION}</td>
                          <td className="border border-slate-300 px-4 py-2">{row.BRAND_TYPE}</td>
                          <td className="border border-slate-300 px-4 py-2">{row.NATURAL_ORGANIC_FLAG}</td>
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
        )}
      </div>
    </div>
  )
}
