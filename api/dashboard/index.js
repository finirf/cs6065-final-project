const { Connection, Request, TYPES } = require('tedious');

module.exports = async function (context, req) {
    context.log('Starting dashboard function');
    try {
        context.log('Environment variables:', {
            DB_SERVER: process.env.DB_SERVER ? 'set' : 'missing',
            DB_USERNAME: process.env.DB_USERNAME ? 'set' : 'missing',
            DB_PASSWORD: process.env.DB_PASSWORD ? 'set' : 'missing',
            DB_NAME: process.env.DB_NAME ? 'set' : 'missing'
        });

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

        context.log('Creating connection');
        const connection = new Connection(config);

        const results = await new Promise((resolve, reject) => {
            connection.on('connect', (err) => {
                if (err) {
                    context.log('Connection error:', err);
                    reject(err);
                }
                context.log('Connected to database');
                
                const executeQuery = (query) => {
                    return new Promise((resolve, reject) => {
                        const request = new Request(query, (err) => {
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
                            resolve(rows);
                        });

                        connection.execSql(request);
                    });
                };

                (async () => {
                    try {
                        const allResults = {};

                        allResults.totalHouseholds = (await executeQuery(
                            'SELECT COUNT(*) as total FROM Households'
                        ))[0]?.total || 0;

                        allResults.totalTransactions = (await executeQuery(
                            'SELECT COUNT(*) as total FROM Transactions'
                        ))[0]?.total || 0;

                        allResults.totalSpend = (await executeQuery(
                            'SELECT SUM(SPEND) as total FROM Transactions'
                        ))[0]?.total || 0;

                        allResults.avgBasketSize = (await executeQuery(
                            'SELECT AVG(SPEND) as avg FROM Transactions'
                        ))[0]?.avg || 0;

                        allResults.topDepartments = await executeQuery(
                            `SELECT TOP 5 p.DEPARTMENT, SUM(t.SPEND) as total_spend 
                             FROM Transactions t 
                             LEFT JOIN Products p ON t.PRODUCT_NUM = p.PRODUCT_NUM 
                             WHERE p.DEPARTMENT IS NOT NULL
                             GROUP BY p.DEPARTMENT 
                             ORDER BY total_spend DESC`
                        );

                        allResults.monthlyTrend = await executeQuery(
                            `SELECT TOP 52 YEAR, WEEK_NUM, SUM(SPEND) as total_spend 
                             FROM Transactions 
                             GROUP BY YEAR, WEEK_NUM 
                             ORDER BY YEAR, WEEK_NUM`
                        );

                        connection.close();
                        resolve(allResults);
                    } catch (err) {
                        reject(err);
                    }
                })();
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
        context.log('Error in dashboard function:', error);
        context.res = {
            status: 500,
            body: { error: error.message, details: error.toString() },
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }
};
