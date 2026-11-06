//Cambie todo el archivo


//const movimientos = [
  //{ id: 1, nombre: 'Pago de nómina', fecha: '12 oct', monto: 2500000 },
  //{ id: 2, nombre: 'Supermercado', fecha: '11 oct', monto: -180000 },
  //{ id: 3, nombre: 'Transferencia a Laura', fecha: '10 oct', monto: -300000 },
  //{ id: 4, nombre: 'Reembolso', fecha: '09 oct', monto: 45000 },
//]

//const menu = ['Resumen', 'Cuentas', 'Transferencias', 'Movimientos', 'Ajustes']

//const formato = (n: number) =>
//  n.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })

//export default function App() {
  //return (
    //<div className="min-h-screen">
      //{/* Sidebar */}
      //<aside className="fixed inset-y-0 left-0 w-60 bg-dark text-white p-6 flex flex-col">
        //<h1 className="text-xl font-bold mb-8">ApiBank</h1>
        //<nav className="flex flex-col gap-1">
          //{menu.map((item, i) => (
            //<a
              //key={item}
              //href="#"
              //className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                //i === 0 ? 'bg-primary text-white' : 'text-gray-300 hover:bg-white/10'
              //}`}
            //>
             // {item}
            //</a>
          //))}
        //</nav>
      //</aside>

     // {/* Contenido */}
      //<div className="ml-60">
        //<header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          //<h2 className="text-lg font-semibold text-dark">Resumen</h2>
          //<div className="flex items-center gap-3">
           // <span className="text-sm text-gray-500">Hola, Mateo</span>
            //<div className="w-9 h-9 rounded-full bg-primary-light text-primary font-semibold flex items-center justify-center">
             // M
            //</div>
          //</div>
        //</header>

        //<main className="p-8 space-y-6">
         // {/* Tarjetas de resumen */}
          //<div className="grid gap-6 md:grid-cols-3">
            //<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              //<p className="text-sm text-gray-500">Saldo disponible</p>
              //<p className="text-3xl font-bold text-primary mt-2">{formato(2450000)}</p>
              //<button className="mt-4 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg transition-colors">
               // Transferir
              //</button>
            //</div>

            //<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              //<p className="text-sm text-gray-500">Ingresos del mes</p>
              //<p className="text-3xl font-bold text-emerald-500 mt-2">{formato(2545000)}</p>
              //<span className="inline-block mt-4 text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full">
                //+8% vs mes anterior
              //</span>
            //</div>

            //<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              //<p className="text-sm text-gray-500">Gastos del mes</p>
              //<p className="text-3xl font-bold text-red-500 mt-2">{formato(480000)}</p>
              //<span className="inline-block mt-4 text-xs bg-red-50 text-red-600 px-2 py-1 rounded-full">
               // -3% vs mes anterior
              //</span>
            //</div>
          //</div>

          //{/* Movimientos */}
          //<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            //<div className="flex items-center justify-between mb-4">
              //<h3 className="text-lg font-semibold text-dark">Últimos movimientos</h3>
              //<button className="border border-primary text-primary hover:bg-primary-light px-3 py-1.5 rounded-lg text-sm transition-colors">
                //Ver todos
              //</button>
            //</div>

           // <ul className="divide-y divide-gray-100">
             // {movimientos.map((m) => (
               // <li key={m.id} className="flex items-center justify-between py-3">
                 // <div>
                   // <p className="font-medium text-dark">{m.nombre}</p>
                   // <p className="text-xs text-gray-400">{m.fecha}</p>
                  //</div>
                  //<span className={`font-semibold ${m.monto > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    //{m.monto > 0 ? '+' : ''}
                    //{formato(m.monto)}
                  //</span>
                //</li>
              //))}
            //</ul>
          //</div>
        //</main>
      //</div>
    //</div>
  //)
//}

import { useState } from 'react'
import type { Account, AuthResponse, Transaction, Quote, CompanyProfile } from './lib/api'
//Desde aqui empieza lo de el profesor

import './App.css'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './components/Dashboard'

function App(){

  const [session, setSession] = useState<AuthResponse | null>(readSession)
  const [accounts, setAccount] = useState<Account[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [loadedDashboardKey, setLoadedDashboardKey] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)
  const [dashboardError, setDashboardError] = useState('')
  const [authMessage, setAuthMessage] = useState('')
  const [toast, setToast] = useState('')
  const [symbol, setSymbol] = useState('AAPL')
  const [quote, setQuote] = useState<Quote | null>(null)
  const [profile, setProfile] = useState<CompanyProfile | null>(null)
  const [marketError, setMarketError] = useState('')
  const [marketRetry, setMarketRetry] = useState(0)
  const [loadedMarketKey, setLoadedMarketKey] = useState('')

  return (
    <Routes>
      <Route path='*' element = {(<Dashboard/>)} />
    </Routes>
  )



}

export default App
