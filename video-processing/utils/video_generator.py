import os
import subprocess
from PIL import Image
import pysrt 

# Configuration
FONT_SIZE = 50
FONT_COLOR = "white"
FONT = "Arial"

BORDER_WIDTH = 1.2
BORDER_COLOR = "darkgray"

SUBTITLE_X_POSITION = "(w-tw)/2"
SUBTITLE_BOTTOM_GAP = 60
SUBTITLE_MARGIN = 30
SUBTITLE_VERTICAL_ALIGNMENT = "bottom"

ADD_SUBTITLES = True


def read_srt_file(srt_file):
    """
    Read subtitles from SRT file
    """
    try:
        subs = pysrt.open(srt_file)
        return [sub.text.replace('\n', ' ') for sub in subs]
    except Exception as e:
        print(f"Error reading SRT file: {e}")
        return []


def wrap_text(text, max_width, font_size=FONT_SIZE, font_path=None):
    effective_width = max_width * 0.8
    char_width = font_size * 0.6 
    space_width = font_size * 0.3  

    lines = []
    current_line = []
    current_line_width = 0

    words = text.split()

    for word in words:
        word_width = len(word) * char_width + space_width

        if current_line_width + word_width <= effective_width:
            current_line.append(word)
            current_line_width += word_width
        else:
            if current_line:
                lines.append(' '.join(current_line))
            current_line = [word]
            current_line_width = word_width

    if current_line:
        lines.append(' '.join(current_line))

    return lines


def calculate_vertical_position(total_lines, font_size, line_spacing, video_height, alignment):
    total_height = total_lines * font_size + (total_lines - 1) * line_spacing
    margin = SUBTITLE_MARGIN

    if alignment == "top":
        return margin
    elif alignment == "center":
        return (video_height - total_height) // 2
    elif alignment == "bottom":
        return video_height - total_height - margin - SUBTITLE_BOTTOM_GAP
    else:
        raise ValueError("Invalid subtitle alignment")


def preprocess_image_if_needed(input_path, output_path):
    img = Image.open(input_path)
    width, height = img.size

    target_width = 1080
    target_height = 1920

    width_ratio = target_width / width
    height_ratio = target_height / height

    scale_ratio = min(width_ratio, height_ratio)

    new_width = int(width * scale_ratio)
    new_height = int(height * scale_ratio)

    img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)

    new_img = Image.new('RGB', (target_width, target_height), (0, 0, 0))
    paste_x = (target_width - new_width) // 2
    paste_y = (target_height - new_height) // 2

    new_img.paste(img, (paste_x, paste_y))
    new_img.save(output_path, quality=100)


def preprocess_images(input_dir, output_dir):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    image_count = 1
    for filename in sorted(os.listdir(input_dir)):
        if filename.endswith((".jpg", ".jpeg", ".png")):
            input_path = os.path.join(input_dir, filename)
            output_path = os.path.join(output_dir, f"image{image_count}.jpg")

            if not os.path.exists(output_path):
                preprocess_image_if_needed(input_path, output_path)

            image_count += 1


def get_audio_duration(audio_path):
    try:
        command = [
            "ffmpeg", "-i", audio_path,
            "-vn", "-f", "null", "-"
        ]
        result = subprocess.run(command, stderr=subprocess.PIPE, text=True)

        for line in result.stderr.splitlines():
            if "Duration" in line:
                duration_str = line.split()[1].rstrip(',')
                h, m, s = duration_str.split(":")
                return float(h) * 3600 + float(m) * 60 + float(s)
        print(f"Duration not found in FFmpeg output for {audio_path}")
        return None
    except Exception as e:
        print(f"Error getting audio duration: {e}")
        return None

