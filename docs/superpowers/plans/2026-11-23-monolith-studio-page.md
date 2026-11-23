# MONOLITH 高级设计工作室官网 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在现有 Vue 3 项目中构建一个黑白、克制、成体系的单页设计工作室官网，用 8 个 Inspira UI 复制式组件撑起恰到好处的动效。

**Architecture:** 先建立 Tailwind v4 + 设计 token + Vitest 测试底座；再按「数据层 → 站壳 → 各区块 → 组装与视觉验收」拆分。Inspira 组件按固定 commit 手动 vendor 到 `src/components/inspira/`，`cn` 统一指向本地 `@/lib/utils`；区块内容全部从 `src/data/site.ts` 读取，页面只负责布局与动效。

**Tech Stack:** Vue 3.6.0-rc.16、Vite 8、TypeScript 6、Tailwind CSS 4.3、motion-v 2.13、@vueuse/core 15、Vitest 5.1、@vue/test-utils 2.6、jsdom 31、@fontsource。

**Spec:** `docs/superpowers/specs/2026-11-23-monolith-studio-page-design.md`（执行者必须同时阅读）

**版本控制说明：** 当前目录不是 git 仓库。计划用每个任务末尾的验证代替提交；不要主动执行 `git init` 或提交，除非用户明确要求。

## Global Constraints

- 技术栈固定为 Vue `3.6.0-rc.16`、Vite `^8.2.2`、TypeScript `~6.0.0`；不更换框架。
- 只允许这些颜色与透明度：`--ink: #0A0A09`、`--paper: #F2F0EA`、`--ash: #8B8A83`、`--line-dark: rgba(242,240,234,0.16)`、`--line-light: rgba(10,10,9,0.14)`。全站不得出现任何色相（包括 vendor 组件里的彩色渐变）。
- 字体：
  - 拉丁无衬线 `Inter Tight` 400/500/600
  - 拉丁衬线 `Instrument Serif` 400/400 italic
  - 拉丁等宽 `IBM Plex Mono` 400
  - 中文系统栈 `"PingFang SC", "Hiragino Sans GB", "Source Han Sans SC", "Noto Sans CJK SC", "Microsoft YaHei", sans-serif`
  - 全部拉丁字体通过 `@fontsource` 自托管；不加载中文 webfont，不使用 Google Fonts。
- 章节编号只用一套：`01 / 关于`、`02 / 精选作品`、`03 / 能力`、`04 / 理念`、`05 / 联系`。Hero、数字区、客户跑马灯、页脚不编号，导航不带序号。
- Inspira UI 只 vendor 这 8 个：`InteractiveGridPattern`、`TextScrollReveal`（含 `ScrollWord`）、`GlowingEffect`、`NumberTicker`、`Marquee`、`ShimmerButton`、`SpinningText`、`HyperText`。不安装 `@inspira-ui/plugins`，不使用 `shadcn-vue init`。
- vendor 来源固定为 commit `eec920b047589058b4b02ba64deb614869e7237a`；每个复制文件中的 `import { cn } from "@inspira-ui/plugins"` 改为 `import { cn } from "@/lib/utils"`。
- 不引入任何外部图片、视频或远程字体；5 张作品封面全部为本地内联 SVG。
- 单路由 `/`；删除 `/about` 与脚手架演示组件。项目不是 git 仓库，本计划不包含提交步骤。
- 动效值：进场 900ms `cubic-bezier(0.16,1,0.3,1)`、逐行错峰 90ms；滚动进入 700ms、位移 24px、阈值 15%、只触发一次；卡片 hover 500ms；数字 1.6s；旋转徽章 14s/圈；理念跑马灯 70s/循环。
- 必须支持 `prefers-reduced-motion: reduce`：无限动画停止、旋转徽章不渲染、光斑隐藏、数字直接显示终值、揭示退化为无位移。
- 可访问性：正文对比度 ≥ AA；所有装饰 SVG `aria-hidden="true"`；语义化 `header/nav/main/section/article/footer`；键盘焦点可见；触控目标 ≥ 44px。
- 移动端 390px 下不得横向滚动；导航中部链接与时钟隐藏，保留字标与邮件 CTA。

## Review Focus

1. **中文揭示被当成一个词**：`TextScrollReveal` 原生按空格切分，中文宣言会整句一次性出现。Task 4 用 `splitRevealTokens` + 显式 `tokens` 修复，并有单测。
2. **减少动效失效**：`SpinningText`、`GlowingEffect`、`NumberTicker` 是 JS 动画，CSS 媒体查询管不到。Task 3/5/6/7 分别加 `usePreferredReducedMotion` 守卫，Task 8 用 Playwright 的 reduced-motion 模拟验收。
3. **移动端横向溢出**：巨型字号 + 12 列网格是主要风险。Task 8 在 390px 视口断言 `scrollWidth <= innerWidth` 并截图复核。
4. **vendor 组件漏进彩色**：`GlowingEffect` 默认是彩虹锥形渐变。Task 5 改为灰阶，Task 8 用 grep 与计算样式审计兜底。
5. **占位链接变成死链或错误跳转**：作品卡使用 `href="#" + @click.prevent`，页脚社交仅为文本。Task 5/7 有断言，Task 8 做链接行为巡检。

---

## File Structure

**Create**

```
src/lib/utils.ts                 # cn()，clsx + tailwind-merge
src/lib/text.ts                  # splitRevealTokens()
src/lib/time.ts                  # formatShanghaiTime()
src/data/site.ts                 # 全站内容与类型
src/components/site/SectionLabel.vue
src/components/site/NoiseOverlay.vue
src/components/site/SiteNav.vue
src/components/site/Reveal.vue
src/components/site/HeroSection.vue
src/components/site/ManifestoSection.vue
src/components/site/ProjectArt.vue
src/components/site/WorkCard.vue
src/components/site/WorkSection.vue
src/components/site/ClientsMarquee.vue
src/components/site/CapabilitiesSection.vue
src/components/site/StatsSection.vue
src/components/site/PhilosophySection.vue
src/components/site/ContactSection.vue
src/components/site/SiteFooter.vue
src/components/inspira/**        # 8 个 vendor 组件
src/components/inspira/README.md # 来源与 MIT 许可说明
vitest.config.ts
vitest.setup.ts
public/favicon.svg
```

**Modify**

```
package.json
vite.config.ts
index.html
src/App.vue
src/main.ts
src/router/index.ts
src/views/HomeView.vue
src/assets/main.css
```

**Delete**

```
src/components/HelloWorld.vue
src/components/WelcomeItem.vue
src/components/TheWelcome.vue
src/components/icons/
src/views/AboutView.vue
src/assets/logo.svg
src/assets/base.css
public/favicon.ico
```

---

### Task 1: 工程底座、设计 token 与测试环境

**Files:**
- Modify: `package.json`, `vite.config.ts`, `index.html`, `src/assets/main.css`
- Create: `public/favicon.svg`, `vitest.config.ts`, `vitest.setup.ts`, `src/lib/utils.ts`, `src/lib/time.ts`, `src/lib/__tests__/utils.spec.ts`, `src/lib/__tests__/time.spec.ts`

**Interfaces:**
- Produces: `cn(...inputs: ClassValue[]): string`
- Produces: `formatShanghaiTime(date: Date): string`（返回 `HH:mm`，时区 `Asia/Shanghai`）
- Produces CSS tokens：`bg-ink`、`text-paper`、`border-line-light`、`font-sans`、`font-serif`、`font-mono`、`.theme-ink`、`.theme-paper`、`.noise-overlay`、`.text-outline`

- [ ] **Step 1: 安装依赖**

```bash
cd /Users/autumn/IdeaProjects/autumn-demo
npm install motion-v@2.13.0 @vueuse/core@15.0.0 clsx@2.1.1 tailwind-merge@3.7.1 tw-animate-css@1.4.0
npm install @fontsource/inter-tight@5.3.0 @fontsource/instrument-serif@5.3.0 @fontsource/ibm-plex-mono@5.3.0
npm install -D tailwindcss@4.3.5 @tailwindcss/vite@4.3.5 vitest@5.1.1 jsdom@31.0.1 @vue/test-utils@2.6.0
```

