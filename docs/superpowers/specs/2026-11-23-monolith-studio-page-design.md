# MONOLITH — 虚构高级设计工作室官网 · 设计稿

- 日期：2026-11-23
- 状态：已批准（2026-11-23）
- 项目：`autumn-demo`（Vue 3.6 RC + Vite 8 + TypeScript）
- 目标产物：一个单页滚动叙事的高级设计工作室官网，使用 Inspira UI 组件，黑白配色、克制动效

---

## 1. 意图

在现有 Vue 项目里做一页「拿得出手」的作品：它要像一个真实的高级独立设计工作室官网，而不是组件效果拼盘。用户看到的第一反应应该是「这个站很有质感」，然后才注意到动效。

Inspira UI 负责效果的上限，设计系统负责下限：黑白、留白、排版、节奏。

## 2. 目标 / 非目标 / 反目标

**目标**
- 单页滚动，打开即完整呈现一个虚构工作室的叙事：首屏 → 理念 → 作品 → 能力 → 数字 → 宣言 → 联系。
- 极简黑白视觉，靠字号、留白、细线和高对比建立高级感。
- 动效恰到好处：每个区块最多一个记忆点，服务于内容节奏。
- 真实可运行、可响应式访问，`npm run dev` 与 `npm run build` 通过。
- 完整体验 Inspira UI 的复制式组件工作流。

**非目标**
- 不做多页路由、作品详情页、CMS、后端表单。
- 不做真实摄影图片，封面全部为本地生成的抽象 SVG 视觉。
- 不做明暗主题切换（页面本身交替使用黑 / 白区块）。
- 不做自定义光标、音效、页面转场、i18n 切换。
- 不接入分析、部署、SSR。

**反目标**
- 彩虹渐变、霓虹、彩色光效。
- 满屏飞入的组件墙、互相抢戏的动画。
- 通用 SaaS 落地页感、模板感。
- 滚动劫持、隐藏内容的动画。
- 大量玻璃拟态与圆角胶囊堆叠。

## 3. 约束

- 技术栈既定：Vue 3.6 RC（3.6.0-rc.16）+ Vite 8 + TypeScript，`@` → `src` 别名已配置。
- Inspira UI 是注册表模式：组件源码复制进项目（CLI 或手动），无 npm 运行时包。
- 依赖需要 Tailwind CSS v4；`motion-v 2.13`、`@vueuse/core 15` 已确认兼容 Vue 3.6 RC。
- 视觉上只允许黑、白、灰与透明度，不得出现任何色相（含高饱和渐变）。
- 内网/离线场景下也应基本可用：不依赖外部图片与视频；字体允许走 Google Fonts 并有回退栈。
- 桌面优先，移动端必须可用、无横向滚动。

## 4. 方案

| 方案 | 内容 | 取舍 |
| --- | --- | --- |
| **A（已选）** | 单页滚动叙事工作室站 | 组件浓度、叙事节奏、构建量最平衡；最接近「高级官网」 |
| B | 多路由站（首页/作品详情/关于） | 更真实，但组件效果被摊薄，构建量显著增加 |
| C | 组件墙演示页 | 展示最全，但最不像高级官网，与调性相悖，排除 |

用户选择 A。组件获取方式（CLI 自动添加 vs 手动复制源码）属于构建细节，由构建者决定；无论哪种，最终源码都落在 `src/components/inspira/`，只取用到的组件。

## 5. 视觉系统

### 5.1 色彩

| Token | 值 | 用途 |
| --- | --- | --- |
| `--ink` | `#0A0A09` | 黑色区块背景、浅色区块文字 |
| `--paper` | `#F2F0EA` | 米白区块背景、深色区块文字 |
| `--ash` | `#8B8A83` | 次级文字、标注 |
| `--line-dark` | `rgba(242,240,234,0.16)` | 黑底细线 |
| `--line-light` | `rgba(10,10,9,0.14)` | 白底细线 |
| 反白强调 | `#F2F0EA` / `#0A0A09` | 只做明暗反转，不加色 |

