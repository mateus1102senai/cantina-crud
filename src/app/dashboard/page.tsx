'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface DashboardStats {
  totalProdutos: number
  totalVendas: number
  estoqueBaixo: number
  vendaHoje: number
  ultimasVendas: Array<{
    id: number
    produto: string
    quantidade: number
    valor: number
    data: string
  }>
}

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalProdutos: 0,
    totalVendas: 0,
    estoqueBaixo: 0,
    vendaHoje: 0,
    ultimasVendas: []
  })
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Verificar autenticação
    const authStatus = localStorage.getItem('cantina_auth')
    const userData = localStorage.getItem('cantina_user')
    
    if (!authStatus || authStatus !== 'true') {
      router.push('/login')
      return
    }
    
    if (userData) {
      setUser(JSON.parse(userData))
    }
    
    loadDashboardData()
  }, [router])

  const loadDashboardData = async () => {
    // Dados mock para demonstração
    setTimeout(() => {
      setStats({
        totalProdutos: 45,
        totalVendas: 156,
        estoqueBaixo: 3,
        vendaHoje: 285.50,
        ultimasVendas: [
          { id: 1, produto: 'Sanduíche Natural', quantidade: 2, valor: 12.00, data: '13/11/2025 14:30' },
          { id: 2, produto: 'Suco de Laranja', quantidade: 1, valor: 5.50, data: '13/11/2025 14:25' },
          { id: 3, produto: 'Pastel Frango', quantidade: 3, valor: 18.00, data: '13/11/2025 14:20' },
          { id: 4, produto: 'Refrigerante', quantidade: 2, valor: 8.00, data: '13/11/2025 14:15' }
        ]
      })
    }, 500)
  }

  const handleLogout = () => {
    localStorage.removeItem('cantina_auth')
    localStorage.removeItem('cantina_user')
    router.push('/login')
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">🍽️ Dashboard Cantina</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Olá, <strong>{user?.username}</strong></span>
              <button 
                onClick={handleLogout}
                className="btn-cantina bg-red-600 hover:bg-red-700 text-white"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card-cantina">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Produtos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProdutos}</p>
              </div>
            </div>
          </div>

          <div className="card-cantina">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Vendas Hoje</p>
                <p className="text-2xl font-bold text-gray-900">R$ {stats.vendaHoje.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="card-cantina">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Estoque Baixo</p>
                <p className="text-2xl font-bold text-gray-900">{stats.estoqueBaixo}</p>
              </div>
            </div>
          </div>

          <div className="card-cantina">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z"/>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Vendas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalVendas}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/cadastro-produto" 
                className="card-cantina hover:shadow-md transition-all duration-200 hover:scale-105 cursor-pointer">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cadastrar Produto</h3>
              <p className="text-gray-600">Adicionar novos produtos ao sistema</p>
            </div>
          </Link>

          <Link href="/gestao-estoque" 
                className="card-cantina hover:shadow-md transition-all duration-200 hover:scale-105 cursor-pointer">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestão Estoque</h3>
              <p className="text-gray-600">Gerenciar inventário e estoque</p>
            </div>
          </Link>

          <Link href="/relatorios" 
                className="card-cantina hover:shadow-md transition-all duration-200 hover:scale-105 cursor-pointer">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Relatórios</h3>
              <p className="text-gray-600">Ver relatórios de vendas e estoque</p>
            </div>
          </Link>
        </div>

        {/* Recent Sales */}
        <div className="card-cantina">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Últimas Vendas</h3>
          <div className="overflow-x-auto">
            <table className="table-cantina">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Produto</th>
                  <th>Quantidade</th>
                  <th>Valor</th>
                  <th>Data/Hora</th>
                </tr>
              </thead>
              <tbody>
                {stats.ultimasVendas.map((venda) => (
                  <tr key={venda.id}>
                    <td className="font-mono text-sm">#{venda.id.toString().padStart(3, '0')}</td>
                    <td className="font-medium">{venda.produto}</td>
                    <td>{venda.quantidade}x</td>
                    <td className="font-semibold text-green-600">R$ {venda.valor.toFixed(2)}</td>
                    <td className="text-gray-500 text-sm">{venda.data}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}