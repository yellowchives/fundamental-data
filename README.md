# fundamental-data

同花顺宏观财经数据发布页面（Vue 3 + Vite 版）。

从单文件 `index.html` 重构为 Vue 3 SFC 项目，便于维护。

## 功能

- 顶部品牌区 + 自动刷新倒计时（60 秒一轮）
- 日期切换（前一天 / 后一天 / 今天）
- 仅看重要数据（权重 ≥ 2）
- 板块筛选
- 数据表格：时间 / 国家 / 指标 / 板块 / 前值 / 预期值 / 公布值 / 重要度
- 点击行查看该指标的历史走势（预测值 vs 公布值双柱状图）

## 技术栈

- Vue 3（`<script setup>` 组合式 API）
- Vite 6
- 原生 Canvas 绘图（无图表库依赖）

## 目录结构

```
fundamental-data/
├── index.html              # Vite 入口
├── package.json
├── vite.config.js
└── src/
    ├── main.js             # 应用入口
    ├── App.vue             # 根组件，统筹状态与事件
    ├── style.css           # 全局样式 / CSS 变量
    ├── api/
    │   └── calendar.js     # 同花顺接口封装
    ├── utils/
    │   └── format.js       # 时间 / 数值 / XSS 转义等工具
    ├── composables/
    │   └── useCountdown.js # 倒计时组合式函数
    └── components/
        ├── TopBar.vue       # 顶栏：品牌 + 倒计时圆环 + 刷新按钮
        ├── ControlBar.vue   # 日期切换 + 重要筛选
        ├── PlateFilter.vue  # 板块胶囊筛选
        ├── DataTable.vue    # 数据表格
        └── ChartModal.vue   # 走势图弹窗
```

## 开发

```bash
npm install
npm run dev      # 本地开发，默认 http://localhost:5173
npm run build    # 生产构建，产物输出到 dist/
npm run preview  # 预览构建产物
```

## 说明

- 数据源：`https://ftapi.10jqka.com.cn/futgwapi/api/news/calendar/v2/`
- 接口需要 `User-Agent` 与 `Referer` 头，浏览器 `fetch` 通常不允许自定义这两个头，
  开发时若遇到 CORS / 头限制问题，可加一层本地代理（例如在 `vite.config.js` 中配置 `server.proxy`）。
- 原始 `index.html` 单文件版本已被替换，逻辑 1:1 迁移，行为一致。
