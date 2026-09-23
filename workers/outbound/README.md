# EverKnitting outbound MVP

复用现有 Next.js / Cloudflare Pages 和 Clerk，新增一个 Worker 与独立 D1。现有 Prisma CRM、网站询盘和 Resend 流程保留；旧 CRM 数据不会自动迁移到 outbound。

## 流程

`Pages 审核后台 → Worker → D1 任务 → 本机 Codex 研究 → D1 草稿 → 人工逐封审核 → Cron → Cloudflare Email Service`

`Email Routing → Worker email() → D1 回复/退订 → 停止后续邮件`

本机 Codex 使用已有 CLI 登录，不需要 OpenAI API key。云端 Cron 不运行 GPT；电脑关闭、未登录或本机 runner 未运行时，研究任务留在队列。已经批准的邮件仍可由云端定时发送。

## 部署

1. 在本目录 `npm ci`，使用 Wrangler 登录目标账户。
2. 新账户需先创建 D1，再修改 `wrangler.jsonc` 的账户和数据库 ID；本项目已有配置。
3. `npm run migrate:remote`，`npm run deploy`。
4. Worker secrets：分别设置至少 32 字符的随机 `ADMIN_TOKEN` 与 `AGENT_TOKEN`。前者仅用于 Pages 后端；后者仅允许本机领取和提交研究任务，不能审核或发送。
5. Pages production 添加 Service Binding `OUTBOUND` → `everknitting-outbound`；加密变量 `OUTBOUND_ADMIN_TOKEN` 与 Worker ADMIN_TOKEN 一致；`OUTBOUND_ADMIN_USER_IDS` 是逗号分隔的 Clerk User ID。不要把任何 token 放入 NEXT_PUBLIC 变量或 git。
6. 保留现有 Clerk 配置。访问 `/dashboard/outbound`，登录后如未授权，错误信息会显示该登录自己的 `user_...` ID。由站点所有者核对后写入 allowlist；空名单拒绝所有管理员。不要允许首次登录自动成为管理员。
7. Pages 按现有 `npx @cloudflare/next-on-pages@1` 构建，输出 `.vercel/output/static`。根目录 build 会生成 Prisma 无引擎客户端供原有 Accelerate/edge 页面使用。
8. 启用 Email Sending 的 `everknitting.com`，发信 `hello@everknitting.com`。为 `reply.everknitting.com` 启用 Email Routing，将 `replies@reply.everknitting.com` 路由到此 Worker。根域已有 Zoho MX，不能用 Routing 根域向导覆盖它。
9. 确认 `PUBLIC_BASE_URL` 对应已发布、可公开访问的退订端点。域名仍在验证或 Pages API 未发布时，不得打开 SEND_ENABLED。

当前默认 `SEND_ENABLED=false`、`DISCOVERY_ENABLED=false`，每日发送/研究上限各 10；新 campaign 默认暂停。修改 Wrangler 配置并重新部署才能打开全局开关。后台仍需启用 campaign，并逐封批准邮件。

## 本机研究

安装并登录官方 Codex CLI。创建保存在仓库外、仅本机用户可读的 JSON 配置：

```json
{"worker_url":"https://YOUR-WORKER.workers.dev","agent_token":"YOUR_AGENT_TOKEN"}
```

PowerShell 单次运行：

```powershell
$env:OUTBOUND_LOCAL_CONFIG = 'C:\secure\outbound-local.json'
node .\scripts\local-agent.mjs
```

无待办任务会直接退出；有任务则调用 `codex --search ... exec --sandbox read-only`，使用默认模型和当前登录，消费现有 Codex 配额。每次最多处理一个任务。输出必须符合 JSON schema；证据链接、评分理由和精确草稿均进入审核后台。第三方网页内容不得作为工具指令执行。

如需电脑登录期间每 15 分钟运行，可手动运行 `scripts/register-local-task.ps1 -ConfigPath C:\secure\outbound-local.json`；它创建 Windows 计划任务，不保存 Windows 密码。尚未注册计划任务时没有本机后台自动研究。删除该计划任务即可停止本机定时研究。

## 操作

1. 创建 campaign：写清目标地区、买家类型、排除条件及经过核实的卖方资料。不要把未核实的认证、MOQ、产能、客户名或价格写入。
2. 启用 campaign 后提交 discovery；也可手工添加官网及来源。Codex 每次最多发现 5 家，D1 按域名和邮箱全局去重。
3. 审核研究证据、业务适配性和公司官网公开联系方式。建议邮箱只是候选；禁止猜测邮箱。手动确认准确收件人。
4. 编辑邮件后保存；编辑会增加 revision 并撤销旧批准。勾选已核实联系人和邮件内容，再批准该具体版本与发送时间。
5. Cron 每 15 分钟检查一次，每轮最多发送 5 封。发送前再次检查 campaign、lead、退订和每日预算。
6. 首封发出 4 天后排研究任务生成 follow-up 1；其发出 7 天后生成 follow-up 2。每封 follow-up 都要重新人工批准，最多两封。
7. 任何匹配发件人的回复都停止序列。明确退订同时加入持久 suppression；退订 GET 只显示确认页，POST 才生效，支持一键退订头。已退订邮箱不可通过重新导入恢复。
8. provider 结果不明进入 uncertain，不自动重试。人工核对 Cloudflare 投递记录后，将其确认 sent 或 not_sent；后者恢复 draft，仍须重新批准。

## 验证与边界

`npm run check`、`npm test`、`npx wrangler deploy --dry-run`。测试使用 SQLite 执行真实 D1 migration，模拟邮件 provider，覆盖审核版本、并发抢占、预算、退订、回复、重试不确定性、定时跟进和本机 agent 权限。

MVP 后台只显示最近 200 leads / 200 messages、100 replies、50 jobs；不是完整历史导出工具。回复按 envelope sender 与 lead email 匹配，换地址的回复可能进入未匹配列表，需要人工处理；不存附件、不渲染邮件 HTML，不自动答复。无投递 webhook 对账，异步退信需要人工标记 bounced。研究任务最多尝试两次；过期 lease 30 分钟后回收。不存在自动批准或模型发信权限。

目前仍使用原有已弃用的 next-on-pages 适配器。依赖审计仍有遗留告警，本改动不是全站安全升级；后续应单独迁移受支持的 Next.js / Cloudflare 适配器组合，避免将不兼容大版本混入 outbound MVP。

真实上线验收还需：Pages 发布成功、管理员 allowlist、退订域名可用，以及由所有者指定测试收件人并审核一封测试邮件，验证送达、回复与停止跟进。单元测试和 health 200 不代表真实投递验收完成。