- [ ] **Step 2: 加测试脚本**

在 `package.json` 的 `scripts` 中加入：

```json
"test": "vitest",
"test:run": "vitest run"
```

- [ ] **Step 3: 创建 Vitest 配置**

`vitest.config.ts`：

```ts
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    restoreMocks: true,
  },
})
```

`vitest.setup.ts`：

```ts
import { vi } from 'vitest'

class ObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return [] }
}

vi.stubGlobal('IntersectionObserver', ObserverStub)
vi.stubGlobal('ResizeObserver', ObserverStub)

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }),
})
```

- [ ] **Step 4: 写失败测试**

`src/lib/__tests__/utils.spec.ts`：

```ts
import { describe, expect, it } from 'vitest'
import { cn } from '../utils'

describe('cn', () => {
  it('lets later Tailwind utilities win', () => {
    const result = cn('h-[200vh] px-4', 'h-[140vh]')
    expect(result).toContain('h-[140vh]')
    expect(result).toContain('px-4')
    expect(result).not.toContain('h-[200vh]')
  })

  it('drops falsy values', () => {
    expect(cn('text-ink', false && 'hidden', null, undefined)).toBe('text-ink')
  })
})
```

`src/lib/__tests__/time.spec.ts`：

```ts
import { describe, expect, it } from 'vitest'
import { formatShanghaiTime } from '../time'

describe('formatShanghaiTime', () => {
  it('formats UTC as Shanghai HH:mm', () => {
    expect(formatShanghaiTime(new Date('2026-11-23T06:32:00Z'))).toBe('14:32')
  })
})
```

- [ ] **Step 5: 运行并确认失败**

Run: `npm run test:run -- src/lib`
Expected: FAIL，`Cannot find module '../utils'` / `'../time'`。

- [ ] **Step 6: 实现工具函数**

`src/lib/utils.ts`：

```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
```

`src/lib/time.ts`：

```ts
export function formatShanghaiTime(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Shanghai',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)
}
```

- [ ] **Step 7: 运行测试确认通过**

Run: `npm run test:run -- src/lib`
Expected: PASS（2 个文件全部通过）。

- [ ] **Step 8: 配置 Vite、Tailwind v4、字体与基础样式**

`vite.config.ts` 引入并注册 Tailwind 插件：

```ts
import tailwindcss from '@tailwindcss/vite'
// plugins: [vue(), tailwindcss(), vueDevTools()]
```

`src/assets/main.css` 完整替换为：

```css
@import "@fontsource/inter-tight/400.css";
@import "@fontsource/inter-tight/500.css";
@import "@fontsource/inter-tight/600.css";
@import "@fontsource/instrument-serif/400.css";
@import "@fontsource/instrument-serif/400-italic.css";
@import "@fontsource/ibm-plex-mono/400.css";
@import "tailwindcss";
@import "tw-animate-css";

@theme {
  --color-ink: #0A0A09;
  --color-paper: #F2F0EA;
  --color-ash: #8B8A83;
  --color-line-dark: rgba(242, 240, 234, 0.16);
  --color-line-light: rgba(10, 10, 9, 0.14);
  --font-sans: "Inter Tight", "PingFang SC", "Hiragino Sans GB", "Source Han Sans SC", "Noto Sans CJK SC", "Microsoft YaHei", sans-serif;
  --font-serif: "Instrument Serif", "Songti SC", "Source Han Serif SC", "Noto Serif CJK SC", serif;
  --font-mono: "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
}

@layer base {
  html {
    scroll-behavior: smooth;
    scroll-padding-top: 5rem;
    background-color: var(--color-ink);
  }
  body {
    margin: 0;
    background-color: var(--color-ink);
    color: var(--color-paper);
    font-family: var(--font-sans);
    font-synthesis: none;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }
  ::selection {
    background-color: var(--color-paper);
    color: var(--color-ink);
  }
  :focus-visible {
    outline: 1px solid currentColor;
    outline-offset: 4px;
  }
  a {
    color: inherit;
    text-decoration: none;
  }
}

@layer utilities {
  .theme-ink {
    background-color: var(--color-ink);
    color: var(--color-paper);
  }
  .theme-paper {
    background-color: var(--color-paper);
    color: var(--color-ink);
  }
  .text-outline {
    color: transparent;
    -webkit-text-stroke: 1px var(--color-ink);
  }
  .noise-overlay {
    position: fixed;
    inset: 0;
    z-index: 60;
    pointer-events: none;
    opacity: 0.035;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  .animate-marquee,
  .animate-marquee-vertical {
    animation: none !important;
  }
}
```

`index.html`：`lang="zh-CN"`、标题 `MONOLITH® — 独立设计工作室`、`meta name="description"`、`meta name="theme-color" content="#0A0A09"`、`link rel="icon" type="image/svg+xml" href="/favicon.svg"`，删除旧 ico 引用。

`public/favicon.svg`：

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="#0A0A09"/>
  <path d="M16 47V17h6l10 15 10-15h6v30h-6V27L32 42 22 27v20z" fill="#F2F0EA"/>
</svg>
```

- [ ] **Step 9: 全量验证**

Run: `npm run test:run && npm run type-check && npm run build`
Expected: 测试通过、类型检查通过、构建成功。

---

### Task 2: 站点数据、清理与站壳

**Files:**
- Create: `src/data/site.ts`, `src/components/site/SectionLabel.vue`, `src/components/site/NoiseOverlay.vue`, `src/components/site/SiteNav.vue`, `src/data/__tests__/site.spec.ts`, `src/components/site/__tests__/SiteNav.spec.ts`, `src/__tests__/App.spec.ts`
- Modify: `src/App.vue`, `src/router/index.ts`, `src/views/HomeView.vue`, `src/main.ts`
- Delete: `src/components/HelloWorld.vue`, `src/components/WelcomeItem.vue`, `src/components/TheWelcome.vue`, `src/components/icons/`, `src/views/AboutView.vue`, `src/assets/logo.svg`, `src/assets/base.css`, `public/favicon.ico`

**Interfaces:**
- Produces `WorkArt = 'blank' | 'north34' | 'handle' | 'slowpress' | 'atlas'`
- Produces `Work { id: string; index: string; titleEn: string; titleZh: string; discipline: string; year: string; summary: string; art: WorkArt; coverAlt: string }`
- Produces `Capability { index: string; titleEn: string; titleZh: string; description: string }`
- Produces `Stat { value: number; label: string; pad?: boolean }`
- Produces `studio`, `hero`, `manifesto`, `works`, `clients`, `capabilities`, `stats`, `philosophy`, `contact`, `footer`, `navLinks`, `sectionLabels`
- Produces `SectionLabel` props：`index: string; label: string; class?: string`
- Consumes `formatShanghaiTime` from Task 1

- [ ] **Step 1: 写失败测试**

`src/data/__tests__/site.spec.ts`：

```ts
import { describe, expect, it } from 'vitest'
import { capabilities, clients, navLinks, sectionLabels, stats, works } from '../site'

describe('site data', () => {
  it('has 5 unique works in narrative order', () => {
    expect(works.map((work) => work.index)).toEqual(['01', '02', '03', '04', '05'])
    expect(new Set(works.map((work) => work.id)).size).toBe(5)
  })

  it('uses the agreed navigation targets', () => {
    expect(navLinks.map((link) => link.href)).toEqual(['#work', '#about', '#contact'])
  })

  it('has 4 capabilities and 4 stats', () => {
    expect(capabilities).toHaveLength(4)
    expect(stats.map((stat) => stat.value)).toEqual([48, 12, 7, 9])
  })

  it('keeps section numbering 01-05', () => {
    expect(Object.values(sectionLabels).map((label) => label.index)).toEqual(['01', '02', '03', '04', '05'])
  })

  it('keeps clients fictional and non-empty', () => {
    expect(clients.length).toBeGreaterThan(3)
  })
})
```

`src/components/site/__tests__/SiteNav.spec.ts`：

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import SiteNav from '../SiteNav.vue'

describe('SiteNav', () => {
  const wrapper = mount(SiteNav)

  it('renders anchor navigation', () => {
    expect(wrapper.find('nav[aria-label="主导航"]').exists()).toBe(true)
    expect(wrapper.find('a[href="#work"]').text()).toBe('作品')
    expect(wrapper.find('a[href="#about"]').text()).toBe('关于')
    expect(wrapper.find('a[href="#contact"]').text()).toBe('联系')
  })

  it('renders a Shanghai clock and mail CTA', () => {
    expect(wrapper.text()).toMatch(/SHANGHAI \d{2}:\d{2}/)
    expect(wrapper.find('a[href="mailto:hello@monolith.studio"]').exists()).toBe(true)
  })
})
```

