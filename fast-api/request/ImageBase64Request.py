from pydantic import BaseModel


class ImageBase64Request(BaseModel):
    image_base64: str
    prompt: str= ""