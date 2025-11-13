import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🍽️ Sistema Cantina
            </h1>
            <p className="text-lg text-gray-600">
              Gerenciamento completo da cantina escolar
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 space-y-4">
            <Link 
              href="/login" 
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-all duration-200 transform hover:scale-105"
            >
              Fazer Login
            </Link>
            
            <Link 
              href="/dashboard" 
              className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg text-center transition-all duration-200"
            >
              Ver Dashboard
            </Link>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              © 2025 Sistema de Cantina - Desenvolvido com Next.js
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}