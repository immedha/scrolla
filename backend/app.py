import os
import uuid
import json
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import logging
import sys

from config import (
    DEBUG,
    PORT,
    HOST,
    UPLOAD_FOLDER,
    OUTPUT_FOLDER,
    ALLOWED_EXTENSIONS,
    MAX_CONTENT_LENGTH,
)
from video_processor import process_pdf_to_video
from firebase_service import (
    upload_file_to_firebase,
    add_videos_to_user,
    get_user_subscription_status,
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    stream=sys.stdout,
)
logger = logging.getLogger(__name__)

logger.info("Starting Scrolla backend server...")

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure app
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["MAX_CONTENT_LENGTH"] = MAX_CONTENT_LENGTH
logger.info(f"Upload folder: {UPLOAD_FOLDER}")
logger.info(f"Output folder: {OUTPUT_FOLDER}")


def allowed_file(filename):
    """Check if the file has an allowed extension"""
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    logger.info("Health check requested")
    return jsonify({"status": "ok"})


@app.route("/api/upload", methods=["POST"])
def upload_files():
    """
    Endpoint to upload PDF files

    Expects:
    - A list of files in the 'files' field
    - User ID in the 'userId' field

    Returns:
    - JSON with the uploaded file URLs
    """
    try:
        logger.info("Upload endpoint called")
        # Check if user ID is provided
        if "userId" not in request.form:
            logger.warning("No userId provided in upload request")
            return jsonify({"error": "User ID is required"}), 400

        user_id = request.form["userId"]
        logger.info(f"Upload request for user: {user_id}")

        # Check if files are provided
        if "files" not in request.files:
            logger.warning("No files provided in upload request")
            return jsonify({"error": "No files provided"}), 400

        # Get files from request
        files = request.files.getlist("files")
        logger.info(f"Number of files received: {len(files)}")

        # Check if any files are selected
        if not files or files[0].filename == "":
            logger.warning("No files selected in upload request")
            return jsonify({"error": "No files selected"}), 400

        # Check user subscription status to determine max files allowed
        try:
            is_pro = get_user_subscription_status(user_id)
            max_files = 50 if is_pro else 5
            logger.info(
                f"User subscription status: {'Pro' if is_pro else 'Free'}, max files: {max_files}"
            )

            if len(files) > max_files:
                logger.warning(
                    f"Too many files: {len(files)}, max allowed: {max_files}"
                )
                return jsonify({"error": f"Maximum {max_files} files allowed"}), 400
        except ValueError as e:
            logger.error(f"Error checking subscription: {str(e)}")
            return jsonify({"error": str(e)}), 404
        except Exception as e:
            logger.error(f"Error checking subscription: {str(e)}")
            # Continue with default max files
            if len(files) > 5:
                logger.warning("Too many files, using default limit of 5")
                return jsonify({"error": "Maximum 5 files allowed"}), 400

        # Process and save files
        saved_files = []
        for file in files:
            if file and allowed_file(file.filename):
                # Secure the filename
                filename = secure_filename(file.filename)
                logger.info(f"Processing file: {filename}")

                # Add a unique identifier to avoid filename conflicts
                unique_filename = f"{uuid.uuid4()}_{filename}"

                # Save file locally
                file_path = os.path.join(app.config["UPLOAD_FOLDER"], unique_filename)
                file.save(file_path)
                logger.info(f"File saved to: {file_path}")

                saved_files.append({"original_name": filename, "path": file_path})
            else:
                logger.warning(
                    f"Invalid file type: {file.filename if file else 'None'}"
                )
                return (
                    jsonify({"error": "Invalid file type. Only PDF files are allowed"}),
                    400,
                )

        # Return the paths of saved files
        logger.info(f"Successfully saved {len(saved_files)} files")
        return jsonify(
            {
                "message": "Files uploaded successfully",
                "files": [file["path"] for file in saved_files],
            }
        )

    except Exception as e:
        logger.error(f"Error uploading files: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/generate", methods=["POST"])
def generate_videos():
    """
    Endpoint to generate videos from PDF files

    Expects:
    - A list of file paths in the 'files' field
    - User ID in the 'userId' field

    Returns:
    - JSON with the generated video URLs
    """
    try:
        logger.info("Generate videos endpoint called")
        # Check if the request is JSON
        if not request.is_json:
            logger.warning("Request is not JSON")
            return jsonify({"error": "Request must be JSON"}), 400

        data = request.json
        logger.info(f"Generate request data: {data}")

        # Check if required fields are provided
        if "userId" not in data:
            logger.warning("No userId provided in generate request")
            return jsonify({"error": "User ID is required"}), 400

        if "files" not in data or not data["files"]:
            logger.warning("No files provided in generate request")
            return jsonify({"error": "File paths are required"}), 400

        user_id = data["userId"]
        file_paths = data["files"]
        logger.info(f"Generate request for user: {user_id}, files: {file_paths}")

        # Process each PDF to generate videos
        videos = []
        for file_path in file_paths:
            try:
                # Check if the file exists
                if not os.path.exists(file_path):
                    logger.error(f"File not found: {file_path}")
                    continue

                logger.info(f"Processing file: {file_path}")
                # Generate a video from the PDF
                video_filename = f"{uuid.uuid4()}.mp4"
                video_path = process_pdf_to_video(file_path, video_filename)
                logger.info(f"Video generated at: {video_path}")

                # Upload video to Firebase Storage
                firebase_path = f"videos/{user_id}/{video_filename}"
                logger.info(f"Uploading video to Firebase: {firebase_path}")
                video_url = upload_file_to_firebase(video_path, firebase_path)
                logger.info(f"Video uploaded to: {video_url}")

                # Create video metadata
                video_data = {
                    "videoUrl": video_url,
                    "liked": False,
                    "title": f"Video {len(videos) + 1}",
                    "category": "generated",
                }

                videos.append(video_data)
                logger.info(f"Video added to list: {video_data}")

            except Exception as e:
                logger.error(f"Error processing file {file_path}: {str(e)}")
                continue

        # Add videos to user's collection in Firestore
        if videos:
            try:
                logger.info(f"Adding {len(videos)} videos to user {user_id}")
                add_videos_to_user(user_id, videos)
                logger.info("Videos added to user's collection")
            except Exception as e:
                logger.error(f"Error adding videos to user: {str(e)}")
                # Continue anyway, as we've already generated the videos

        logger.info(f"Successfully generated {len(videos)} videos")
        return jsonify({"message": "Videos generated successfully", "videos": videos})

    except Exception as e:
        logger.error(f"Error generating videos: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/videos/<path:filename>")
def serve_video(filename):
    """
    Serve a video file

    Args:
        filename (str): Name of the video file

    Returns:
        The video file
    """
    logger.info(f"Serving video: {filename}")
    return send_from_directory(OUTPUT_FOLDER, filename)


# Create necessary directories
for folder in [UPLOAD_FOLDER, OUTPUT_FOLDER]:
    os.makedirs(folder, exist_ok=True)
    logger.info(f"Created directory: {folder}")

if __name__ == "__main__":
    logger.info(f"Starting Flask server at {HOST}:{PORT}, debug={DEBUG}")
    app.run(debug=DEBUG, host=HOST, port=PORT)
