'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface ProdutoForm {
  nome: string
  descricao: string
  preco: string
  categoria: string
  estoque: string
  estoqueMinimo: string
}

export default function CadastroProdutoPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<ProdutoForm>({
    nome: '',
    descricao: '',
    preco: '',
    categoria: '',
    estoque: '',
    estoqueMinimo: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Verificar autenticação
    const authStatus = localStorage.getItem('cantina_auth')
    if (!authStatus || authStatus !== 'true') {
      router.push('/login')
      return
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      alert('Produto cadastrado com sucesso!')
      
      // Reset form
      setFormData({
        nome: '',
        descricao: '',
        preco: '',
        categoria: '',
        estoque: '',
        estoqueMinimo: ''
      })
    } catch (error) {
      console.error('Erro ao cadastrar produto:', error)
      alert('Erro ao cadastrar produto')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
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
              <h1 className="text-2xl font-bold text-gray-900">Cadastrar Produto</h1>
            </div>
            <Link href="/dashboard" className="btn-cantina bg-gray-600 hover:bg-gray-700 text-white">
              Voltar ao Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card-cantina">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Informações do Produto</h2>
            <p className="text-gray-600">Preencha os dados abaixo para cadastrar um novo produto</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Produto *
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className="input-cantina"
                  placeholder="Ex: Sanduíche Natural"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria *
                </label>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  className="input-cantina"
                  required
                  disabled={loading}
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="lanches">Lanches</option>
                  <option value="bebidas">Bebidas</option>
                  <option value="doces">Doces</option>
                  <option value="salgados">Salgados</option>
                  <option value="frutas">Frutas</option>
                  <option value="outros">Outros</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                rows={3}
                className="input-cantina"
                placeholder="Descrição detalhada do produto..."
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preço (R$) *
                </label>
                <input
                  type="number"
                  name="preco"
                  value={formData.preco}
                  onChange={handleChange}
                  className="input-cantina"
                  placeholder="0,00"
                  step="0.01"
                  min="0"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estoque Atual *
                </label>
                <input
                  type="number"
                  name="estoque"
                  value={formData.estoque}
                  onChange={handleChange}
                  className="input-cantina"
                  placeholder="0"
                  min="0"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estoque Mínimo *
                </label>
                <input
                  type="number"
                  name="estoqueMinimo"
                  value={formData.estoqueMinimo}
                  onChange={handleChange}
                  className="input-cantina"
                  placeholder="0"
                  min="0"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <Link 
                href="/dashboard"
                className="btn-cantina bg-gray-300 hover:bg-gray-400 text-gray-700"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={loading}
                className={`btn-cantina btn-primary ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Cadastrando...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                    </svg>
                    Cadastrar Produto
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Preview Card */}
        {formData.nome && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview do Produto</h3>
            <div className="card-cantina max-w-sm">
              <h4 className="font-semibold text-gray-900">{formData.nome}</h4>
              {formData.categoria && (
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1">
                  {formData.categoria}
                </span>
              )}
              {formData.descricao && (
                <p className="text-gray-600 text-sm mt-2">{formData.descricao}</p>
              )}
              {formData.preco && (
                <p className="text-lg font-bold text-green-600 mt-2">
                  R$ {parseFloat(formData.preco || '0').toFixed(2)}
                </p>
              )}
              {formData.estoque && (
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>Estoque: {formData.estoque}</span>
                  {formData.estoqueMinimo && (
                    <span>Min: {formData.estoqueMinimo}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}