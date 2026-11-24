# SDD ledger — plan: docs/superpowers/plans/2026-11-23-monolith-studio-page.md

Pre-flight: no shared-interface conflicts found; plan self-review fixed section/article, label semantics, and vendor color leaks.
Ruling: 当前目录不是 git 仓库，无法创建 worktree 或使用 task-start/task-done 的 commit range — 就地实现 + 手动 ledger + 每任务验证 — 代价：没有逐任务 commit 可回溯，恢复依赖 ledger 与工作区。

Task 1: complete (tests: npm run test:run → 3 passed; type-check + build passed).
Task 1: Ruling: 字体导入改为 latin-* 子集 — 避免打包 cyrillic/greek 资源，保持性能约束 — 代价：仅支持拉丁字形，中文走系统栈（符合设计）。
Task 2: complete (tests: npm run test:run -- src → 11 passed; type-check + build passed).
Task 2: Ruling: @vueuse/core 15 的 useNow 移除了 interval 选项，改用 scheduler + useIntervalFn(cb, 1000) — 保持每秒刷新时钟的语义与开销 — 代价：依赖 VueUse scheduler API（正式公开接口）。
Task 2: Ruling: 额外删除未使用的脚手架 src/stores/counter.ts — 计划删除清单未列出，但属脚手架残留 — 代价：若后续需要 Pinia 示例需重建（Pinia 仍保留在 main.ts）。
Task 3: complete (tests: npm run test:run -- src/components → 6 passed; type-check + build passed).
Task 3: Ruling: motion-v 的泛型组件类型在 vue-tsc 3.3 + TS 6 下无法解析（initial 等 props 被推断为 never），将 Motion 局部断言为 vue Component 常量 MotionAny — 运行时行为不变，保留其余类型检查 — 代价：Reveal 内 Motion props 失去静态校验。
Task 4: complete (tests: npm run test:run -- src → 21 passed; type-check + build passed).
Task 4: Ruling: ManifestoSection 增加 sr-only 完整宣言 — 视觉层被拆成重复 ghost/foreground token，读屏需要连续语句；同时满足文案断言 — 代价：无（多一行视觉隐藏文本）。
Task 5: complete (tests: npm run test:run -- src → 28 passed; type-check + build passed; monochrome grep ok).
Task 5: Ruling: GlowingEffect 原文件依赖 Nuxt 自动导入，本地补入 vue 显式导入；center 数组改为 centerX/centerY 以满足 noUncheckedIndexedAccess — 行为不变 — 代价：与上游文件差异略增（已在 README 记录）。
Task 6: complete (tests: npm run test:run -- src → 31 passed; type-check + build passed).
Task 7: complete (tests: npm run test:run -- src → 34 passed; type-check + build passed).
Task 7: Ruling: SpinningText 原生 span 上的 `:variants` 改为移除（非 Motion 节点，运行时无效且类型不兼容）— 旋转仅由容器 Motion 驱动，视觉不变 — 代价：不再支持自定义 item variants。
Task 8: complete (tests: npm run test:run → 34 passed; type-check + build passed; visual: 1440/390 no h-scroll, monochrome computed check [], 44px targets [], reduced motion ok, console clean).
Task 8: Ruling: Playwright MCP 配置的 Chrome 未安装，改用已安装 Microsoft Edge + 本机 playwright-core 运行同等 headless 验收脚本 — 完成相同截图与断言 — 代价：验证内核为 Edge/Chromium 而非 Chrome 品牌构建。
Task 8: Ruling: 静态审计 C 唯一命中为 noise 内联 SVG 的 xmlns（data URI 内，非网络请求），保留可读性不编码 — 实际无外链 — 代价：该 grep 不输出 no-external-urls，但语义通过。
Task 8: Ruling: 计算样式单色审计以通道差 ≤12 判定（设计 token 为暖灰：paper 242/240/234、ash 139/138/131）— 符合实际 token，仍能捕捉饱和色 — 代价：通道差 ≤12 的极低饱和色不会被捕捉。

