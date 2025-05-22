import traceback
import uuid
from http.client import HTTPException
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from PIL import Image, ImageEnhance
from starlette.middleware.cors import CORSMiddleware
from transformers import BlipProcessor, BlipForConditionalGeneration
import gradio as gr
import httpx
import os
import io
import base64
import numpy as np
import  cv2

from request.AvatarRequest import AvatarRequest

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


@app.post("/recommend-avatar")
async def recommend_avatar(data: AvatarRequest):
    try:
        # Decode the base64 image
        image_decode = base64.b64decode(data.base64)
        img = Image.open(io.BytesIO(image_decode))

        # Create directories if they don't exist
        os.makedirs("static/avatars", exist_ok=True)
        os.makedirs("models", exist_ok=True)

        # Use HuggingFace free API
        stylized_img = await apply_huggingface_ai(img, data.style)

        # Generate a unique filename for the avatar
        filename = f"avatar_{uuid.uuid4()}.png"
        filepath = f"static/avatars/{filename}"

        # Save the styled image
        stylized_img.save(filepath)

        # Return the URL to the saved image
        base_url = os.getenv("BASE_URL", "http://localhost:8000")
        avatar_url = f"{base_url}/static/avatars/{filename}"

        return {"avatar_url": avatar_url}

    except Exception as e:
        traceback.print_exc()  # Print detailed traceback for debugging
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")


async def apply_huggingface_ai(image, style):
    """Apply AI style transfer using HuggingFace's free Inference API"""
    # Resize image to reasonable dimensions
    image = image.resize((512, 512), Image.LANCZOS)

    # Convert image to base64 string for API
    buffered = io.BytesIO()
    image.save(buffered, format="JPEG")
    img_str = base64.b64encode(buffered.getvalue()).decode()

    # Get HuggingFace API token - you can use a free token from huggingface.co
    hf_token = os.getenv("HUGGINGFACE_API_TOKEN")
    if not hf_token:
        # Create a free account on huggingface.co and generate a token
        raise ValueError("HuggingFace API token not set. Set HUGGINGFACE_API_TOKEN environment variable.")

    # Map style to appropriate model
    model_mapping = {
        "cartoon": "ogkalu/Cartoon-StyleGAN",
        "anime": "apple/AnimeGANv2",
        "oil painting": "sd-concepts-library/oil-painting",
        "sketch": "huggingface/sketch-diffusion",
        "watercolor": "sd-concepts-library/watercolor",
        "pixel art": "sd-concepts-library/pixel-art",
        "pop art": "sd-concepts-library/pop-art",
        "abstract": "sd-concepts-library/abstract-art",
        # Default to a generally good style transfer model
        "default": "lllyasviel/control_v11p_sd15_scribble"
    }

    # Select model based on style or use default
    model_id = model_mapping.get(style.lower(), model_mapping["default"])

    # Prepare API request
    headers = {
        "Authorization": f"Bearer {hf_token}",
        "Content-Type": "application/json"
    }

    # The payload depends on the model
    if "control" in model_id:
        # ControlNet models
        payload = {
            "inputs": {
                "image": img_str,
                "prompt": f"high quality {style} style portrait"
            }
        }
    elif "Cartoon-StyleGAN" in model_id:
        # StyleGAN specific
        payload = {
            "input": img_str
        }
    else:
        # General case for most models
        payload = {
            "inputs": img_str,
            "parameters": {
                "prompt": f"high quality {style} style"
            }
        }

    # Use aiohttp for async API call
    import aiohttp
    async with aiohttp.ClientSession() as session:
        # API URL depends on the model
        api_url = f"https://api-inference.huggingface.co/models/{model_id}"

        # Make the API call
        async with session.post(api_url, headers=headers, json=payload) as response:
            if response.status != 200:
                error_text = await response.text()
                # If we get an error, use a different model as fallback
                if "currently loading" in error_text:
                    # Model still loading, fallback to local processing
                    return await apply_local_ai(image, style)
                else:
                    raise Exception(f"HuggingFace API error: {error_text}")

            # Get the response as bytes
            response_bytes = await response.read()

            # Convert to image
            return Image.open(io.BytesIO(response_bytes))


