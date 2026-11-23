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

export interface Capability {
  index: string
  titleEn: string
  titleZh: string
  description: string
}

export interface Stat {
  value: number
  label: string
  pad?: boolean
}

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

export const works: Work[] = [
  {
    id: 'blank-furniture',
    index: '01',
    titleEn: 'BLANK FURNITURE',
    titleZh: '白卷家具',
    discipline: '品牌系统 · 数字官网',
    year: '2026',
    summary: '让沉默的家具自己说话。',
    art: 'blank',
    coverAlt: 'BLANK FURNITURE 项目封面：留白柱体与排版网格',
  },
  {
    id: 'north-34',
    index: '02',
    titleEn: 'NORTH/34 ARCHITECTS',
    titleZh: '北纬三十四',
    discipline: '数字体验 · 作品档案',
    year: '2025',
    summary: '为建筑事务所建立一座可漫游的数字展馆。',
    art: 'north34',
    coverAlt: 'NORTH/34 ARCHITECTS 项目封面：等距建筑线稿',
  },
  {
    id: 'handle',
    index: '03',
    titleEn: 'HANDLE',
    titleZh: '执物',
    discipline: '产品设计 · 电商体验',
    year: '2025',
    summary: '一件日常器物，一次触感优先的购买体验。',
    art: 'handle',
    coverAlt: 'HANDLE 项目封面：半调圆点组成的器物轮廓',
  },
  {
    id: 'slow-press',
    index: '04',
    titleEn: 'SLOW PRESS',
    titleZh: '慢印',
    discipline: '编辑设计 · 线上书店',
    year: '2024',
    summary: '把翻书的节奏，带进屏幕。',
    art: 'slowpress',
    coverAlt: 'SLOW PRESS 项目封面：巨大衬线字母的印刷样张',
  },
  {
    id: 'atlas',
    index: '05',
    titleEn: 'ATLAS',
    titleZh: '图志',
    discipline: '展览视觉 · 空间标识',
    year: '2024',
    summary: '用一张地图，讲述一座城市的密度。',
    art: 'atlas',
    coverAlt: 'ATLAS 项目封面：等高线地形与细密曲线',
  },
]

export const clients = [
  'BLANK',
  'NORTH/34',
  'HANDLE',
  'SLOW PRESS',
  'ATLAS',
  'VESSEL',
  'COMMON GROUND',
  'FIELD NOTES',
]

export const capabilities: Capability[] = [
  {
    index: '01',
    titleEn: 'Brand Identity',
    titleZh: '品牌识别',
    description: '命名、标志、视觉系统与品牌规范。',
  },
  {
    index: '02',
    titleEn: 'Digital Experience',
    titleZh: '数字体验',
    description: '官网、产品界面与设计系统。',
  },
  {
    index: '03',
    titleEn: 'Motion & Interaction',
    titleZh: '动效与交互',
    description: '微交互、转场与滚动叙事。',
  },
  {
    index: '04',
    titleEn: 'Art Direction',
    titleZh: '艺术指导',
    description: '摄影方向、编辑排版与内容气质。',
  },
]

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