def create_video_with_audio_and_subtitles(output_dir, audio_dir, output_video):
    try:
        watermark_path = "watermark_Scrolla.png"
        watermark_exists = os.path.exists(watermark_path)
        watermark_padding_top = 30

        base_dir = os.getcwd()
        concat_list_path = os.path.join(base_dir, "concat_list.txt")
        subtitles = read_srt_file('subtitles.srt')

        total_duration = sum(get_audio_duration(os.path.join(audio_dir, f"scene{i}.mp3"))
                             for i in range(1, len(subtitles) + 1))

        with open(concat_list_path, "w", encoding='utf-8') as f:
            scene_count = len(
                [x for x in os.listdir(audio_dir) if x.endswith('.mp3')])
            print(f"Found {scene_count} audio files")

            for i in range(1, scene_count + 1):
                image_path = os.path.join(output_dir, f"image{i}.jpg")
                audio_path = os.path.join(audio_dir, f"scene{i}.mp3")
                temp_video = os.path.join(base_dir, f"temp_scene_{i}.mp4")

                if not os.path.exists(image_path) or not os.path.exists(audio_path):
                    print(f"Missing files for scene {i}")
                    continue

                audio_duration = get_audio_duration(audio_path)
                if audio_duration is None:
                    print(f"Could not determine duration for {audio_path}")
                    continue

                print(f"Processing scene {i} with duration {audio_duration} seconds")

                if ADD_SUBTITLES:
                    subtitle_text = subtitles[i - 1] if i - 1 < len(subtitles) else ""
                    wrapped_subtitles = wrap_text(
                        subtitle_text, max_width=1080 - 40)

                    print(f"Wrapped subtitles for scene {i}: {wrapped_subtitles}")

                    if not wrapped_subtitles:
                        filter_str = "null"
                    else:
                        filter_complex = []
                        line_spacing = 20
                        video_height = 1920
                        total_lines = len(wrapped_subtitles)
                        vertical_position = calculate_vertical_position(
                            total_lines, FONT_SIZE, line_spacing, video_height, SUBTITLE_VERTICAL_ALIGNMENT)

                        for idx, seg_text in enumerate(wrapped_subtitles):
                            seg_text = seg_text.replace(
                                "'", "'\\''").replace(":", "\\:")
                            y_position = vertical_position + \
                                (FONT_SIZE + line_spacing) * idx

                            filter_complex.append(
                                f"drawtext=text='{seg_text}':fontcolor={FONT_COLOR}:fontsize={FONT_SIZE}:"
                                f"font='{FONT}':"
                                f"borderw={BORDER_WIDTH}:bordercolor={BORDER_COLOR}:"
                                f"box=1:boxcolor=black@0.5:boxborderw=5:"
                                f"x={SUBTITLE_X_POSITION}:y={y_position}:line_spacing={line_spacing}:"
                                f"fix_bounds=true:enable='between(t,0,{audio_duration})'"
                            )

                        subtitle_filter = ','.join(filter_complex)
                else:
                    subtitle_filter = "null"

                bg_music_path = "bg_music.mp3"
                bg_music_exists = os.path.exists(bg_music_path)

                if watermark_exists:
                    command = [
                        "ffmpeg", "-y",
                        "-loop", "1",
                        "-t", str(audio_duration),
                        "-i", image_path,
                        "-i", audio_path,
                        "-i", watermark_path,
                        "-filter_complex",
                        f"[0][2]overlay=(W-w)/2:{watermark_padding_top}[bg]; "
                        f"[bg]{subtitle_filter},fade=t=in:st=0:d=1,fade=t=out:st={total_duration-0.5}:d=0.5",
                        "-c:v", "libx264",
                        "-pix_fmt", "yuv420p",
                        "-shortest",
                        "-avoid_negative_ts", "make_zero",
                        "-r", "30",
                        temp_video
                    ]
                else:
                    command = [
                        "ffmpeg", "-y",
                        "-loop", "1",
                        "-t", str(audio_duration),
                        "-i", image_path,
                        "-i", audio_path,
                        "-filter_complex",
                        f"{subtitle_filter},fade=t=in:st=0:d=1,fade=t=out:st={total_duration-0.5}:d=0.5",
                        "-c:v", "libx264",
                        "-pix_fmt", "yuv420p",
                        "-shortest",
                        "-avoid_negative_ts", "make_zero",
                        "-r", "30",
                        temp_video
                    ]

                print(f"Creating scene {i} with watermark & timed subtitles..." if ADD_SUBTITLES else f"Creating scene {i} without subtitles")
                subprocess.run(command, check=True)

                f.write(f"file '{os.path.abspath(temp_video)}'\n")

        if not os.path.exists(concat_list_path):
            raise Exception("Concat list file was not created")

        with open(concat_list_path, 'r') as f:
            content = f.read().strip()
            if not content:
                raise Exception("Concat list file is empty")
            print("Concat file content:")
            print(content)

        final_command = [
            "ffmpeg", "-y",
            "-f", "concat",
            "-safe", "0",
            "-i", concat_list_path,
            "-i", bg_music_path if bg_music_exists else "null",
            "-filter_complex",
            f"[0:v]fade=t=in:st=0:d=1,fade=t=out:st={total_duration-0.5}:d=0.5[v]; "
            f"[1:a]volume=0.5[bg_music]; "
            f"[0:a][1:a]amix=inputs=2:duration=first:dropout_transition=0[a]"
            if bg_music_exists else "[0:v]fade=t=in:st=0:d=1,fade=t=out:st={total_duration-0.5}:d=0.5[v]; [0:a]anull[a]",
            "-map", "[v]",
            "-map", "[a]",
            "-c:v", "libx264",
            "-c:a", "aac",
            "-b:a", "384k",
            "-pix_fmt", "yuv420p",
            "-shortest",
            output_video
        ]

        print("Combining all scenes with background music...")
        print("Running command:", ' '.join(final_command))
        result = subprocess.run(
            final_command, stderr=subprocess.PIPE, stdout=subprocess.PIPE, text=True)

        if result.returncode != 0:
            print("FFmpeg stderr output:")
            print(result.stderr)
            raise subprocess.CalledProcessError(
                result.returncode, final_command)

        print("Video created successfully!")

        for i in range(1, scene_count + 1):
            temp_file = os.path.join(base_dir, f"temp_scene_{i}.mp4")
            if os.path.exists(temp_file):
                os.remove(temp_file)
        os.remove(concat_list_path)

    except subprocess.CalledProcessError as e:
        print(f"FFmpeg Error: {e}")
        print("Command output:", e.output if hasattr(
            e, 'output') else 'No output available')
    except Exception as e:
        print(f"Error: {e}")

        