from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import UAV


def list_uavs(db: Session) -> list[UAV]:
    return list(db.scalars(select(UAV).order_by(UAV.id)))


def create_uav(db: Session) -> UAV:
    # TODO: 添加课程需要的业务规则。
    with db.begin():
        record = UAV(name="")
        db.add(record)
        db.flush()  # 先取得数据库生成的序号，再填写默认名称。
        record.name = f"无人机{record.id}"
    return record
