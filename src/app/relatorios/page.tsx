'use client';

import { useState, useEffect } from 'react';

// Mock data para relatórios
const mockVendasData = [
  { produto: 'Pão de Açúcar', quantidade: 45, valor: 135.00, categoria: 'Padaria' },
  { produto: 'Refrigerante Coca-Cola', quantidade: 32, valor: 160.00, categoria: 'Bebidas' },
  { produto: 'Salgadinho Chips', quantidade: 28, valor: 84.00, categoria: 'Snacks' },
  { produto: 'Café Expresso', quantidade: 67, valor: 201.00, categoria: 'Bebidas' },
  { produto: 'Sanduíche Natural', quantidade: 23, valor: 184.00, categoria: 'Lanches' },
];

const mockFinanceiroData = {
  receitas: 2450.00,
  custos: 1200.00,
  lucro: 1250.00,
  margemLucro: 51.02
};

const mockProdutosData = [
  { nome: 'Pão de Açúcar', estoque: 125, vendas: 45, rotatividade: 'Alta' },
  { nome: 'Refrigerante Coca-Cola', estoque: 67, vendas: 32, rotatividade: 'Média' },
  { nome: 'Salgadinho Chips', estoque: 34, vendas: 28, rotatividade: 'Alta' },
  { nome: 'Café Expresso', estoque: 89, vendas: 67, rotatividade: 'Muito Alta' },
  { nome: 'Sanduíche Natural', estoque: 12, vendas: 23, rotatividade: 'Crítica' },
];

