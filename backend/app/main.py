from fastapi import FastAPI
from app.routes.data import router
from app.db.database import init_db

app = FastAPI()

@app.on_event("startup")
def on_startup():
    init_db()

app.include_router(router)