- 页面不出现除以上颜色外的实色。透明度和灰度阶用于层次。
- 区块节奏：黑（Hero）→ 白（理念 + 作品）→ 黑（能力 + 数字）→ 白（宣言 + 联系）→ 黑（页脚）。

### 5.2 字体

- 拉丁无衬线（主）：**Inter Tight**，400 / 500 / 600，用于英文标题、正文、UI。
- 拉丁衬线（强调）：**Instrument Serif**，常以斜体出现，用于首屏关键词、宣言中的对照词。
- 拉丁等宽（标注）：**IBM Plex Mono** 400，用于小标签、序号、时间、坐标。
- 中文：**系统无衬线**，不加载中文 webfont。字体栈：
  `"PingFang SC", "Hiragino Sans GB", "Source Han Sans SC", "Noto Sans CJK SC", "Microsoft YaHei", sans-serif`。
  巨型中文使用 Light（300）字重 + 略收紧字距（`-0.02em`），依靠字号、粗细对比和留白建立高级感；平台间差异视为可接受的降级。
- 字体族总数：3 个拉丁 webfont + 中文系统栈，不新增中文衬线。
- 拉丁字体通过 `@fontsource` 自托管（Inter Tight 400/500/600、Instrument Serif 400/400 italic、IBM Plex Mono 400），构建时打包；中文走系统栈，不产生字体网络请求。
- 字号策略：
  - Hero：`clamp(3.25rem, 11vw, 10.5rem)`，行高 `0.92`，字距 `-0.04em`（中文行按中文字距策略单独处理）。
  - 区块标题：`clamp(2.25rem, 5vw, 4.5rem)`。
  - 标签：11–12px，全大写，字距 `0.18em`，等宽。
  - 正文：15–17px，行高 1.7；中文正文行高 1.8。

### 5.3 网格与节奏

- 12 列网格，最大内容宽 1440px，左右留白 `clamp(20px, 4vw, 64px)`。
- 区块垂直内边距 `clamp(6rem, 12vw, 11rem)`；区块之间用 1px 细线分隔，不使用阴影卡片。
- 章节序号贯穿全站：`01 / 关于`、`02 / 精选作品`、`03 / 能力`、`04 / 理念`、`05 / 联系`，使用等宽字体，与中文标题并排。Hero、数字区、客户跑马灯与页脚不编号；导航也不显示序号——序号只标记叙事章节。

### 5.4 材质与细节

- 全站叠一层极轻 SVG grain（透明度 3%–4%，`pointer-events: none`），增加「印刷感」。
- 所有图像框、卡片使用 1px 细线 + 0 圆角（或极小 2px 圆角）。
- 按钮为主流细边框文字按钮 + 一处 Shimmer 按钮作为主要 CTA。
- 图片封面保持纯灰阶，hover 只做轻微亮度与缩放变化，不还原彩色。

### 5.5 动效语言

原则：**少动、慢动、只动一次**。页面同一视口内最多一个环境动效。

| 场景 | 时长 / 缓动 | 说明 |
| --- | --- | --- |
| 首屏进场 | 900ms，`cubic-bezier(0.16,1,0.3,1)`，逐行 90ms 错峰 | y 32px → 0，opacity 0 → 1，轻微 blur 10px → 0 |
| 滚动进入 | 700ms，`cubic-bezier(0.16,1,0.3,1)` | y 24px → 0 + opacity，只触发一次，阈值 15% |
| 导航浮出 | 400ms | 滚动 24px 后毛玻璃 + 细线出现 |
| 作品卡 hover | 500ms | 封面 scale 1.03、边框流转光、标题下划线扫过 |
| 数字统计 | 1.6s | NumberTicker，进入视口触发一次 |
| 理念跑马灯 | 基础 70s/循环 | Marquee 慢速漂移；hover 暂停；reduced-motion 时静态 |
| 联系区旋转环 | 14s/圈 | SpinningText，线性 |
| 首屏网格/光斑 | 网格缓慢漂移 60s；光斑插值 0.15 | 光斑只在精确指针设备上启用 |

