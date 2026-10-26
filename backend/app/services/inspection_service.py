from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Inspection


def list_inspections(db: Session) -> list[Inspection]:
    return list(db.scalars(select(Inspection).order_by(Inspection.id)))


def create_inspection(db: Session) -> Inspection:
    # TODO: 添加课程需要的业务规则。
    with db.begin():
        record = Inspection(name="")
        db.add(record)
        db.flush()
        record.name = f"巡检{record.id}"
    return record
