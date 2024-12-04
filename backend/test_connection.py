from sqlalchemy import create_engine

# Cadena de conexión para autenticación de Windows
db_url = (
    "mssql+pyodbc://@DESKTOP-M9VJRRK\\SQLEXPRESS/dbAgroInversionesFora"
    "?driver=ODBC+Driver+17+for+SQL+Server"
)

# Crear el motor de conexión
engine = create_engine(db_url)

try:
    # Probar conexión
    with engine.connect() as connection:
        print("Conexión exitosa a la base de datos.")
        result = connection.execute("SELECT name FROM sys.databases")
        print("Bases de datos disponibles:")
        for row in result:
            print(row[0])
except Exception as e:
    print(f"Error de conexión: {e}")