Final review: fresh reviewer (Opus) on whole page — 5 Important findings fixed in one pass; Minor findings deferred below.
Final: fixed CTA 焦点环不可见 — browser focus check RED→GREEN（hero CTA outline rgb(242,240,234) on ink；contact email outline rgb(10,10,9) on paper），suite 47/47.
Final: fixed 宣言读屏重复 — ManifestoSection.spec.ts › exposes a single accessible copy of the statement RED→GREEN，suite 47/47.
Final: fixed 地标 section 缺少可访问名称 — landmarks.spec.ts › names #hero/#about/#work/#capabilities/#stats/#philosophy/#contact with its heading RED→GREEN，suite 47/47.
Final: fixed manifesto 滚动结尾被裁切（末尾 token 仅 0.938）— reveal.spec.ts › reaches full opacity while the sticky block is still pinned RED→GREEN；浏览器 pinned 末尾 minOpacity 0.9984，suite 47/47.
Final: fixed 超宽屏内容无 1440 上限 — browser layout check RED→GREEN（1920 下 11 个 .shell 均宽 1440、left 240、无错位），suite 47/47.
Final: fixed 旋转徽章遮挡 CTA 点击 — browser hit test RED→GREEN（徽章底部 elementFromPoint 命中 CTA，insideCta true），suite 47/47.
Final: minor (deferred): reduced-motion 下 manifesto 仍为滚动驱动显影，不属自动动画但仍有位移感。
Final: minor (deferred): 每张 WorkCard 各挂一套 GlowingEffect 指针监听与 tween，卡片增多时开销线性增长。
Final: minor (deferred): ProjectArt 五个 SVG 变体复用同一组 gradient/filter id，同页重复渲染同变体时 id 冲突。
Final: minor (deferred): Inter Tight 仅载入 400/500/600，stats 的 font-light(300) 实际回退到 400。
Final: minor (deferred): contact 旋转徽章与 CTA 间距偏紧。
Final: minor (deferred): 死数据/属性残留（studio.mark/nameZh、SpinningText variants 无效入口、`insert-0` 拼写、HyperText class 重复）。
Final: minor (deferred): 时钟秒级刷新与 case 卡片 aria-label 文案可再打磨。
Final: minor (deferred): 部分组件缺独立单测（Marquee/NumberTicker/HyperText 等仅通过页面级覆盖）。
Final: minor (deferred): 视觉打磨项（hero 入场 blur/drift、footer wordmark 裁切、stats 底部分隔线、capability 序号 hover、标题下划线、移动端 marquee 速度）。
Final: minor (deferred): 768/1024 断点未逐屏截图验收，仅 390/1440/1920。
Final: minor (deferred): 视觉脚本硬编码 Edge 路径与 :4174 端口，换机需改。
Final: suite final — npm run test:run → 20 files / 47 passed；npm run type-check → exit 0；npm run build → exit 0（JS 338.59 kB / gzip 118.79 kB）。

Task 9: complete (tests: npm run test:run → 22 files / 50 passed; type-check + build passed; visual: 390/768/1024/1440/1920 liquid heights 129.56/207.33/276.47/388.78/432 equal to measure, no h-scroll, reduced motion static no canvas, accessibility snapshot reads one copy, console clean).
Task 9: Ruling: 用户明确指向 Inspira HtmlLiquid 后，采用 HtmlInCanvas + HtmlLiquid 包裹联系区收束语句，放弃中途的 LiquidGlass 尝试 — 用户指定组件；LiquidGlass 的 RGB 通道分离还会产生彩色边缘，违反单色约束 — 代价：组件为 Chromium 实验特性。
Task 9: Ruling: 仅当原生 HTML-in-canvas 可用时启用液态，其余浏览器回退静态排版 — 避免 foreignObject 快照丢失 Web 字体/交互 — 代价：Safari/Firefox 无液态效果。
Task 9: Ruling: 本地把基础流场降到 35%、指针涟漪 ×1.2 — 静止时排版保持克制，鼠标划过才明显流动 — 代价：与上游默认观感不同（README 已记）。
Task 9: Ruling: LiquidType 用 aria-hidden 的不可见副本测高，液态层绝对定位覆盖 — 不写死三行标题高度 — 代价：DOM 中文本多一份（读屏快照验证只读一次）。
Task 9: fixed 768 横向溢出（旧布局 4 列卡片标题超出 2px）— browser check RED→GREEN（scrollWidth 770→768，五卡 707px 全宽），suite 50/50.
Task 9: Ruling: 作品网格 12 列断点由 md 改为 lg — 768–1023 改为单列，避免窄卡标题溢出 — 代价：平板段视觉更朴素。
Task 9: verified 768/1024 screenshots — 解决此前 Final minor 中「768/1024 未逐屏验收」。
Task 9: minor (deferred): 联系区大标题由 canvas 覆盖，文本不可选中/复制（仍可被读屏读取）。
Task 9: minor (deferred): HtmlInCanvas 属实验特性，Chrome/Edge 版本变化可能导致原生路径失效并落回静态排版。
Task 9: suite final — npm run test:run → 22 files / 50 passed；npm run type-check → exit 0；npm run build → exit 0（JS 362.15 kB / gzip 126.00 kB；CSS 46.08 kB / gzip 9.25 kB）。

