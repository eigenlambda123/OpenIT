from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import init_db
from app.scripts.prepopulate_database import populate_lucena_evacuation_centers
from app.db.database import get_session
from app.models.data import Evacuation

from app.routes.data import router as data_router
from app.routes.email import router as email_router


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)


@app.on_event("startup")
async def on_startup():
    init_db()
    # Get the first session from the generator
    db = next(get_session())
    try:
        # Check if data already exists
        existing = db.query(Evacuation).first()
        if not existing:
            populate_lucena_evacuation_centers(db)
    finally:
        db.close()

app.include_router(data_router)
app.include_router(email_router)