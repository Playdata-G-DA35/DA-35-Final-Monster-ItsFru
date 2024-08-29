# app/services/recognition_service.py
import httpx
from core.config import settings

async def analyze_fruit_image(image_path: str):
    async with httpx.AsyncClient() as client:
        with open(image_path, "rb") as image_file:
            response = await client.post(
                f"{settings.RECOGNITION_API_URL}/analyze-fruit",
                files={"image": image_file}
            )
        response.raise_for_status()
        return response.json() 