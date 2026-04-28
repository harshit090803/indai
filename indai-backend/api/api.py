from ninja import Router
from ninja_jwt.authentication import JWTAuth
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from .schemas import ChatMessageSchema, RegisterSchema
from .motor_client import db
import logging

logger = logging.getLogger(__name__)
router = Router()

@router.get("/health")
async def health(request):
    try:
        # Simple ping to mongodb
        await db.command("ping")
        return {"status": "ok", "mongodb": "connected"}
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return {"status": "error", "message": str(e)}

@router.post("/register")
def register_user(request, payload: RegisterSchema):
    if User.objects.filter(username=payload.email).exists():
        return {"success": False, "message": "Email already registered"}
    
    user = User.objects.create(
        username=payload.email,
        email=payload.email,
        first_name=payload.name,
        password=make_password(payload.password)
    )
    return {"success": True, "message": "User created successfully"}

@router.post("/chat", auth=JWTAuth())
async def save_chat(request, payload: ChatMessageSchema):
    doc = payload.model_dump()
    doc["user_id"] = str(request.user.id)
    # Insert into MongoDB
    result = await db.chat.insert_one(doc)
    doc["_id"] = str(result.inserted_id)
    return {"success": True, "data": doc}

@router.get("/chat", auth=JWTAuth())
async def get_chat_history(request):
    user_id = str(request.user.id)
    messages = await db.chat.find({"user_id": user_id}).sort("timestamp", -1).limit(50).to_list(length=50)
    for msg in messages:
        msg["_id"] = str(msg["_id"])
    return {"success": True, "messages": messages}
