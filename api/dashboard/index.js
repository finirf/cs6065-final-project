const { Connection, Request, TYPES } = require('tedious');

module.exports = async function (context, req) {
    try {
        const config = {
            server: process.env.DB_SERVER,
            authentication: {
                type: 'default',
                options: {
                    userName: process.env.DB_USERNAME,
                    password: process.env.DB_PASSWORD
                }
            },
            options: {
                database: process.env.DB_NAME,
                encrypt: true,
                trustServerCertificate: false
            }
        };

        const connection = new Connection(config);
        
        const results = await new Promise((resolve, reject) => {
            connection.on('connect', (err) => {
                if (err) reject(err);
                
                const queries = [
                    // Total households
                    'SELECT COUNT(*) as total FROM Households',
                    // Total transactions
                    'SELECT COUNT(*) as total FROM Transactions',
                    // Total spend
                    'SELECT SUM(SPEND) as total FROM Transactions',
                    // Average basket size
                    'SELECT AVG(SPEND) as avg FROM Transactions',
                    // Top departments by spend
                    `SELECT TOP 5 p.DEPARTMENT, SUM(t.SPEND) as total_spend 
                     FROM Transactions t 
                     JOIN Products p ON t.PRODUCT_NUM = p.PRODUCT_NUM 
                     GROUP BY p.DEPARTMENT 
                     ORDER BY total_spend DESC`,
                    // Monthly spend trend
                    `SELECT YEAR, WEEK_NUM, SUM(SPEND) as total_spend 
                     FROM Transactions 
                     GROUP BY YEAR, WEEK_NUM 
                     ORDER BY YEAR, WEEK_NUM 
                     LIMIT 52`
                ];
                
                const allResults = {};
                let completed = 0;
                
                queries.forEach((query, index) => {
                    const request = new Request(query, (err, rowCount) => {
                        if (err) reject(err);
                    });
                    
                    const rows = [];
                    request.on('row', (columns) => {
                        const row = {};
                        columns.forEach(column => {
                            row[column.metadata.colName] = column.value;
                        });
                        rows.push(row);
                    });
                    
                    request.on('requestCompleted', () => {
                        if (index === 0) allResults.totalHouseholds = rows[0]?.total || 0;
                        if (index === 1) allResults.totalTransactions = rows[0]?.total || 0;
                        if (index === 2) allResults.totalSpend = rows[0]?.total || 0;
                        if (index === 3) allResults.avgBasketSize = rows[0]?.avg || 0;
                        if (index === 4) allResults.topDepartments = rows;
                        if (index === 5) allResults.monthlyTrend = rows;
                        
                        completed++;
                        if (completed === queries.length) {
                            connection.close();
                            resolve(allResults);
                        }
                    });
                    
                    connection.execSql(request);
                });
            });
            
            connection.on('error', (err) => {
                reject(err);
            });
            
            connection.connect();
        });

        context.res = {
            status: 200,
            body: results,
            headers: {
                'Content-Type': 'application/json'
            }
        };
    } catch (error) {
        context.res = {
            status: 500,
            body: { error: error.message },
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }
};
