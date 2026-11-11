import { createAdminClient } from '@/utils/supabase/admin'

export interface WaitlistEntry {
  id: string
  position: number
  email: string
  source: string | null
  email_sent: boolean
  created_at: string
}

export interface WaitlistMetrics {
  total: number
  today: number
  last7Days: number
  last30Days: number
  emailSentCount: number
  emailSentRate: number
  topSources: { source: string; count: number; percentage: number }[]
  dailySignups: { date: string; count: number }[]
  entries: WaitlistEntry[]
}

export async function getWaitlistMetrics(): Promise<WaitlistMetrics> {
  const supabase = await createAdminClient()

  const { data, error } = await supabase
    .from('waitlist')
    .select('*')
    .order('position', { ascending: false })

  if (error || !data) {
    console.error('[getWaitlistMetrics error]:', error)
    return {
      total: 0,
      today: 0,
      last7Days: 0,
      last30Days: 0,
      emailSentCount: 0,
      emailSentRate: 0,
      topSources: [],
      dailySignups: [],
      entries: [],
    }
  }

  const entries: WaitlistEntry[] = data as WaitlistEntry[]
  const total = entries.length

  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).getTime()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).getTime()

  let today = 0
  let last7Days = 0
  let last30Days = 0
  let emailSentCount = 0

  const sourceCounts: Record<string, number> = {}
  const dailyMap: Record<string, number> = {}

  // Inicializa os últimos 14 dias com 0 para o gráfico não ter buracos
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const key = d.toISOString().split('T')[0]
    dailyMap[key] = 0
  }

  entries.forEach((item) => {
    const itemDate = new Date(item.created_at).getTime()
    const dateStr = item.created_at.split('T')[0]

    if (itemDate >= startOfToday) today++
    if (itemDate >= sevenDaysAgo) last7Days++
    if (itemDate >= thirtyDaysAgo) last30Days++
    if (item.email_sent) emailSentCount++

    // Fontes
    const src = item.source && item.source.trim() !== '' ? item.source : 'Direto'
    sourceCounts[src] = (sourceCounts[src] || 0) + 1

    // Dias
    if (typeof dailyMap[dateStr] !== 'undefined') {
      dailyMap[dateStr] = (dailyMap[dateStr] || 0) + 1
    }
  })

  const emailSentRate = total > 0 ? Math.round((emailSentCount / total) * 100) : 0

  // Top Fontes
  const topSources = Object.entries(sourceCounts)
    .map(([source, count]) => ({
      source,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // Inscrições por dia ordenadas
  const dailySignups = Object.entries(dailyMap).map(([date, count]) => ({
    date,
    count,
  }))

  return {
    total,
    today,
    last7Days,
    last30Days,
    emailSentCount,
    emailSentRate,
    topSources,
    dailySignups,
    entries,
  }
}
