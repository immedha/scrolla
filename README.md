<div align="center">

# Scrolla ⭐ - Endless scroll meets endless knowledge

![scrolla](https://github.com/user-attachments/assets/3cce01de-57e9-41ea-8c77-43517d33ce22)

</div>

Scrolla transforms articles, PDFs, and web content into engaging short-form videos with cutting-edge AI technology. It lets you enjoy the entertainment of scrolling through social media while effortlessly absorbing educational content at the same time.

> Scrolla combines advanced AI technology with powerful content processing tools to transform text into engaging short-form video content.

## About Team Scrolla

Scrolla for SacHacks VI. Our dedicated team members include:

| <img src="https://github.com/Neilblaze.png?size=100" alt="Pratyay Banerjee" width="100" /><br />[Pratyay Banerjee](https://github.com/Neilblaze) | <img src="https://github.com/immedha.png?size=100" alt="Medha Gupta" width="100" /><br />[Medha Gupta](https://github.com/immedha) | <img src="https://github.com/achalbajpai.png?size=100" alt="Achal Bajpai" width="100" /><br />[Achal Bajpai](https://github.com/achalbajpai) | <img src="https://github.com/yashalluri.png?size=100" alt="Yashwanth Alluri" width="100" /><br />[Yashwanth Alluri](https://github.com/yashalluri) |
| --- | --- | --- | --- |


## Why Scrolla ? 
In today's era, where short-form content like reels dominates social media, we saw an opportunity to bridge the gap between in-depth narratives and engaging video formats. Our mission is to revolutionize content creation by leveraging cutting-edge AI to transform long-form content into captivating short-form videos that bring the best of both worlds together.


<img width="790" alt="Screenshot 2025-03-02 at 6 15 15 PM" src="https://github.com/user-attachments/assets/fda1ba56-34d0-4764-897b-4a3a56b6c000" />
<br> 

## Key Features

- **Multi-Source Input**: Process PDFs, URLs, and web articles
- **AI-Generated Visuals**: Create stunning images with DALLE-3
- **Content Transformation**: Convert long-form textcontent to short-form reels
- **YouTube Shorts Format**: Optimized for social media sharing
- **Social Media-style scrolling**: View the videos in a personal feed like popular social media apps
- **API Integration**: Powerful OpenAI and Deepgram capabilities
- **Command-Line Interface**: Simple and efficient processing

## Architecture Flow 

![Architecture (1)](https://github.com/user-attachments/assets/08f970b6-c98b-435d-81be-e9b0a9fb5bdf)

| **Category**           | **Technologies**                                      |
|------------------------|------------------------------------------------------|
| **Frontend**          | TypeScript, React, Vite, Redux, Tailwind CSS         |
| **Backend & Deployment** | Python, Flask, FastAPI, Firebase, Docker, venv     |
| **AI & Media Processing** | OpenAI (GPT-4o-mini, DALLE-3), Deepgram, Agentic-AI, Playwright, Crawl4AI, FFmpeg, PDF Parsing Libraries |  


## Scrolla Documentation

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Running the Backend Server](#running-the-backend-server)
- [Running the Frontend](#running-the-frontend)
- [Backend API Usage Examples](#backend-api-usage-examples)

---

> [!WARNING]  
> You need the Firebase, Open AI, and Deepgram API keys to be able to run the website. 

## Getting Started

### Prerequisites

- Python 3.7+
- Node.js and npm
- Firebase CLI

### Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd scrolla

---

## Running the Backend Server

Do `cd video_processing`

### Setting Up API Keys

Export the following API keys:

```bash
export OPENAI_API_KEY=your_openai_api_key
export DEEPGRAM_API_KEY=your_deepgram_api_key
```

### Running the Application

1. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

2. Install Playwright:
   ```bash
   playwright install
   ```

3. Run the script:
   ```bash
   python scrolla.py
   ```

## Running the Frontend

Do `cd frontend` (or `cd ..` and `cd frontend` if you were in the `video_processing` directory before)

### Setting Up API Keys

Create a `.env` add these keys:

```bash
VITE_API_KEY
VITE_AUTH_DOMAIN
VITE_PROJECT_ID
VITE_STORAGE_BUCKET
VITE_MESSAGING_SENDER_ID
VITE_APP_ID
VITE_MEASUREMENT_ID
```
### Running the Application

1. Do `npm install`. 

2. Do `npm run dev` to run it locally. 
---

## Backend API Usage Examples

#### Process a URL:
```bash
curl -X POST http://127.0.0.1:8000/process -F "type=url" -F "url=https://example.com/article"
```

#### Process a PDF:
```bash
curl -X POST http://127.0.0.1:8000/process -F "type=pdf" -F "pdfs=@/path/to/document.pdf"
```