`src/__tests__/App.spec.ts`：

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import App from '../App.vue'

describe('App shell', () => {
  const wrapper = mount(App, {
    global: { stubs: { RouterView: true, SiteNav: true, SiteFooter: true } },
  })

  it('exposes a skip link and decorative grain', () => {
    expect(wrapper.find('a[href="#main"]').exists()).toBe(true)
    expect(wrapper.find('[aria-hidden="true"].noise-overlay').exists()).toBe(true)
  })
})
```

- [ ] **Step 2: 运行并确认失败**

Run: `npm run test:run -- src`
Expected: FAIL，缺少 `site.ts`、`SiteNav.vue` 等模块。

- [ ] **Step 3: 写 `src/data/site.ts`**

按设计稿第 9 节逐字录入文案。结构如下，不允许改写内容：

```ts
export type WorkArt = 'blank' | 'north34' | 'handle' | 'slowpress' | 'atlas'

export interface Work {
  id: string
  index: string
  titleEn: string
  titleZh: string
  discipline: string
  year: string
  summary: string
  art: WorkArt
  coverAlt: string
}

export interface Capability { index: string; titleEn: string; titleZh: string; description: string }
export interface Stat { value: number; label: string; pad?: boolean }

export const studio = {
  name: 'MONOLITH',
  mark: 'MONOLITH®',
  nameZh: '独石设计事务所',
  city: 'SHANGHAI / BERLIN',
  coords: '31.2304° N, 121.4737° E',
  email: 'hello@monolith.studio',
}

export const navLinks = [
  { label: '作品', href: '#work' },
  { label: '关于', href: '#about' },
  { label: '联系', href: '#contact' },
]

export const sectionLabels = {
  about: { index: '01', label: '关于' },
  work: { index: '02', label: '精选作品' },
  capabilities: { index: '03', label: '能力' },
  philosophy: { index: '04', label: '理念' },
  contact: { index: '05', label: '联系' },
} as const

export const hero = {
  lines: ['WE SHAPE', 'quiet,', 'DELIBERATE', 'digital.'],
  subtitle:
    '独石是一间独立设计工作室。我们以克制的形式，为品牌、产品与空间塑造安静而笃定的数字体验。',
}

export const manifesto = {
  text: '少，不是更少。是刚刚好。',
  tokens: ['少，', '不是更少。', '是刚刚好。'],
  paragraphs: [
    '独石成立于 2019 年，在上海与柏林之间工作。我们相信克制的力量——让形式安静下来，让内容被看见。',
    '从品牌识别到数字产品，我们只与相信长期主义的团队合作。不追逐潮流，只打磨经得起时间的形状。',
  ],
  en: 'We remove until only the essential remains. What is left should feel inevitable.',
}

export const works: Work[] = [/* 5 项，字段值逐字取自设计稿第 9 节 */]

export const clients = [
  'BLANK', 'NORTH/34', 'HANDLE', 'SLOW PRESS', 'ATLAS', 'VESSEL', 'COMMON GROUND', 'FIELD NOTES',
]

export const capabilities: Capability[] = [/* 4 项，逐字取自设计稿 6.6 */]

export const stats: Stat[] = [
  { value: 48, label: '交付项目' },
  { value: 12, label: '设计奖项' },
  { value: 7, pad: true, label: '年持续实践' },
  { value: 9, pad: true, label: '国家与地区' },
]

export const philosophy = {
  text: 'FORM FOLLOWS FEELING — 形式追随感受 —',
  note: '如果一件作品需要解释，它还不够安静。',
}

export const contact = {
  lines: ["LET'S MAKE", 'SOMETHING', 'quiet.'],
  availability: '2027 年档期开放 · 接受品牌、数字与空间合作',
  badge: 'OPEN FOR COMMISSIONS · 2027 · SHANGHAI — BERLIN · ',
}

export const footer = {
  socials: ['Instagram', 'Behance', '小红书'],
  copyright: '© 2026 MONOLITH STUDIO',
  motto: 'MADE WITH RESTRAINT',
}
```

`works` 的 `id` 依次为 `blank-furniture`、`north-34`、`handle`、`slow-press`、`atlas`；`art` 依次为 `blank`、`north34`、`handle`、`slowpress`、`atlas`；`coverAlt` 使用「项目名 + 项目封面：构图描述」。

- [ ] **Step 4: 实现站壳**

`SectionLabel.vue`：渲染 `<h2 class="font-mono text-[11px] uppercase tracking-[0.18em]">{{ index }} / {{ label }}</h2>`，接受 `class` 合并，作为各区块的语义标题。

`NoiseOverlay.vue`：`<div class="noise-overlay" aria-hidden="true" />`。

`SiteNav.vue`：
- 固定顶部 `fixed inset-x-0 top-0 z-50 mix-blend-difference text-paper`。
- 用 `useWindowScroll`（@vueuse/core）计算 `scrolled = y > 24`，`data-scrolled` 属性；滚动后加 `border-b border-paper/20` 与 `backdrop-blur-[2px]`（无底色，仅轻微毛玻璃），仍在 `mix-blend-difference` 下保证可读性。
- 左字标 `MONOLITH®` 链接 `#hero`；中部 `navLinks`；右侧 `SHANGHAI {time}` + `mailto:` CTA「开始项目 ↗」。
- 时间：`useNow({ interval: 1000 })` + `formatShanghaiTime(new Date(now.value))`，`<time aria-label="上海时间">`。
- 中部链接与时间使用 `hidden md:flex` / `hidden md:block`。

`App.vue`：

```vue
<template>
  <a class="sr-only focus:not-sr-only ..." href="#main">跳到主内容</a>
  <NoiseOverlay />
  <SiteNav />
  <RouterView />
</template>
```

`router/index.ts`：只保留 `path: '/'`，删除 about 路由与 import。

`HomeView.vue`：暂时只渲染 `<main id="main" class="min-h-screen" />`，后续任务逐段填充。

`main.ts`：保持 `import './assets/main.css'`、Pinia、Router 注册不变。

删除脚手架文件（逐个确认存在后删除）：

```bash
rm -rf src/components/HelloWorld.vue src/components/WelcomeItem.vue src/components/TheWelcome.vue src/components/icons src/views/AboutView.vue src/assets/logo.svg src/assets/base.css public/favicon.ico
```

- [ ] **Step 5: 运行测试确认通过**

Run: `npm run test:run -- src`
Expected: PASS。

- [ ] **Step 6: 类型与构建验证**

Run: `npm run type-check && npm run build`
Expected: 通过。

---

### Task 3: Hero、网格背景、Reveal 与 ShimmerButton

**Files:**
- Create: `src/components/inspira/interactive-grid-pattern/InteractiveGridPattern.vue`, `src/components/inspira/shimmer-button/ShimmerButton.vue`, `src/components/inspira/README.md`, `src/components/site/Reveal.vue`, `src/components/site/HeroSection.vue`, `src/components/inspira/__tests__/ShimmerButton.spec.ts`, `src/components/site/__tests__/HeroSection.spec.ts`
- Modify: `src/views/HomeView.vue`

**Interfaces:**
- Produces `Reveal` props：`delay?: number`（秒，默认 0）、`as?: string`（默认 `'div'`）、`class?: string`；默认插槽
- Produces `ShimmerButton` props：原有 shimmer 参数 + `href?: string`、`type?: 'button' | 'submit' | 'reset'`；有 `href` 时根节点为 `<a>`，否则为 `<button>`
- Produces `HeroSection`：无 props，读取 `hero`、`studio`

