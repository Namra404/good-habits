from typing import Annotated
from fastapi import Depends, APIRouter, HTTPException
from uuid import UUID

from src.entity.comics import Comic
from src.infra.dependencies.comics import get_comics_repository
from src.infra.repositories.postgres.comics import PostgresComicsRepository

router = APIRouter()


@router.get("/{comic_id}", response_model=Comic)
async def get_comic(
        comic_id: UUID,
        repo: Annotated[PostgresComicsRepository, Depends(get_comics_repository)]
):
    comic = await repo.get_comic_by_id(comic_id)
    if not comic:
        raise HTTPException(status_code=404, detail="Comic not found")
    return comic


@router.post("/", response_model=UUID)
async def create_comic(
        comic: Comic,
        repo: Annotated[PostgresComicsRepository, Depends(get_comics_repository)]
):
    return await repo.create_comic(comic)


@router.put("/{comic_id}", response_model=bool)
async def update_comic(
        comic_id: UUID,
        comic_data: dict,
        repo: Annotated[PostgresComicsRepository, Depends(get_comics_repository)]
):
    return await repo.update_comic(comic_id, comic_data)


@router.delete("/{comic_id}", response_model=bool)
async def delete_comic(
        comic_id: UUID,
        repo: Annotated[PostgresComicsRepository, Depends(get_comics_repository)]
):
    return await repo.delete_comic(comic_id)
