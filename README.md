# OPC User Workbench

企业 AI 员工与 OPC 中台的用户端演示源码。此仓库只包含用户工作台前端，不包含管理端代码、后台服务、生产环境密钥或生产数据库配置。

## 本地预览

在仓库根目录运行：

```powershell
python -m http.server 8000
```

然后打开 `http://127.0.0.1:8000/apps/user-web/`。

## 后端连接

公开版中的 `apps/user-web/supabase-client.js` 不包含生产 Supabase 地址或密钥。若要连接自己的演示环境，请使用独立 Supabase 项目，并先为所有表和 Storage bucket 配置并验证 RLS/访问策略，再填入项目 URL 和 publishable key。不要使用 `service_role`、数据库密码或其他服务端密钥。

该仓库当前是用户端源码展示，不包含独立后端，因此本地预览不代表已连接可用的演示数据库。

## 范围

管理端入口已从公开版移除；用户端依赖的演示头像和页面文件会随源码提供。仓库没有带入开发仓库的提交历史、管理后台、模拟资料目录或本地原型截图。