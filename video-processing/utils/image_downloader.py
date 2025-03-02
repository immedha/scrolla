import os
import time
import mimetypes
import requests


def download_image(url, filename, max_retries=3, retry_delay=1):
    retries = 0
    while retries < max_retries:
        try:
            response = requests.get(url)
            print(f'{retries} try')
            if response.status_code == 200:

                # content = response.content
                content_type = response.headers.get('Content-Type')
                extension = mimetypes.guess_extension(content_type)
                filename_with_extension = f"{filename}{extension}"
                
                os.makedirs('images', exist_ok=True)

                with open(os.path.join('images', filename_with_extension), 'wb') as file:
                    file.write(response.content)

                print(
                    f"Image '{filename_with_extension}' downloaded successfully.")
                return

            else:
                print(f"Failed to download image. Status code: {response.status_code}")
                retries += 1
                time.sleep(retry_delay)

        except requests.exceptions.RequestException as e:
            print(f"Error occurred while downloading image: {e}")
            retries += 1
            time.sleep(retry_delay)

    print(f"Failed to download image after {max_retries} retries.")
    