- `prefers-reduced-motion: reduce`：关闭所有跑马灯、旋转、漂移与光斑；进场动画退化为淡入，不位移。
- 所有动画不得延迟内容可读性；内容在无动画时也完整。

## 6. 页面结构

单页，`/` 路由。自上而下：

```
┌ 固定导航：MONOLITH®   |   作品 工作室 联系   |   SHANGHAI 14:32   开始项目 ↗
│
├ 01 HERO（黑，100svh）
│    网格背景 + 鼠标光斑
│    WE SHAPE / quiet,（衬线斜体）/ DELIBERATE / digital.（衬线斜体）
│    中文副标题 + 两个 CTA
│    底部：SCROLL ↓ · SHANGHAI / BERLIN · 31.2304°N, 121.4737°E
│
├ 02 关于（白）
│    标签 01 / 关于
│    巨型宣言：少，不是更少。是刚刚好。
│    两段短文 + 英文对照句
│
├ 03 精选作品（白）
│    标签 02 / 精选作品   右侧：2023—2026
│    错落网格：5 个虚构项目，1 大 + 2 中 + 2 宽
│    每张卡：序号 / 中英标题 / 门类 / 年份 / 抽象 SVG 封面
│
├ SELECTED CLIENTS 跑马灯（白，细线上下）
│
├ 03 能力（黑）
│    左：WHAT WE DO / 我们能做什么（粘性标题）
│    右：4 行服务，hover 时行底色微亮、箭头出现
│
├ 数字（黑，细线上下，不编号）
│    48 项目 / 12 奖项 / 07 年 / 09 国家（NumberTicker）
│
├ 04 理念（白）
│    标签 04 / 理念
│    巨型描边跑马灯：FORM FOLLOWS FEELING — 形式追随感受 —
│    下方一句：如果一件作品需要解释，它还不够安静。
│
├ 05 联系（白）
│    标签 05 / 联系
│    LET'S MAKE / SOMETHING / quiet.（衬线斜体）
│    hello@monolith.studio（巨型链接，hover 字符扰动）
│    2027 档期开放 · Shimmer 按钮「开始一个项目」
│    右下角旋转徽章：OPEN FOR COMMISSIONS · 2027 · SHANGHAI — BERLIN
│
└ 页脚（黑）
     巨型 MONOLITH 字标（底部裁切）
     SITEMAP / SOCIAL / CONTACT 三栏
     © 2026 MONOLITH STUDIO · MADE WITH RESTRAINT · 返回顶部 ↑
```

### 6.1 导航

- 固定顶部，初始透明；滚动 24px 后出现毛玻璃与底部细线。
- 左：`MONOLITH®` 文字标（`®` 上标）。
- 中：作品 / 关于 / 联系 三个锚点（不带序号，保持导航干净）。
- 右：上海本地时间（每秒更新）+ 「开始项目 ↗」。移动端隐藏中部链接与时间，保留字标与 CTA。
- 锚点滚动使用原生 `scroll-behavior: smooth`（reduced-motion 时关闭）。

### 6.2 首屏 Hero

- 背景：Inspira `InteractiveGridPattern`，遮罩为 radial 渐隐，线条使用 `--line-dark`。
- 鼠标光斑：径向渐变跟随鼠标，`mix-blend-mode: screen` 极低透明度，仅桌面启用。
- 主标题四行，逐行错峰进场；`quiet,` 与 `digital.` 使用 Instrument Serif 斜体，形成粗黑无衬线与精致衬线的对比。
- 中文副标题：`独石是一间独立设计工作室。我们以克制的形式，为品牌、产品与空间塑造安静而笃定的数字体验。`
- CTA：`查看作品`（ShimmerButton，白底黑字）+ `开始一个项目`（细线文字按钮）。
- 底部细线行：滚动提示、城市、坐标。

### 6.3 关于

- 等宽标签 `01 / 关于`。
- 宣言使用 `TextScrollReveal`，滚动时逐词点亮：`少，不是更少。是刚刚好。`
- 两段正文（见内容清单）+ 英文对照：`We remove until only the essential remains. What is left should feel inevitable.`

