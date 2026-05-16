# xplora_backend/app/utils.py
import os
from datetime         import datetime, timedelta, timezone
from fastapi          import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose             import JWTError, jwt
from passlib.context  import CryptContext
from sqlalchemy.orm   import Session
from app.database     import get_db
from app.models       import User

SECRET_KEY    = os.getenv("SECRET_KEY", "smarttrip-dev-secret-change-in-prod")
ALGORITHM     = "HS256"
ACCESS_EXPIRE = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")
bearer  = HTTPBearer()


def hash_password(plain: str) -> str:
    return pwd_ctx.hash(plain)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_ctx.verify(plain, hashed)

def create_access_token(data: dict) -> str:
    payload = {**data, "exp": datetime.now(timezone.utc) + timedelta(minutes=ACCESS_EXPIRE)}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(
    creds: HTTPAuthorizationCredentials = Depends(bearer),
    db:    Session                       = Depends(get_db),
) -> User:
    exc = HTTPException(
        status_code = status.HTTP_401_UNAUTHORIZED,
        detail      = "Invalid or expired token.",
        headers     = {"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(creds.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        uid = payload.get("sub")
        if uid is None: raise exc
    except JWTError:
        raise exc
    user = db.query(User).filter(User.id == int(uid)).first()
    if not user: raise exc
    return user