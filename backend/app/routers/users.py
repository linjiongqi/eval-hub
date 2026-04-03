from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.user import User

router = APIRouter(prefix="/api/v1/users", tags=["users"])


@router.get("/")
async def list_users(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).order_by(User.created_at.desc()))
    users = result.scalars().all()
    return [
        {"id": str(u.id), "username": u.username, "email": u.email, "role": u.role}
        for u in users
    ]