### 6.4 精选作品

- 布局（12 列）：
  - 01 BLANK：`col-span-7`，封面 4:5。
  - 02 NORTH/34：`col-span-5`，顶部偏移，封面 3:4。
  - 03 HANDLE：`col-span-5`，封面 1:1。
  - 04 SLOW PRESS：`col-span-7`，封面 4:3。
  - 05 ATLAS：`col-span-12`，横长封面 21:9。
- 每张卡：1px 边框；封面为本地抽象 SVG；hover 时封面 scale 1.03、`GlowingEffect` 边框光沿边缘流动、`VIEW CASE ↗` 淡入。
- 封面 SVG 设计（全部纯灰阶）：
  1. BLANK：留白柱体与排版网格，近乎全白，只有细线与一团柔和灰。
  2. NORTH/34：等距建筑线稿，交叉斜线构成体块。
  3. HANDLE：半调圆点拼出的圆环/器物轮廓。
  4. SLOW PRESS：巨大衬线字母的印刷样张，局部裁切。
  5. ATLAS：等高线地形，细密曲线。
- 卡片标题中英双语，年份与门类使用等宽小字。整卡可点击，但本 demo 跳转 `#`（预留作品详情）。

### 6.5 客户跑马灯

- 上下细线，单行无限滚动，内容为虚构客户字标：`BLANK · NORTH/34 · HANDLE · SLOW PRESS · ATLAS · VESSEL · COMMON GROUND · FIELD NOTES`。
- 使用 Inspira `Marquee`；若组件不可用则用 CSS 动画实现。hover 暂停。

### 6.6 能力

- 等宽标签 `03 / 能力`。
- 左侧粘性大标题：`WHAT WE DO` + 中文 `我们能做什么`，`position: sticky; top: 6rem`。
- 右侧 4 行：
  1. `01 品牌识别 Brand Identity` — 命名、标志、视觉系统与品牌规范。
  2. `02 数字体验 Digital Experience` — 官网、产品界面与设计系统。
  3. `03 动效与交互 Motion & Interaction` — 微交互、转场与滚动叙事。
  4. `04 艺术指导 Art Direction` — 摄影方向、编辑排版与内容气质。
- 行间细线；hover 时背景从 `--ink` 微提亮，左侧序号变白，右侧出现 `↗`。点击行为本 demo 为空。

### 6.7 数字

- 不编号，作为能力区之后的一段黑色过渡带。
- 四项统计，等宽数字，使用 `NumberTicker`：
  - 48 / 交付项目
  - 12 / 设计奖项
  - 07 / 年持续实践
  - 09 / 国家与地区
- 每项上下细线，进入视口后计数一次。

### 6.8 理念

- 巨型描边文字跑马灯（`-webkit-text-stroke` 或 SVG 描边），内容 `FORM FOLLOWS FEELING — 形式追随感受 —` 重复。
- 使用 Inspira `Marquee` 做慢速描边跑马灯（当前注册表没有 ScrollBasedVelocity，采用等效实现：70s/圈、hover 暂停）；reduced-motion 时静态显示。
- 下方居中一句：`如果一件作品需要解释，它还不够安静。`

### 6.9 联系

- 巨型三行标题：`LET'S MAKE` / `SOMETHING` / `quiet.`（最后一行衬线斜体）。
- 邮箱超大链接：`hello@monolith.studio`，hover 时 `HyperText` 字符扰动；`mailto:` 可直接打开邮件客户端。
- 备注：`2027 年档期开放 · 接受品牌、数字与空间合作`。
- 主按钮：ShimmerButton「开始一个项目」→ `mailto:`。
- 旋转徽章：`SpinningText`，白底黑字圆环，叠在区块右下。
- 背景保持留白，不加额外光效。

### 6.10 页脚

