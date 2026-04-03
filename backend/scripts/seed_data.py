"""Seed demo data into the database."""

import asyncio

from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import async_session
from app.models.user import User


async def seed():
    async with async_session() as session:
        # Check if already seeded
        result = await session.execute(select(User).limit(1))
        if result.scalar_one_or_none():
            print("Data already seeded, skipping.")
            return

        users = [
            User(username="admin", email="admin@evalhub.dev", role="admin"),
            User(username="evaluator", email="evaluator@evalhub.dev", role="evaluator"),
            User(username="viewer", email="viewer@evalhub.dev", role="viewer"),
        ]
        session.add_all(users)
        await session.commit()
        print(f"Seeded {len(users)} users.")


if __name__ == "__main__":
    asyncio.run(seed())
