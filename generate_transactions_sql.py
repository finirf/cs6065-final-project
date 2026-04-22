import csv

# Read the CSV and generate SQL INSERT statements
input_file = '400_transactions.csv'
output_file = 'insert_transactions.sql'
batch_size = 50000

# Generate SQL statements
statements = []
with open(input_file, 'r', encoding='utf-8-sig') as csvfile:
    reader = csv.DictReader(csvfile)
    # Strip whitespace from column names
    reader.fieldnames = [name.strip() for name in reader.fieldnames]
    
    for row in reader:
        basket_num = int(row['BASKET_NUM'])
        hshd_num = row['HSHD_NUM']
        purchase = row['PURCHASE_']
        product_num = int(row['PRODUCT_NUM'])
        spend = row['SPEND']
        units = row['UNITS']
        store_r = row['STORE_R']
        week_num = int(row['WEEK_NUM'])
        year = int(row['YEAR'])
        
        # Handle NULL values
        spend_val = spend if spend and spend.strip() else 'NULL'
        units_val = units if units and units.strip() else 'NULL'
        
        sql = f"INSERT INTO Transactions (BASKET_NUM, HSHD_NUM, PURCHASE_, PRODUCT_NUM, SPEND, UNITS, STORE_R, WEEK_NUM, YEAR) VALUES ({basket_num}, '{hshd_num}', '{purchase}', {product_num}, {spend_val}, {units_val}, '{store_r}', {week_num}, {year});"
        statements.append(sql)

print(f"Generated {len(statements)} SQL statements")

# Split into batches
num_batches = (len(statements) + batch_size - 1) // batch_size
print(f"Splitting into {num_batches} batches of {batch_size} statements each")

for i in range(num_batches):
    start_idx = i * batch_size
    end_idx = min((i + 1) * batch_size, len(statements))
    batch_statements = statements[start_idx:end_idx]
    
    batch_filename = f'insert_transactions_batch_{i + 1}.sql'
    with open(batch_filename, 'w', encoding='utf-8', newline='\n') as batch_file:
        batch_file.write('\n'.join(batch_statements))
    
    print(f"Created {batch_filename} with {len(batch_statements)} statements")

print("Done!")
