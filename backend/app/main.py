"""应用入口。运行：uvicorn app.main:app --reload --port 12001"""

import logging
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import sessionmaker

from app.api import auth, facilities, inspections, uavs
from app.utils.database import Base, make_engine

logger = logging.getLogger(__name__)


def create_app(database_url: str | None = None) -> FastAPI:
    engine = make_engine(database_url)

    @asynccontextmanager
    async def lifespan(_app: FastAPI) -> AsyncIterator[None]:
        # 仅教学 Demo 使用 create_all；扩展模型时可引入 Alembic 迁移。
        Base.metadata.create_all(engine)
        try:
            yield
        finally:
            engine.dispose()

    app = FastAPI(title="UAV 教学 Demo", version="0.1.0", lifespan=lifespan)
    app.state.session_factory = sessionmaker(engine, expire_on_commit=False)

    @app.exception_handler(SQLAlchemyError)
    async def database_error(_request: Request, _exc: SQLAlchemyError):
        logger.exception("数据库操作失败")
        return JSONResponse(
            status_code=500,
            content={"code": 1001, "message": "数据操作失败，请重试", "data": None},
        )

    for router in (auth.router, uavs.router, facilities.router, inspections.router):
        app.include_router(router, prefix="/api")

    return app


app = create_app()
