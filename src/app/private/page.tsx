import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export default async function PrivatePage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            プライベートページ
          </h1>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
            >
              ログアウト
            </button>
          </form>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h2 className="text-lg font-semibold text-green-800 mb-2">
              認証成功
            </h2>
            <p className="text-green-700">
              こんにちは、{data.user.email}さん！
            </p>
            <p className="text-sm text-green-600 mt-2">
              このページは認証されたユーザーのみがアクセスできます。
            </p>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              ユーザー情報
            </h3>
            <div className="space-y-2 text-sm text-blue-700">
              <p><span className="font-medium">ID:</span> {data.user.id}</p>
              <p><span className="font-medium">メール:</span> {data.user.email}</p>
              <p><span className="font-medium">作成日:</span> {new Date(data.user.created_at).toLocaleDateString('ja-JP')}</p>
              {data.user.last_sign_in_at && (
                <p><span className="font-medium">最終ログイン:</span> {new Date(data.user.last_sign_in_at).toLocaleDateString('ja-JP')}</p>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <a
              href="/"
              className="flex-1 text-center px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              ホームに戻る
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}