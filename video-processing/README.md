## SacHacks 2025

Set/Export following API keys:
- **OpenAI API Key**
- **Deepgram API Key**


```sh
OPENAI_API_KEY=your_openai_api_key
DEEPGRAM_API_KEY=your_deepgram_api_key
```

### Setup

1. **Create & Activate a Virtual Environment**
   ```bash
   python -m venv venv
   source venv/bin/activate 

   or 

   venv\Scripts\activate
   ```

- Run the following command inside your virtual environment (venv):

   ```sh
   playwright install
   ```

2. **Add Your Article Link**
   - Open the `crawler.py` file.
   - Insert your desired article link in the `main` method.

3. **Run the Script**
   ```bash
   python crawler.py
   ```

### How It Works
The script retrieves data from the given article link and uses AI to create engaging YouTube Shorts like content. It leverages the **DALLE-3** model to produce eye-catching images, while OpenAI and Deepgram services manage other processing tasks. Make sure your API keys are properly configured to enable these integrations.


### To Run the Script

Single PDF:
```sh
python scrolla.py pdf GlobalWarming_Earth.pdf
```

Multiple PDFs:
```sh
python scrolla.py pdf GlobalWarming_Earth.pdf AnotherDocument.pdf
```

Using URL:

```sh
python scrolla.py url https://www.theverge.com/news/610721/thomson-reuters-ross-intelligence-ai-copyright-infringement
```

<!-- Example list of links to news articles: -->
<!-- https://www.bbc.com/future/article/20250122-expert-tips-on-how-to-keep-exercising-during-cold-winter-weather -->



## To star the REST API server:

[Recommended] Default run:
```sh
python scrolla.py
```

### Testing with cURL  [URL / PDF / Multiple PDFs] 

```sh
curl -X POST http://127.0.0.1:5000/process -F "type=url" -F "url=https://www.theverge.com/news/610721/thomson-reuters-ross-intelligence-ai-copyright-infringement"
```

```sh
curl -X POST http://127.0.0.1:5000/process \
-F "type=pdf" \
-F "pdfs=@/path/to/your/file.pdf"
```

```sh
curl -X POST http://127.0.0.1:5000/process \
-F "type=pdf" \
-F "pdfs=@/path/to/file1.pdf" \
-F "pdfs=@/path/to/file2.pdf" \
-F "pdfs=@/path/to/file3.pdf"
```





<!-- -----------------------------------------------  TESTING -------------------------------------------------->

[optional / For Testing] Start the Flask [Async] server:
```sh
uvicorn scrolla:app --reload
```

```sh
curl -X POST http://127.0.0.1:8000/process -F "type=url" -F "url=https://www.example.com/article"
```

```sh
curl -X POST http://127.0.0.1:8000/process -F "type=pdf" -F "pdfs=@path/to/your/file1.pdf" -F "pdfs=@path/to/your/file2.pdf"
```