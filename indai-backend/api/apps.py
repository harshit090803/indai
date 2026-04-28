from django.apps import AppConfig
import asyncio

class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        import os
        # Avoid running asyncio setup during management commands like makemigrations
        if os.environ.get('RUN_MAIN') == 'true' or not os.environ.get('RUN_MAIN'):
            from .motor_client import db
            import pymongo
            
            async def setup_indexes():
                try:
                    await db.chat.create_index([("user_id", pymongo.ASCENDING)])
                    await db.chat.create_index([("timestamp", pymongo.DESCENDING)])
                    print("MongoDB indexes created successfully.")
                except Exception as e:
                    print(f"Error creating MongoDB indexes: {e}")
            
            # Django's ready() is synchronous, so we need to run the async setup properly
            try:
                loop = asyncio.get_running_loop()
                loop.create_task(setup_indexes())
            except RuntimeError:
                # No running loop, run until complete
                asyncio.run(setup_indexes())