Task 10: complete (tests: npm run test:run → 22 files / 52 passed; type-check + build passed; visual: 390/768/1024/1440/1920 hero root/measure heights 193.31/314.88/418.5/590.88/626.19 equal, no h-scroll, pointer spotlight + wheel scroll + CTA hit/click ok, reduced motion static no canvas, aria reads title once, console clean).
Task 10: Ruling: 首页液态应用于 hero 大标题，复用 LiquidType；标题 id 由内层 h1 移到液态外层容器，避免测高副本产生重复 id — aria-labelledby 仍解析出单一可访问名称 — 代价：#hero-title 不再是 h1 本身。
Task 10: Ruling: hero 标题改为静态行 + LiquidType 整块 CSS 入场（0.7s 上移淡入），移除逐行 Reveal — canvas 内的逐行动画只在首帧被捕获，导致标题在动画结束后才整块出现 — 代价：液态模式下失去逐行错峰，静态回退也使用整块入场。
Task 10: minor (deferred): hero 大标题由 canvas 覆盖，文本不可选中/复制（读屏仍读取一次）。
Task 10: minor (deferred): Chromium 下 hero 与 contact 各持有一个 WebGL 上下文；hero 在视口内持续以 60fps 绘制。
Task 10: suite final — npm run test:run → 22 files / 52 passed；npm run type-check → exit 0；npm run build → exit 0（JS 362.34 kB / gzip 126.06 kB；CSS 46.36 kB / gzip 9.32 kB）。

Task 11: complete (tests: npm run test:run → 24 files / 66 passed; type-check + build passed; visual: 390/768/1024/1440/1920 all 13 slides exactly 100dvh, stacked at n×vh, zero vertical overflow, no h-scroll; one gesture = one page; two gestures 130ms apart chain 0→1800; spring overshoot 29px; 25ms momentum pair stays one page; wheel/keyboard/touch/nav/skip/reduced/console all green; real wheel verified over WorkCard art and Contact liquid canvas).
Task 11: Ruling: 用户明确否定「智能对齐」并要求逐页设计后，整站改为 13 个独立 100dvh 幻灯片（hero、about、5 个项目页、clients、capabilities、stats、philosophy、contact、footer）— 每屏内容自成一体，不再有跨屏截断 — 代价：页面更多、作品区每页重复页眉。
Task 11: Ruling: 翻页改为目标页接力 — 弹簧动画中再次滑动会以当前目标为起点前进一页并保留速度，而不是丢弃输入 — 代价：慢速触控板动量若出现 >50ms 空隙且累计超过阈值，理论上可能多翻一页；无页面指示器。
Task 11: Ruling: 取消 Manifesto 的 140vh 滚动显影，改为单屏静态宣言；About 页一次呈现宣言、两段说明与英文收束 — 代价：失去原来的滚动叙事感。
Task 11: Ruling: 作品区改为「一项目一页」，WorkCard 改为填满可用高度、图片区 flex-1 — 代价：桌面不再有错落双列构图，视觉更接近作品集幻灯片。
Task 11: Ruling: 幻灯片高度使用 100dvh（100svh 回退），PagePager 仍按 DOM 锚点计算 stops — 移动端工具栏变化会触发 resize 重算 — 代价：动态视口变化时可能有一次位置校正。
Task 11: minor (deferred): 无页码/进度指示，13 屏全靠滚动与导航定位。
Task 11: minor (deferred): 离屏页面的 marquee 与 hero/contact 两个 WebGL 上下文仍持续绘制，长时浏览有额外 GPU/CPU 开销。
Task 11: minor (deferred): 间隔 <50ms 的快速滚轮刻度会被合并为同一次手势，需要用户保持一定节奏才能连续翻页。
Task 11: minor (deferred): 开发环境截图底部中间的 Vue DevTools 悬浮球不属于页面内容，生产构建不会出现。
Task 11: minor (deferred): PageStops 的 align/offset 能力已无调用方，暂时保留为通用接口。
Task 11: suite final — npm run test:run → 24 files / 66 passed；npm run type-check → exit 0；npm run build → exit 0（JS 369.99 kB / gzip 128.35 kB；CSS 49.48 kB / gzip 9.91 kB）。

