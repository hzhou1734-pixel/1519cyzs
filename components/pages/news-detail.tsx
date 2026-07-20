'use client'

import { useState } from 'react'
import { Eye, Flame, Share2, Star, ThumbsUp, Clock } from 'lucide-react'
import { newsArticles, type NewsArticle } from '@/lib/app-data'
import { formatNumber } from '@/lib/home-data'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'

type Props = {
  articleId: number
  onBack: () => void
  onOpenArticle: (id: number) => void
  showToast: (msg: string) => void
}

// 原型数据仅有摘要，按语义生成正文段落
function buildBody(a: NewsArticle): string[] {
  return [
    a.summary,
    '从行业实践来看，这一变化并非孤立现象，而是餐饮经营环境持续演进的缩影。对于身处一线的档口经营者与创业者而言，及时读懂趋势、调整经营策略，往往意味着能够抢占先机。',
    '业内人士指出，标准化、透明化与合规化正在成为行业发展的主线。无论是招商准入、供应链管理还是日常运营，谁能率先建立起规范的体系，谁就能在激烈的竞争中获得更强的抗风险能力。',
    '万户优铺将持续跟踪相关动态，为平台用户提供第一手的政策解读与经营参考。我们也欢迎广大商户在评论区分享自己的经验与思考，共同营造诚信、健康的餐饮创业生态。',
  ]
}

export function NewsDetail({ articleId, onBack, onOpenArticle, showToast }: Props) {
  const article = newsArticles.find((a) => a.id === articleId)
  const [liked, setLiked] = useState(false)
  const [faved, setFaved] = useState(false)

  if (!article) {
    return (
      <div className="flex h-full w-full flex-col overflow-hidden bg-background">
        <PageHeader title="资讯详情" onBack={onBack} />
        <EmptyState title="文章不存在" desc="该文章可能已被删除" />
      </div>
    )
  }

  const body = buildBody(article)
  const related = newsArticles.filter((a) => a.id !== article.id).slice(0, 3)

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-background">
      <PageHeader title="资讯详情" onBack={onBack} />

      <div className="no-scrollbar flex-1 overflow-y-auto overflow-x-hidden pb-24">
        <article className="bg-card px-4 py-4">
          <h1 className="text-xl font-bold leading-snug text-foreground text-balance">{article.title}</h1>

          <div className="mt-2.5 flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="font-medium text-primary">{article.source}</span>
            <span className="flex items-center gap-0.5">
              <Clock className="h-3 w-3" />
              {article.publishDate}
            </span>
            <span className="flex items-center gap-0.5">
              <Eye className="h-3 w-3" />
              {formatNumber(article.views)}
            </span>
            {article.hot && (
              <span className="flex items-center gap-0.5 rounded bg-accent-soft px-1.5 py-0.5 font-bold text-accent">
                <Flame className="h-3 w-3" />
                热门
              </span>
            )}
          </div>

          {article.cover && (
            <div className="mt-3.5 overflow-hidden rounded-xl bg-muted">
              <img src={article.cover || '/placeholder.svg'} alt={article.title} className="h-full w-full object-cover" />
            </div>
          )}

          <div className="mt-4 flex flex-col gap-3.5">
            {body.map((p, i) => (
              <p key={i} className="text-[15px] leading-[1.8] text-foreground/90">
                {p}
              </p>
            ))}
          </div>

          {/* 点赞/收藏 */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => {
                setLiked((v) => !v)
                showToast(liked ? '已取消点赞' : '感谢点赞')
              }}
              className={`flex items-center gap-1.5 rounded-full border px-5 py-2 text-sm font-semibold transition-colors ${
                liked ? 'border-primary bg-primary-soft text-primary' : 'border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              <ThumbsUp className="h-4 w-4" fill={liked ? 'currentColor' : 'none'} />
              有用
            </button>
            <button
              type="button"
              onClick={() => {
                setFaved((v) => !v)
                showToast(faved ? '已取消收藏' : '已收藏文章')
              }}
              className={`flex items-center gap-1.5 rounded-full border px-5 py-2 text-sm font-semibold transition-colors ${
                faved ? 'border-accent bg-accent-soft text-accent' : 'border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              <Star className="h-4 w-4" fill={faved ? 'currentColor' : 'none'} />
              收藏
            </button>
          </div>
        </article>

        {/* 相关阅读 */}
        {related.length > 0 && (
          <div className="mt-2 bg-card px-4 py-4">
            <h2 className="mb-3 text-sm font-bold text-foreground">相关阅读</h2>
            <div className="flex flex-col divide-y divide-border">
              {related.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => onOpenArticle(a.id)}
                  className="flex items-center gap-3 py-2.5 text-left first:pt-0 last:pb-0"
                >
                  <span className="line-clamp-2 min-w-0 flex-1 text-[13px] font-medium leading-snug text-foreground">
                    {a.title}
                  </span>
                  {a.cover && (
                    <span className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <img src={a.cover || '/placeholder.svg'} alt={a.title} className="h-full w-full object-cover" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 底部栏 */}
      <div className="flex items-center gap-2 border-t border-border bg-card px-3 py-2.5">
        <div className="flex flex-1 items-center rounded-full bg-muted px-4 py-2.5 text-[13px] text-muted-foreground">
          说点什么...
        </div>
        <button
          type="button"
          onClick={() => showToast('分享文章')}
          className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="分享"
        >
          <Share2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
