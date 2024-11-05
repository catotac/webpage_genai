# database.py
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class AccessRequest(Base):
    __tablename__ = "access_requests"
    
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False)
    userid = Column(String(50), nullable=False)

# Create SQLite database
engine = create_engine("sqlite:///access_requests.db", echo=True)
Base.metadata.create_all(engine)
