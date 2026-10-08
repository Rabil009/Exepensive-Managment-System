from supabase import create_client, Client
from app.core.config import settings

def get_supabase_client() -> Client:
    """Returns a Supabase client configured with project credentials."""
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

def get_supabase_admin_client() -> Client:
    """Returns a Supabase admin client using the service role key if available."""
    key = settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_KEY
    return create_client(settings.SUPABASE_URL, key)

supabase = get_supabase_client()

