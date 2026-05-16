import os
from dotenv import load_dotenv

# ── 🟢 الحل هنا: كنقولو ليه يرجع خطوة لوراء باش يلقى الـ .env الخارجي ──
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENV_PATH = os.path.join(BASE_DIR, ".env")

load_dotenv(dotenv_path=ENV_PATH)

# دابا هادشي غايقرأ الساروت الجديد 100% المضمونة
DATABASE_URL = os.getenv("DATABASE_URL")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))