// 万户优铺 - 首页数据（文本、跳转含义、分类等均沿用原型，不改动）

export type NavItem = {
  cat: string
  label: string
  icon: string
}

export type CatTab = {
  cat: string
  label: string
}

export type Banner = {
  id: number
  img: string
  title: string
  subtitle: string
  toast: string
}

export type Post = {
  id: number
  cat: string
  catLabel: string
  pinned?: boolean
  verified?: boolean
  userLiked?: boolean
  userFaved?: boolean
  title: string
  desc: string
  tags: string[]
  /** 发布表单填写的商铺详情字段（学校名称、在校人数、商铺楼层、商铺面积等） */
  details?: { label: string; value: string }[]
  location: string
  phone: string
  images: string[]
  avatar: string
  username: string
  time: string
  publishDate: string
  likes: number
  favorites: number
  views: number
  shares: number
}

// 顶部宫格导航（对应 switchHomeCatByNav）
export const navItems: NavItem[] = [
  { cat: 'canteen', label: '校园食堂', icon: '/images/cat-canteen.png' },
  { cat: 'street', label: '校园商圈', icon: '/images/cat-street.png' },
  { cat: 'hospital', label: '医院餐厅', icon: '/images/cat-hospital.png' },
  { cat: 'park', label: '企业园区', icon: '/images/cat-park.png' },
  { cat: 'recruit', label: '人才招聘', icon: '/images/cat-recruit.png' },
  { cat: 'biz', label: '店铺转租', icon: '/images/cat-biz.png' },
  { cat: 'shop', label: '校外旺铺', icon: '/images/cat-shop.png' },
  { cat: 'brand', label: '品牌加盟', icon: '/images/cat-brand.png' },
  { cat: 'training', label: '技术培训', icon: '/images/cat-training.png' },
  { cat: 'sauce', label: '酱料供应', icon: '/images/cat-sauce.png' },
]

// 分类标签栏（对应 switchHomeCat）
export const catTabs: CatTab[] = [
  { cat: 'all', label: '全部' },
  { cat: 'canteen', label: '校园食堂' },
  { cat: 'transfer', label: '档口转让' },
  { cat: 'recruit', label: '人才招聘' },
  { cat: 'biz', label: '店铺转租' },
  { cat: 'shop', label: '校外旺铺' },
  { cat: 'brand', label: '品牌加盟' },
]

export const banners: Banner[] = [
  {
    id: 0,
    img: '/images/banner1.png',
    title: '高校食堂招商专场',
    subtitle: '优质档口 · 精准对接',
    toast: '查看详情：高校食堂招商专场',
  },
  {
    id: 1,
    img: '/images/banner2.png',
    title: '闲置设备限时秒杀',
    subtitle: '好货低价 · 先到先得',
    toast: '查看详情：闲置设备限时秒杀',
  },
  {
    id: 2,
    img: '/images/banner3.png',
    title: '品牌加盟季 · 0元审核',
    subtitle: '一站服务 · 轻松开店',
    toast: '查看详情：品牌加盟季·0元审核',
  },
]

export const announcements: string[] = [
  '欢迎使用万户优铺，真实信息共建诚信平台',
]

const P = {
  canteen: '/images/photo-canteen.png',
  drink: '/images/photo-drink.png',
  shop: '/images/photo-shop.png',
  equip: '/images/photo-equip.png',
  training: '/images/photo-training.png',
  sauce: '/images/photo-sauce.png',
}