- [ ] **Step 1: vendor 组件**

```bash
BASE="https://raw.githubusercontent.com/unovue/inspira-ui/eec920b047589058b4b02ba64deb614869e7237a/app/components/inspira/ui"
mkdir -p src/components/inspira/interactive-grid-pattern src/components/inspira/shimmer-button
curl -sL "$BASE/interactive-grid-pattern/InteractiveGridPattern.vue" -o src/components/inspira/interactive-grid-pattern/InteractiveGridPattern.vue
curl -sL "$BASE/shimmer-button/ShimmerButton.vue" -o src/components/inspira/shimmer-button/ShimmerButton.vue
```

创建 `src/components/inspira/README.md`，写明来源仓库、commit、MIT 许可与原文：

> Vendored from uninovue/inspira-ui at commit `eec920b047589058b4b02ba64deb614869e7237a`. MIT License, Copyright (c) 2024-2026 rahulv.dev. Local changes: `cn` import path, monochrome colors, anchor support.

- [ ] **Step 2: 改写 vendor 组件**

- 两个文件里的 `import { cn } from "@inspira-ui/plugins"` 改为 `import { cn } from "@/lib/utils"`。
- `InteractiveGridPattern`：`border-gray-400/30` → `border-paper/10`；`stroke-gray-400/30` → `stroke-paper/10`；hovered fill `fill-gray-300/30` → `fill-paper/10`。
- `ShimmerButton`：
  - Props 增加 `href?: string`、`type?: 'button' | 'submit' | 'reset'`。
  - 根节点改为 `<component :is="href ? 'a' : 'button'" :href="href" :type="href ? undefined : (type ?? 'button')">`。
  - 颜色类改为 `border-current/20 text-current`，删除 `text-white`、`dark:text-black`。
  - 默认值改为 `shimmerColor: "#F2F0EA"`、`background: "#0A0A09"`；把 `#ffffff1f`、`#ffffff3f` 改为 `#F2F0EA1F`、`#F2F0EA3F`，不留纯白/纯黑十六进制。
  - 其他 shimmer 结构保持不变。

- [ ] **Step 3: 写失败测试**

`src/components/inspira/__tests__/ShimmerButton.spec.ts`：

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ShimmerButton from '../shimmer-button/ShimmerButton.vue'

describe('ShimmerButton', () => {
  it('renders an anchor when href is provided', () => {
    const wrapper = mount(ShimmerButton, {
      props: { href: '#work' },
      slots: { default: '查看作品' },
    })
    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBe('#work')
    expect(wrapper.text()).toBe('查看作品')
  })

  it('renders a button otherwise', () => {
    const wrapper = mount(ShimmerButton, { slots: { default: '开始' } })
    expect(wrapper.element.tagName).toBe('BUTTON')
  })
})
```

`src/components/site/__tests__/HeroSection.spec.ts`：

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import HeroSection from '../HeroSection.vue'

const RevealStub = { name: 'Reveal', template: '<div><slot /></div>' }

describe('HeroSection', () => {
  const wrapper = mount(HeroSection, {
    global: { stubs: { Reveal: RevealStub, InteractiveGridPattern: true } },
  })

  it('renders the headline and Chinese subtitle', () => {
    const text = wrapper.text()
    expect(text).toContain('WE SHAPE')
    expect(text).toContain('quiet,')
    expect(text).toContain('DELIBERATE')
    expect(text).toContain('digital.')
    expect(text).toContain('独石是一间独立设计工作室')
  })

  it('links the primary actions', () => {
    expect(wrapper.find('a[href="#work"]').text()).toContain('查看作品')
    expect(wrapper.find('a[href^="mailto:"]').exists()).toBe(true)
  })
})
```

- [ ] **Step 4: 运行并确认失败**

Run: `npm run test:run -- src/components`
Expected: FAIL，缺少 `HeroSection.vue`。

- [ ] **Step 5: 实现 `Reveal.vue` 与 `HeroSection.vue`**

`Reveal.vue`：

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { Motion } from 'motion-v'
import { usePreferredReducedMotion } from '@vueuse/core'

const props = withDefaults(defineProps<{ delay?: number; as?: string; class?: string }>(), {
  delay: 0,
  as: 'div',
})
const reduced = usePreferredReducedMotion()
const isReduced = computed(() => reduced.value === 'reduce')
</script>

<template>
  <Motion
    v-if="!isReduced"
    :as="props.as"
    :class="props.class"
    :initial="{ opacity: 0, y: 24 }"
    :while-in-view="{ opacity: 1, y: 0 }"
    :in-view-options="{ once: true, amount: 0.15 }"
    :transition="{ duration: 0.7, delay: props.delay, ease: [0.16, 1, 0.3, 1] }"
  >
    <slot />
  </Motion>
  <component :is="props.as" v-else :class="props.class">
    <slot />
  </component>
</template>
```

`HeroSection.vue` 必须包含：
- 根 `<section id="hero" class="theme-ink relative flex min-h-[100svh] flex-col justify-between overflow-hidden px-[clamp(20px,4vw,64px)] pt-28 pb-8">`。
- 背景层：`InteractiveGridPattern` 位于 `absolute inset-0`，外层加 `[mask-image:radial-gradient(ellipse_at_center,black,transparent_78%)]`，传 `:width="56" :height="56" :squares="[32, 32]"`。
- 光斑层：加 `hero-spotlight` class 与 `pointer-events-none absolute inset-0 hidden md:block motion-reduce:hidden`，`background: radial-gradient(500px circle at var(--mx,50%) var(--my,40%), rgba(242,240,234,0.07), transparent 70%)`；根节点 `@pointermove` 用 rAF 更新 `--mx` / `--my`，卸载时取消 rAF。触屏隐藏：在 scoped CSS 或 main.css 加 `@media (hover: none) { .hero-spotlight { display: none; } }`。
- 标题四行用 `<h1>` 包裹，逐行用 `Reveal`，delay 依次 `0 / 0.09 / 0.18 / 0.27`；字号 `text-[clamp(3.25rem,11vw,10.5rem)] leading-[0.92] tracking-[-0.04em] font-medium`；`quiet,` 与 `digital.` 使用 `font-serif font-normal italic`。
- 中文副标题使用 `max-w-xl text-[15px] leading-7 text-paper/65`。
- CTA：`ShimmerButton href="#work" background="#F2F0EA" shimmer-color="#0A0A09" class="text-ink"` 文案「查看作品」；第二个是 `a[href="mailto:..."]` 文案「开始一个项目」，带下划线 hover。
- 底部细线行：`SCROLL ↓`、`SHANGHAI / BERLIN`、`31.2304° N, 121.4737° E`，字体 `font-mono text-[10px] tracking-[0.18em] text-paper/50`。

`HomeView.vue`：在 `<main id="main">` 内加入 `<HeroSection />`。

- [ ] **Step 6: 运行测试并修类型**

Run: `npm run test:run -- src/components && npm run type-check`
Expected: 测试 PASS；若 vendor 文件因 `noUncheckedIndexedAccess` 报错，只在 vendored 文件内加非空断言或本地守卫，不改变行为。

- [ ] **Step 7: 构建验证**

Run: `npm run build`
Expected: 成功。

---

### Task 4: 关于区、中英文揭示分词

**Files:**
- Create: `src/components/inspira/text-scroll-reveal/TextScrollReveal.vue`, `src/components/inspira/text-scroll-reveal/ScrollWord.vue`, `src/lib/text.ts`, `src/lib/__tests__/text.spec.ts`, `src/components/inspira/__tests__/TextScrollReveal.spec.ts`, `src/components/site/ManifestoSection.vue`, `src/components/site/__tests__/ManifestoSection.spec.ts`
- Modify: `src/views/HomeView.vue`, `src/components/inspira/README.md`

**Interfaces:**
- Produces `splitRevealTokens(text: string, tokens?: string[]): string[]`
- Produces `TextScrollReveal` props：`text: string`、`tokens?: string[]`、`class?: string`、`textClass?: string`
- Produces `ManifestoSection`：无 props，读取 `manifesto`、`sectionLabels.about`

- [ ] **Step 1: 写失败测试**

`src/lib/__tests__/text.spec.ts`：

```ts
import { describe, expect, it } from 'vitest'
import { splitRevealTokens } from '../text'

