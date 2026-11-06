import { useState } from 'react'
import { ArrowRight, ArrowUpRight, Check, Copy, CreditCard, LoaderCircle, Wallet } from 'lucide-react'
import type { Account } from '../lib/api'
import { formatMoney } from '../lib/formatters'

interface AccountsPanelProps {
  accounts: Account[]
  loading: boolean
  selectedAccountId: number | null
  onSelectAccount: (id: number) => void
  variant?: 'list' | 'cards'
  onOpenTransfer?: () => void
}

function accountLabel(type: string) {
  return type === 'SAVINGS' ? 'Cuenta de ahorros' : type
}

export default function AccountsPanel({
  accounts,
  loading,
  selectedAccountId,
  onSelectAccount,
  variant = 'list',
  onOpenTransfer,
}: AccountsPanelProps) {
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const total = accounts.reduce((sum, account) => sum + account.balance, 0)

  async function copyNumber(account: Account) {
    try {
      await navigator.clipboard.writeText(account.accountNumber)
      setCopiedId(account.id)
      window.setTimeout(() => setCopiedId(null), 1600)
    } catch {
      setCopiedId(null)
    }
  }

  if (variant === 'cards') {
    return (
      <section className="accounts-page" id="accounts">
        <header className="page-head">
          <div>
            <span className="eyebrow">PRODUCTOS</span>
            <h1>Mis cuentas</h1>
            <p>Elige una cuenta para ver sus movimientos o enviar dinero desde ella.</p>
          </div>
          <div className="page-total">
            <span>Total en {accounts.length} {accounts.length === 1 ? 'cuenta' : 'cuentas'}</span>
            <strong>{formatMoney(total)}</strong>
          </div>
        </header>

        {loading ? (
          <div className="loading-row"><LoaderCircle className="spin" size={20} />Cargando tus cuentas...</div>
        ) : accounts.length === 0 ? (
          <div className="empty-state"><Wallet size={24} /><p>Aún no hay cuentas para mostrar.</p></div>
        ) : (
          <div className="cards-grid">
            {accounts.map((account, index) => {
              const selected = selectedAccountId === account.id
              return (
                <article
                  key={account.id}
                  className={`bank-card bank-card-${index % 3} ${selected ? 'is-selected' : ''}`}
                  onClick={() => onSelectAccount(account.id)}
                >
                  <div className="bank-card-top">
                    <span className="bank-card-type"><CreditCard size={16} />{accountLabel(account.accountType)}</span>
                    {selected && <span className="bank-card-badge">Activa</span>}
                  </div>

                  <div className="bank-card-middle">
                    <span className="bank-card-caption">Saldo disponible</span>
                    <strong className="bank-card-balance">{formatMoney(account.balance)}</strong>
                  </div>

                  <div className="bank-card-bottom">
                    <button
                      type="button"
                      className="bank-card-number"
                      onClick={(event) => { event.stopPropagation(); void copyNumber(account) }}
                      title="Copiar número de cuenta"
                    >
                      •••• {account.accountNumber.slice(-4)}
                      {copiedId === account.id ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                    {onOpenTransfer && (
                      <button
                        type="button"
                        className="bank-card-send"
                        onClick={(event) => {
                          event.stopPropagation()
                          onSelectAccount(account.id)
                          onOpenTransfer()
                        }}
                      >
                        <ArrowUpRight size={15} />Enviar
                      </button>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    )
  }

  return (
    <section className="panel accounts-panel" id="accounts">
      <div className="section-heading">
        <div><span className="eyebrow">PRODUCTOS</span><h2>Tus cuentas</h2></div>
        <span className="section-count">{accounts.length.toString().padStart(2, '0')}</span>
      </div>
      {loading ? (
        <div className="loading-row"><LoaderCircle className="spin" size={20} />Cargando tus cuentas...</div>
      ) : accounts.length === 0 ? (
        <div className="empty-state"><Wallet size={24} /><p>Aún no hay cuentas para mostrar.</p></div>
      ) : (
        <div className="accounts-list">
          {accounts.map((account, index) => {
            const selected = selectedAccountId === account.id
            return (
              <button
                className={`account-row ${selected ? 'account-row-selected' : ''}`}
                key={account.id}
                onClick={() => onSelectAccount(account.id)}
                aria-pressed={selected}
              >
                <span className={`account-icon account-icon-${index % 3}`}><CreditCard size={19} /></span>
                <span className="account-details">
                  <strong>{accountLabel(account.accountType)}</strong>
                  <small>Cuenta {account.accountNumber}</small>
                </span>
                <span className="account-balance">{formatMoney(account.balance)}</span>
                <ArrowRight className="account-chevron" size={16} />
              </button>
            )
          })}
        </div>
      )}
    </section>
  )
}