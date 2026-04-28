import speech_recognition as sr
import pyttsx3
import os
from faster_whisper import WhisperModel
import sounddevice as sd
import numpy as np
import scipy.io.wavfile as wav

# Initialize TTS
engine = pyttsx3.init()
voices = engine.getProperty('voices')
# Set a better voice if available, otherwise default
if len(voices) > 1:
    engine.setProperty('voice', voices[1].id) 
else:
    engine.setProperty('voice', voices[0].id)
engine.setProperty('rate', 175) # Moderate speed

def speak(text):
    """Converts text to speech."""
    print(f"Assistant: {text}")
    engine.say(text)
    engine.runAndWait()

def listen_faster_whisper(model_size="tiny", language="en"):
    """
    Listens and converts speech to text using Faster-Whisper.
    This is more accurate than basic SpeechRecognition.
    """
    try:
        model = WhisperModel(model_size, device="cpu", compute_type="int8")
        
        fs = 16000  # Sample rate
        seconds = 5  # Duration of recording
        
        print(f"Listening (Whisper {model_size})...")
        myrecording = sd.rec(int(seconds * fs), samplerate=fs, channels=1)
        sd.wait()  # Wait until recording is finished
        
        # Save temporary wav file
        temp_file = "temp_voice.wav"
        wav.write(temp_file, fs, myrecording)
        
        segments, info = model.transcribe(temp_file, beam_size=5, language=language)
        
        query = ""
        for segment in segments:
            query += segment.text
        
        print(f"User (Whisper): {query}")
        return query.strip()
    except Exception as e:
        print(f"Whisper Error: {e}")
        return "None"

def listen_sr():
    """Listens and converts speech to text using SpeechRecognition (Google)."""
    r = sr.Recognizer()
    with sr.Microphone() as source:
        print("Listening...")
        r.pause_threshold = 0.8
        r.adjust_for_ambient_noise(source)
        audio = r.listen(source)
    try:
        print("Recognizing...")
        query = r.recognize_google(audio, language='en-in')
        print(f"User: {query}\n")
        return query
    except Exception as e:
        return "None"

if __name__ == "__main__":
    # Test
    speak("Hello, I am INDAI.")
    # result = listen_faster_whisper()
    # print(f"Heard: {result}")
