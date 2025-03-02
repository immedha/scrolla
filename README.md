<div align="center">

# Scrolla ⭐ - Endless scroll , meets endless knowledge

![scrolla](https://github.com/user-attachments/assets/3cce01de-57e9-41ea-8c77-43517d33ce22)

</div>




Transform articles, PDFs, and web content into engaging short-form videos with cutting-edge AI technology.



> Scrolla combines advanced AI technology with powerful content processing tools to transform text into engaging short-form video content.

## About Team Scrolla

Scrolla for SacHacks VI. Our dedicated team members include:

| <img src="https://github.com/Neilblaze.png?size=100" alt="Pratyay Banerjee" width="100" /><br />[Pratyay Banerjee](https://github.com/Neilblaze) | <img src="https://github.com/achalbajpai.png?size=100" alt="Achal Bajpai" width="100" /><br />[Achal Bajpai](https://github.com/achalbajpai) | <img src="https://github.com/yashalluri.png?size=100" alt="Yashwanth Alluri" width="100" /><br />[Yashwanth Alluri](https://github.com/yashalluri) | <img src="https://github.com/immedha.png?size=100" alt="Medha Gupta" width="100" /><br />[Medha Gupta](https://github.com/immedha) |
| --- | --- | --- | --- |


## Why Scrolla ? 
In today's era, where short-form content like reels dominates social media, we saw an opportunity to bridge the gap between in-depth narratives and engaging video formats. Our mission is to revolutionize content creation by leveraging cutting-edge AI to transform long-form content into captivating short-form videos that bring the best of both worlds together.


<img width="790" alt="Screenshot 2025-03-02 at 6 15 15 PM" src="https://github.com/user-attachments/assets/fda1ba56-34d0-4764-897b-4a3a56b6c000" />
<br> 

## Key Features

- **Multi-Source Input**: Process PDFs, URLs, and web articles
- **AI-Generated Visuals**: Create stunning images with DALLE-3
- **Content Transformation**: Convert long-form content to short-form
- **YouTube Shorts Format**: Optimized for social media sharing
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
- [Building and Deploying](#building-and-deploying)
- [Usage](#usage)
  - [Setting Up API Keys](#setting-up-api-keys)
  - [Running the Application](#running-the-application)
  - [API Usage Examples](#api-usage-examples)

---

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

## Building and Deploying

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy to Firebase:
   ```bash
   firebase deploy
   ```

---

## Usage

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
   python crawler.py
   ```

---

### API Usage Examples

#### Process a URL:
```bash
curl -X POST http://127.0.0.1:8000/process -F "type=url" -F "url=https://example.com/article"
```

#### Process a PDF:
```bash
curl -X POST http://127.0.0.1:8000/process -F "type=pdf" -F "pdfs=@/path/to/document.pdf"
```





