// 万户优铺 - 其余页面数据（沿用首页业务语义与图片资源，不改动首页数据）

import { navItems } from '@/lib/home-data'

/* ------------------------- 闲置社区 ------------------------- */

export type IdleItem = {
  id: number
  title: string
  price: number
  original?: number
  cond: string // 成色
  image: string
  location: string
  seller: string
  publishDate: string
  wants: number // 想要人数
  cat: string
}

export const idleCats: { cat: string; label: string }[] = [
  { cat: 'all', label: '全部' },
  { cat: 'equip', label: '厨房设备' },
  { cat: 'table', label: '桌椅家具' },
  { cat: 'fridge', label: '冷藏冷冻' },
  { cat: 'tableware', label: '餐具器皿' },
  { cat: 'other', label: '其他闲置' },
]

const IMG = {
  equip: '/images/photo-equip.png',
  shop: '/images/photo-shop.png',
  canteen: '/images/photo-canteen.png',
  drink: '/images/photo-drink.png',
  sauce: '/images/photo-sauce.png',
  training: '/images/photo-training.png',
}

export const idleItems: IdleItem[] = [
  { id: 1, title: '九成新商用四门冰柜 制冷强劲', price: 1800, original: 4200, cond: '9成新', image: IMG.equip, location: '长沙 · 岳麓区', seller: '老张餐饮', publishDate: '2026-07-09', wants: 23, cat: 'fridge' },
  { id: 2, title: '大型不锈钢操作台 4张打包出', price: 600, original: 1600, cond: '8成新', image: IMG.shop, location: '长沙 · 天心区', seller: '小陈奶茶', publishDate: '2026-07-09', wants: 15, cat: 'equip' },
  { id: 3, title: '闲置餐桌椅一批 快餐店同款', price: 1200, original: 3000, cond: '7成新', image: IMG.canteen, location: '湘潭 · 雨湖区', seller: '味多多快餐', publishDate: '2026-07-08', wants: 31, cat: 'table' },
  { id: 4, title: '商用双缸炸炉 几乎全新', price: 900, original: 2100, cond: '9成新', image: IMG.equip, location: '长沙 · 芙蓉区', seller: '炸鸡王', publishDate: '2026-07-08', wants: 18, cat: 'equip' },
  { id: 5, title: '奶茶设备整套转让 封口机制冰机', price: 3500, original: 8000, cond: '8成新', image: IMG.drink, location: '长沙 · 岳麓区', seller: '茶小满', publishDate: '2026-07-07', wants: 42, cat: 'equip' },
  { id: 6, title: '全套骨瓷餐具 未开封', price: 320, original: 700, cond: '全新', image: IMG.sauce, location: '长沙 · 望城区', seller: '湘味源', publishDate: '2026-07-07', wants: 9, cat: 'tableware' },
  { id: 7, title: '商用冷藏工作台 保鲜效果好', price: 1500, original: 3600, cond: '8成新', image: IMG.equip, location: '长沙 · 高新区', seller: '园区食堂', publishDate: '2026-07-06', wants: 12, cat: 'fridge' },
  { id: 8, title: '烘焙店闲置烤箱 三层六盘', price: 2200, original: 5000, cond: '9成新', image: IMG.training, location: '长沙 · 天心区', seller: '麦香烘焙', publishDate: '2026-07-06', wants: 27, cat: 'equip' },
]

/* ------------------------- 资讯 ------------------------- */

export type NewsArticle = {
  id: number
  title: string
  summary: string
  cover?: string
  source: string
  publishDate: string
  views: number
  cat: string
  hot?: boolean
}

export const newsCats: { cat: string; label: string }[] = [
  { cat: 'rec', label: '推荐' },
  { cat: 'policy', label: '政策解读' },
  { cat: 'operate', label: '经营干货' },
  { cat: 'case', label: '成功案例' },
  { cat: 'trend', label: '行业趋势' },
]

