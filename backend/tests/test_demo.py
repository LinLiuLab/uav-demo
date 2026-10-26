"""接口测试示例：使用临时数据库，不读写本地 Demo 数据。"""

from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from app.main import create_app


def test_login_uses_default_account(tmp_path: Path):
    app = create_app(f"sqlite:///{tmp_path / 'login.db'}")
    with TestClient(app) as client:
        response = client.post("/api/login")
    assert response.status_code == 200
    assert response.json() == {
        "code": 0,
        "message": "成功",
        "data": {"id": 1, "username": "demo"},
    }


@pytest.mark.parametrize(
    ("resource", "name"),
    [("uavs", "无人机"), ("facilities", "设施"), ("inspections", "巡检")],
)
def test_create_list_and_persist(tmp_path: Path, resource: str, name: str):
    url = f"sqlite:///{tmp_path / 'records.db'}"
    with TestClient(create_app(url)) as client:
        assert client.get(f"/api/{resource}").json()["data"] == []
        for index in (1, 2):
            response = client.post(f"/api/{resource}")
            assert response.status_code == 201
            assert response.json()["data"] == {"id": index, "name": f"{name}{index}"}

        # 三张表分别编号，新建其他类型不受当前表序号影响。
        other = "facilities" if resource == "uavs" else "uavs"
        assert client.post(f"/api/{other}").json()["data"]["id"] == 1

    # 重新创建应用后仍能读取已有行，并继续递增。
    with TestClient(create_app(url)) as client:
        assert client.get(f"/api/{resource}").json()["data"] == [
            {"id": 1, "name": f"{name}1"},
            {"id": 2, "name": f"{name}2"},
        ]
        assert client.post(f"/api/{resource}").json()["data"]["id"] == 3
