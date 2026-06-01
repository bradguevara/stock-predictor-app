from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from backend.stock import router as stocks_router
from backend.prediction import router as predict_router

app = FastAPI()

app.include_router(stocks_router)
app.include_router(predict_router)

app.mount("/assets", StaticFiles(directory="frontend/dist/assets"), name="assets")

@app.get("/")
def read_root():
    return FileResponse("frontend/dist/index.html")

@app.get("/{full_path:path}")
def catch_all(full_path: str):
    return FileResponse("frontend/dist/index.html")