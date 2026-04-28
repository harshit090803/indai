from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class ChatMessageSchema(BaseModel):
    user_id: str
    message: str
    response: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
