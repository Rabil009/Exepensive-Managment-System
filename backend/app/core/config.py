import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Payout Finance API"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    EMPLOYEE_DEMO_API_ENABLED: bool = os.getenv("EMPLOYEE_DEMO_API_ENABLED", "false").lower() == "true"
    
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "https://gzjucqkeddwoteugddik.supabase.co")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "sb_publishable_mAVZBRpp9SFpRtUB_qegig_SsgvbUCr")
    SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

settings = Settings()

