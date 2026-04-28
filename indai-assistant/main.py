import time
import threading
from pystray import Icon, Menu, MenuItem
from PIL import Image, ImageDraw
import voice
import llm_client
import commands
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

# FastAPI App Setup
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    system_prompt: str = "You are INDAI, a helpful PC assistant."

class CommandRequest(BaseModel):
    command: str

@app.post("/chat")
async def chat_endpoint(req: ChatRequest):
    try:
        response = llm_client.get_response(req.message, req.system_prompt)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/execute")
async def execute_endpoint(req: CommandRequest):
    try:
        result = commands.execute_command(req.command)
        return {"result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/status")
async def status_endpoint():
    return {"status": "online", "name": "INDAI Assistant"}

class IndaiAssistant:
    def __init__(self):
        self.running = True
        self.listening = False
        self.icon = None

    def create_image(self, color):
        # Generate an icon image
        image = Image.new('RGB', (64, 64), color)
        dc = ImageDraw.Draw(image)
        dc.rectangle((16, 16, 48, 48), fill=(255, 255, 255))
        return image

    def on_quit(self):
        self.running = False
        if self.icon:
            self.icon.stop()

    def assistant_loop(self):
        print("INDAI Assistant background loop started.")
        while self.running:
            # Stage 1: Continuous Wake Word Detection (Simplified)
            # In a production app, we'd use a dedicated wake-word engine like Porcupine
            user_input = voice.listen_sr()
            
            if user_input and "hey" in user_input.lower() and "indai" in user_input.lower():
                voice.speak("I am listening. How can I help you?")
                
                query = voice.listen_sr()
                if query != "None":
                    # Process with LLM
                    response = llm_client.get_response(query)
                    
                    # Automagic Action Detection
                    if any(word in query.lower() for word in ["open", "search", "screenshot", "volume", "time", "cpu", "ram"]):
                        action_result = commands.execute_command(query)
                        voice.speak(f"{response}. {action_result}")
                    else:
                        voice.speak(response)
            
            time.sleep(0.5)

    def run_server(self):
        print("Starting Local API Server on http://localhost:8000")
        uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")

    def run(self):
        # Setup system tray icon
        self.icon = Icon("INDAI", self.create_image((0, 120, 215)), "INDAI Assistant", menu=Menu(
            MenuItem("Quit", self.on_quit)
        ))
        
        # Run API server in a separate thread
        threading.Thread(target=self.run_server, daemon=True).start()
        
        # Run voice assistant loop in another thread
        threading.Thread(target=self.assistant_loop, daemon=True).start()
        
        # Run tray icon loop (this blocks)
        self.icon.run()

if __name__ == "__main__":
    assistant = IndaiAssistant()
    assistant.run()
