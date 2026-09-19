from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from pymongo import MongoClient
from passlib.context import CryptContext
from fastapi.middleware.cors import CORSMiddleware
import datetime

app = FastAPI()

# Cho phép Frontend gọi API (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Kết nối Database theo đúng yêu cầu
client = MongoClient("mongodb://localhost:27017/")
db = client.sofep_db

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Tạo cấu trúc dữ liệu theo đúng chuẩn Sprint 1
class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    role: str = "Customer"

class UserLogin(BaseModel):
    email: str
    password: str

class FashionPreferences(BaseModel):
    email: str
    height: float
    weight: float
    gender: str
    favoriteStyles: List[str]
    favoriteColors: List[str]

@app.post("/auth/register")
def register(user: UserRegister):
    if db.users.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email đã tồn tại")
    
    hashed_password = pwd_context.hash(user.password)
    new_user = {
        "name": user.name,
        "email": user.email,
        "password": hashed_password,
        "role": user.role,
        "createdAt": datetime.datetime.now()
    }
    db.users.insert_one(new_user) # Lưu vào collection users[cite: 1]
    return {"message": "Đăng ký thành công", "role": user.role}

@app.post("/auth/login")
def login(user: UserLogin):
    db_user = db.users.find_one({"email": user.email})
    if not db_user or not pwd_context.verify(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Email hoặc mật khẩu sai")
    
    return {"token": "fake-jwt-token", "email": db_user['email'], "role": db_user['role']}

@app.post("/profile/preferences")
def update_preferences(prefs: FashionPreferences):
    profile_data = prefs.dict()
    db.customer_profiles.update_one( # Lưu vào collection customer_profiles[cite: 1]
        {"email": prefs.email}, 
        {"$set": profile_data}, 
        upsert=True
    )
    return {"message": "Cập nhật Fashion Preferences thành công"}
