import { ArrowLeftRight, ArrowUpRight, RefreshCw, Wallet } from 'lucide-react'
import { formatMoney } from '../lib/formatters'

interface DashboardSummaryProps {
  accountCount: number
  totalBalance: number
  transactionCount: number
  loading: boolean
  onRefresh: () => void
  onOpenTransfer: () => void
}

export default function DashboardSummary({
  accountCount,
  totalBalance,
  transactionCount,
  loading,
  onRefresh,
  onOpenTransfer,
}: DashboardSummaryProps) {
  return (
    <section className="overview-top" aria-label="Resumen financiero">
      <article className="hero-balance">
        <div className="hero-head">
          <span className="hero-label">Tu saldo disponible</span>
          <span className="hero-chip">
            <Wallet size={14} />{accountCount} {accountCount === 1 ? 'cuenta' : 'cuentas'}
          </span>
        </div>
        <div className="hero-amount">
          {loading ? <span className="hero-skeleton" /> : formatMoney(totalBalance)}
        </div>
        <div className="hero-foot">
          <span className="hero-caption">Suma de todas tus cuentas · USD</span>
          <div className="hero-actions">
            <button
              type="button"
              className="hero-btn hero-btn-ghost"
              onClick={onRefresh}
              aria-label="Actualizar saldos"
              title="Actualizar saldos"
            >
              <RefreshCw size={15} />
            </button>
            <button
              type="button"
              className="hero-btn hero-btn-solid"
              onClick={onOpenTransfer}
              disabled={accountCount === 0}
            >
              <ArrowUpRight size={16} />Enviar dinero
            </button>
          </div>
        </div>
      </article>

      <div className="stat-stack">
        <article className="stat-card">
          <span className="stat-icon"><ArrowLeftRight size={18} /></span>
          <div>
            <span className="stat-label">Movimientos</span>
            <strong className="stat-value">{loading ? '—' : transactionCount}</strong>
          </div>
        </article>
        <article className="stat-card">
          <span className="stat-icon stat-icon-alt"><Wallet size={18} /></span>
          <div>
            <span className="stat-label">Cuentas activas</span>
            <strong className="stat-value">{loading ? '—' : accountCount}</strong>
          </div>
        </article>
      </div>
    </section>
  )
}