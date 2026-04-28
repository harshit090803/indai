from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class ChatMessageSchema(BaseModel):
    message: str
    response: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class RegisterSchema(BaseModel):
    name: str
    email: str
    password: str
