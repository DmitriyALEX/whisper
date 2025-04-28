import sys
import whisper

audio_path = sys.argv[1]

model = whisper.load_model("medium")  

result = model.transcribe(audio_path, language=None) 

print(result["text"])