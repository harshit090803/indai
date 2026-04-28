# IndAI - The Intelligent PC Assistant & Dashboard

Welcome to **IndAI**, a comprehensive AI-powered application that combines a local desktop voice assistant with a modern web dashboard.

## 🚀 Features

- **Voice-Activated PC Assistant**: Runs quietly in your system tray. Just say "Hey IndAI" to activate it!
- **Local Command Execution**: Ask IndAI to open apps, take screenshots, check CPU/RAM usage, adjust volume, and more.
- **Web Dashboard**: A beautiful, modern web interface built with Next.js for managing your AI interactions.
- **Secure Authentication**: Includes MongoDB-backed email/password login and secure authentication flows.

---

## 📁 Project Structure

The project is divided into three main parts:

1. **`indai-assistant/` (Local Python Assistant)**
   - A local FastAPI backend and voice assistant.
   - Listens for wake words and handles PC commands locally.
   - Runs in the system tray for seamless background operation.

2. **`indai-next/` (Web Application)**
   - A full-stack Next.js web application.
   - Provides the user interface, chat interfaces, and settings.
   - Includes document parsing capabilities (PDF, Word, Images).

3. **`indai-backend/`**
   - Designated directory for future scalable backend infrastructure.

---

## 🛠️ Installation & Setup

### 1. Setting up the Local Voice Assistant (`indai-assistant`)

The local assistant requires Python to run.

1. Navigate to the `indai-assistant` folder:
   ```bash
   cd indai-assistant
   ```
2. Create and activate a virtual environment (recommended):
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   ```
3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the assistant:
   ```bash
   python main.py
   ```
   *Note: The assistant will appear in your system tray and a local API server will start on port `8000`.*

### 2. Setting up the Web Dashboard (`indai-next`)

The web dashboard is built with Next.js and requires Node.js.

1. Navigate to the `indai-next` folder:
   ```bash
   cd indai-next
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Environment Setup:
   - Create a `.env.local` file in the `indai-next` folder.
   - Add your MongoDB connection string (required for authentication):
     ```env
     MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/indaiAuth?retryWrites=true&w=majority"
     ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser!

---

## 🗣️ Using the Voice Assistant

Once the Python `main.py` is running, the assistant listens in the background. 
- Say **"Hey IndAI"** to wake it up.
- Try saying commands like:
  - *"Take a screenshot"*
  - *"What is my CPU usage?"*
  - *"Check RAM"*
  - *"What time is it?"*

To stop the assistant, right-click the "INDAI" icon in your system tray and select **Quit**.