export const newsArticles: NewsArticle[] = [
  { id: 1, cat: 'policy', hot: true, title: '2026年高校食堂档口招商新规解读', summary: '教育部联合市场监管总局发布高校餐饮准入新规，明确档口经营者资质要求、食品安全责任及退出机制，对招商模式影响深远。', cover: '/images/photo-canteen.png', source: '万户优铺研究院', publishDate: '2026-07-09', views: 5230 },
  { id: 2, cat: 'operate', title: '档口选址避坑指南：这5个位置千万别碰', summary: '结合上百个真实案例，总结食堂档口选址的常见误区，从人流动线、竞争密度到租金结构，手把手教你选到黄金档口。', cover: '/images/photo-shop.png', source: '餐饮老炮说', publishDate: '2026-07-08', views: 3890 },
  { id: 3, cat: 'case', hot: true, title: '从1个档口到30家门店，他做对了什么', summary: '「味湘来」创始人自述创业历程，揭秘标准化运营体系如何支撑品牌快速扩张，以及高校团餐赛道的增长逻辑。', cover: '/images/photo-drink.png', source: '创业故事汇', publishDate: '2026-07-08', views: 6710 },
  { id: 4, cat: 'trend', title: '2026餐饮供应链趋势：预制菜与酱料标准化', summary: '随着人力成本上升，标准化酱料与半成品正成为中小餐饮降本增效的关键，供应链上游迎来新一轮洗牌。', cover: '/images/photo-sauce.png', source: '中国餐饮报', publishDate: '2026-07-07', views: 2450 },
  { id: 5, cat: 'operate', title: '一份让顾客回头的菜单该怎么设计', summary: '菜单不只是价目表，更是经营策略。从爆款结构、定价心理到视觉呈现，拆解高转化菜单的设计方法论。', source: '经营参谋', publishDate: '2026-07-07', views: 1980 },
  { id: 6, cat: 'policy', title: '食品经营许可证办理全流程（2026版）', summary: '手把手梳理食品经营许可证办理所需材料、办理时限与常见驳回原因，创业开店必备实用指南。', source: '政务服务通', publishDate: '2026-07-06', views: 3120 },
  { id: 7, cat: 'case', title: '大学城麻辣烫店年入20万的经营账本', summary: '一位大学城麻辣烫店主公开真实经营数据，从成本结构到引流打法，还原一家小店的盈利全貌。', cover: '/images/photo-training.png', source: '小店观察', publishDate: '2026-07-06', views: 4560 },
]

/* ------------------------- 我的 ------------------------- */

export const profile = {
  name: '陈师傅餐饮',
  desc: '湖南大学食堂档口经营者',
  avatar: '/images/avatar1.png',
  verified: true,
  vipLevel: '认证商户',
  stats: {
    points: 1280,
    posts: 12,
    favorites: 34,
    likes: 89,
    views: 5680,
    balance: 71,
  },
}

export type MenuItem = { key: string; label: string; icon: string; badge?: number }

// 我的发布/收藏/点赞等业务入口（沿用底部导航与卡片交互语义）
export const myServiceMenu: MenuItem[] = [
  { key: 'posts', label: '我的发布', icon: 'FileText' },
  { key: 'favorites', label: '我的收藏', icon: 'Star' },
  { key: 'likes', label: '我的点赞', icon: 'Heart' },
  { key: 'history', label: '浏览历史', icon: 'History' },
]

export const myToolMenu: MenuItem[] = [
  { key: 'invite', label: '邀请好友', icon: 'UserPlus' },
  { key: 'orders', label: '订单中心', icon: 'Receipt' },
  { key: 'history', label: '浏览记录', icon: 'History' },
  { key: 'service', label: '客服中心', icon: 'Headphones' },
  { key: 'feedback', label: '意见反馈', icon: 'MessageSquare' },
  { key: 'settings', label: '设置', icon: 'Settings' },
]

// 发布页可选分类（复用首页宫格导航语义）
export const publishCats = navItems.map((n) => ({ cat: n.cat, label: n.label }))

// 发布页二级分类（按一级分类 cat 归类）
export const publishSubCats: Record<string, string[]> = {
  canteen: ['档口招商', '整体承包', '窗口出租', '摊位招租'],
  street: ['商铺出租', '商铺转让', '柜台招商', '广告位招租'],
  hospital: ['档口招商', '整体承包', '窗口出租'],
  park: ['档口招商', '食堂承包', '商铺出租', '自助餐招商'],
  recruit: ['管理岗', '技术岗', '服务岗', '兼职'],
  biz: ['餐饮转让', '旺铺转让', '设备转让', '仓库转让'],
  shop: ['沿街旺铺', '商业街铺', '综合体铺', '社区商铺'],
  brand: ['餐饮加盟', '饮品加盟', '小吃加盟', '中餐加盟'],
  training: ['面食培训', '饮品培训', '小吃培训', '烧烤培训'],
  sauce: ['底料供应', '酱���代工', '原料批发', '设备供应'],
}

// 发布页预设标签（可多选，也支持自定义添加）
export const publishTags: string[] = [
  '本科',
  '专科',
  '纯租金',
  '倒扣抽点',
  '设备齐全',
  '含水电',
  '含设备',
  '人流量大',
  '包吃住',
  '低价转让',
  '面食',
  '饮品',
  '快餐',
  '小吃',
  '管理岗',
  '技术岗',
  '品牌加盟',
  '沿街旺铺',
  '商业街',
  '中央厨房',
]

/* ------------------------- 省市区三级数据 ------------------------- */

export type Region = {
  name: string
  children?: Region[]
}

