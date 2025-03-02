import os
import json
import logging
import uuid
import datetime
from config import FIREBASE_STORAGE_BUCKET

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Mock implementation for testing without Firebase
MOCK_MODE = True
MOCK_STORAGE = {}
MOCK_DB = {
    "users": {
        "test-user-id": {
            "userName": "Test User",
            "userEmail": "test@example.com",
            "isProSubscription": False,
            "videos": [],
        }
    }
}
MOCK_BASE_URL = "http://localhost:5003/api/videos"

logger.info(f"Firebase service initializing in {'MOCK' if MOCK_MODE else 'REAL'} mode")

try:
    import firebase_admin
    from firebase_admin import credentials, storage, firestore

    # Initialize Firebase if not already initialized and not in mock mode
    if not MOCK_MODE and not firebase_admin._apps:
        # Check if running in a production environment with service account JSON
        if os.path.exists("firebase-service-account.json"):
            logger.info("Using firebase-service-account.json for authentication")
            cred = credentials.Certificate("firebase-service-account.json")
        else:
            # For development, try to use a JSON string from environment variable
            service_account_json = os.getenv("FIREBASE_SERVICE_ACCOUNT")
            if service_account_json:
                logger.info(
                    "Using FIREBASE_SERVICE_ACCOUNT environment variable for authentication"
                )
                service_account_info = json.loads(service_account_json)
                cred = credentials.Certificate(service_account_info)
            else:
                # Fall back to application default credentials
                logger.warning(
                    "No explicit credentials found, falling back to application default credentials"
                )
                cred = credentials.ApplicationDefault()

        firebase_admin.initialize_app(cred, {"storageBucket": FIREBASE_STORAGE_BUCKET})

        logger.info("Firebase initialized successfully")
        bucket = storage.bucket()
        db = firestore.client()
    else:
        logger.info("Using mock Firebase implementation")
except Exception as e:
    logger.error(f"Failed to initialize Firebase: {str(e)}")
    logger.warning("Falling back to mock implementation")
    MOCK_MODE = True


def upload_file_to_firebase(file_path, destination_path):
    """
    Upload a file to Firebase Storage or mock storage

    Args:
        file_path (str): Local path to the file
        destination_path (str): Path in Firebase Storage

    Returns:
        str: Public URL of the uploaded file
    """
    if MOCK_MODE:
        logger.info(f"MOCK: Uploading file {file_path} to {destination_path}")
        # Create a mock URL for the file
        filename = os.path.basename(file_path)
        mock_url = f"{MOCK_BASE_URL}/{filename}"
        # Store the file in mock storage
        MOCK_STORAGE[destination_path] = {
            "local_path": file_path,
            "url": mock_url,
            "uploaded_at": datetime.datetime.now().isoformat(),
        }
        logger.info(f"MOCK: File uploaded, URL: {mock_url}")
        return mock_url
    else:
        try:
            logger.info(f"Uploading file {file_path} to Firebase: {destination_path}")
            blob = bucket.blob(destination_path)
            blob.upload_from_filename(file_path)
            # Make the blob publicly accessible
            blob.make_public()
            url = blob.public_url
            logger.info(f"File uploaded to Firebase, URL: {url}")
            return url
        except Exception as e:
            logger.error(f"Error uploading to Firebase: {str(e)}")
            # Fall back to mock implementation
            return upload_file_to_firebase(file_path, destination_path)