async def apply_local_ai(image, style):
    """Fallback to a locally running AI model"""
    try:
        # Try to import torch
        import torch
        from torchvision import transforms
        import torch.nn as nn

        # Check for model files or download
        model_path = "models/fast_neural_style_{}.pth".format(style.lower().replace(" ", "_"))

        if not os.path.exists(model_path):
            await download_style_model(style, model_path)

        # Load the model
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

        # Create a simple style transfer model
        class TransformerNet(nn.Module):
            def __init__(self):
                super(TransformerNet, self).__init__()
                # Simple CNN model definition
                self.conv1 = nn.Conv2d(3, 32, kernel_size=9, stride=1, padding=4)
                self.conv2 = nn.Conv2d(32, 64, kernel_size=3, stride=2, padding=1)
                self.conv3 = nn.Conv2d(64, 128, kernel_size=3, stride=2, padding=1)
                self.res1 = ResidualBlock(128)
                self.res2 = ResidualBlock(128)
                self.res3 = ResidualBlock(128)
                self.res4 = ResidualBlock(128)
                self.res5 = ResidualBlock(128)
                self.deconv1 = nn.ConvTranspose2d(128, 64, kernel_size=3, stride=2, padding=1, output_padding=1)
                self.deconv2 = nn.ConvTranspose2d(64, 32, kernel_size=3, stride=2, padding=1, output_padding=1)
                self.deconv3 = nn.Conv2d(32, 3, kernel_size=9, stride=1, padding=4)
                self.relu = nn.ReLU()
                self.instance_norm = nn.InstanceNorm2d(3)

            def forward(self, x):
                x = self.relu(self.conv1(x))
                x = self.relu(self.conv2(x))
                x = self.relu(self.conv3(x))
                x = self.res1(x)
                x = self.res2(x)
                x = self.res3(x)
                x = self.res4(x)
                x = self.res5(x)
                x = self.relu(self.deconv1(x))
                x = self.relu(self.deconv2(x))
                x = self.deconv3(x)
                return x

        class ResidualBlock(nn.Module):
            def __init__(self, channels):
                super(ResidualBlock, self).__init__()
                self.conv1 = nn.Conv2d(channels, channels, kernel_size=3, stride=1, padding=1)
                self.in1 = nn.InstanceNorm2d(channels)
                self.conv2 = nn.Conv2d(channels, channels, kernel_size=3, stride=1, padding=1)
                self.in2 = nn.InstanceNorm2d(channels)
                self.relu = nn.ReLU()

            def forward(self, x):
                residual = x
                out = self.relu(self.in1(self.conv1(x)))
                out = self.in2(self.conv2(out))
                out = out + residual
                out = self.relu(out)
                return out

        # Load the model
        style_model = TransformerNet().to(device)
        style_model.load_state_dict(torch.load(model_path, map_location=device))
        style_model.eval()

        # Preprocess the image
        transform = transforms.Compose([
            transforms.ToTensor(),
            transforms.Lambda(lambda x: x.mul(255))
        ])
        image_tensor = transform(image).unsqueeze(0).to(device)

        # Style transfer
        with torch.no_grad():
            output = style_model(image_tensor)

        # Post-process
        output = output[0].cpu().clone().clamp(0, 255).numpy()
        output = output.transpose(1, 2, 0).astype("uint8")
        result_img = Image.fromarray(output)

        return result_img

    except ImportError:
        # If torch is not available, fall back to OpenCV-based filters
        return apply_opencv_fallback(image, style)


async def download_style_model(style, model_path):
    """Download a pre-trained style transfer model"""
    # Map style to model URLs - these would be your pre-trained models
    style_urls = {
        "cartoon": "https://github.com/pytorch/examples/raw/main/fast_neural_style/saved_models/mosaic.pth",
        "anime": "https://github.com/pytorch/examples/raw/main/fast_neural_style/saved_models/candy.pth",
        "sketch": "https://github.com/pytorch/examples/raw/main/fast_neural_style/saved_models/pencil.pth",
        # Default style
        "default": "https://github.com/pytorch/examples/raw/main/fast_neural_style/saved_models/mosaic.pth"
    }

    url = style_urls.get(style.lower(), style_urls["default"])

    # Create the directory if it doesn't exist
    os.makedirs(os.path.dirname(model_path), exist_ok=True)

    # Download the model
    import aiohttp
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            if response.status == 200:
                with open(model_path, 'wb') as f:
                    while True:
                        chunk = await response.content.read(1024)
                        if not chunk:
                            break
                        f.write(chunk)
            else:
                raise Exception(f"Failed to download model: HTTP {response.status}")


def apply_opencv_fallback(image, style):
    """Apply OpenCV-based filters as a fallback if other methods fail"""
    # Convert to RGB if the image has an alpha channel
    if image.mode == 'RGBA':
        image = image.convert('RGB')

    img_array = np.array(image)

    # Apply different filters based on the requested style
    if style.lower() == "cartoon":
        gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
        gray = cv2.medianBlur(gray, 5)
        edges = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 9, 9)
        color = cv2.bilateralFilter(img_array, 9, 300, 300)
        cartoon = cv2.bitwise_and(color, color, mask=edges)
        return Image.fromarray(cartoon)

    elif style.lower() == "sketch":
        gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
        inv_gray = 255 - gray
        blurred = cv2.GaussianBlur(inv_gray, (21, 21), 0)
        inv_blurred = 255 - blurred
        sketch = cv2.divide(gray, inv_blurred, scale=256.0)
        return Image.fromarray(sketch)

    elif style.lower() == "oil painting" or style.lower() == "painting":
        img_array = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
        result = cv2.xphoto.oilPainting(img_array, 7, 1)
        result = cv2.cvtColor(result, cv2.COLOR_BGR2RGB)
        return Image.fromarray(result)

    else:
        # Default enhancement
        enhancer = ImageEnhance.Contrast(image)
        image = enhancer.enhance(1.2)
        enhancer = ImageEnhance.Sharpness(image)
        image = enhancer.enhance(1.5)
        return image
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