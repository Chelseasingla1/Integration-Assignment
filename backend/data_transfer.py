# src/backend/data_transfer.py

class DataTransfer:
    @staticmethod
    async def clickhouse_to_file(config, selected_columns, output_file):
        client = Client(...)  # Connection setup
        query = f"SELECT {','.join(selected_columns)} FROM table_name"
        data = client.execute(query)
        
        df = pd.DataFrame(data, columns=selected_columns)
        df.to_csv(output_file, index=False)
        return len(df)

    @staticmethod
    async def file_to_clickhouse(config, file_path, selected_columns):
        df = pd.read_csv(file_path)
        if selected_columns:
            df = df[selected_columns]
        
        client = Client(...)  # Connection setup
        # Convert DataFrame to ClickHouse table
        # Implementation details here
        return len(df)