export const posts: Post[] = [
  { id: 1, cat: 'canteen', catLabel: '校园食堂', pinned: true, verified: true, userLiked: true, userFaved: false, title: '湖南大学学生食堂档口招商', desc: '在校生人数28000人，档口面积15-25㎡可选，经营品类：盖浇饭、面食、麻辣烫、饮品等，收费模式纯租金+水电网均摊，水电标准按商业用电收费，空余档位3个，进场要求有餐饮经验。', tags: ['本科', '纯租金', '3个档位', '人流量大'], details: [{ label: '学校名称', value: '湖南大学' }, { label: '在校人数', value: '28000 人' }, { label: '商铺楼层', value: '食堂一楼' }, { label: '商铺面积', value: '15-25 ㎡' }], location: '长沙 · 岳麓区', phone: '138****5678', images: [P.canteen, P.drink, P.equip], avatar: '湖', username: '湖南大学餐饮部', time: '2小时前', publishDate: '2026-07-09', likes: 128, favorites: 56, views: 2340, shares: 45 },
  { id: 2, cat: 'canteen', catLabel: '校园食堂', pinned: true, verified: true, userLiked: false, userFaved: false, title: '长沙理工大学食堂档口整体招租', desc: '专科院校，在校生15000人，各档口面积12-20㎡，经营品类面食、快餐均可，收费倒扣抽点模式18%，含基础水电，进场即可营业。', tags: ['专科', '倒扣抽点', '设备齐全', '含水电'], details: [{ label: '学校名称', value: '长沙理工大学' }, { label: '在校人数', value: '15000 人' }, { label: '商铺楼层', value: '食堂二楼' }, { label: '商铺面积', value: '12-20 ㎡' }], location: '长沙 · 天心区', phone: '139****2345', images: [P.canteen, P.drink], avatar: '长', username: '长理食堂管理处', time: '3小时前', publishDate: '2026-07-09', likes: 96, favorites: 42, views: 1890, shares: 28 },
  { id: 3, cat: 'canteen', catLabel: '校园食堂', pinned: false, userLiked: false, userFaved: false, title: '湖南科技大学档口招商（特色小吃）', desc: '本科院校在校生22000人，档口面积18㎡，经营品类特色小吃优先（炸鸡汉堡、奶茶、烘焙），收费模式纯租金2000/月+水电自理。', tags: ['本科', '纯租金', '18㎡', '特色小吃'], details: [{ label: '学校名称', value: '湖南科技大学' }, { label: '在校人数', value: '22000 人' }, { label: '商铺楼层', value: '食堂一楼' }, { label: '商铺面积', value: '18 ㎡' }], location: '湘潭 · 雨湖区', phone: '137****8901', images: [P.canteen, P.drink], avatar: '科', username: '科大后勤处', time: '5小时前', publishDate: '2026-07-09', likes: 75, favorites: 31, views: 1560, shares: 19 },
  { id: 4, cat: 'transfer', catLabel: '档口转让', pinned: true, userLiked: true, userFaved: true, title: '中南大学校内商业街档口转让', desc: '本科院校，在校生35000人，商业街黄金位置档口转让，面积25㎡，目前经营奶茶店，月营业额8-10万，因个人原因转让，转让费面议。含设备齐全。', tags: ['本科', '商业街', '25㎡', '含设备'], details: [{ label: '学校名称', value: '中南大学' }, { label: '在校人数', value: '35000 人' }, { label: '商铺楼层', value: '商业街一楼' }, { label: '商铺面积', value: '25 ㎡' }], location: '长沙 · 岳麓区', phone: '136****3456', images: [P.drink, P.shop], avatar: '中', username: '小陈餐饮', time: '1天前', publishDate: '2026-07-08', likes: 203, favorites: 89, views: 4520, shares: 78 },
  { id: 5, cat: 'transfer', catLabel: '档口转让', pinned: false, userLiked: false, userFaved: false, title: '湖南农大食堂档口低价转让', desc: '在校生20000人，档口面积15㎡，目前经营面食，月营业额稳定4万+，因回乡发展转让，转让费3.5万含设备，收费模式纯租金1000/月。', tags: ['本科', '15㎡', '面食', '低价'], details: [{ label: '学校名称', value: '湖南农业大学' }, { label: '在校人数', value: '20000 人' }, { label: '商铺楼层', value: '食堂一楼' }, { label: '商铺面积', value: '15 ㎡' }], location: '长沙 · 芙蓉区', phone: '152****7890', images: [P.drink], avatar: '农', username: '老张餐饮', time: '2天前', publishDate: '2026-07-07', likes: 56, favorites: 23, views: 1230, shares: 15 },
  { id: 6, cat: 'recruit', catLabel: '人才招聘', pinned: false, verified: true, userLiked: false, userFaved: true, title: '招聘高校食堂厨师长（管理岗）', desc: '招聘人数2人，工资待遇8000-12000/月，包吃住，要求5年以上团餐管理经验，负责食堂整体运营管理，工作地点长沙岳麓区。', tags: ['管理岗', '8000-12000', '包吃住', '5年经验'], location: '长沙 · 岳麓区', phone: '155****2345', images: [], avatar: '招', username: '湘味餐饮集团', time: '3小时前', publishDate: '2026-07-09', likes: 45, favorites: 18, views: 890, shares: 11 },
  { id: 7, cat: 'recruit', catLabel: '人才招聘', pinned: false, userLiked: false, userFaved: false, title: '长沙高校食堂急招面点师傅（技术岗）', desc: '招聘2人，工资6000-8000/月包食宿，要求会制作各类中式面点，工作内容负责早餐供应，工作地点长沙望城区，需有健康证。', tags: ['技术岗', '6000-8000', '包食宿', '面点师傅'], location: '长沙 · 望城区', phone: '187****9012', images: [], avatar: '面', username: '湘食汇餐饮', time: '6小时前', publishDate: '2026-07-09', likes: 32, favorites: 12, views: 670, shares: 8 },
  { id: 8, cat: 'biz', catLabel: '生意转让', pinned: false, userLiked: false, userFaved: false, title: '长沙河西大学城小吃街旺铺整体转让', desc: '位于大学城核心商圈，周边5所高校，面积40㎡，目前经营麻辣烫，日均营业额3000+，年利润20w+。因扩大经营规模转让，含全套设备、配方。转让费12万。', tags: ['大学城商圈', '40㎡', '年利润20万+', '含配方'], location: '长沙 · 岳麓区', phone: '158****6789', images: [P.shop, P.drink], avatar: '旺', username: '李先生', time: '1天前', publishDate: '2026-07-08', likes: 89, favorites: 36, views: 2100, shares: 32 },
  { id: 9, cat: 'shop', catLabel: '校外旺铺', pinned: true, userLiked: false, userFaved: false, title: '长沙岳麓区临街旺铺出租（适合餐饮）', desc: '沿街门店，面积60㎡，人流密集，周边有学校、写字楼。之前做早餐店，设施齐全，可做快餐/小吃/饮品等，租金8000/月，押二付三。', tags: ['沿街门店', '60㎡', '人流密集', '设施齐全'], location: '长沙 · 岳麓区', phone: '139****4567', images: [P.shop, P.equip], avatar: '店', username: '王房东', time: '8小时前', publishDate: '2026-07-09', likes: 112, favorites: 47, views: 1890, shares: 41 },
  { id: 10, cat: 'brand', catLabel: '品牌加盟', pinned: false, verified: true, userLiked: false, userFaved: false, title: '「味湘来」湘式快餐品牌全省招商加盟', desc: '深耕湖南高校团餐10年品牌，标准化运营体系，提供选址评估、装修方案、技术培训、供应链支持。投资门槛8-15万，回本周期6-12个月，已有30+成功门店。', tags: ['湘式快餐', '10年品牌', '8-15万', '30+门店'], location: '长沙 · 覆盖全省', phone: '133****8901', images: [P.drink], avatar: '味', username: '味湘来品牌部', time: '12小时前', publishDate: '2026-07-09', likes: 67, favorites: 29, views: 1340, shares: 25 },
  { id: 11, cat: 'street', catLabel: '校园商圈', pinned: false, userLiked: false, userFaved: false, title: '长沙大学城商业街饮品店整体转让', desc: '位于麓山南路商业街核心地段，面积20㎡，装修精美设备齐全，日均营业额2000+，因店主出国转让。含全套设备及库存，接手即可经营。', tags: ['商业街', '20㎡', '饮品店', '含设备'], location: '长沙 · 岳麓区', phone: '186****3456', images: [P.drink], avatar: '饮', username: '小莫茶饮', time: '6小时前', publishDate: '2026-07-09', likes: 45, favorites: 15, views: 980, shares: 17 },
  { id: 12, cat: 'hospital', catLabel: '医院餐厅', pinned: true, verified: true, userLiked: false, userFaved: false, title: '湘雅三医院食堂营养餐档口招商', desc: '日均门诊量8000+人次，食堂档口面积18-25㎡，经营品类营养餐、养生汤品优先，收费纯租金模式1500/月+水电网均摊，需持健康证及食品安全管理员证。', tags: ['三甲医院', '18-25㎡', '营养餐', '证照齐全'], details: [{ label: '机构名称', value: '湘雅三医院' }, { label: '日均人流', value: '8000+ 人次' }, { label: '商铺楼层', value: '门诊楼负一层' }, { label: '商铺面积', value: '18-25 ㎡' }], location: '长沙 · 岳麓区', phone: '135****7890', images: [P.canteen, P.equip], avatar: '雅', username: '湘雅后勤管理', time: '4小时前', publishDate: '2026-07-09', likes: 88, favorites: 32, views: 1670, shares: 35 },
  { id: 13, cat: 'park', catLabel: '企业园区', pinned: false, userLiked: false, userFaved: false, title: '长沙高新区企业园区食堂档口招租', desc: '园区入驻企业200+家，日均用餐人数5000+，档口面积15-30㎡可选，经营品类中餐、快餐、粉面均可，收费倒扣抽点15%含水电，有中央厨房配套。', tags: ['200+企业', '5000+用餐', '倒扣15%', '中央厨房'], details: [{ label: '园区名称', value: '长沙高新区产业园' }, { label: '入驻企业', value: '200+ 家' }, { label: '商铺楼层', value: '综合楼一楼' }, { label: '商铺面积', value: '15-30 ㎡' }], location: '长沙 · 高新区', phone: '177****0123', images: [P.canteen, P.shop], avatar: '高', username: '高新区管委会', time: '1天前', publishDate: '2026-07-08', likes: 56, favorites: 24, views: 1120, shares: 22 },
  { id: 14, cat: 'training', catLabel: '技术培训', pinned: true, verified: true, userLiked: true, userFaved: false, title: '正宗重庆��面技术培训 包教包会学完上岗', desc: '10年重庆小面师傅手把手教学，培训周期7-15天，课程内容：底料炒制、辣椒油熬制、面条制作、浇头调配、成本核算。学完提供配方手册+原料供应链对接，适合零基础创业者。', tags: ['重庆小面', '7-15天', '包教包会', '配方手册'], location: '长沙 · 岳麓区', phone: '133****5678', images: [P.training, P.canteen], avatar: '面', username: '老重庆面馆', time: '3小时前', publishDate: '2026-07-09', likes: 96, favorites: 42, views: 2100, shares: 38 },
  { id: 15, cat: 'training', catLabel: '技术培训', pinned: false, verified: true, userLiked: false, userFaved: true, title: '网红饮品制作培训 30+热门配方一网打尽', desc: '涵盖奶茶、果茶、奶盖、水果茶、冰沙等热门品类，培训周期5-10天，提供设备清单+原料采购渠道+开业指导，赠送门头设计方案，学完即可开店。', tags: ['饮品培训', '30+配方', '5-10天', '开业指导'], location: '长沙 · 天心区', phone: '155****8901', images: [P.training], avatar: '饮', username: '茶颜悦色培训中心', time: '6小时前', publishDate: '2026-07-09', likes: 134, favorites: 58, views: 3560, shares: 67 },
  { id: 16, cat: 'training', catLabel: '技术培训', pinned: false, userLiked: false, userFaved: false, title: '黄焖鸡米饭技术培训 月入过万的爆款项目', desc: '从选料到出品全流程教学，培训周期3-5天，内容包括酱料熬制、鸡肉腌制、火候控制、配菜搭配。提供核心料包供应，标准化操作，新手也能快速上手。', tags: ['黄焖鸡', '3-5天', '核心料包', '新手友好'], location: '武汉 · 洪山区', phone: '186****2345', images: [P.training], avatar: '鸡', username: '味美餐饮培训', time: '1天前', publishDate: '2026-07-08', likes: 78, favorites: 35, views: 1870, shares: 29 },
  { id: 17, cat: 'sauce', catLabel: '酱料供应', pinned: true, verified: true, userLiked: true, userFaved: true, title: '麻辣烫秘制底料供应商 厂家直供价格优', desc: '专注麻辣烫底料研发生产15年，产品含麻辣、藤椒、番茄、骨汤4大系列，月产能50吨，支持OEM贴牌代工，小批量可发货，提供免费样品试味。', tags: ['麻辣烫底料', '15年经验', '月产50吨', '免费样品'], location: '长沙 · 望城区', phone: '137****3456', images: [P.sauce, P.equip], avatar: '麻', username: '湘味源食品', time: '2小时前', publishDate: '2026-07-09', likes: 112, favorites: 49, views: 2780, shares: 52 },
  { id: 18, cat: 'sauce', catLabel: '酱料供应', pinned: false, userLiked: false, userFaved: false, title: '黄焖鸡酱料源头厂家 一件代发欢迎比价', desc: '标准化黄焖鸡酱料包，口味稳定出品统一，每包可做5份出品，单价低至2.8元/包。支持全国物流发货，量大从优，批发价更实惠。', tags: ['黄焖鸡酱料', '标准化', '2.8元/包', '全国发货'], location: '济南 · 历城区', phone: '139****7890', images: [P.sauce], avatar: '酱', username: '鲁味调料厂', time: '5小时前', publishDate: '2026-07-09', likes: 67, favorites: 28, views: 1430, shares: 24 },
  { id: 19, cat: 'sauce', catLabel: '酱料供应', pinned: false, userLiked: false, userFaved: false, title: '饮品专用果酱果糖供应商 B端专供品质保障', desc: '专业饮品原料供应，产品线含芒果酱、草莓酱、百香果酱、蓝莓酱、黑糖糖浆等20+品种，通过ISO22000认证，全国招商代理中。', tags: ['饮品原料', '20+品种', 'ISO22000', '招商代理'], location: '广州 · 白云区', phone: '188****0123', images: [P.sauce, P.drink], avatar: '果', username: '果乐源食品', time: '1天前', publishDate: '2026-07-08', likes: 89, favorites: 36, views: 1960, shares: 31 },
]

export function formatNumber(num: number): string {
  if (num >= 10000) return (num / 10000).toFixed(1) + '万'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
  return num.toString()
}
