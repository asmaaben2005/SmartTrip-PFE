# xplora_backend/app/models.py
import uuid as uuid_lib
from datetime       import datetime
from sqlalchemy     import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database   import Base


class User(Base):
    __tablename__ = "users"

    id         = Column(Integer, primary_key=True, index=True)
    name       = Column(String(80),  nullable=False)
    email      = Column(String(120), unique=True, index=True, nullable=False)
    hashed_pw  = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    trips = relationship("Trip", back_populates="owner", cascade="all, delete-orphan")


class Trip(Base):
    __tablename__ = "trips"

    id            = Column(Integer, primary_key=True, index=True)
    uuid          = Column(String(36), unique=True, index=True,
                           default=lambda: str(uuid_lib.uuid4()))
    user_id       = Column(Integer, ForeignKey("users.id"), nullable=False)
    destination   = Column(String(100), nullable=False)
    from_location = Column(String(100), default="")
    plan          = Column(JSON, nullable=False)
    created_at    = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="trips")