from fastapi import APIRouter

from app.schemas.common import APIResponse
from app.schemas.user import DemoUser
from app.utils.dependencies import get_current_user

router = APIRouter(tags=["登录"])


@router.post("/login", response_model=APIResponse[DemoUser])
def login() -> APIResponse[DemoUser]:
    # 演示登录：没有账号/密码请求参数，直接使用默认用户。
    return APIResponse(data=get_current_user())
