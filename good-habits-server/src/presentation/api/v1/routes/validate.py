from fastapi import APIRouter, HTTPException
from src.entity.init_data_model import InitDataModel  # Модель должна содержать поле initData
from src.infra.repositories.postgres.validate import check_telegram_auth, extract_tg_id

router = APIRouter()



@router.post("/validate")
async def validate_init_data(data: InitDataModel):
    if check_telegram_auth(data.initData):
        tg_id = extract_tg_id(data.initData)
        if tg_id is None:
            raise HTTPException(status_code=400, detail="tg_id не найден")
        return {"status": "ok", "tg_id": tg_id}
    raise HTTPException(status_code=400, detail="Invalid initData")