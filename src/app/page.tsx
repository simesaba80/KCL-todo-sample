import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import AuthenticatedHome from '@/components/AuthenticatedHome'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    return <AuthenticatedHome user={user} />
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Todo App
          </h1>
          <div className="flex gap-2">
            <Link
              href="/login"
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              ログイン
            </Link>
            <Link
              href="/register"
              className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
            >
              登録
            </Link>
          </div>
        </div>
        
        <div className="text-center space-y-4">
          <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">
              ようこそ Todo App へ
            </h2>
            <p className="text-blue-700 text-sm">
              Todoを管理するには、ログインまたは新規登録が必要です。
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href="/login"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-center"
            >
              ログイン
            </Link>
            <Link
              href="/register"
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-center"
            >
              新規登録
            </Link>
            <Link
              href="/private"
              className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-center"
            >
              プライベートページ（認証テスト）
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
