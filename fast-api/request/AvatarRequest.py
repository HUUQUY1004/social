from pydantic import BaseModel


class AvatarRequest(BaseModel):
    base64: str
    style: str
