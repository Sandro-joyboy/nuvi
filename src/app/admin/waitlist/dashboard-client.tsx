'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { signOut } from '@/app/actions/auth'
import type { WaitlistMetrics, WaitlistEntry } from '@/lib/admin-waitlist'

interface Props {
  metrics: WaitlistMetrics
  adminEmail: string
}

export function AdminWaitlistDashboard({ metrics, adminEmail }: Props) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSource, setSelectedSource] = useState<string>('all')

  // Filtro de pesquisa e fonte
  const filteredEntries = useMemo(() => {
    return metrics.entries.filter((entry) => {
      const matchSearch =
        entry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (entry.source && entry.source.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchSource =
        selectedSource === 'all'
          ? true
          : (entry.source || 'Direto').toLowerCase() === selectedSource.toLowerCase()

      return matchSearch && matchSource
    })
  }, [metrics.entries, searchTerm, selectedSource])

  // Função para exportar CSV
  const handleExportCSV = () => {
    if (metrics.entries.length === 0) return

    const headers = ['Posicao', 'Email', 'Fonte', 'Email_Enviado', 'Data_Registo']
    const rows = metrics.entries.map((item) => [
      item.position,
      `"${item.email}"`,
      `"${item.source || 'Direto'}"`,
      item.email_sent ? 'Sim' : 'Nao',
      `"${new Date(item.created_at).toLocaleString('pt-PT')}"`,
    ])

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute(
      'download',
      `nuvi-waitlist-${new Date().toISOString().split('T')[0]}.csv`
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Altura máxima para normalizar o gráfico de barras
  const maxDailyCount = useMemo(() => {
    const max = Math.max(...metrics.dailySignups.map((d) => d.count), 1)
    return max
  }, [metrics.dailySignups])

  return (
    <div className="admin-container">
      {/* Top Navbar */}
      <header className="admin-header">
        <div className="header-left">
          <Link href="/">
            <img src="/logo.svg" alt="Nuvi" className="admin-logo" />
          </Link>
          <div className="admin-badge">Admin Waitlist</div>
        </div>

        <div className="header-right">
          <span className="admin-user-pill">
            <span className="user-dot" />
            {adminEmail}
          </span>
          <form action={signOut}>
            <button type="submit" className="admin-logout-btn">
              Sair
            </button>
          </form>
        </div>
      </header>

      {/* Overview Metric Cards */}
      <section className="metrics-grid">
        <div className="metric-card highlight">
          <span className="metric-label">Total de Inscritos</span>
          <span className="metric-value">{metrics.total.toLocaleString('pt-PT')}</span>
          <span className="metric-foot">Todas as submissões únicas</span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Inscritos Hoje</span>
          <span className="metric-value">{metrics.today}</span>
          <span className="metric-foot">Últimas 24 horas</span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Últimos 7 Dias</span>
          <span className="metric-value">{metrics.last7Days}</span>
          <span className="metric-foot">Ritmo semanal</span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Últimos 30 Dias</span>
          <span className="metric-value">{metrics.last30Days}</span>
          <span className="metric-foot">Crescimento mensal</span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Confirmação por Email</span>
          <span className="metric-value">{metrics.emailSentRate}%</span>
          <span className="metric-foot">
            {metrics.emailSentCount} de {metrics.total} enviados
          </span>
        </div>
      </section>

      {/* Middle Section: Chart & Top Sources */}
      <section className="analytics-split">
        {/* Daily Registrations Bar Chart */}
        <div className="chart-panel">
          <div className="panel-header">
            <h2 className="panel-title">Inscrições nos últimos 14 dias</h2>
            <span className="panel-subtitle">Volume diário</span>
          </div>

          <div className="bars-container">
            {metrics.dailySignups.map((item) => {
              const heightPercent =
                maxDailyCount > 0 ? (item.count / maxDailyCount) * 100 : 0
              const dayLabel = item.date.slice(5) // MM-DD

              return (
                <div key={item.date} className="bar-column">
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{ height: `${Math.max(heightPercent, 6)}%` }}
                      title={`${item.date}: ${item.count} inscrições`}
                    >
                      <span className="bar-tooltip">{item.count}</span>
                    </div>
                  </div>
                  <span className="bar-date">{dayLabel}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top Sources */}
        <div className="sources-panel">
          <div className="panel-header">
            <h2 className="panel-title">Top Fontes / Referrers</h2>
            <span className="panel-subtitle">Origem do tráfego</span>
          </div>

          <div className="sources-list">
            {metrics.topSources.length === 0 ? (
              <p className="empty-text">Sem dados de fontes ainda.</p>
            ) : (
              metrics.topSources.map((item) => (
                <div key={item.source} className="source-item">
                  <div className="source-row">
                    <span className="source-name">{item.source}</span>
                    <span className="source-count">
                      {item.count} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Table Section */}
      <section className="table-panel">
        <div className="table-controls">
          <div className="controls-left">
            <h2 className="panel-title">
              Inscritos ({filteredEntries.length} de {metrics.total})
            </h2>
            <div className="search-box">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="search-icon"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Pesquisar por e-mail ou fonte..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="controls-right">
            <button
              type="button"
              onClick={handleExportCSV}
              disabled={metrics.entries.length === 0}
              className="export-btn"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Exportar CSV
            </button>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '90px' }}>Posição</th>
                <th>E-mail</th>
                <th>Fonte</th>
                <th>Email de Confirmação</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="empty-table-row">
                    Nenhum inscrito encontrado com os critérios de pesquisa.
                  </td>
                </tr>
              ) : (
                filteredEntries.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <span className="position-pill">#{row.position}</span>
                    </td>
                    <td className="email-cell">{row.email}</td>
                    <td>
                      <span className="source-pill">
                        {row.source && row.source.trim() !== ''
                          ? row.source
                          : 'Direto'}
                      </span>
                    </td>
                    <td>
                      {row.email_sent ? (
                        <span className="status-badge sent">Enviado</span>
                      ) : (
                        <span className="status-badge pending">Pendente</span>
                      )}
                    </td>
                    <td className="date-cell">
                      {new Date(row.created_at).toLocaleString('pt-PT', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Styles */}
      <style>{`
        .admin-container {
          width: 100%;
          max-width: 1300px;
          margin: 0 auto;
          padding: 24px 20px 48px;
          box-sizing: border-box;
          font-family: var(--font-sf-pro), -apple-system, sans-serif;
          color: #FFFFFF;
        }

        .admin-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.18);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          margin-bottom: 24px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .admin-logo {
          height: 22px;
          width: auto;
          display: block;
        }

        .admin-badge {
          background: rgba(0, 130, 245, 0.25);
          border: 1px solid rgba(0, 130, 245, 0.5);
          color: #60A5FA;
          font-size: 12px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 9999px;
          letter-spacing: 0.02em;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .admin-user-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(0, 0, 0, 0.25);
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .user-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #10B981;
          box-shadow: 0 0 6px #10B981;
        }

        .admin-logout-btn {
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #FFFFFF;
          padding: 6px 16px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .admin-logout-btn:hover {
          background: rgba(255, 255, 255, 0.22);
        }

        /* Metrics Grid */
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .metric-card {
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(255, 255, 255, 0.16);
          backdrop-filter: blur(18px);
          border-radius: 20px;
          padding: 20px 22px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .metric-card.highlight {
          background: linear-gradient(135deg, rgba(0, 130, 245, 0.3) 0%, rgba(255, 255, 255, 0.08) 100%);
          border-color: rgba(0, 130, 245, 0.5);
        }

        .metric-label {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 500;
        }

        .metric-value {
          font-family: var(--font-gt-mechanik), sans-serif;
          font-size: 32px;
          font-weight: 700;
          color: #FFFFFF;
          line-height: 1.1;
        }

        .metric-foot {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          margin-top: 2px;
        }

        /* Analytics Split */
        .analytics-split {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 20px;
          margin-bottom: 24px;
        }

        .chart-panel, .sources-panel, .table-panel {
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(255, 255, 255, 0.16);
          backdrop-filter: blur(18px);
          border-radius: 22px;
          padding: 24px;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 20px;
        }

        .panel-title {
          font-family: var(--font-gt-mechanik), sans-serif;
          font-size: 18px;
          font-weight: 600;
          color: #FFFFFF;
          margin: 0;
        }

        .panel-subtitle {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.55);
        }

        /* Chart */
        .bars-container {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          height: 180px;
          gap: 8px;
          padding-top: 20px;
        }

        .bar-column {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
          justify-content: flex-end;
          gap: 8px;
        }

        .bar-track {
          width: 100%;
          max-width: 32px;
          height: 140px;
          display: flex;
          align-items: flex-end;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 2px;
          box-sizing: border-box;
        }

        .bar-fill {
          width: 100%;
          background: linear-gradient(180deg, #60A5FA 0%, #0082F6 100%);
          border-radius: 6px;
          position: relative;
          transition: height 0.4s ease;
        }

        .bar-tooltip {
          position: absolute;
          top: -24px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 11px;
          font-weight: 600;
          color: #FFFFFF;
          background: rgba(0, 0, 0, 0.8);
          padding: 2px 6px;
          border-radius: 4px;
          opacity: 0;
          transition: opacity 0.2s;
          pointer-events: none;
        }

        .bar-column:hover .bar-tooltip {
          opacity: 1;
        }

        .bar-date {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.6);
        }

        /* Sources */
        .sources-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .source-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .source-row {
          display: flex;
          justify-content: space-between;
          font-size: 13.5px;
        }

        .source-name {
          color: #FFFFFF;
          font-weight: 500;
        }

        .source-count {
          color: rgba(255, 255, 255, 0.7);
        }

        .progress-bar-bg {
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 9999px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background: #4EA7EB;
          border-radius: 9999px;
        }

        /* Table */
        .table-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .controls-left {
          display: flex;
          align-items: center;
          gap: 20px;
          flex: 1;
          flex-wrap: wrap;
        }

        .search-box {
          position: relative;
          min-width: 280px;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.5);
        }

        .search-input {
          width: 100%;
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 9999px;
          padding: 8px 16px 8px 38px;
          color: #FFFFFF;
          font-size: 13.5px;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s;
        }

        .search-input:focus {
          border-color: #0082F6;
        }

        .export-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #4EA7EB;
          border: 1px solid rgba(255, 255, 255, 0.35);
          color: #FFFFFF;
          font-size: 13.5px;
          font-weight: 500;
          padding: 8px 18px;
          border-radius: 9999px;
          cursor: pointer;
          transition: filter 0.2s, transform 0.2s;
        }

        .export-btn:hover:not(:disabled) {
          filter: brightness(1.08);
          transform: scale(1.02);
        }

        .export-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 14px;
        }

        .admin-table th {
          padding: 12px 16px;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 500;
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          font-size: 12.5px;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .admin-table td {
          padding: 14px 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.9);
        }

        .position-pill {
          display: inline-block;
          font-weight: 700;
          color: #60A5FA;
          font-family: ui-monospace, Menlo, Monaco, monospace;
        }

        .email-cell {
          font-weight: 500;
          color: #FFFFFF;
        }

        .source-pill {
          background: rgba(255, 255, 255, 0.1);
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 12.5px;
          color: rgba(255, 255, 255, 0.85);
        }

        .status-badge {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 500;
        }

        .status-badge.sent {
          background: rgba(34, 197, 94, 0.2);
          color: #86EFAC;
          border: 1px solid rgba(34, 197, 94, 0.4);
        }

        .status-badge.pending {
          background: rgba(234, 179, 8, 0.2);
          color: #FDE047;
          border: 1px solid rgba(234, 179, 8, 0.4);
        }

        .date-cell {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.6);
        }

        .empty-table-row {
          text-align: center;
          padding: 36px !important;
          color: rgba(255, 255, 255, 0.5);
        }

        .empty-text {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.5);
          margin: 0;
        }

        @media (max-width: 900px) {
          .analytics-split {
            grid-template-columns: 1fr;
          }
          .admin-header {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }
          .header-right {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  )
}
