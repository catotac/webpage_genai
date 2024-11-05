# main.py
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy import create_engine
from pydantic import BaseModel
from database import AccessRequest

# FastAPI app initialization
app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection
SQLALCHEMY_DATABASE_URL = "sqlite:///access_requests.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic model for request validation
class AccessRequestCreate(BaseModel):
    name: str
    email: str
    userid: str

# API endpoint
@app.post("/api/access-requests")
def create_access_request(request: AccessRequestCreate, db: Session = Depends(get_db)):
    # Create access request
    db_request = AccessRequest(
        name=request.name,
        email=request.email,
        userid=request.userid
    )
    
    try:
        db.add(db_request)
        db.commit()
        return {
            "success": True,
            "message": "Access request submitted successfully"
        }
    except Exception as e:
        db.rollback()
        return {
            "success": False,
            "message": str(e)
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
