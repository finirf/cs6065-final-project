// Basket Analysis using Association Rules (Market Basket Analysis)
// This module implements market basket analysis to find commonly purchased product combinations

export class BasketAnalyzer {
  constructor(minSupport = 0.2, minConfidence = 0.5) {
    this.minSupport = minSupport
    this.minConfidence = minConfidence
    this.frequentItemsets = []
    this.associationRules = []
  }

  // Find frequent itemsets using Apriori algorithm
  findFrequentItemsets(transactions) {
    const itemsets = this.generateItemsets(transactions)
    this.frequentItemsets = this.filterBySupport(itemsets, transactions)
    return this.frequentItemsets
  }

  // Generate all possible itemsets from transactions
  generateItemsets(transactions) {
    const items = new Set()
    transactions.forEach(t => {
      const product = t.PRODUCT_NUM
      items.add(product)
    })
    
    const itemsets = []
    items.forEach(item => itemsets.push([item]))
    
    // Generate 2-itemsets
    const itemsArray = Array.from(items)
    for (let i = 0; i < itemsArray.length; i++) {
      for (let j = i + 1; j < itemsArray.length; j++) {
        itemsets.push([itemsArray[i], itemsArray[j]])
      }
    }
    
    return itemsets
  }

  // Filter itemsets by minimum support
  filterBySupport(itemsets, transactions) {
    return itemsets.filter(itemset => {
      return this.calculateSupport(itemset, transactions) >= this.minSupport
    })
  }

  // Calculate support for an itemset
  calculateSupport(itemset, transactions) {
    let count = 0
    transactions.forEach(t => {
      const basketProducts = transactions
        .filter(tr => tr.BASKET_NUM === t.BASKET_NUM && tr.HSHD_NUM === t.HSHD_NUM)
        .map(tr => tr.PRODUCT_NUM)
      
      const hasAllItems = itemset.every(item => basketProducts.includes(item))
      if (hasAllItems) count++
    })
    
    return count / transactions.length
  }

  // Generate association rules from frequent itemsets
  generateRules(transactions) {
    this.associationRules = []
    
    this.frequentItemsets.forEach(itemset => {
      if (itemset.length >= 2) {
        // Generate rules for each possible split
        for (let i = 1; i < itemset.length; i++) {
          const antecedent = itemset.slice(0, i)
          const consequent = itemset.slice(i)
          
          const confidence = this.calculateConfidence(antecedent, consequent, transactions)
          
          if (confidence >= this.minConfidence) {
            this.associationRules.push({
              antecedent,
              consequent,
              confidence,
              support: this.calculateSupport(itemset, transactions)
            })
          }
        }
      }
    })
    
    return this.associationRules.sort((a, b) => b.confidence - a.confidence)
  }

  // Calculate confidence for a rule
  calculateConfidence(antecedent, consequent, transactions) {
    const antecedentSupport = this.calculateSupport(antecedent, transactions)
    const combinedSupport = this.calculateSupport([...antecedent, ...consequent], transactions)
    
    return antecedentSupport !== 0 ? combinedSupport / antecedentSupport : 0
  }
}

// Analyze basket combinations for cross-selling opportunities
export function analyzeBaskets(transactions, products) {
  const analyzer = new BasketAnalyzer(0.15, 0.4)
  
  // Group transactions by basket
  const basketMap = new Map()
  transactions.forEach(t => {
    const key = `${t.HSHD_NUM}-${t.BASKET_NUM}`
    if (!basketMap.has(key)) {
      basketMap.set(key, [])
    }
    basketMap.get(key).push(t)
  })
  
  const basketTransactions = Array.from(basketMap.values()).flat()
  
  // Find frequent itemsets and rules
  analyzer.findFrequentItemsets(basketTransactions)
  const rules = analyzer.generateRules(basketTransactions)
  
  // Format rules with product names
  const formattedRules = rules.slice(0, 10).map(rule => {
    const antecedentNames = rule.antecedent.map(pNum => {
      const product = products.find(p => p.PRODUCT_NUM === pNum)
      return product ? `${product.DEPARTMENT} - ${product.COMMODITY}` : `Product ${pNum}`
    })
    
    const consequentNames = rule.consequent.map(pNum => {
      const product = products.find(p => p.PRODUCT_NUM === pNum)
      return product ? `${product.DEPARTMENT} - ${product.COMMODITY}` : `Product ${pNum}`
    })
    
    return {
      antecedent: antecedentNames.join(', '),
      consequent: consequentNames.join(', '),
      confidence: (rule.confidence * 100).toFixed(1),
      support: (rule.support * 100).toFixed(1),
      lift: (rule.confidence / analyzer.calculateSupport(rule.consequent, basketTransactions)).toFixed(2)
    }
  })
  
  return {
    rules: formattedRules,
    totalRules: rules.length,
    topRecommendations: formattedRules.slice(0, 5)
  }
}

// Get cross-selling recommendations for a product
export function getCrossSellRecommendations(productNum, rules, products) {
  const relevantRules = rules.filter(rule => 
    rule.antecedent.includes(productNum.toString()) || 
    rule.antecedent.some(p => p === productNum)
  )
  
  return relevantRules.slice(0, 5).map(rule => ({
    product: rule.consequent,
    confidence: rule.confidence,
    reason: `Customers who bought this also bought ${rule.consequent}`
  }))
}
