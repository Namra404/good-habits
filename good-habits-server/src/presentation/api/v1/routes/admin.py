from fastapi import Depends, APIRouter
from pydantic import BaseModel

from infra.repositories.postgres.factories import PostgresSessionFactory
from infra.repositories.postgres.user import PostgresUserRepository
from infra.repositories.postgres.validate import get_admin_user

router = APIRouter()


class UserResponse(BaseModel):
    tg_id: str
    username: str | None
    avatar_url: str | None
    role_id: str


@router.get("/", response_model=dict)
async def admin_panel(tg_id: str = Depends(get_admin_user)):
    return {"message": "Добро пожаловать в админ-панель!"}


@router.get("/users", response_model=list[UserResponse])
async def get_all_users(tg_id: str = Depends(get_admin_user)):
    async with PostgresSessionFactory().get_session() as session:
        user_repo = PostgresUserRepository(session)
        users = await user_repo.get_all()
        return [
            UserResponse(
                id=str(user.id),
                tg_id=str(user.tg_id),
                role_id=str(user.role_id),
                username=user.username,
                coin_balance=user.coin_balance,
                avatar_url=user.avatar_url
            ) for user in users
        ]


@router.get('/is-admin/{tg_id}')
async def is_user_admin(tg_id: str) -> bool:
    async with PostgresSessionFactory().get_session() as session:
        user_repo = PostgresUserRepository(session)
        return await user_repo.is_user_admin(tg_id=tg_id)