// 精简版省/市/区三级数据（覆盖平台主要业务区域）
export const regions: Region[] = [
  {
    name: '湖南省',
    children: [
      { name: '长沙市', children: [{ name: '岳麓区' }, { name: '天心区' }, { name: '芙蓉区' }, { name: '雨花区' }, { name: '开福区' }, { name: '望城区' }, { name: '高新区' }] },
      { name: '湘潭市', children: [{ name: '雨湖区' }, { name: '岳��区' }, { name: '湘潭县' }] },
      { name: '株洲市', children: [{ name: '天元区' }, { name: '芦淞区' }, { name: '荷塘区' }] },
      { name: '衡阳市', children: [{ name: '雁峰区' }, { name: '石鼓区' }, { name: '蒸湘区' }] },
    ],
  },
  {
    name: '湖北省',
    children: [
      { name: '武汉市', children: [{ name: '洪山区' }, { name: '武昌区' }, { name: '江汉区' }, { name: '江夏区' }, { name: '汉阳区' }] },
      { name: '宜昌市', children: [{ name: '西陵区' }, { name: '伍家岗区' }, { name: '点军区' }] },
      { name: '襄阳市', children: [{ name: '襄城区' }, { name: '樊城区' }, { name: '襄州区' }] },
    ],
  },
  {
    name: '广东省',
    children: [
      { name: '广州市', children: [{ name: '天河区' }, { name: '越秀区' }, { name: '海珠区' }, { name: '番禺区' }, { name: '白云区' }] },
      { name: '深圳市', children: [{ name: '南山区' }, { name: '福田区' }, { name: '宝安区' }, { name: '龙岗区' }] },
      { name: '东莞市', children: [{ name: '南城街道' }, { name: '东城街道' }, { name: '莞城街道' }] },
    ],
  },
  {
    name: '江西省',
    children: [
      { name: '南昌市', children: [{ name: '东湖区' }, { name: '西湖区' }, { name: '青山湖区' }, { name: '红谷滩区' }] },
      { name: '赣州市', children: [{ name: '章贡区' }, { name: '南康区' }, { name: '赣县区' }] },
    ],
  },
]

/* ------------------------- 平台公告 ------------------------- */

export type Notice = {
  id: number
  title: string
  tag: string // 分类标签
  date: string
  pinned?: boolean
  summary: string
  content: string[] // 正文段落
}

export const notices: Notice[] = [
  {
    id: 1,
    title: '欢迎使用万户优铺，真实信息共建诚信平台',
    tag: '平台公告',
    date: '2026-07-09',
    pinned: true,
    summary: '万户优铺致力于打造高校及企业餐饮商业信息服务平台，倡导真实、诚信的信息发布环境。',
    content: [
      '尊敬的万户优铺用户，欢迎您加入我们的平台！',
      '万户优铺是一个专注于高校食堂、企业园区、医院餐厅等场景的餐饮商业信息服务平台，为档口招商、店铺转租、人才招聘、品牌加盟、技术培训、酱料供应等提供精准对接服务。',
      '为共同营造诚信的信息环境，我们倡议：所有发布的信息务必真实有效，如实填写经营条件、收费模式与联系方式；严禁发布虚假、夸大或误导性内容。平台将对认证商户提供优先展示与身份标识。',
      '如您在使用过程中遇到任何问题，可通过「我的-客服中心」联系我们。祝您在万户优铺找到理想的商机！',
    ],
  },
  {
    id: 2,
    title: '关于加强信息真实性审核的通知',
    tag: '规则更新',
    date: '2026-07-06',
    summary: '为保障用户权益，平台将进一步加强信息发布审核，认证商户可获得更高曝光权重。',
    content: [
      '为持续提升平台信息质量、保护广大用户的合法权益，即日起平台将对发布信息实施更严格的审核机制。',
      '一、所有涉及转让费、租金、招聘薪资等关键信息须与实际情况一致，平台将进行抽样核验。',
      '二、鼓励用户完成实名认证与商户认证，认证账号发布的信息将获得更高的曝光权重及专属标识。',
      '三、对于经核实存在虚假信息的账号，平台将视情节采取下架信息、限制发布、封禁账号等措施。',
      '感谢您的理解与支持，让我们共同维护诚信的交易环境。',
    ],
  },
  {
    id: 3,
    title: '暑期高校档口招商专场活动开启',
    tag: '活动通知',
    date: '2026-07-01',
    summary: '暑期档口招商专场正式上线，多所高校优质档位集中释放，认证商户报名享专属对接服务。',
    content: [
      '暑假是高校餐饮档口调整与招商的黄金窗口期。本次专场活动汇集长沙、湘潭、武汉等地多所高校的优质空余档位，涵盖校园食堂、校园商圈、企业园区等多种场景。',
      '活动期间，认证商户报名参与可享受平台专属对接服务，包括档口信息优先推送、实地考察协助等。',
      '名额有限，欢迎有意向的经营者尽快通过平台发布需求或联系客服报名。',
    ],
  },
]
