# xplora_backend/app/routers/auth.py
import logging
from fastapi        import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database   import get_db
from app.models     import User
from app.schemas    import UserCreate, UserLogin, Token, UserOut
from app.utils      import hash_password, verify_password, create_access_token

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/register", response_model=Token, status_code=201)
def register(body: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == body.email.lower().strip()).first():
        raise HTTPException(409, "An account with this email already exists.")

    user = User(
        name      = body.name.strip(),
        email     = body.email.lower().strip(),
        hashed_pw = hash_password(body.password),
    )
    db.add(user); db.commit(); db.refresh(user)
    logger.info(f"Registered: {user.email}")
    return Token(
        access_token = create_access_token({"sub": str(user.id)}),
        user         = UserOut.model_validate(user),
    )


@router.post("/login", response_model=Token)
def login(body: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email.lower().strip()).first()
    if not user or not verify_password(body.password, user.hashed_pw):
        raise HTTPException(401, "Invalid email or password.")

    logger.info(f"Login: {user.email}")
    return Token(
        access_token = create_access_token({"sub": str(user.id)}),
        user         = UserOut.model_validate(user),
    )