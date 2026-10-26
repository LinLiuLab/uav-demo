from typing import Generic, TypeVar

from pydantic import BaseModel, ConfigDict

T = TypeVar("T")


class APIResponse(BaseModel, Generic[T]):
    code: int = 0
    message: str = "成功"
    data: T


class RecordResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
