import sys
from flask import Flask, request, jsonify, abort
import os
import json
import asyncio
import shutil
from typing import List
from pydantic import BaseModel, Field
from dataclasses import dataclass
from crawl4ai import AsyncWebCrawler
from pydantic_ai import Agent, RunContext
import fitz

from utils.subtitles_generator import generate_audio_and_subtitle
from utils.image_downloader import download_image
from utils.image_generator import generate_image
from utils.video_generator import preprocess_images, create_video_with_audio_and_subtitles

app = Flask(__name__)

# if sys.platform == "win32":
#     asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

class Scene(BaseModel):
    scene_number: int = Field(..., description="The sequential number of the scene.")
    text: str = Field(..., description="The narration or on-screen text for the scene.")
    image_prompt: str = Field(..., description="A detailed prompt to generate the image or visual for the scene.")
    timeframe: int = Field(..., description="The duration of the scene in seconds.")

class ScrollaShortsScript(BaseModel):
    scenes: List[Scene] = Field(
        ..., description="A list of scenes, each containing the script and related metadata.")

system_prompt = """You are an advanced language model tasked with analyzing news articles and generating a YouTube Shorts video script. You will be provided with a tool to scrape web pages, primarily news articles. Here's your job:

                    1. **Focus on Relevant Content**:
                    Analyze the webpage content and extract only the main article text. Ignore headers, footers, navigation bars, advertisements, and any other irrelevant content.

                    2. **Script Creation**:
                    Based on the extracted content, generate a compelling script for a YouTube Shorts video. Divide the script into scenes, ensuring the flow is engaging and concise.

                    3. **Scene Structure**:
                    Each scene should include:
                    - **Text**: The script or narration for the scene.
                    - **Image Description Prompt**: An effective prompt for generating a relevant and visually engaging image or video background for the scene. This will be used with an image-generation AI.
                    - **Timeframe**: A duration (in seconds) for each scene to guide video editors.

                    4. **Output Format**:
                    The output should be in valid JSON format. Each scene should be a separate object in the JSON array, containing the following fields:
                    - `scene_number`: The sequential number of the scene.
                    - `text`: The narration or on-screen text for the scene.
                    - `image_prompt`: A detailed prompt to generate the image or visual for the scene.
                    - `timeframe`: The duration of the scene in seconds.

                    5. **Ensure Creativity and Clarity**:
                    Make the script engaging, audience-focused, and easy to follow. Use persuasive and emotionally appealing language where appropriate.

                Focus on creating a visually appealing and engaging experience for the audience while maintaining accuracy and relevance to the article.
                """

@dataclass
class Deps:
    client: AsyncWebCrawler
    content: str

agent = Agent(
    model='openai:gpt-4o-mini',
    system_prompt=system_prompt,
    result_type=ScrollaShortsScript,
    deps_type=Deps,
    name="YT Shorts Script Generator",
)

@agent.tool
async def web_crawler(ctx: RunContext[Deps]) -> str:
    """Use this tool to scrape the webpage and return content as markdown"""
    if ctx.deps.client is None:
        return ctx.deps.content
    result = await ctx.deps.client.arun(
        url=ctx.deps.content,
    )
    return result.markdown

def extract_text_from_pdf(pdf_path):
    """Extract text from a PDF file, ignoring images."""
    doc = fitz.open(pdf_path)
    text = ""
    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        text += page.get_text("text")  # text only, no images
    return text

async def process_content(content: str, content_type: str):
    async with AsyncWebCrawler() as crawler:
        if content_type == 'url':
            deps = Deps(client=crawler, content=content)
        elif content_type == 'pdf':
            text_content = extract_text_from_pdf(content)
            deps = Deps(client=None, content=text_content)
        else:
            raise ValueError("Unsupported content type. Use 'url' or 'pdf'.")

        result = await agent.run('Crawl the webpage of a given URL and do your job', deps=deps)
        scenes = result.data.scenes
        json_output = json.dumps([scene.model_dump() for scene in scenes], indent=2)
        print(json_output)

        urls = []
        for item in json.loads(json_output):
            print(f"Generating image for scene {item['scene_number']}")
            url = generate_image(item['image_prompt'])
            urls.append({"url": url, "scene": item['scene_number']})

        generate_audio_and_subtitle(json.loads(json_output))

        for item in urls:
            print(f"Downloading image for scene {item['scene']}")
            download_image(item['url'], f"image{item['scene']}")

    input_dir = "images"
    output_dir = "images_processed"
    audio_dir = "audios"
    output_video = "output_video.mp4"

    os.makedirs('images_processed', exist_ok=True)
    preprocess_images(input_dir, output_dir)
    create_video_with_audio_and_subtitles(output_dir, audio_dir, output_video)
    shutil.rmtree(output_dir, ignore_errors=True)

    return json_output

@app.route('/')
def home():
    return "Welcome to Scrolla!"


@app.route('/process', methods=['POST'])
async def process():
    content_type = request.form.get('type')
    if content_type == 'url':
        url = request.form.get('url')
        if not url:
            abort(400, description="URL is required for URL processing.")
        result = await process_content(url, content_type)
    elif content_type == 'pdf':
        files = request.files.getlist('pdfs')
        if len(files) > 5:
            abort(400, description="A maximum of 5 PDF files are allowed.")
        if not files:
            abort(400, description="At least one PDF file is required for PDF processing.")

        pdf_paths = []
        for file in files:
            pdf_path = os.path.join('uploads', file.filename)
            os.makedirs('uploads', exist_ok=True)
            file.save(pdf_path)
            pdf_paths.append(pdf_path)

        results = []
        for pdf_path in pdf_paths:
            result = await process_content(pdf_path, content_type)
            results.append(result)

        return jsonify(results), 200
    else:
        abort(400, description="Invalid content type. Use 'url' or 'pdf'.")

    return jsonify({"result": result}), 200

if __name__ == "__main__":
    app.run(debug=True, port=8000)