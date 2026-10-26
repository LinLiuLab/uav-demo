from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas.common import APIResponse, RecordResponse
from app.services import facility_service
from app.utils.database import get_db
from app.utils.dependencies import get_current_user

router = APIRouter(
    prefix="/facilities", tags=["设施管理"], dependencies=[Depends(get_current_user)]
)


@router.get("", response_model=APIResponse[list[RecordResponse]])
def list_facilities(db: Session = Depends(get_db)):
    return APIResponse(data=facility_service.list_facilities(db))


@router.post("", response_model=APIResponse[RecordResponse], status_code=201)
def create_facility(db: Session = Depends(get_db)):
    return APIResponse(data=facility_service.create_facility(db))
