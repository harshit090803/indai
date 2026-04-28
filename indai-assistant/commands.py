import os
import subprocess
import webbrowser
import pyautogui
import psutil
import datetime
import time

def open_app(app_name):
    """Opens a Windows application."""
    try:
        # Basic mapping for common apps
        apps = {
            "notepad": "notepad.exe",
            "calculator": "calc.exe",
            "chrome": "chrome.exe",
            "explorer": "explorer.exe",
            "vlc": "vlc.exe",
            "word": "winword.exe",
            "excel": "excel.exe"
        }
        
        executable = apps.get(app_name.lower())
        if executable:
            subprocess.Popen(executable)
            return f"Opening {app_name}"
        else:
            # Try running as a general command
            subprocess.Popen(f'start {app_name}', shell=True)
            return f"Attempting to open {app_name}"
    except Exception as e:
        return f"Failed to open {app_name}: {str(e)}"

def search_web(query):
    """Searches the web using default browser."""
    url = f"https://www.google.com/search?q={query}"
    webbrowser.open(url)
    return f"Searching for {query} on Google"

def take_screenshot():
    """Takes a screenshot and saves it to the user's Pictures folder."""
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    path = os.path.join(os.environ['USERPROFILE'], 'Pictures', f'IndAI_Screenshot_{timestamp}.png')
    
    # Ensure Pictures directory exists
    os.makedirs(os.path.dirname(path), exist_ok=True)
    
    screenshot = pyautogui.screenshot()
    screenshot.save(path)
    return f"Screenshot saved to {path}"

def get_system_stats():
    """Returns CPU and RAM usage statistics."""
    cpu = psutil.cpu_percent(interval=1)
    memory = psutil.virtual_memory().percent
    return f"System Stats: CPU is at {cpu}% and Memory is at {memory}%"

def get_time_date():
    """Returns the current current time and date."""
    now = datetime.datetime.now()
    return f"Today is {now.strftime('%A, %B %d, %Y')} and the time is {now.strftime('%I:%M %p')}"

def control_volume(direction):
    """Controls system volume using pyautogui."""
    if "up" in direction.lower() or "increase" in direction.lower():
        for _ in range(5):
            pyautogui.press("volumeup")
        return "Volume increased"
    elif "down" in direction.lower() or "decrease" in direction.lower():
        for _ in range(5):
            pyautogui.press("volumedown")
        return "Volume decreased"
    elif "mute" in direction.lower():
        pyautogui.press("volumemute")
        return "System muted/unmuted"
    return "Volume command not recognized"

def execute_command(intent_data):
    """
    Executes a command based on text intent.
    Used for simple command matching.
    """
    command = intent_data.lower()
    
    if "open" in command:
        app = command.replace("open", "").strip()
        return open_app(app)
    elif "search" in command:
        query = command.replace("search", "").strip()
        return search_web(query)
    elif "screenshot" in command:
        return take_screenshot()
    elif "system stats" in command or "cpu" in command or "ram" in command:
        return get_system_stats()
    elif "time" in command or "date" in command:
        return get_time_date()
    elif "volume" in command:
        return control_volume(command)
    
    return "Command not recognized"

if __name__ == "__main__":
    # Test
    print(get_time_date())
    print(get_system_stats())
