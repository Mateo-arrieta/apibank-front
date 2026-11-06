import { ArrowLeftRight, ArrowRight, ArrowUpRight, RefreshCw, Wallet } from 'lucide-react'
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
    <section className="summary-stack" aria-label="Resumen financiero">
      <article className="balance-panel">
        <div className="balance-panel-top">
          <span>Tu saldo disponible</span>
          <span className="balance-chip">
            <Wallet size={14} />{accountCount} {accountCount === 1 ? 'cuenta' : 'cuentas'}
          </span>
        </div>
        <div className="balance-value">
          {loading ? <span className="balance-skeleton" /> : formatMoney(totalBalance)}
        </div>
        <div className="balance-panel-bottom">
          <span>Suma de todas tus cuentas · USD</span>
          <button onClick={onRefresh} aria-label="Actualizar saldos" title="Actualizar saldos">
            <RefreshCw size={16} />
          </button>
        </div>
        <div className="balance-decoration balance-decoration-one" />
        <div className="balance-decoration balance-decoration-two" />
      </article>
      <article className="metric-panel">
        <div className="metric-icon metric-icon-mint"><ArrowLeftRight size={18} /></div>
        <span className="metric-label">Movimientos</span>
        <strong className="metric-value">{loading ? '—' : transactionCount}</strong>
        <span className="metric-footnote">Registrados hasta hoy</span>
      </article>
      <button className="transfer-cta" onClick={onOpenTransfer} disabled={accountCount === 0}>
        <span className="cta-icon"><ArrowUpRight size={20} /></span>
        <span><strong>Enviar dinero</strong><small>A otra cuenta Cobalto</small></span>
        <ArrowRight className="cta-arrow" size={18} />
      </button>
    </section>
  )
}