def add_video_to_user(user_id, video_data):
    """
    Add a video to a user's collection in Firestore or mock DB

    Args:
        user_id (str): User ID
        video_data (dict): Video data to add
    """
    if MOCK_MODE:
        logger.info(f"MOCK: Adding video to user {user_id}: {video_data}")
        if user_id not in MOCK_DB["users"]:
            MOCK_DB["users"][user_id] = {
                "userName": f"User {user_id}",
                "userEmail": f"user{user_id}@example.com",
                "isProSubscription": False,
                "videos": [],
            }
        MOCK_DB["users"][user_id]["videos"].append(video_data)
        logger.info(f"MOCK: Video added to user {user_id}")
    else:
        try:
            logger.info(f"Adding video to user {user_id} in Firestore")
            user_ref = db.collection("users").document(user_id)
            user_doc = user_ref.get()

            if user_doc.exists:
                user_data = user_doc.to_dict()
                videos = user_data.get("videos", [])
                videos.append(video_data)
                user_ref.update({"videos": videos})
                logger.info(f"Video added to user {user_id} in Firestore")
            else:
                logger.error(f"User {user_id} not found in Firestore")
                raise ValueError(f"User {user_id} not found")
        except Exception as e:
            logger.error(f"Error adding video to user in Firestore: {str(e)}")
            # Fall back to mock implementation
            add_video_to_user(user_id, video_data)


def add_videos_to_user(user_id, videos_data):
    """
    Add multiple videos to a user's collection in Firestore or mock DB

    Args:
        user_id (str): User ID
        videos_data (list): List of video data to add
    """
    if MOCK_MODE:
        logger.info(f"MOCK: Adding {len(videos_data)} videos to user {user_id}")
        if user_id not in MOCK_DB["users"]:
            MOCK_DB["users"][user_id] = {
                "userName": f"User {user_id}",
                "userEmail": f"user{user_id}@example.com",
                "isProSubscription": False,
                "videos": [],
            }
        MOCK_DB["users"][user_id]["videos"].extend(videos_data)
        logger.info(f"MOCK: {len(videos_data)} videos added to user {user_id}")
    else:
        try:
            logger.info(
                f"Adding {len(videos_data)} videos to user {user_id} in Firestore"
            )
            user_ref = db.collection("users").document(user_id)
            user_doc = user_ref.get()

            if user_doc.exists:
                user_data = user_doc.to_dict()
                videos = user_data.get("videos", [])
                videos.extend(videos_data)
                user_ref.update({"videos": videos})
                logger.info(
                    f"{len(videos_data)} videos added to user {user_id} in Firestore"
                )
            else:
                logger.error(f"User {user_id} not found in Firestore")
                raise ValueError(f"User {user_id} not found")
        except Exception as e:
            logger.error(f"Error adding videos to user in Firestore: {str(e)}")
            # Fall back to mock implementation
            add_videos_to_user(user_id, videos_data)


def get_user_subscription_status(user_id):
    """
    Get the subscription status of a user from Firestore or mock DB

    Args:
        user_id (str): User ID

    Returns:
        bool: True if the user has a pro subscription, False otherwise
    """
    if MOCK_MODE:
        logger.info(f"MOCK: Checking subscription status for user {user_id}")
        if user_id not in MOCK_DB["users"]:
            # Create a mock user for testing
            MOCK_DB["users"][user_id] = {
                "userName": f"User {user_id}",
                "userEmail": f"user{user_id}@example.com",
                "isProSubscription": False,
                "videos": [],
            }
        is_pro = MOCK_DB["users"][user_id].get("isProSubscription", False)
        logger.info(
            f"MOCK: User {user_id} subscription status: {'Pro' if is_pro else 'Free'}"
        )
        return is_pro
    else:
        try:
            logger.info(f"Checking subscription status for user {user_id} in Firestore")
            user_ref = db.collection("users").document(user_id)
            user_doc = user_ref.get()

            if user_doc.exists:
                user_data = user_doc.to_dict()
                is_pro = user_data.get("isProSubscription", False)
                logger.info(
                    f"User {user_id} subscription status: {'Pro' if is_pro else 'Free'}"
                )
                return is_pro
            else:
                logger.error(f"User {user_id} not found in Firestore")
                raise ValueError(f"User {user_id} not found")
        except Exception as e:
            logger.error(f"Error checking subscription status in Firestore: {str(e)}")
            # Fall back to mock implementation
            return get_user_subscription_status(user_id)
