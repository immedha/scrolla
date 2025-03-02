import re
from .tts import generate_audio

def format_time(seconds):
    """
    Convert seconds into HH:MM:SS,mmm format
    """
    milliseconds = int((seconds - int(seconds)) * 1000)
    time_formatted = (
        f"{int(seconds // 3600):02}:"
        f"{int((seconds % 3600) // 60):02}:"
        f"{int(seconds % 60):02},"
        f"{milliseconds:03}"
    )
    return time_formatted

def clean_text(text):
    """
    Removes emojis and special characters
    """
    pattern = re.compile(
        "["
        u"\U0001F600-\U0001F64F"  # emoticons
        u"\U0001F300-\U0001F5FF"  # symbols & pictographs
        u"\U0001F680-\U0001F6FF"  # transport & map symbols
        u"\U0001F1E0-\U0001F1FF"  # flags (iOS)
        u"\U00002702-\U000027B0"
        u"\U000024C2-\U0001F251"
        "]+", flags=re.UNICODE
    )
    text = pattern.sub(r'', text)
    text = re.sub(r'[^A-Za-z0-9\s.,?!-]', '', text)
    return text

def generate_audio_and_subtitle(json_output, output_srt_path="subtitles.srt"):
    """
    Generate an SRT file → text & audio durations
    """
    try:
        subtitles = []
        current_time = 0.0

        for item in json_output:
            scene_number = item["scene_number"]
            text = item["text"]

            text = clean_text(text)

            print(f"Generating audio for scene {scene_number}")
            duration = generate_audio(text, scene_number)

            if duration:
                start_time = current_time
                end_time = current_time + duration

                start_time_formatted = format_time(start_time)
                end_time_formatted = format_time(end_time)

                subtitles.append(f"{scene_number}")
                subtitles.append(
                    f"{start_time_formatted} --> {end_time_formatted}")
                subtitles.append(text)
                subtitles.append("")

                current_time = end_time

        with open(output_srt_path, "w", encoding="utf-8") as srt_file:
            srt_file.write("\n".join(subtitles))
        print(f"SRT file generated successfully: {output_srt_path}")

    except Exception as e:
        print(f"Error generating SRT file: {e}")
