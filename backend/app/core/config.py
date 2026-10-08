import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Expense Management System - Manager API"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "https://gzjucqkeddwoteugddik.supabase.co")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "sb_publishable_mAVZBRpp9SFpRtUB_qegig_SsgvbUCr")
    
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "*",
    ]

settings = Settings()
