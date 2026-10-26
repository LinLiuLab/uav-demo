from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas.common import APIResponse, RecordResponse
from app.services import uav_service
from app.utils.database import get_db
from app.utils.dependencies import get_current_user

router = APIRouter(
    prefix="/uavs", tags=["无人机管理"], dependencies=[Depends(get_current_user)]
)


@router.get("", response_model=APIResponse[list[RecordResponse]])
def list_uavs(db: Session = Depends(get_db)):
    return APIResponse(data=uav_service.list_uavs(db))


@router.post("", response_model=APIResponse[RecordResponse], status_code=201)
def create_uav(db: Session = Depends(get_db)):
    return APIResponse(data=uav_service.create_uav(db))