- 顶部细线；巨型 `MONOLITH` 字标占满整行，底部裁切（`overflow: hidden`），低对比度（`--paper` 20% 透明度）作为收尾。
- 三栏：SITEMAP（作品 / 工作室 / 联系锚点）、SOCIAL（Instagram / Behance / 小红书，demo 占位链接）、CONTACT（邮箱 / 城市 / 时间）。
- 底行：`© 2026 MONOLITH STUDIO`、`MADE WITH RESTRAINT`、返回顶部。

## 7. Inspira UI 组件选型

| 组件 | 用途 | 备注 |
| --- | --- | --- |
| `InteractiveGridPattern` | Hero 背景网格 | 遮罩渐隐、线条改为低透明度白 |
| `TextScrollReveal` | 关于宣言逐词点亮 | 滚动驱动 |
| `GlowingEffect` | 作品卡边框流光 | 仅 hover 激活，避免全站发光 |
| `NumberTicker` | 数字统计 | 进入视口触发一次 |
| `Marquee` | 客户字标 + 理念大字跑马灯 | 理念区用 70s 慢速漂移；当前注册表无 ScrollBasedVelocity |
| `ShimmerButton` | Hero 与联系区主 CTA | 黑白配色，shimmer 用白色 |
| `SpinningText` | 联系区旋转徽章 | 14s/圈 |
| `HyperText` | 邮箱 hover 扰动 | 仅在邮箱链接上 |

补充：
- 卡片分层、区块进场使用 `motion-v` 的 `Motion` 组件，不额外引入动画库。
- 不使用的 Inspira 组件一律不安装。
- 复制后的组件允许做最小改动以适配黑白 token；改动需保持组件行为不变。
- 具体注册表 ID / CLI 命令 / 手动源码在实现阶段按官方文档核对。

## 8. 技术架构

### 8.1 依赖

- 运行时：`motion-v@2.13`、`@vueuse/core@15`、`clsx@2.1`、`tailwind-merge@3.7`
- 构建：`tailwindcss@4.3`、`@tailwindcss/vite@4.3`、`tw-animate-css@1.4`、`vitest@5.1`、`jsdom@31`、`@vue/test-utils@2.6`
- 字体：自托管 `@fontsource`（Inter Tight、Instrument Serif、IBM Plex Mono）；中文系统栈
- 不安装 `@inspira-ui/plugins`：复制组件中的 `cn` 统一改为本地 `@/lib/utils`

### 8.2 目录结构

```
src/
├── App.vue                    # 全局壳：grain 覆盖层 + 导航 + RouterView
├── main.ts                    # 入口（保持现有 Pinia / Router 注册）
├── assets/main.css            # Tailwind v4 导入 + 设计 token + 基础样式 + 自定义 utilities
├── lib/utils.ts               # cn() 工具（clsx + tailwind-merge）
├── lib/text.ts                # splitRevealTokens()，中英文揭示分词
├── router/index.ts            # 保留单路由 /
├── components/
│   ├── inspira/               # 复制进来的组件源码
│   │   ├── interactive-grid-pattern/
│   │   ├── text-scroll-reveal/
│   │   ├── glowing-effect/
│   │   ├── number-ticker/
│   │   ├── scroll-based-velocity/
│   │   ├── spinning-text/
│   │   ├── shimmer-button/
│   │   ├── marquee/
│   │   └── hyper-text/
│   └── site/
│       ├── NoiseOverlay.vue
│       ├── SiteNav.vue
│       ├── HeroSection.vue
│       ├── ManifestoSection.vue
│       ├── WorkSection.vue
│       ├── WorkCard.vue
│       ├── ProjectArt.vue      # 5 种抽象封面 SVG
│       ├── ClientsMarquee.vue
│       ├── CapabilitiesSection.vue
│       ├── StatsSection.vue
│       ├── PhilosophySection.vue
│       ├── ContactSection.vue
│       └── SiteFooter.vue
└── views/HomeView.vue         # 组合各 section
```

### 8.3 清理

