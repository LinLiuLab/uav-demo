"""SQLite 连接与请求级 Session；数据库文件的位置不依赖启动目录。"""

import os
from collections.abc import Generator
from pathlib import Path

from fastapi import Request
from sqlalchemy import create_engine
from sqlalchemy.engine import Engine, make_url
from sqlalchemy.orm import DeclarativeBase, Session
from sqlalchemy.pool import StaticPool

BACKEND_ROOT = Path(__file__).resolve().parents[2]


class Base(DeclarativeBase):
    pass


def make_engine(database_url: str | None = None) -> Engine:
    url = make_url(
        database_url
        or os.environ.get("UAV_DEMO_DATABASE_URL")
        or f"sqlite:///{BACKEND_ROOT / 'data' / 'demo.db'}"
    )
    if url.get_backend_name() != "sqlite":
        raise ValueError("教学 Demo 仅配置 SQLite")

    if url.database and url.database != ":memory:":
        path = Path(url.database)
        if not path.is_absolute():
            path = BACKEND_ROOT / path
        path.parent.mkdir(parents=True, exist_ok=True)
        url = url.set(database=str(path))

    options = {"check_same_thread": False, "timeout": 10}
    if not url.database or url.database == ":memory:":
        return create_engine(url, connect_args=options, poolclass=StaticPool)
    return create_engine(url, connect_args=options)


def get_db(request: Request) -> Generator[Session, None, None]:
    with request.app.state.session_factory() as session:
        yield session
