# OPC User Workbench

企业 AI 员工与 OPC 中台的用户端演示源码。仓库默认不连接作者的 Supabase、Edge Functions、模型服务或其他业务接口；需要后端的操作会提示“后端未配置”。

## 本地预览

在仓库根目录运行：

```powershell
python -m http.server 8000
```

然后打开 `http://127.0.0.1:8000/apps/user-web/`。

运行离线请求门禁测试：

```powershell
node --test apps/user-web/tests/offline-backend.test.mjs
```

## 接入自己的后端

修改 `apps/user-web/backend-config.js`，填写自己项目的 HTTPS Supabase URL 和 publishable key。客户端请求会限制在所配置的同一来源；空配置时请求直接被拒绝，不会调用 `fetch`。

只使用适合放在浏览器中的 publishable/anon key。不要填写 `service_role`、数据库密码或其他服务端密钥。配置自己的服务后，仍需为数据库表和 Storage 设置合适的 RLS、用户身份校验和资源限额。

## 范围

仓库只包含用户工作台页面、页面直接依赖的脚本和演示头像，不包含管理端代码、原仓库提交历史或生产环境连接配置。