describe('splitRevealTokens', () => {
  it('splits Latin text on whitespace', () => {
    expect(splitRevealTokens('We remove  until only')).toEqual(['We', 'remove', 'until', 'only'])
  })

  it('splits CJK text per character and keeps punctuation attached', () => {
    expect(splitRevealTokens('少，不是更少。')).toEqual(['少，', '不', '是', '更', '少。'])
  })

  it('prefers explicit tokens', () => {
    expect(splitRevealTokens('少，不是更少。', ['少，', '不是更少。'])).toEqual(['少，', '不是更少。'])
  })
})
```

`src/components/inspira/__tests__/TextScrollReveal.spec.ts`：

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import TextScrollReveal from '../text-scroll-reveal/TextScrollReveal.vue'

describe('TextScrollReveal', () => {
  it('renders one token per provided item', () => {
    const wrapper = mount(TextScrollReveal, {
      props: { text: '少，不是更少。', tokens: ['少，', '不是更少。'] },
    })
    expect(wrapper.findAll('[data-reveal-token]')).toHaveLength(2)
    expect(wrapper.text()).toContain('不是更少。')
  })
})
```

`src/components/site/__tests__/ManifestoSection.spec.ts`：

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ManifestoSection from '../ManifestoSection.vue'

describe('ManifestoSection', () => {
  const wrapper = mount(ManifestoSection)

  it('renders label 01 and the statement', () => {
    expect(wrapper.text()).toContain('01 / 关于')
    expect(wrapper.text()).toContain('少，不是更少。是刚刚好。')
  })

  it('renders the English closing line', () => {
    expect(wrapper.text()).toContain('We remove until only the essential remains')
  })
})
```

- [ ] **Step 2: 运行并确认失败**

Run: `npm run test:run -- src/lib src/components`
Expected: FAIL，缺少 `text.ts` / `ManifestoSection.vue`。

- [ ] **Step 3: 实现分词函数**

`src/lib/text.ts`：

```ts
const PUNCTUATION = /^[，。！？、；：,.!?;:]+$/

export function splitRevealTokens(text: string, tokens?: string[]): string[] {
  if (tokens?.length) return tokens
  if (/\s/.test(text)) return text.split(/\s+/).filter(Boolean)

  const result: string[] = []
  for (const char of Array.from(text)) {
    if (PUNCTUATION.test(char) && result.length > 0) {
      result[result.length - 1] = (result[result.length - 1] ?? '') + char
    } else {
      result.push(char)
    }
  }
  return result
}
```

- [ ] **Step 4: vendor 并改写 TextScrollReveal**

```bash
BASE="https://raw.githubusercontent.com/unovue/inspira-ui/eec920b047589058b4b02ba64deb614869e7237a/app/components/inspira/ui"
mkdir -p src/components/inspira/text-scroll-reveal
curl -sL "$BASE/text-scroll-reveal/TextScrollReveal.vue" -o src/components/inspira/text-scroll-reveal/TextScrollReveal.vue
curl -sL "$BASE/text-scroll-reveal/ScrollWord.vue" -o src/components/inspira/text-scroll-reveal/ScrollWord.vue
```

改写点：
- `cn` 改从 `@/lib/utils` 引入；引入 `splitRevealTokens`。
- Props 增加 `tokens?: string[]` 与 `textClass?: string`。
- `words` 改为 `computed(() => splitRevealTokens(props.text, props.tokens))`。
- 外层保留 `h-[200vh]`，确保 class 传入可被 `cn` 合并覆盖（本页使用 `h-[140vh]`）。
- 内部 `<p>` 使用 `cn('flex flex-wrap p-5 text-current ...', props.textClass)`，字号由 `textClass` 覆盖；ghost 层由 `ScrollWord` 的 `opacity-20` 控制对比度，不再给 `<p>` 叠加透明度。
- `ScrollWord`：ghost 层 `aria-hidden="true"` 且 `class="absolute opacity-20"`，前景层 `class="text-current"`；根 `<span>` 增加 `data-reveal-token`。
- 更新 `src/components/inspira/README.md` 的组件清单。

- [ ] **Step 5: 实现 ManifestoSection**

结构：
- 根 `<section id="about" class="theme-paper relative border-b border-line-light">`。
- 顶部 `SectionLabel`：`v-bind="sectionLabels.about"`。
- `TextScrollReveal`：`:text="manifesto.text"`、`:tokens="manifesto.tokens"`、`class="h-[140vh]"`、`text-class="text-[clamp(2.5rem,7vw,6.5rem)] font-light leading-[1.12] tracking-[-0.02em]"`。
- 下方两段正文与英文对照：两列网格 `md:grid-cols-12`，正文 `md:col-span-4`，英文 `md:col-span-4 md:col-start-9`，字号 15px / 行高 1.8，`text-ink/65`。
- 底部留出 `pb-[clamp(6rem,12vw,11rem)]`。

`HomeView.vue` 在 Hero 后加入 `<ManifestoSection />`。

- [ ] **Step 6: 运行测试与类型检查**

Run: `npm run test:run -- src && npm run type-check`
Expected: PASS。

---

### Task 5: 精选作品、抽象封面与 GlowingEffect

**Files:**
- Create: `src/components/inspira/glowing-effect/GlowingEffect.vue`, `src/components/site/ProjectArt.vue`, `src/components/site/WorkCard.vue`, `src/components/site/WorkSection.vue`, `src/components/site/__tests__/ProjectArt.spec.ts`, `src/components/site/__tests__/WorkSection.spec.ts`
- Modify: `src/views/HomeView.vue`, `src/components/inspira/README.md`

**Interfaces:**
- Produces `ProjectArt` props：`variant: WorkArt`、`label: string`；根节点 `role="img"` + `aria-label`
- Produces `WorkCard` props：`work: Work`
- Produces `WorkSection`：无 props，读取 `works`、`sectionLabels.work`
- Consumes `WorkArt`、`Work` from Task 2

- [ ] **Step 1: 写失败测试**

`src/components/site/__tests__/ProjectArt.spec.ts`：

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ProjectArt from '../ProjectArt.vue'

const variants = ['blank', 'north34', 'handle', 'slowpress', 'atlas'] as const

describe('ProjectArt', () => {
  it.each(variants)('renders an accessible %s composition without images', (variant) => {
    const wrapper = mount(ProjectArt, { props: { variant, label: '项目封面' } })
    expect(wrapper.attributes('role')).toBe('img')
    expect(wrapper.attributes('aria-label')).toBe('项目封面')
    expect(wrapper.find(`[data-art="${variant}"]`).exists()).toBe(true)
    expect(wrapper.find('img').exists()).toBe(false)
  })
})
```

`src/components/site/__tests__/WorkSection.spec.ts`：

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WorkSection from '../WorkSection.vue'

describe('WorkSection', () => {
  const wrapper = mount(WorkSection, { global: { stubs: { GlowingEffect: true } } })

  it('renders five project cards in order', () => {
    const cards = wrapper.findAll('article')
    expect(cards).toHaveLength(5)
    expect(cards[0]?.text()).toContain('BLANK FURNITURE')
    expect(cards[4]?.text()).toContain('ATLAS')
  })

  it('renders placeholder links with accessible names', () => {
    const links = wrapper.findAll('a[href="#"]')
    expect(links).toHaveLength(5)
    for (const link of links) {
      expect(link.attributes('aria-label')).toBeTruthy()
    }
  })
})
```

- [ ] **Step 2: 运行并确认失败**

Run: `npm run test:run -- src/components`
Expected: FAIL。

- [ ] **Step 3: vendor 并改写 GlowingEffect**

```bash
BASE="https://raw.githubusercontent.com/unovue/inspira-ui/eec920b047589058b4b02ba64deb614869e7237a/app/components/inspira/ui"
mkdir -p src/components/inspira/glowing-effect
curl -sL "$BASE/glowing-effect/GlowingEffect.vue" -o src/components/inspira/glowing-effect/GlowingEffect.vue
```

改写点：
- `cn` 改从 `@/lib/utils` 引入。
- 删除默认彩虹渐变中的 `#dd7bbb`、`#d79f1e`、`#5a922c`、`#4c7894`（含其 `00` 透明变体）、`#fff`、`#0000`、`#00000000` 与 `var(--black)`；全部替换为灰阶 token：`var(--color-ink)`、`var(--color-ash)`、`var(--color-paper)`。透明停靠点改用 `transparent` 关键字，不保留十六进制。
- `variant === 'white'` 的分支同样只使用灰阶（`var(--color-paper)`、`var(--color-ash)`），`border-white` 改为 `border-paper`。
- 不改变指针跟随、`--active`、`--start` 逻辑。

