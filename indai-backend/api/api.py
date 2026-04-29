from ninja import Router, Depends
from ninja_jwt.authentication import JWTAuth
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.core.cache import cache
from ninja.errors import HttpError
from .schemas import ChatMessageSchema, RegisterSchema
from .motor_client import db
import logging

logger = logging.getLogger(__name__)
router = Router()

def rate_limit(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0].strip()
    else:
        ip = request.META.get('REMOTE_ADDR')
        
    identifier = getattr(request.user, 'id', ip) if hasattr(request, 'user') and request.user.is_authenticated else ip
    
    cache_key = f"rl_{identifier}"
    count = cache.get(cache_key, 0)
    if count >= 30: # 30 requests per minute limit
        raise HttpError(429, "Too Many Requests")
    cache.set(cache_key, count + 1, 60)
    return count

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
def register_user(request, payload: RegisterSchema, rl: int = Depends(rate_limit)):
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
async def save_chat(request, payload: ChatMessageSchema, rl: int = Depends(rate_limit)):
    doc = payload.model_dump()
    doc["user_id"] = str(request.user.id)
    # Insert into MongoDB
    result = await db.chat.insert_one(doc)
    doc["_id"] = str(result.inserted_id)
    return {"success": True, "data": doc}

@router.get("/chat", auth=JWTAuth())
async def get_chat_history(request, rl: int = Depends(rate_limit)):
    user_id = str(request.user.id)
    messages = await db.chat.find({"user_id": user_id}).sort("timestamp", -1).limit(50).to_list(length=50)
    for msg in messages:
        msg["_id"] = str(msg["_id"])
    return {"success": True, "messages": messages}
