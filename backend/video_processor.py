import os
import uuid
import shutil
import PyPDF2
from PIL import Image
import ffmpeg
import logging
from io import BytesIO
from config import TEMP_FOLDER, OUTPUT_FOLDER, VIDEO_QUALITY, MAX_VIDEO_DURATION

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Video quality settings
quality_settings = {
    "low": {"resolution": "720x1280", "bitrate": "1000k", "audio_bitrate": "128k"},
    "medium": {"resolution": "1080x1920", "bitrate": "2500k", "audio_bitrate": "192k"},
    "high": {"resolution": "1440x2560", "bitrate": "6000k", "audio_bitrate": "256k"},
}


def extract_images_from_pdf(pdf_path):
    """
    Extract images from a PDF file and save them as PNG files

    Args:
        pdf_path (str): Path to the PDF file

    Returns:
        list: List of paths to the extracted images
    """
    # Create a unique temporary directory for this processing job
    job_id = str(uuid.uuid4())
    temp_dir = os.path.join(TEMP_FOLDER, job_id)
    os.makedirs(temp_dir, exist_ok=True)

    image_paths = []

    try:
        # Open the PDF file
        with open(pdf_path, "rb") as file:
            pdf = PyPDF2.PdfReader(file)

            # Extract each page as an image
            for page_num in range(len(pdf.pages)):
                try:
                    # Convert PDF page to image
                    page = pdf.pages[page_num]

                    # This is a simplified approach - in a real implementation, you would use
                    # a library like pdf2image or Wand for better PDF rendering
                    if "/XObject" in page["/Resources"]:
                        xObject = page["/Resources"]["/XObject"].get_object()

                        for obj in xObject:
                            if xObject[obj]["/Subtype"] == "/Image":
                                image_data = xObject[obj]._data
                                image = Image.open(BytesIO(image_data))

                                # Save the image
                                image_path = os.path.join(
                                    temp_dir, f"page_{page_num:03d}.png"
                                )
                                image.save(image_path, "PNG")
                                image_paths.append(image_path)

                except Exception as e:
                    logger.error(f"Error processing page {page_num}: {str(e)}")
                    continue

    except Exception as e:
        logger.error(f"Error processing PDF: {str(e)}")
        # Clean up
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise

    return image_paths, temp_dir


def create_video_from_images(image_paths, output_filename, duration_per_image=5):
    """
    Create a video from a list of images using ffmpeg

    Args:
        image_paths (list): List of paths to the images
        output_filename (str): Output video filename
        duration_per_image (int): Duration in seconds to show each image

    Returns:
        str: Path to the created video
    """
    # Create output directory if it doesn't exist
    os.makedirs(OUTPUT_FOLDER, exist_ok=True)

    # Determine the full output path
    output_path = os.path.join(OUTPUT_FOLDER, output_filename)

    try:
        # Get video quality settings
        quality = quality_settings.get(VIDEO_QUALITY, quality_settings["medium"])

        # Calculate the total duration based on the number of images
        total_duration = min(len(image_paths) * duration_per_image, MAX_VIDEO_DURATION)

        # Adjust duration_per_image if the total would exceed the maximum
        if len(image_paths) * duration_per_image > MAX_VIDEO_DURATION:
            duration_per_image = MAX_VIDEO_DURATION / len(image_paths)

        # Create a temporary text file with the list of images
        list_file_path = os.path.join(TEMP_FOLDER, f"{uuid.uuid4()}_list.txt")
        with open(list_file_path, "w") as list_file:
            for image_path in image_paths:
                list_file.write(f"file '{image_path}'\n")
                list_file.write(f"duration {duration_per_image}\n")

            # Add the last image again without duration (required by ffmpeg)
            if image_paths:
                list_file.write(f"file '{image_paths[-1]}'\n")

        # Create video using ffmpeg
        (
            ffmpeg.input(list_file_path, format="concat", safe=0)
            .output(
                output_path,
                vcodec="libx264",
                pix_fmt="yuv420p",
                s=quality["resolution"],
                b=quality["bitrate"],
                preset="medium",
                r=30,
            )
            .overwrite_output()
            .run(quiet=True, capture_stdout=True, capture_stderr=True)
        )

        return output_path

    except ffmpeg.Error as e:
        logger.error(f"FFmpeg error: {e.stderr.decode() if e.stderr else str(e)}")
        raise
    except Exception as e:
        logger.error(f"Error creating video: {str(e)}")
        raise
    finally:
        # Clean up the list file
        if os.path.exists(list_file_path):
            os.remove(list_file_path)


def process_pdf_to_video(pdf_path, output_filename=None):
    """
    Process a PDF file to create a video

    Args:
        pdf_path (str): Path to the PDF file
        output_filename (str, optional): Output video filename. If None, a random name will be generated.

    Returns:
        str: Path to the created video
    """
    if output_filename is None:
        output_filename = f"{uuid.uuid4()}.mp4"

    temp_dir = None

    try:
        # Extract images from PDF
        image_paths, temp_dir = extract_images_from_pdf(pdf_path)

        if not image_paths:
            raise ValueError("No images extracted from the PDF")

        # Create video from images
        video_path = create_video_from_images(image_paths, output_filename)

        return video_path

    except Exception as e:
        logger.error(f"Error processing PDF to video: {str(e)}")
        raise
    finally:
        # Clean up temporary directory
        if temp_dir and os.path.exists(temp_dir):
            shutil.rmtree(temp_dir, ignore_errors=True)