Task 12: withdrawn — 用户明确「不要 liquid-glass 这个了」 — LiquidGlass 组件、support、单测、README 条目与验证脚本/截图全部移除，hero 元数据栏恢复原样 — 已回归 suite 24 files / 66 passed；type-check + build 通过（JS 369.99 kB / gzip 128.35 kB；CSS 49.48 kB / gzip 9.91 kB），浏览器 verified 无 data-liquid-glass 残留、hero 900/900 无溢出、13 屏不变。
Task 13: fixed scroll bugs — root cause: wheel accumulator reset every 50ms, so sub-threshold ticks separated by >50ms were discarded (page felt stuck) while repeated medium ticks were classified as new gestures and chained several pages; ArrowUp/Down stayed native and left the deck 40px off-stop. Fix: keep accumulating across short gaps, split commit threshold (18) from decisive-notch threshold (32), adaptive re-arm (100ms decisive / 240ms small), only consume a gesture after a page actually advances, respond to deliberate reversal, and page ArrowUp/Down. Tests +4 RED→GREEN; suite 24 files / 70 passed; browser matrix: 6×10@65ms→1, 6×25@65/120ms→1, 6×10@120ms→1, 12×10@16ms→1, 120@120ms chain→2, three 120 notches→3, reversal→0, arrows 900/1800/900; console clean; type-check + build green (JS 370.10 kB / gzip 128.41 kB; CSS 49.48 kB / gzip 9.91 kB).
Task 14: fixed cropped work artwork — root cause: full-page WorkCard made the art viewport ~2.1–2.9:1 while ProjectArt was a single 4:5 portrait SVG with preserveAspectRatio slice, so desktop showed only the central ~30% vertical slice and lost corner labels/shapes. Fix: author five complete 1600×760 landscape compositions for lg+, keep the five portrait compositions below lg, switch both to xMidYMid meet so nothing is cut, and add a hairline plate frame. Tests: ProjectArt.spec 5→10 passed (portrait meet + wide viewBox/meet/data-art); suite 24 files / 75 passed; shared deck check 19/19 green; visual 1440/1366/2560/390 all five works complete, no overflow, console clean; type-check + build green (JS 379.33 kB / gzip 129.95 kB; CSS 49.53 kB / gzip 9.92 kB).
Task 14: Ruling: 宽屏重绘横版作品图而非简单 meet — 直接把 4:5 竖版放进 2.1:1 画框会留下巨大空白且作品变小；横版构图保留原 motifs 并补齐名牌/年份，窄屏继续用原竖版 — 代价：ProjectArt DOM 含两套内联 SVG（隐藏一套），打包体积 +约 9 kB。
Task 15: verified mobile work artwork — 390×844, 430×932, 768×900 all five work pages: portrait 800×1000 composition with xMidYMid meet, rounded art plate 332×525 / 372×613 / 689×569, slide scroll overflow 0, no horizontal scroll, all corner labels and year marks visible; extra 320×568, 360×640, 375×667, 412×915 also clean. Landscape 844×390 is the only weak case: 100dvh deck leaves the art viewport ~759×59, so the plate renders as a thin band; no layout breakage, but a dedicated short-landscape treatment would be needed if that orientation matters.
