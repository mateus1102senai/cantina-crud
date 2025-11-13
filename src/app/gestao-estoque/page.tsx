'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Produto {
  id: number
  nome: string
  categoria: string
  preco: number
  estoque: number
  estoqueMinimo: number
  status: 'ok' | 'baixo' | 'critico'
}

export default function GestaoEstoquePage() {
  const router = useRouter()
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [filtro, setFiltro] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('todos')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar autenticação
    const authStatus = localStorage.getItem('cantina_auth')
    if (!authStatus || authStatus !== 'true') {
      router.push('/login')
      return
    }

    loadProdutos()
  }, [router])

  const loadProdutos = async () => {
    // Simular carregamento de produtos
    setTimeout(() => {
      const mockProdutos: Produto[] = [
        { id: 1, nome: 'Sanduíche Natural', categoria: 'lanches', preco: 6.00, estoque: 25, estoqueMinimo: 10, status: 'ok' },
        { id: 2, nome: 'Suco de Laranja', categoria: 'bebidas', preco: 5.50, estoque: 8, estoqueMinimo: 15, status: 'baixo' },
        { id: 3, nome: 'Pastel de Frango', categoria: 'salgados', preco: 6.50, estoque: 2, estoqueMinimo: 10, status: 'critico' },
        { id: 4, nome: 'Refrigerante Coca', categoria: 'bebidas', preco: 4.00, estoque: 30, estoqueMinimo: 20, status: 'ok' },
        { id: 5, nome: 'Brigadeiro', categoria: 'doces', preco: 2.00, estoque: 15, estoqueMinimo: 12, status: 'ok' },
        { id: 6, nome: 'Água Mineral', categoria: 'bebidas', preco: 2.50, estoque: 5, estoqueMinimo: 25, status: 'critico' },
        { id: 7, nome: 'Pão de Açúcar', categoria: 'doces', preco: 3.50, estoque: 18, estoqueMinimo: 8, status: 'ok' },
        { id: 8, nome: 'Coxinha', categoria: 'salgados', preco: 5.00, estoque: 12, estoqueMinimo: 15, status: 'baixo' }
      ]
      
      setProdutos(mockProdutos)
      setLoading(false)
    }, 500)
  }

  const produtosFiltrados = produtos.filter(produto => {
    const matchNome = produto.nome.toLowerCase().includes(filtro.toLowerCase())
    const matchStatus = filtroStatus === 'todos' || produto.status === filtroStatus
    return matchNome && matchStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ok': return 'bg-green-100 text-green-800'
      case 'baixo': return 'bg-yellow-100 text-yellow-800'
      case 'critico': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ok': return 'Normal'
      case 'baixo': return 'Estoque Baixo'
      case 'critico': return 'Crítico'
      default: return 'Desconhecido'
    }
  }

  const handleUpdateEstoque = (id: number, novoEstoque: number) => {
    setProdutos(produtos.map(produto => {
      if (produto.id === id) {
        const status = novoEstoque <= produto.estoqueMinimo * 0.5 ? 'critico' 
                     : novoEstoque <= produto.estoqueMinimo ? 'baixo' 
                     : 'ok'
        return { ...produto, estoque: novoEstoque, status }
      }
      return produto
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Carregando estoque...</p>
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
              <Link href="/dashboard" className="text-blue-600 hover:text-blue-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Gestão de Estoque</h1>
            </div>
            <div className="flex space-x-2">
              <Link href="/cadastro-produto" className="btn-cantina btn-primary">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
                Novo Produto
              </Link>
              <Link href="/dashboard" className="btn-cantina bg-gray-600 hover:bg-gray-700 text-white">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="card-cantina mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar produto
              </label>
              <input
                type="text"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="input-cantina"
                placeholder="Digite o nome do produto..."
              />
            </div>
            <div className="w-full md:w-64">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por status
              </label>
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="input-cantina"
              >
                <option value="todos">Todos</option>
                <option value="ok">Normal</option>
                <option value="baixo">Estoque Baixo</option>
                <option value="critico">Crítico</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="card-cantina text-center">
            <div className="text-2xl font-bold text-blue-600">{produtos.length}</div>
            <div className="text-gray-600">Total Produtos</div>
          </div>
          <div className="card-cantina text-center">
            <div className="text-2xl font-bold text-green-600">{produtos.filter(p => p.status === 'ok').length}</div>
            <div className="text-gray-600">Estoque Normal</div>
          </div>
          <div className="card-cantina text-center">
            <div className="text-2xl font-bold text-yellow-600">{produtos.filter(p => p.status === 'baixo').length}</div>
            <div className="text-gray-600">Estoque Baixo</div>
          </div>
          <div className="card-cantina text-center">
            <div className="text-2xl font-bold text-red-600">{produtos.filter(p => p.status === 'critico').length}</div>
            <div className="text-gray-600">Crítico</div>
          </div>
        </div>

        {/* Products Table */}
        <div className="card-cantina">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Produtos em Estoque ({produtosFiltrados.length})
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="table-cantina">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Produto</th>
                  <th>Categoria</th>
                  <th>Preço</th>
                  <th>Estoque</th>
                  <th>Mín.</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {produtosFiltrados.map((produto) => (
                  <tr key={produto.id}>
                    <td className="font-mono text-sm">#{produto.id.toString().padStart(3, '0')}</td>
                    <td className="font-medium">{produto.nome}</td>
                    <td>
                      <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                        {produto.categoria}
                      </span>
                    </td>
                    <td className="font-semibold">R$ {produto.preco.toFixed(2)}</td>
                    <td className="font-bold">
                      <input
                        type="number"
                        value={produto.estoque}
                        onChange={(e) => handleUpdateEstoque(produto.id, parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                        min="0"
                      />
                    </td>
                    <td>{produto.estoqueMinimo}</td>
                    <td>
                      <span className={`inline-block text-xs px-2 py-1 rounded-full ${getStatusColor(produto.status)}`}>
                        {getStatusText(produto.status)}
                      </span>
                    </td>
                    <td>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleUpdateEstoque(produto.id, produto.estoque + 1)}
                          className="text-green-600 hover:text-green-800"
                          title="Adicionar 1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                          </svg>
                        </button>
                        <button
                          onClick={() => handleUpdateEstoque(produto.id, Math.max(0, produto.estoque - 1))}
                          className="text-red-600 hover:text-red-800"
                          title="Remover 1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {produtosFiltrados.length === 0 && (
            <div className="text-center py-8">
              <svg className="mx-auto w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
              </svg>
              <p className="text-gray-500">Nenhum produto encontrado com os filtros aplicados.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}