- 删除脚手架示例：`components/HelloWorld.vue`、`TheWelcome.vue`、`WelcomeItem.vue`、`icons/`、`views/AboutView.vue`、`assets/logo.svg`、`assets/base.css` 中旧样式。
- 路由只保留 `/`；移除 `/about`。
- `public/` 下替换为黑白 `M` 字标 favicon（SVG）。
- 保留 Pinia 注册（脚手架既有，不影响页面；如需精简可另行移除）。

### 8.4 Token 策略

- 在 `main.css` 中用 Tailwind v4 的 `@theme inline` 映射 `--color-ink`、`--color-paper`、`--color-ash`、`--color-line-*`。
- 黑 / 白区块通过局部 class（如 `.theme-ink` / `.theme-paper`）覆写 CSS 变量，组件内部优先使用 `currentColor` 与 token，避免依赖全局 `.dark` 模式。
- 复制组件中出现的 `dark:` 变体需按本页 token 调整，保证在两种区块中都正确。
- 边框统一使用 `--line-dark` / `--line-light`，圆角接近 0。

### 8.5 可访问性

- 语义化结构：`header/nav/main/section/article/footer`，区块有可访问名称。
- 焦点态明显：1px 外框 + 2px 偏移，黑白区块各用反色。
- 所有装饰性 SVG `aria-hidden="true"`；有语义的封面提供 `role="img"` + `aria-label`。
- 正文对比度 ≥ AA；`--ash` 仅用于大字号或辅助信息。
- `prefers-reduced-motion` 全站生效。
- 链接均有可读文本，不仅靠图标。

### 8.6 性能

- 无外部图片/视频；封面为内联 SVG。
- 字体自托管（@fontsource），不产生第三方字体请求；拉丁字体 3 个族、有限字重（400/500/600 + 衬线 400 + 等宽 400）；中文使用系统字体，零网络加载。
- 背景与动画使用 CSS 变换与透明度；光斑跟随用 `requestAnimationFrame` 节流，触摸设备禁用。
- 按需引入 `motion-v` 组件，不做全量注册。
- 页面初始 JS 体积以 Vite 默认 code-splitting 为准，不引入额外大型库。

### 8.7 响应式

- 断点：640 / 768 / 1024 / 1280。
- 移动端：Hero 字号降级、作品全部单列、能力区取消粘性、跑马灯保留但降低速度、隐藏光斑和城市时间。
- 最小宽度 360px 无横向滚动；点击目标 ≥ 44px。

## 9. 内容清单（直接采用）

**工作室**：MONOLITH® / 独石设计事务所；上海 — 柏林；成立于 2019。

**Hero**
- 主标题：`WE SHAPE / quiet, / DELIBERATE / digital.`
- 副标题：`独石是一间独立设计工作室。我们以克制的形式，为品牌、产品与空间塑造安静而笃定的数字体验。`
- CTA：`查看作品`、`开始一个项目`

**关于**
- 宣言：`少，不是更少。是刚刚好。`
- 正文一：`独石成立于 2019 年，在上海与柏林之间工作。我们相信克制的力量——让形式安静下来，让内容被看见。`
- 正文二：`从品牌识别到数字产品，我们只与相信长期主义的团队合作。不追逐潮流，只打磨经得起时间的形状。`
- 英文对照：`We remove until only the essential remains. What is left should feel inevitable.`

**精选作品**

| 序号 | 标题 | 门类 | 年份 | 一句话 |
| --- | --- | --- | --- | --- |
| 01 | BLANK FURNITURE / 白卷家具 | 品牌系统 · 数字官网 | 2026 | 让沉默的家具自己说话。 |
| 02 | NORTH/34 ARCHITECTS / 北纬三十四 | 数字体验 · 作品档案 | 2025 | 为建筑事务所建立一座可漫游的数字展馆。 |
| 03 | HANDLE / 执物 | 产品设计 · 电商体验 | 2025 | 一件日常器物，一次触感优先的购买体验。 |
| 04 | SLOW PRESS / 慢印 | 编辑设计 · 线上书店 | 2024 | 把翻书的节奏，带进屏幕。 |
| 05 | ATLAS / 图志 | 展览视觉 · 空间标识 | 2024 | 用一张地图，讲述一座城市的密度。 |

