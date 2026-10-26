from sqlalchemy.orm import Mapped, mapped_column

from app.utils.database import Base


class UAV(Base):
    __tablename__ = "uavs"
    __table_args__ = {"sqlite_autoincrement": True}

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]


class Facility(Base):
    __tablename__ = "facilities"
    __table_args__ = {"sqlite_autoincrement": True}

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]


class Inspection(Base):
    __tablename__ = "inspections"
    __table_args__ = {"sqlite_autoincrement": True}

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
