from pydantic import BaseModel


class DemoUser(BaseModel):
    id: int
    username: str