- [ ] **Step 4: 实现 ProjectArt**

- 根 `<div role="img" :aria-label="label" class="absolute inset-0 overflow-hidden bg-paper">`。
- 内部 `<svg viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid slice" class="h-full w-full" aria-hidden="true">`，5 个 `<g :data-art="variant">` 分支：
  - `blank`：纸白底 + 细竖线 + 柔和灰柱体矩形。
  - `north34`：等距建筑线稿（重复斜线 `<path>`），细线 `var(--color-ink)` 10%–30%。
  - `handle`：`<pattern>` 半调圆点组成的圆环/器物轮廓。
  - `slowpress`：巨大衬线 `S`（`font-family="Instrument Serif"`）局部裁切 + 印刷网格。
  - `atlas`：多条等高线 `<path>` 曲线，线宽 1–1.5。
- 全部只用 `#0A0A09`、`#F2F0EA`、`#8B8A83` 及其透明度；允许 `<filter>` 轻微模糊。
- 不引用任何外部 URL。

- [ ] **Step 5: 实现 WorkCard 与 WorkSection**

`WorkCard.vue`：
- 根 `<article class="group relative">`；内部是整个可点击的 `<a href="#" @click.prevent class="block border border-line-light p-2" :aria-label="'查看 ' + work.titleEn + ' 项目（演示占位）'">`。
- 内层图片容器按 `work.id` 取比例：`blank-furniture: aspect-[4/5]`、`north-34: aspect-[3/4]`、`handle: aspect-square`、`slow-press: aspect-[4/3]`、`atlas: aspect-[21/9]`；`ProjectArt` 绝对定位填满该容器。
- `GlowingEffect` 放在卡片内：`:disabled="false"`、`:proximity="64"`、`:spread="40"`、`:glow="true"`、`variant="default"`；`prefers-reduced-motion` 时 `:disabled="true"`。
- 信息行：`index`、中英标题（标题用 `<h3>`）、`discipline`、`year`，使用细线分隔；hover 时封面 `scale-[1.03]`、`VIEW CASE ↗` 淡入（该提示 `aria-hidden="true"`，可访问名称由整卡链接承担）。
- 摘要使用 `text-ink/55`。

`WorkSection.vue`：
- 根 `<section id="work" class="theme-paper border-b border-line-light px-[clamp(20px,4vw,64px)] py-[clamp(6rem,12vw,11rem)]">`。
- 顶部行：`SectionLabel` + 右侧 `2023—2026`。
- 网格 `grid gap-x-8 gap-y-16 md:grid-cols-12`；每个项目只包一层定位 `div`（比例由 `WorkCard` 内部处理）：
  - `blank-furniture`：`md:col-span-7`
  - `north-34`：`md:col-span-4 md:col-start-9 md:mt-24`
  - `handle`：`md:col-span-5`
  - `slow-press`：`md:col-span-6 md:col-start-7`
  - `atlas`：`md:col-span-12`
- 移动端全部单列。

`HomeView.vue` 在 Manifesto 后加入 `<WorkSection />`。

- [ ] **Step 6: 运行测试与类型检查**

Run: `npm run test:run -- src && npm run type-check`
Expected: PASS。

- [ ] **Step 7: 彩色残留检查**

Run: `grep -RInE "dd7bbb|d79f1e|5a922c|4c7894" src && echo "FOUND" || echo "monochrome-ok"`
Expected: `monochrome-ok`。

---

### Task 6: 客户跑马灯、能力区与数字统计

**Files:**
- Create: `src/components/inspira/marquee/Marquee.vue`, `src/components/inspira/number-ticker/NumberTicker.vue`, `src/components/site/ClientsMarquee.vue`, `src/components/site/CapabilitiesSection.vue`, `src/components/site/StatsSection.vue`, `src/components/site/__tests__/ClientsMarquee.spec.ts`, `src/components/site/__tests__/CapabilitiesSection.spec.ts`, `src/components/site/__tests__/StatsSection.spec.ts`
- Modify: `src/views/HomeView.vue`, `src/components/inspira/README.md`

**Interfaces:**
- Produces `ClientsMarquee`：无 props，读取 `clients`
- Produces `CapabilitiesSection`：无 props，读取 `capabilities`、`sectionLabels.capabilities`
- Produces `StatsSection`：无 props，读取 `stats`；用 `usePreferredReducedMotion`

- [ ] **Step 1: 写失败测试**

`src/components/site/__tests__/ClientsMarquee.spec.ts`：

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ClientsMarquee from '../ClientsMarquee.vue'

describe('ClientsMarquee', () => {
  const wrapper = mount(ClientsMarquee)

  it('offers a screen-reader list and hides the repeated visuals', () => {
    expect(wrapper.find('section[aria-label="合作客户"]').exists()).toBe(true)
    expect(wrapper.find('[data-clients-sr]').text()).toContain('BLANK')
    expect(wrapper.find('[data-clients-marquee]').attributes('aria-hidden')).toBe('true')
  })
})
```

`src/components/site/__tests__/CapabilitiesSection.spec.ts`：

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import CapabilitiesSection from '../CapabilitiesSection.vue'

describe('CapabilitiesSection', () => {
  const wrapper = mount(CapabilitiesSection)

  it('renders label 03 and four capabilities', () => {
    expect(wrapper.text()).toContain('03 / 能力')
    expect(wrapper.findAll('li')).toHaveLength(4)
    expect(wrapper.text()).toContain('品牌识别')
    expect(wrapper.text()).toContain('艺术指导')
  })
})
```

`src/components/site/__tests__/StatsSection.spec.ts`：

```ts
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import StatsSection from '../StatsSection.vue'

const NumberTickerStub = defineComponent({
  name: 'NumberTicker',
  props: { value: Number, duration: Number, decimalPlaces: Number },
  template: '<span class="ticker">{{ value }}</span>',
})

describe('StatsSection', () => {
  const wrapper = mount(StatsSection, { global: { stubs: { NumberTicker: NumberTickerStub } } })

  it('renders four stats in order', () => {
    expect(wrapper.findAll('.ticker').map((node) => node.text())).toEqual(['48', '12', '7', '9'])
    expect(wrapper.text()).toContain('交付项目')
    expect(wrapper.text()).toContain('国家与地区')
  })
})
```

- [ ] **Step 2: 运行并确认失败**

Run: `npm run test:run -- src/components`
Expected: FAIL。

- [ ] **Step 3: vendor 并改写 Marquee / NumberTicker**

```bash
BASE="https://raw.githubusercontent.com/unovue/inspira-ui/eec920b047589058b4b02ba64deb614869e7237a/app/components/inspira/ui"
mkdir -p src/components/inspira/marquee src/components/inspira/number-ticker
curl -sL "$BASE/marquee/Marquee.vue" -o src/components/inspira/marquee/Marquee.vue
curl -sL "$BASE/number-ticker/NumberTicker.vue" -o src/components/inspira/number-ticker/NumberTicker.vue
```

改写点：
- `cn` 改从 `@/lib/utils` 引入。
- `NumberTicker`：`text-black ... dark:text-white` 改为 `text-current`；保留 `tabular-nums`。默认 `decimalPlaces` 保持 2，但本页必须显式传 `:decimal-places="0"`。
- `Marquee`：保留 props 与 scoped keyframes；确保 `[data-clients-marquee]` 可通过属性透传到根节点（在组件根 div 上 `v-bind="$attrs"` 或直接由父级传 class/attr）。

- [ ] **Step 4: 实现三个区块**

