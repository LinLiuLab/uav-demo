# UAV 软件工程课程 Demo

一个最小可运行的前后端代码示例，使用 FastAPI、SQLAlchemy、SQLite、Next.js 和 Mantine。

## Demo 包含内容

- 登录页预填只读账号 `demo`；点击登录调用后端，后端直接返回默认用户。
- 登录后左侧只有无人机管理、设施管理、巡检管理，右上角只有退出登录。
- 每页只有序号、名称和新建按钮；点击新建立即产生默认数据行。
- 三类记录分别从 1 编号，数据保存到 SQLite，刷新和重启后保留。
- 前后端各保留测试目录和少量可运行示例。

本 Demo 没有真实身份认证。默认用户是后端代码中的常量；前端 localStorage 只用于演示登录页面跳转，后端接口可以直接访问。`get_current_user()` 是后续实现认证的位置。

## 启动后端

要求 Python 3.12+。终端一：

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements-dev.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 12001
```

Windows 可使用 `.venv\Scripts\activate` 激活虚拟环境。

- API 文档：<http://localhost:12001/docs>
- 默认数据库：`backend/data/demo.db`，首次启动自动创建三张表。
- `UAV_DEMO_DATABASE_URL` 可覆盖地址；相对 SQLite 文件路径始终相对于 `backend/`。
- 本 Demo 用 `create_all` 初始化表；它不会修改已有表结构。后续更改数据模型时可引入 Alembic。

## 启动前端

要求 Node.js 20.9+ 和 npm。终端二：

```bash
cd frontend
npm ci
npm run dev
```

打开 <http://localhost:3001>，点击登录即可。默认账号固定为 `demo`，不需要密码。

浏览器始终请求相对地址 `/api`，由 Next.js 转发到后端 `http://127.0.0.1:12001`，不需要配置跨域。如需更改后端地址，复制 `frontend/.env.example` 为 `frontend/.env.local`，修改 `BACKEND_URL`，然后重新启动前端。

生产构建演示可使用 `npm run build`，然后在自己的终端运行 `npm start`。

## 目录与调用过程

```text
backend/
  app/
    api/                 HTTP 路由
    schemas/             请求/响应数据结构
    services/            默认数据创建、列表查询
    models/              三张独立业务表
    utils/               SQLite Session、默认用户依赖
    main.py              应用入口、路由注册
  tests/                 后端接口测试示例
frontend/
  app/                   登录、布局、三个管理页
  components/            Provider、共享列表组件
  lib/api/               HTTP 请求和各模块 API
  lib/session.ts         演示登录状态
  schema/                Zod 响应校验与 TypeScript 类型
  tests/                 前端组件测试示例
```

以无人机新建为例：

```text
app/dashboard/uavs/page.tsx
  → components/ManagementList.tsx 的新建按钮
  → lib/api/uavs.ts
  → POST /api/uavs
  → backend/app/api/uavs.py
  → services/uav_service.py
  → models/records.py → SQLite
  → 返回已创建记录 → 刷新服务端列表 → 渲染数据行
```

没有组织、复杂权限、检查项、文件上传、地图、航线、地面站、AI 或进阶方向实现。三个业务模块没有关联关系。框架正常解析请求和处理数据库事务，账号校验和业务规则留作课程扩展。

## 接口约定

| 方法 | 路径 | 用途 |
| --- | --- | --- |
| POST | `/api/login` | 返回默认用户，不接受账号密码参数 |
| GET | `/api/uavs` | 按序号查询无人机 |
| POST | `/api/uavs` | 新建默认无人机 |
| GET | `/api/facilities` | 按序号查询设施 |
| POST | `/api/facilities` | 新建默认设施 |
| GET | `/api/inspections` | 按序号查询巡检 |
| POST | `/api/inspections` | 新建默认巡检 |

所有 POST 均无须请求体。成功返回统一格式；创建成功使用 HTTP 201，其余成功使用 HTTP 200：

```json
{"code": 0, "message": "成功", "data": {"id": 1, "name": "无人机1"}}
```

列表的 `data` 为数组。登录的 `data` 为 `{"id": 1, "username": "demo"}`。数据库错误返回 HTTP 500 和 `{"code": 1001, "message": "数据操作失败，请重试", "data": null}`。

退出登录仅清除前端演示状态和查询缓存，不删除数据库记录。

## 测试与检查

```bash
# 在 backend/，使用已安装 requirements-dev.txt 的虚拟环境
python -m pytest
ruff check app tests

# 在 frontend/
npm test
npm run lint
npm run typecheck
npm run build
```

后端测试使用临时数据库，覆盖默认登录、三个模块新建/编号以及重启后数据保留。前端测试覆盖新建后列表同步、新建失败时的错误反馈，不需要启动后端。

## 适合从哪里扩展

给无人机新增字段时，从 `models/records.py` 与 `schemas/` 开始，再补 Service、API 和前端表单。真实登录可从 `utils/dependencies.py` 与 `api/auth.py` 开始。接口和业务规则保持在对应层，测试放入两端现有的 `tests/`。
