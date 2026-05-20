from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

app = FastAPI()

app.mount("/assets", StaticFiles(directory="frontend/dist/assets"), name="assets")

@app.get("/")
def read_root():
    return FileResponse("frontend/dist/index.html")

@app.get("/{full_path:path}")
def catch_all(full_path: str):
    return FileResponse("frontend/dist/index.html")