`ClientsMarquee.vue`：
- 根 `<section aria-label="合作客户" class="theme-paper border-b border-line-light">`。
- `h2.sr-only` 文案「合作客户」；`span.sr-only[data-clients-sr]` 列出全部 client，以「、」分隔。
- `Marquee` 传 `data-clients-marquee`、`aria-hidden="true"`、`class="[--duration:45s] [--gap:2.5rem] py-6"`、`:repeat="3"`、`pause-on-hover`；每个 client 为 `font-mono text-[clamp(1.25rem,2.5vw,2rem)] tracking-[0.12em] text-ink/50`。

`CapabilitiesSection.vue`：
- 根 `<section id="capabilities" class="theme-ink border-b border-line-dark px-... py-...">`。
- `SectionLabel` 03 / 能力。
- 左列 `md:sticky md:top-28`：`WHAT WE DO`（`text-[clamp(2.5rem,5vw,5rem)]`）+ 中文「我们能做什么」。
- 右侧 `<ul>` 四行；每行 `<li>` 含序号、双语标题、描述、右侧 `↗`；行间 `border-t border-line-dark`；hover `bg-paper/5`，箭头淡入。触控目标 `min-h-24`。

`StatsSection.vue`：
- 根 `<section id="stats" class="theme-ink border-b border-line-dark px-... py-...">`，不编号；加 `<h2 class="sr-only">工作室数字</h2>`。
- `<dl class="grid grid-cols-2 md:grid-cols-4">`，4 项，每项显示数字 + 标签。
- 数字：`usePreferredReducedMotion()` 为 `reduce` 时直接渲染 `pad ? '0' + value : value`；否则 `<span v-if="stat.pad">0</span><NumberTicker :value="stat.value" :duration="1600" :decimal-places="0" />`。
- 数字字号 `text-[clamp(3rem,6vw,5.5rem)] font-light tabular-nums`；标签 `font-mono text-[10px] tracking-[0.18em] text-paper/45`。

`HomeView.vue` 顺序：Work → `<ClientsMarquee />` → `<CapabilitiesSection />` → `<StatsSection />`。

- [ ] **Step 5: 运行测试与类型检查**

Run: `npm run test:run -- src && npm run type-check`
Expected: PASS。

---

### Task 7: 理念、联系与页脚

**Files:**
- Create: `src/components/inspira/spinning-text/SpinningText.vue`, `src/components/inspira/hyper-text/HyperText.vue`, `src/components/site/PhilosophySection.vue`, `src/components/site/ContactSection.vue`, `src/components/site/SiteFooter.vue`, `src/components/site/__tests__/PhilosophySection.spec.ts`, `src/components/site/__tests__/ContactSection.spec.ts`, `src/components/site/__tests__/SiteFooter.spec.ts`
- Modify: `src/views/HomeView.vue`, `src/App.vue`, `src/components/inspira/README.md`

**Interfaces:**
- Produces `PhilosophySection`：无 props，读取 `philosophy`、`sectionLabels.philosophy`
- Produces `ContactSection`：无 props，读取 `contact`、`studio`、`sectionLabels.contact`
- Produces `SiteFooter`：无 props，读取 `footer`、`studio`、`navLinks`
- Consumes `Marquee` from Task 6、`ShimmerButton` from Task 3

- [ ] **Step 1: 写失败测试**

`src/components/site/__tests__/PhilosophySection.spec.ts`：

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import PhilosophySection from '../PhilosophySection.vue'

describe('PhilosophySection', () => {
  const wrapper = mount(PhilosophySection)

  it('renders label 04, the marquee phrase and the note', () => {
    expect(wrapper.text()).toContain('04 / 理念')
    expect(wrapper.text()).toContain('FORM FOLLOWS FEELING')
    expect(wrapper.text()).toContain('如果一件作品需要解释')
  })
})
```

`src/components/site/__tests__/ContactSection.spec.ts`：

```ts
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ContactSection from '../ContactSection.vue'

const HyperTextStub = defineComponent({
  name: 'HyperText',
  props: { text: String },
  template: '<span>{{ text }}</span>',
})

const SpinningTextStub = defineComponent({
  name: 'SpinningText',
  props: { text: String },
  template: '<div data-spinning-badge />',
})