export default function RelatoriosPage() {
  const [tipoRelatorio, setTipoRelatorio] = useState('vendas');
  const [periodo, setPeriodo] = useState('7dias');
  const [categoria, setCategoria] = useState('todas');

  const gerarRelatorioVendas = () => {
    return mockVendasData;
  };

  const gerarRelatorioFinanceiro = () => {
    return mockFinanceiroData;
  };

  const gerarRelatorioProdutos = () => {
    return mockProdutosData;
  };

  const exportarRelatorio = (formato: string) => {
    alert(`Exportando relatório em formato ${formato.toUpperCase()}...`);
  };

  const calcularTotalVendas = () => {
    return mockVendasData.reduce((total, item) => total + item.valor, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">📊 Relatórios</h1>
              <p className="text-gray-600">Análises detalhadas e insights da cantina</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => exportarRelatorio('pdf')}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                📄 Exportar PDF
              </button>
              <button 
                onClick={() => exportarRelatorio('excel')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                📊 Exportar Excel
              </button>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">🔍 Filtros</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Relatório
              </label>
              <select 
                value={tipoRelatorio} 
                onChange={(e) => setTipoRelatorio(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="vendas">📈 Vendas</option>
                <option value="financeiro">💰 Financeiro</option>
                <option value="produtos">📦 Produtos</option>
                <option value="estoque">📋 Estoque</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Período
              </label>
              <select 
                value={periodo} 
                onChange={(e) => setPeriodo(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="hoje">📅 Hoje</option>
                <option value="7dias">📅 Últimos 7 dias</option>
                <option value="30dias">📅 Últimos 30 dias</option>
                <option value="3meses">📅 Últimos 3 meses</option>
                <option value="ano">📅 Este ano</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select 
                value={categoria} 
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="todas">🏷️ Todas</option>
                <option value="bebidas">🥤 Bebidas</option>
                <option value="snacks">🍿 Snacks</option>
                <option value="lanches">🥪 Lanches</option>
                <option value="padaria">🍞 Padaria</option>
              </select>
            </div>
          </div>
        </div>

        {/* Relatório de Vendas */}
        {tipoRelatorio === 'vendas' && (
          <div className="space-y-6">
            {/* Resumo de Vendas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Vendas</p>
                    <p className="text-2xl font-bold text-gray-900">
                      R$ {calcularTotalVendas().toFixed(2)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">💰</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Itens Vendidos</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {mockVendasData.reduce((total, item) => total + item.quantidade, 0)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📦</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
                    <p className="text-2xl font-bold text-gray-900">
                      R$ {(calcularTotalVendas() / mockVendasData.length).toFixed(2)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🎯</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Produtos Ativos</p>
                    <p className="text-2xl font-bold text-gray-900">{mockVendasData.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🏷️</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabela de Vendas */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">📊 Detalhamento de Vendas</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Produto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoria
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantidade
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Valor Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {gerarRelatorioVendas().map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{item.produto}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            {item.categoria}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.quantidade}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          R$ {item.valor.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Relatório Financeiro */}
        {tipoRelatorio === 'financeiro' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Receitas</p>
                    <p className="text-2xl font-bold">R$ {mockFinanceiroData.receitas.toFixed(2)}</p>
                  </div>
                  <div className="text-3xl">📈</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm font-medium">Custos</p>
                    <p className="text-2xl font-bold">R$ {mockFinanceiroData.custos.toFixed(2)}</p>
                  </div>
                  <div className="text-3xl">📉</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Lucro</p>
                    <p className="text-2xl font-bold">R$ {mockFinanceiroData.lucro.toFixed(2)}</p>
                  </div>
                  <div className="text-3xl">💰</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Margem</p>
                    <p className="text-2xl font-bold">{mockFinanceiroData.margemLucro.toFixed(1)}%</p>
                  </div>
                  <div className="text-3xl">🎯</div>
                </div>
              </div>
            </div>

            {/* Gráfico de Pizza Simples (CSS) */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">💹 Distribuição Financeira</h3>
              <div className="flex items-center justify-center">
                <div className="relative w-64 h-64">
                  <div className="absolute inset-0 rounded-full bg-gradient-conic"
                       style={{
                         background: `conic-gradient(from 0deg, #10b981 0deg ${(mockFinanceiroData.lucro / mockFinanceiroData.receitas) * 360}deg, #ef4444 ${(mockFinanceiroData.lucro / mockFinanceiroData.receitas) * 360}deg 360deg)`
                       }}>
                  </div>
                  <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{mockFinanceiroData.margemLucro.toFixed(1)}%</div>
                      <div className="text-sm text-gray-600">Margem</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-4 space-x-6">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Lucro (R$ {mockFinanceiroData.lucro.toFixed(2)})</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Custos (R$ {mockFinanceiroData.custos.toFixed(2)})</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Relatório de Produtos */}
        {tipoRelatorio === 'produtos' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">📦 Análise de Produtos</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estoque
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vendas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rotatividade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {gerarRelatorioProdutos().map((produto, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{produto.nome}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {produto.estoque}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {produto.vendas}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          produto.rotatividade === 'Muito Alta' ? 'bg-green-100 text-green-800' :
                          produto.rotatividade === 'Alta' ? 'bg-blue-100 text-blue-800' :
                          produto.rotatividade === 'Média' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {produto.rotatividade}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {produto.estoque < 20 ? (
                          <span className="text-red-600 font-medium">⚠️ Baixo</span>
                        ) : produto.estoque < 50 ? (
                          <span className="text-yellow-600 font-medium">⚡ Médio</span>
                        ) : (
                          <span className="text-green-600 font-medium">✅ Normal</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Relatório de Estoque */}
        {tipoRelatorio === 'estoque' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Produtos em Estoque</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {mockProdutosData.reduce((total, item) => total + item.estoque, 0)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📦</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Produtos Críticos</p>
                    <p className="text-2xl font-bold text-red-600">
                      {mockProdutosData.filter(p => p.estoque < 20).length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">⚠️</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Valor do Estoque</p>
                    <p className="text-2xl font-bold text-gray-900">R$ 8.450,00</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">💰</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Lista de Produtos com Estoque Baixo */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">⚠️ Produtos com Estoque Crítico</h3>
              <div className="space-y-3">
                {mockProdutosData.filter(p => p.estoque < 20).map((produto, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-red-600">⚠️</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{produto.nome}</p>
                        <p className="text-sm text-gray-600">Estoque atual: {produto.estoque} unidades</p>
                      </div>
                    </div>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                      Reabastecer
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}