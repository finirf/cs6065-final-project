import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import Input from '../components/ui/Input'
import Label from '../components/ui/Label'
import Button from '../components/ui/Button'

export default function DataLoading() {
  const [files, setFiles] = useState({
    households: null,
    transactions: null,
    products: null
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleFileChange = (type, e) => {
    setFiles({
      ...files,
      [type]: e.target.files[0]
    })
  }

  const handleUpload = async (type) => {
    if (!files[type]) {
      setMessage(`Please select a ${type} file first.`)
      return
    }

    setLoading(true)
    setMessage(`Uploading ${type} data...`)

    // Simulate upload delay
    setTimeout(() => {
      setLoading(false)
      setMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} data uploaded successfully!`)
      // In production, this would call an API to upload to Azure
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Data Loading Web App</CardTitle>
            <CardDescription>
              Upload the latest Transactions, Households, and Products datasets
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {message && (
              <div className={`p-4 rounded-lg ${message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                {message}
              </div>
            )}

            {/* Households Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Households Data</CardTitle>
                <CardDescription>
                  Upload 400_household.csv file
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="households">Select CSV File</Label>
                  <Input
                    id="households"
                    type="file"
                    accept=".csv"
                    onChange={(e) => handleFileChange('households', e)}
                  />
                </div>
                <Button 
                  onClick={() => handleUpload('households')}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Uploading...' : 'Upload Households Data'}
                </Button>
              </CardContent>
            </Card>

            {/* Transactions Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Transactions Data</CardTitle>
                <CardDescription>
                  Upload 400_transactions.csv file (minimum 10K records)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="transactions">Select CSV File</Label>
                  <Input
                    id="transactions"
                    type="file"
                    accept=".csv"
                    onChange={(e) => handleFileChange('transactions', e)}
                  />
                </div>
                <Button 
                  onClick={() => handleUpload('transactions')}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Uploading...' : 'Upload Transactions Data'}
                </Button>
              </CardContent>
            </Card>

            {/* Products Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Products Data</CardTitle>
                <CardDescription>
                  Upload 400_products.csv file
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="products">Select CSV File</Label>
                  <Input
                    id="products"
                    type="file"
                    accept=".csv"
                    onChange={(e) => handleFileChange('products', e)}
                  />
                </div>
                <Button 
                  onClick={() => handleUpload('products')}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Uploading...' : 'Upload Products Data'}
                </Button>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
