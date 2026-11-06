import { useMemo, useState } from 'react'
import {
  ArrowDownLeft, ArrowLeftRight, ArrowRight, ArrowUpRight, LoaderCircle, Scale, Search,
} from 'lucide-react'
import type { Account, Transaction } from '../lib/api'
import { formatMoney, shortDate } from '../lib/formatters'
import TransactionRow from './TransactionRow'

interface ActivityPanelProps {
  account: Account | undefined
  transactions: Transaction[]
  loading: boolean
  onOpenTransfer: () => void
  variant?: 'list' | 'table'
  accounts?: Account[]
  onSelectAccount?: (id: number) => void
}

type Filter = 'all' | 'in' | 'out'

const timeFormat = new Intl.DateTimeFormat('es-CO', { hour: '2-digit', minute: '2-digit' })

function timeOf(value: string) {
  const n = new Date(value).getTime()
  return Number.isNaN(n) ? 0 : n
}

export default function ActivityPanel({
  account,
  transactions,
  loading,
  onOpenTransfer,
  variant = 'list',
  accounts = [],
  onSelectAccount,
}: ActivityPanelProps) {
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')

  const rows = useMemo(
    () => [...transactions]
      .sort((a, b) => timeOf(b.timestamp) - timeOf(a.timestamp))
      .map((transaction) => ({
        transaction,
        outgoing: transaction.sourceAccountNumber === account?.accountNumber,
      })),
    [transactions, account],
  )

  if (variant === 'table') {
    const totalIn = rows.filter((r) => !r.outgoing).reduce((s, r) => s + r.transaction.amount, 0)
    const totalOut = rows.filter((r) => r.outgoing).reduce((s, r) => s + r.transaction.amount, 0)
    const net = totalIn - totalOut
    const text = query.trim().toLowerCase()

    const visible = rows.filter(({ transaction, outgoing }) => {
      if (filter === 'in' && outgoing) return false
      if (filter === 'out' && !outgoing) return false
      if (!text) return true
      const other = outgoing ? transaction.destinationAccount : transaction.sourceAccountNumber
      return (transaction.description || '').toLowerCase().includes(text)
        || other.includes(text)
        || String(transaction.amount).includes(text)
    })

    return (
      <section className="activity-page" id="activity">
        <header className="page-head">
          <div>
            <span className="eyebrow">HISTORIAL</span>
            <h1>Movimientos</h1>
            <p>
              {account
                ? `Cuenta •••• ${account.accountNumber.slice(-4)} · ${rows.length} ${rows.length === 1 ? 'movimiento' : 'movimientos'}`
                : 'Selecciona una cuenta para ver su historial.'}
            </p>
          </div>
          <div className="page-actions">
            {accounts.length > 1 && onSelectAccount && (
              <select
                className="tx-select"
                value={account?.id ?? ''}
                onChange={(event) => onSelectAccount(Number(event.target.value))}
                aria-label="Cuenta"
              >
                {accounts.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.accountType === 'SAVINGS' ? 'Ahorros' : item.accountType} •••• {item.accountNumber.slice(-4)}
                  </option>
                ))}
              </select>
            )}
            <button type="button" className="tx-send-btn" onClick={onOpenTransfer} disabled={!account}>
              <ArrowUpRight size={16} />Nueva transferencia
            </button>
          </div>
        </header>

        <div className="tx-stats">
          <article className="tx-stat">
            <span className="tx-stat-icon tx-ico-in"><ArrowDownLeft size={18} /></span>
            <div><span>Entradas</span><strong className="tx-amount-in">{formatMoney(totalIn)}</strong></div>
          </article>
          <article className="tx-stat">
            <span className="tx-stat-icon tx-ico-out"><ArrowUpRight size={18} /></span>
            <div><span>Salidas</span><strong className="tx-amount-out">{formatMoney(totalOut)}</strong></div>
          </article>
          <article className="tx-stat">
            <span className="tx-stat-icon tx-ico-net"><Scale size={18} /></span>
            <div>
              <span>Neto</span>
              <strong className={net >= 0 ? 'tx-amount-in' : 'tx-amount-out'}>
                {net >= 0 ? '+' : '−'}{formatMoney(Math.abs(net))}
              </strong>
            </div>
          </article>
        </div>

        <div className="tx-card">
          <div className="tx-toolbar">
            <div className="tx-tabs" role="tablist" aria-label="Filtrar movimientos">
              {([['all', 'Todos'], ['in', 'Entradas'], ['out', 'Salidas']] as [Filter, string][]).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={filter === key}
                  className={filter === key ? 'tx-tab active' : 'tx-tab'}
                  onClick={() => setFilter(key)}
                >
                  {label}
                </button>
              ))}
            </div>
            <label className="tx-search">
              <Search size={15} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar descripción, cuenta o monto"
              />
            </label>
          </div>

          {loading ? (
            <div className="loading-row"><LoaderCircle className="spin" size={20} />Cargando movimientos...</div>
          ) : rows.length === 0 ? (
            <div className="empty-state empty-activity">
              <ArrowLeftRight size={23} />
              <p>Tus transferencias aparecerán aquí.</p>
              <button onClick={onOpenTransfer} disabled={!account}>
                Hacer una transferencia <ArrowRight size={14} />
              </button>
            </div>
          ) : visible.length === 0 ? (
            <div className="empty-state"><Search size={22} /><p>No hay movimientos que coincidan con tu búsqueda.</p></div>
          ) : (
            <div className="tx-scroll">
              <table className="tx-table">
                <thead>
                  <tr>
                    <th>Movimiento</th>
                    <th>Contraparte</th>
                    <th>Fecha</th>
                    <th className="tx-right">Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map(({ transaction, outgoing }) => {
                    const date = new Date(transaction.timestamp)
                    const valid = !Number.isNaN(date.getTime())
                    const other = outgoing ? transaction.destinationAccount : transaction.sourceAccountNumber
                    return (
                      <tr key={transaction.id}>
                        <td>
                          <div className="tx-desc">
                            <span className={`tx-ico ${outgoing ? 'tx-ico-out' : 'tx-ico-in'}`}>
                              {outgoing ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                            </span>
                            <div>
                              <strong>{transaction.description || 'Transferencia entre cuentas'}</strong>
                              <small>{outgoing ? 'Enviada' : 'Recibida'}</small>
                            </div>
                          </div>
                        </td>
                        <td>{outgoing ? 'Para' : 'De'} •••• {other.slice(-4)}</td>
                        <td>
                          {valid ? shortDate.format(date) : '—'}
                          {valid && <small className="tx-time">{timeFormat.format(date)}</small>}
                        </td>
                        <td className={`tx-right ${outgoing ? 'tx-amount-out' : 'tx-amount-in'}`}>
                          {outgoing ? '−' : '+'}{formatMoney(transaction.amount)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
          {!loading && visible.length > 0 && (
            <div className="tx-foot">Mostrando {visible.length} de {rows.length}</div>
          )}
        </div>
      </section>
    )
  }

  return (
    <section className="panel activity-panel" id="activity">
      <div className="section-heading activity-heading">
        <div><span className="eyebrow">TU CUENTA</span><h2>Actividad reciente</h2></div>
        <span className="activity-account-label">
          {account ? `•••• ${account.accountNumber.slice(-4)}` : 'Selecciona una cuenta'}
        </span>
      </div>
      {loading ? (
        <div className="loading-row"><LoaderCircle className="spin" size={20} />Cargando movimientos...</div>
      ) : transactions.length === 0 ? (
        <div className="empty-state empty-activity">
          <ArrowLeftRight size={23} />
          <p>Tus transferencias aparecerán aquí.</p>
          <button onClick={onOpenTransfer} disabled={!account}>
            Hacer una transferencia <ArrowRight size={14} />
          </button>
        </div>
      ) : (
        <div className="transaction-list">
          {transactions.slice(0, 6).map((transaction) => (
            <TransactionRow
              key={transaction.id}
              transaction={transaction}
              outgoing={transaction.sourceAccountNumber === account?.accountNumber}
            />
          ))}
        </div>
      )}
    </section>
  )
}