describe('ContactSection', () => {
  const wrapper = mount(ContactSection, {
    global: { stubs: { HyperText: HyperTextStub, SpinningText: SpinningTextStub } },
  })

  it('renders label 05, mail links and availability', () => {
    expect(wrapper.text()).toContain('05 / 联系')
    expect(wrapper.find('a[href="mailto:hello@monolith.studio"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('2027 年档期开放')
    expect(wrapper.find('[data-spinning-badge]').exists()).toBe(true)
  })
})
```

`src/components/site/__tests__/SiteFooter.spec.ts`：

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import SiteFooter from '../SiteFooter.vue'

describe('SiteFooter', () => {
  const wrapper = mount(SiteFooter)

  it('renders navigation, mail and back-to-top', () => {
    expect(wrapper.text()).toContain('© 2026 MONOLITH STUDIO')
    expect(wrapper.find('a[href="#hero"]').exists()).toBe(true)
    expect(wrapper.find('a[href="#work"]').exists()).toBe(true)
    expect(wrapper.find('a[href="mailto:hello@monolith.studio"]').exists()).toBe(true)
  })
})
```

- [ ] **Step 2: 运行并确认失败**

Run: `npm run test:run -- src/components`
Expected: FAIL。

- [ ] **Step 3: vendor 并改写 SpinningText / HyperText**

```bash
BASE="https://raw.githubusercontent.com/unovue/inspira-ui/eec920b047589058b4b02ba64deb614869e7237a/app/components/inspira/ui"
mkdir -p src/components/inspira/spinning-text src/components/inspira/hyper-text
curl -sL "$BASE/spinning-text/SpinningText.vue" -o src/components/inspira/spinning-text/SpinningText.vue
curl -sL "$BASE/hyper-text/HyperText.vue" -o src/components/inspira/hyper-text/HyperText.vue
```

改写点：
- `cn` 改从 `@/lib/utils` 引入。
- `HyperText`：
  - Props 增加 `alphabet?: string`（默认 `"ABCDEFGHIJKLMNOPQRSTUVWXYZ"`）。
  - `getRandomLetter` 使用 `props.alphabet`。
  - 模板中 `{{ letter.toUpperCase() }}` 改为 `{{ letter }}`。
  - `animateOnLoad` 默认 `false`。
  - 增加 `disabled?: boolean`；`disabled` 时 `@mouseenter` 不触发动画。
- `SpinningText` 保持原样（颜色继承 currentColor），由父级控制尺寸与字号。

- [ ] **Step 4: 实现 PhilosophySection**

- 根 `<section id="philosophy" class="theme-paper border-b border-line-light px-... py-...">`。
- `SectionLabel` 04 / 理念。
- `h2.sr-only` 放完整理念句。
- `<Marquee data-philosophy-marquee aria-hidden="true" class="[--duration:70s] [--gap:3rem]" :repeat="3" pause-on-hover>`；槽内 `<span class="whitespace-nowrap font-sans text-[clamp(3.5rem,11vw,11rem)] leading-none tracking-[-0.03em] text-outline">FORM FOLLOWS FEELING — 形式追随感受 —</span>`。
- 下方居中备注 `philosophy.note`，`text-ink/60`。

`HomeView.vue` 在 Stats 后加入 `<PhilosophySection />`。

- [ ] **Step 5: 实现 ContactSection**

- 根 `<section id="contact" class="theme-paper relative overflow-hidden px-... py-...">`。
- `SectionLabel` 05 / 联系。
- 三行巨型标题：字号 `text-[clamp(3rem,10vw,10rem)] leading-[0.9] tracking-[-0.04em]`，最后一行 `font-serif italic font-normal`。
- 邮箱链接：`<a :href="`mailto:${studio.email}`" class="...">` 内放 `HyperText :text="studio.email" :animate-on-load="false" alphabet="abcdefghijklmnopqrstuvwxyz"`；`usePreferredReducedMotion` 为 reduce 时改用普通文本。
- 可用性说明 `contact.availability`，等宽小字。
- 主 CTA：`ShimmerButton :href="`mailto:${studio.email}`" background="#0A0A09" shimmer-color="#F2F0EA" class="text-paper"` 文案「开始一个项目」。
- 旋转徽章：`<div v-if="!reduced" data-spinning-badge class="absolute bottom-12 right-8 hidden md:block">`，内部 `<SpinningText :text="contact.badge" :duration="14" :radius="12" class="h-40 w-40 text-[10px] tracking-[0.18em]" />`；reduced 时不渲染该容器。
- 测试使用 stub 时，ContactSection 内的 `v-if="!reduced"` 为真（matchMedia 返回 no-preference），`[data-spinning-badge]` 存在。
- 手机端徽章隐藏，标题单列。

- [ ] **Step 6: 实现 SiteFooter**

- 根 `<footer class="theme-ink border-t border-line-dark px-... pt-...">`。
- 巨型字标 `MONOLITH`：`aria-hidden="true"`，`text-[clamp(4rem,18vw,16rem)] leading-[0.75] tracking-[-0.05em] text-paper/15 overflow-hidden`。
- 三栏：`nav[aria-label="页脚导航"]` 内放 SITEMAP（`navLinks` 锚点）、SOCIAL（`footer.socials` 渲染为 `<span>`，不做链接）、CONTACT（邮箱 mailto、城市、时间或「SHANGHAI — BERLIN」）。
- 底行：copyright、motto、`<a href="#hero">返回顶部 ↑</a>`。
- `App.vue` 在 `<RouterView />` 后加入 `<SiteFooter />`。

`HomeView.vue` 在 Philosophy 后加入 `<ContactSection />`。

- [ ] **Step 7: 运行测试与类型检查**

Run: `npm run test:run -- src && npm run type-check`
Expected: PASS。

---

### Task 8: 组装、响应式、可达性与视觉验收

**Files:**
- Modify: `src/views/HomeView.vue`, `src/App.vue`, `src/assets/main.css`, 以及需要微调的 `src/components/site/*.vue`

**Interfaces:**
- 消费全部前序组件与数据；不新增公共 API

- [ ] **Step 1: 最终组装**

`HomeView.vue` 严格按此顺序：

```vue
<main id="main">
  <HeroSection />
  <ManifestoSection />
  <WorkSection />
  <ClientsMarquee />
  <CapabilitiesSection />
  <StatsSection />
  <PhilosophySection />
  <ContactSection />
</main>
```

`App.vue`：skip link + `NoiseOverlay` + `SiteNav` + `RouterView` + `SiteFooter`。

- [ ] **Step 2: 响应式与安全区**

- 在 `main.css` 加 `body { overflow-x: clip; }` 作为兜底，但不得用它掩盖布局错误。
- 390px：Hero 字号、作品单列、能力区取消 sticky、数字 2×2、联系标题不裁切、页脚字标不横向溢出。
- 确保所有点击目标至少 44px 高（导航链接、CTA、页脚链接）。
- 检查 `mix-blend-difference` 导航在 Hero、作品、能力、联系区都清晰可读。

- [ ] **Step 3: 减少动效收口**

- `Reveal`：已有 reduce 分支。
- `HeroSection` 光斑：`motion-reduce:hidden` + `@media (hover: none)` 隐藏。
- `WorkCard`：`usePreferredReducedMotion()` 为 reduce 时给 `GlowingEffect` 传 `:disabled="true"`。
- `StatsSection`：已有静态终值分支。
- `ContactSection`：reduce 时不渲染 `SpinningText`。
- `HyperText`：reduce 时传 `disabled`，不触发字符扰动。
- `Marquee`：全局 CSS 已把 `.animate-marquee` 设为 `animation: none`。

- [ ] **Step 4: 运行全部自动化验证**

```bash
npm run test:run
npm run type-check
npm run build
```

Expected: 全部通过；构建无警告性错误。

- [ ] **Step 5: 静态审计**

```bash
grep -RInE "dd7bbb|d79f1e|5a922c|4c7894|#ff[0-9a-f]{2}|#00[0-9a-f]{2}" src || echo "no-chromatic-hex"
grep -RInE "#[0-9a-fA-F]{6}" src --exclude=README.md | grep -viE "0A0A09|F2F0EA|8B8A83" || echo "no-unexpected-hex"
grep -RInE "https?://" src --exclude=README.md || echo "no-external-urls"
grep -RIn "http" src/components/site src/views || echo "no-external-sources"
```

Expected: 只出现 `no-chromatic-hex`、`no-unexpected-hex`、`no-external-urls`、`no-external-sources`。

- [ ] **Step 6: 浏览器视觉验收（Playwright MCP）**

如工具未加载，先用 ToolSearch 加载：`select:mcp__plugin_playwright_playwright__browser_navigate,mcp__plugin_playwright_playwright__browser_resize,mcp__plugin_playwright_playwright__browser_evaluate,mcp__plugin_playwright_playwright__browser_take_screenshot,mcp__plugin_playwright_playwright__browser_emulate_media,mcp__plugin_playwright_playwright__browser_press_key,mcp__plugin_playwright_playwright__browser_console_messages,mcp__plugin_playwright_playwright__browser_close`。

1. 后台启动：`npm run dev -- --port 4173`（记录 PID，结束后关闭）。
2. 打开 `http://localhost:4173`；调用 `browser_console_messages({ level: 'warning' })`，确认没有 error 级别消息。
3. 桌面 1440×1000：截图整页；检查 Hero、作品错落网格、能力区、数字、理念跑马灯、联系、页脚。
4. 在浏览器执行并确认：

```js
document.documentElement.scrollWidth <= window.innerWidth
```

```js
(() => {
  const bad = []
  for (const el of document.querySelectorAll('*')) {
    const s = getComputedStyle(el)
    for (const prop of ['color', 'backgroundColor', 'borderTopColor', 'borderBottomColor']) {
      const m = s[prop].match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
      if (m && !(m[1] === m[2] && m[2] === m[3])) bad.push([el.tagName, prop, s[prop]])
    }
  }
  return bad.slice(0, 20)
})()
```

Expected: `true` 与 `[]`。

```js
getComputedStyle(document.body).fontFamily
```

Expected: 包含 `Inter Tight` 与 `PingFang SC`。

5. 移动端 390×844：重新加载，重复 `scrollWidth` 检查并截图。
6. reduced motion：`browser_emulate_media({ reducedMotion: 'reduce' })`，重新加载后确认：

```js
(() => {
  const marquee = document.querySelector('.animate-marquee')
  return {
    marqueeAnimation: marquee ? getComputedStyle(marquee).animationName : 'none',
    badgeVisible: !!document.querySelector('[data-spinning-badge]'),
    spotlight: !!document.querySelector('.hero-spotlight') && getComputedStyle(document.querySelector('.hero-spotlight')).display !== 'none',
  }
})()
```

Expected: `marqueeAnimation: 'none'`，`badgeVisible: false`（或静态替代），`spotlight: false`。

7. 键盘：按 `Tab` 至少 5 次，确认焦点态清晰且顺序合理；截图。
8. 用 Read 查看桌面与移动端截图，若出现以下问题就地修正并重复验收：
   - 标题换行难看 / 裁切
   - 作品卡比例失衡
   - 字体没有生效或中文过粗
   - 导航在某个区块不可读
   - 动效抢戏或过密

- [ ] **Step 7: 最终验收清单**

逐项核对设计稿第 10 节：

- [ ] `/` 可正常加载且无控制台错误
- [ ] `npm run test:run` 全绿
- [ ] `npm run type-check` 通过
- [ ] `npm run build` 通过
- [ ] 1440 与 390 截图均无横向滚动
- [ ] 全站无彩色值（计算样式 + grep）
- [ ] reduced-motion 下无无限动画 / 光斑 / 旋转徽章
- [ ] 锚点、邮箱、返回顶部可用；作品卡占位链接不跳走
- [ ] 键盘可遍历，焦点可见
- [ ] 脚手架残留已删除，无 About 路由、无 Vue logo

- [ ] **Step 8: 收尾**

关闭 dev server；如用户未要求，不初始化 git、不部署。
