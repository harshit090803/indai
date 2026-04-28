import os
from motor.motor_asyncio import AsyncIOMotorClient

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/indai")
client = AsyncIOMotorClient(MONGODB_URI)
# Note: Provide default database name in connection string, or fallback to 'indai'
db = client.get_default_database("indai")
