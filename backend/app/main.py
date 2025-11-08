from fastapi import FastAPI
from app.routes.data import router

app = FastAPI()

app.include_router(router)