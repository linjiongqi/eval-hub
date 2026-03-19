from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from config import settings
import os

app = FastAPI(title="EvalHub API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:5177", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve media files (mock NFS)
os.makedirs(settings.NFS_MOUNT_PATH, exist_ok=True)
app.mount("/static", StaticFiles(directory=settings.NFS_MOUNT_PATH), name="static")

@app.get("/health")
async def health():
    return {"status": "ok"}
