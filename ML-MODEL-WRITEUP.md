# ML Model Write-Up

## Linear Regression
Linear regression models the relationship between dependent and independent variables using a linear equation. For Customer Lifetime Value (CLV) prediction, it correlates purchase frequency with total spend to estimate long-term revenue. Simple, interpretable, and computationally efficient, linear regression provides baseline predictions and identifies key drivers of customer value through coefficient analysis.

## Random Forest
Random Forest is an ensemble learning method that constructs multiple decision trees during training and outputs the mode of classification or mean prediction of regression. For basket analysis, it handles complex, non-linear relationships between product combinations and purchase patterns. Robust against overfitting and capable of handling high-dimensional data, Random Forest provides feature importance scores to identify most influential products in cross-selling opportunities.

## Gradient Boosting
Gradient Boosting builds models sequentially, with each new model correcting errors from previous ones. For churn prediction, it iteratively improves accuracy by focusing on misclassified customers. Highly effective for imbalanced datasets, gradient boosting achieves superior predictive performance by combining weak learners into a strong predictor. It handles mixed data types and captures complex interactions between customer engagement metrics.
