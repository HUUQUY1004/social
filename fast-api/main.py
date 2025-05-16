from http.client import HTTPException
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from PIL import Image
from starlette.middleware.cors import CORSMiddleware
from transformers import BlipProcessor, BlipForConditionalGeneration
import gradio as gr
import httpx
import os
import io
import base64
import numpy as np

# Load environment variables
load_dotenv(dotenv_path='.env')


# Define the request model
class ImageBase64Request(BaseModel):
    image_base64: str
    prompt: str = ""  # Optional prompt for conditional image captioning


# Initialize the BLIP model
processor = BlipProcessor.from_pretrained('Salesforce/blip-image-captioning-base')
model = BlipForConditionalGeneration.from_pretrained('Salesforce/blip-image-captioning-base')

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)
@app.post("/generate-caption")
async def generate_caption(data: ImageBase64Request):
    try:
        print("Hi lo")
        # Decode the base64 string to image
        image_data = base64.b64decode(data.image_base64)
        img = Image.open(io.BytesIO(image_data))

        # Process the image with BLIP
        if data.prompt:
            # Conditional image captioning
            inputs = processor(img, data.prompt, return_tensors="pt")
            out = model.generate(**inputs)
            caption = processor.decode(out[0], skip_special_tokens=True)
        else:
            # Unconditional image captioning
            inputs = processor(img, return_tensors="pt")
            out = model.generate(**inputs)
            caption = processor.decode(out[0], skip_special_tokens=True)
        print(caption)
        return {"caption": caption}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")


# Create a simple Gradio interface for testing
def gradio_caption_generator(image, prompt=""):
    # Convert image to base64
    buffered = io.BytesIO()
    image.save(buffered, format="JPEG")
    img_str = base64.b64encode(buffered.getvalue()).decode()

    # Call the API directly
    response = generate_caption(ImageBase64Request(image_base64=img_str, prompt=prompt))
    return response["caption"]


# Create Gradio interface
with gr.Blocks() as demo:
    gr.Markdown("# Image Caption Generator")
    with gr.Row():
        with gr.Column():
            img_input = gr.Image(type="pil", label="Upload Image")
            prompt_input = gr.Textbox(label="Optional Prompt (for conditional captioning)")
            generate_btn = gr.Button("Generate Caption")
        with gr.Column():
            caption_output = gr.Textbox(label="Generated Caption")

    generate_btn.click(
        fn=gradio_caption_generator,
        inputs=[img_input, prompt_input],
        outputs=caption_output
    )

# Mount the Gradio app at a specific route
app = gr.mount_gradio_app(app, demo, path="/ui")

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)