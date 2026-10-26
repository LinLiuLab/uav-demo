from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Facility


def list_facilities(db: Session) -> list[Facility]:
    return list(db.scalars(select(Facility).order_by(Facility.id)))


def create_facility(db: Session) -> Facility:
    # TODO: 添加课程需要的业务规则。
    with db.begin():
        record = Facility(name="")
        db.add(record)
        db.flush()
        record.name = f"设施{record.id}"
    return record
