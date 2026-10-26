"""演示身份占位。后续课程可在此实现真实认证和权限校验。"""

from app.schemas.user import DemoUser

DEFAULT_USER = DemoUser(id=1, username="demo")


def get_current_user() -> DemoUser:
    # TODO: 从请求中解析登录凭据，并校验真实用户。
    return DEFAULT_USER.model_copy()
