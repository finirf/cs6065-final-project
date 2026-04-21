// Mock data for development and testing
// This simulates the 8451/Kroger retail data structure
// Column names match actual CSV files from the assignment

export const mockHouseholds = [
  {
    HSHD_NUM: '1600',
    L: 'Y',
    AGE_RANGE: null,
    MARITAL: null,
    INCOME_RANGE: null,
    HOMEOWNER: null,
    HSHD_COMPOSITION: null,
    HH_SIZE: null,
    CHILDREN: null
  },
  {
    HSHD_NUM: '1470',
    L: 'N',
    AGE_RANGE: null,
    MARITAL: null,
    INCOME_RANGE: null,
    HOMEOWNER: null,
    HSHD_COMPOSITION: null,
    HH_SIZE: null,
    CHILDREN: null
  },
  {
    HSHD_NUM: '0577',
    L: 'Y',
    AGE_RANGE: null,
    MARITAL: null,
    INCOME_RANGE: null,
    HOMEOWNER: null,
    HSHD_COMPOSITION: null,
    HH_SIZE: null,
    CHILDREN: null
  }
]

export const mockProducts = [
  {
    PRODUCT_NUM: '00072499',
    DEPARTMENT: 'NON-FOOD',
    COMMODITY: 'PET',
    BRAND_TY: 'PRIVATE',
    NATURAL_ORGANIC_FLAG: 'N'
  },
  {
    PRODUCT_NUM: '00074380',
    DEPARTMENT: 'NON-FOOD',
    COMMODITY: 'PET',
    BRAND_TY: 'PRIVATE',
    NATURAL_ORGANIC_FLAG: 'N'
  },
  {
    PRODUCT_NUM: '00083652',
    DEPARTMENT: 'GROCERY',
    COMMODITY: 'CEREAL',
    BRAND_TY: 'NATIONAL',
    NATURAL_ORGANIC_FLAG: 'N'
  },
  {
    PRODUCT_NUM: '06157725',
    DEPARTMENT: 'GROCERY',
    COMMODITY: 'MILK',
    BRAND_TY: 'PRIVATE',
    NATURAL_ORGANIC_FLAG: 'Y'
  },
  {
    PRODUCT_NUM: '00654479',
    DEPARTMENT: 'DAIRY',
    COMMODITY: 'CHEESE',
    BRAND_TY: 'NATIONAL',
    NATURAL_ORGANIC_FLAG: 'N'
  }
]

export const mockTransactions = [
  {
    BASKET_NUM: '00000002',
    HSHD_NUM: '0577',
    PURCHASE_: '2018-08-17',
    PRODUCT_NUM: '00083652',
    SPEND: 0.59,
    UNITS: 1,
    STORE_R: 'CENTRAL',
    WEEK_NUM: 32,
    YEAR: 2018
  },
  {
    BASKET_NUM: '00000002',
    HSHD_NUM: '0577',
    PURCHASE_: '2018-08-17',
    PRODUCT_NUM: '06157725',
    SPEND: 3.49,
    UNITS: 1,
    STORE_R: 'CENTRAL',
    WEEK_NUM: 32,
    YEAR: 2018
  },
  {
    BASKET_NUM: '00000009',
    HSHD_NUM: '1916',
    PURCHASE_: '2018-08-17',
    PRODUCT_NUM: '06157725',
    SPEND: 3.49,
    UNITS: 1,
    STORE_R: 'WEST',
    WEEK_NUM: 32,
    YEAR: 2018
  },
  {
    BASKET_NUM: '00000016',
    HSHD_NUM: '0514',
    PURCHASE_: '2018-08-17',
    PRODUCT_NUM: '00654479',
    SPEND: 2.24,
    UNITS: 1,
    STORE_R: 'CENTRAL',
    WEEK_NUM: 32,
    YEAR: 2018
  },
  {
    BASKET_NUM: '00000016',
    HSHD_NUM: '0514',
    PURCHASE_: '2018-08-17',
    PRODUCT_NUM: '00008118',
    SPEND: 5.39,
    UNITS: 1,
    STORE_R: 'CENTRAL',
    WEEK_NUM: 32,
    YEAR: 2018
  }
]

// Helper function to get joined transaction details
export const getTransactionDetails = (hshdNum) => {
  return mockTransactions
    .filter(t => t.HSHD_NUM === hshdNum)
    .map(t => {
      const household = mockHouseholds.find(h => h.HSHD_NUM === t.HSHD_NUM)
      const product = mockProducts.find(p => p.PRODUCT_NUM === t.PRODUCT_NUM)
      return {
        ...t,
        DATE: t.PURCHASE_,
        STORE_REGION: t.STORE_R,
        LOYALTY_FLAG: household?.L || '',
        AGE_RANGE: household?.AGE_RANGE || '',
        INCOME_RANGE: household?.INCOME_RANGE || '',
        DEPARTMENT: product?.DEPARTMENT || '',
        COMMODITY: product?.COMMODITY || '',
        BRAND_TYPE: product?.BRAND_TY || '',
        NATURAL_ORGANIC_FLAG: product?.NATURAL_ORGANIC_FLAG || ''
      }
    })
    .sort((a, b) => {
      if (a.HSHD_NUM !== b.HSHD_NUM) return a.HSHD_NUM.localeCompare(b.HSHD_NUM)
      if (a.BASKET_NUM !== b.BASKET_NUM) return a.BASKET_NUM.localeCompare(b.BASKET_NUM)
      if (a.DATE !== b.DATE) return new Date(a.DATE) - new Date(b.DATE)
      if (a.PRODUCT_NUM !== b.PRODUCT_NUM) return a.PRODUCT_NUM.localeCompare(b.PRODUCT_NUM)
      if (a.DEPARTMENT !== b.DEPARTMENT) return a.DEPARTMENT.localeCompare(b.DEPARTMENT)
      return a.COMMODITY.localeCompare(b.COMMODITY)
    })
}
