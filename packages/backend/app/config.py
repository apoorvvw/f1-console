import os

from dotenv import load_dotenv

load_dotenv()

PORT = int(os.getenv("PORT", 8000))
FASTF1_CACHE_DIR = os.getenv("FASTF1_CACHE_DIR", ".fastf1_cache")
