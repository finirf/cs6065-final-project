const { app } = require('@azure/functions');
const { Connection, Request, TYPES } = require('tedious');

app.http('search', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'search',
    handler: async (request, query) => {
        const hshdNum = request.query.get('hshdNum');
        
        if (!hshdNum) {
            return {
                status: 400,
                jsonBody: { error: 'hshdNum parameter is required' }
            };
        }

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
                    
                    const query = `
                        SELECT 
                            t.HSHD_NUM,
                            t.BASKET_NUM,
                            t.PURCHASE_ as DATE,
                            t.PRODUCT_NUM,
                            p.DEPARTMENT,
                            p.COMMODITY,
                            t.SPEND,
                            t.UNITS,
                            t.STORE_R as STORE_REGION,
                            p.BRAND_TY as BRAND_TYPE,
                            p.NATURAL_ORGANIC_FLAG
                        FROM Transactions t
                        JOIN Products p ON t.PRODUCT_NUM = p.PRODUCT_NUM
                        WHERE t.HSHD_NUM = @hshdNum
                        ORDER BY t.HSHD_NUM, t.BASKET_NUM, t.PURCHASE_, t.PRODUCT_NUM, p.DEPARTMENT, p.COMMODITY
                    `;
                    
                    const request = new Request(query, (err, rowCount) => {
                        if (err) reject(err);
                        connection.close();
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
                    
                    request.addParameter('hshdNum', TYPES.VarChar, hshdNum);
                    connection.execSql(request);
                });
                
                connection.on('error', (err) => {
                    reject(err);
                });
                
                connection.connect();
            });

            return {
                status: 200,
                jsonBody: results
            };
        } catch (error) {
            return {
                status: 500,
                jsonBody: { error: error.message }
            };
        }
    }
});
