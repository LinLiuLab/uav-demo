from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas.common import APIResponse, RecordResponse
from app.services import inspection_service
from app.utils.database import get_db
from app.utils.dependencies import get_current_user

router = APIRouter(
    prefix="/inspections", tags=["巡检管理"], dependencies=[Depends(get_current_user)]
)


@router.get("", response_model=APIResponse[list[RecordResponse]])
def list_inspections(db: Session = Depends(get_db)):
    return APIResponse(data=inspection_service.list_inspections(db))


@router.post("", response_model=APIResponse[RecordResponse], status_code=201)
def create_inspection(db: Session = Depends(get_db)):
    return APIResponse(data=inspection_service.create_inspection(db))
