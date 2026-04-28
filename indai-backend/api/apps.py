from django.apps import AppConfig
import asyncio

class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        from .motor_client import db
        import pymongo
        
        async def setup_indexes():
            try:
                await db.chat.create_index([("user_id", pymongo.ASCENDING)])
                await db.chat.create_index([("timestamp", pymongo.DESCENDING)])
                print("MongoDB indexes created successfully.")
            except Exception as e:
                print(f"Error creating MongoDB indexes: {e}")
        
        # Safely dispatch async task if an event loop exists (e.g. Uvicorn is running)
        try:
            loop = asyncio.get_running_loop()
            loop.create_task(setup_indexes())
        except RuntimeError:
            # No running loop (e.g., manage.py shell or migrate)
            # We can safely ignore index creation here to prevent blocking manage commands
            pass
