from google.cloud.sql.connector import Connector, IPTypes
import sqlalchemy
from dotenv import load_dotenv
import os
import pymysql
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")
DB_HOST = os.getenv("DB_HOST")

# initialize Connector object
ip_type=IPTypes.PUBLIC
connector = Connector(ip_type=ip_type, refresh_strategy="LAZY")

# function to return the database connection
def getconn() -> pymysql.connections.Connection:
    conn: pymysql.connections.Connection = connector.connect(
        "gothic-imprint-447314-a5:asia-south2:file-repo-db",
        "pymysql",
        user=DB_USER,
        password=DB_PASSWORD,
        db=DB_NAME
    )
    return conn

# create connection pool
pool = sqlalchemy.create_engine(
    "mysql+pymysql://",
    creator=getconn,
)