**客户跑马灯**：BLANK · NORTH/34 · HANDLE · SLOW PRESS · ATLAS · VESSEL · COMMON GROUND · FIELD NOTES（均为虚构）

**能力**：见 6.6。

**数字**：48 交付项目 / 12 设计奖项 / 07 年持续实践 / 09 国家与地区。

**理念**：`FORM FOLLOWS FEELING — 形式追随感受 —`；落款句 `如果一件作品需要解释，它还不够安静。`

**联系**
- 标题：`LET'S MAKE / SOMETHING / quiet.`
- 邮箱：`hello@monolith.studio`
- 备注：`2027 年档期开放 · 接受品牌、数字与空间合作`
- 旋转徽章：`OPEN FOR COMMISSIONS · 2027 · SHANGHAI — BERLIN ·`

**页脚**：`© 2026 MONOLITH STUDIO` / `MADE WITH RESTRAINT` / 返回顶部 ↑

## 10. 验收标准

1. `npm run dev` 正常启动，页面无控制台报错。
2. `npm run type-check`、`npm run build` 通过。
3. 1440px 桌面与 390px 移动端截图：布局完整、无横向滚动、导航可用。
4. 色彩审计：除黑/白/灰与透明度外无色相。
5. 动效审计：每屏至多一个环境动效；reduced-motion 下全部退化为静态/淡入。
6. 交互审计：锚点跳转、邮箱、返回顶部可用；hover 状态完整。
7. 可访问性：键盘可遍历所有链接/按钮，焦点态清晰，装饰图像 aria-hidden。
8. 无脚手架残留：示例组件、About 路由、Vue logo、默认绿色样式全部移除。
9. 字体加载失败时有合理回退，布局不塌。
10. 首屏在普通网络下 3 秒内呈现完整内容（非动画完成）。

## 11. 留给构建者的决定

- 组件获取：优先 shadcn-vue CLI 添加；若与 Vue 3.6 RC / Vite 8 有冲突，改用官方文档手动复制源码。
- 每个组件的确切文件名、props 与依赖以其官方文档当前版本为准；选型表若有组件不可用，允许以等效实现替代（不影响视觉目标）。
- 5 张抽象封面的具体 SVG 构图与颗粒感细节。
- 动画时序的微调（±100ms）与缓动细节。
- 社交链接在 demo 中的占位方式。
- 是否保留 Pinia 注册。
- 拉丁字体使用 `@fontsource` 自托管、中文使用系统无衬线、`cn` 使用本地 `@/lib/utils`，均为已定方案。

## 12. 审查后补充决策

- **章节序号统一**：`01 / 关于`、`02 / 精选作品`、`03 / 能力`、`04 / 理念`、`05 / 联系`。Hero、数字区、客户跑马灯与页脚不编号；导航不带序号。
- **中文排版**：正文、标题与巨型宣言统一使用系统无衬线（PingFang SC / 思源黑体栈），Light 字重 + 紧字距建立气质；英文衬线保留。不加载中文 webfont，不新增中文字体族。
- **评论范围**：独立审查只提出以上两个实质问题，其余属于文档第 11 节已留给构建者的决定。
- **组件获取**：放弃 shadcn-vue CLI，按固定 commit `eec920b047589058b4b02ba64deb614869e7237a` 手动 vendor 源码，保证可复现、不引入 reka-ui 等多余基础层。
- **ScrollBasedVelocity 不存在**：理念区改用 `Marquee` 70s 慢速漂移，作为等效实现。
- **cn 来源**：复制组件中的 `import { cn } from "@inspira-ui/plugins"` 统一改为 `@/lib/utils`，本地用 `clsx + tailwind-merge` 实现。
- **中文字幕与揭示**：`TextScrollReveal` 增加 `tokens` 属性；宣言按短语显式传入 token，避免中文无空格导致整句一次性揭示。
- **导航可读性**：固定导航采用 `mix-blend-mode: difference` 保证在黑白区块上都可读；滚动后保留细线，毛玻璃仅作轻微增强。
