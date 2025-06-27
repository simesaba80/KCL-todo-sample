import Link from 'next/link'

export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="text-center space-y-6">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              エラーが発生しました
            </h1>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h2 className="text-lg font-semibold text-red-800 mb-2">
                認証エラー
              </h2>
              <p className="text-red-700 text-sm">
                ログインまたはサインアップ処理中にエラーが発生しました。
              </p>
            </div>

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h3 className="text-md font-semibold text-gray-800 mb-2">
                考えられる原因
              </h3>
              <ul className="text-sm text-gray-600 space-y-1 text-left">
                <li>• メールアドレスまたはパスワードが正しくない</li>
                <li>• アカウントが存在しない（サインアップが必要）</li>
                <li>• 既に登録済みのメールアドレス（ログインが必要）</li>
                <li>• ネットワークの問題</li>
                <li>• サーバーの一時的な問題</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href="/login"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-center"
            >
              ログインページに戻る
            </Link>
            <Link
              href="/register"
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-center"
            >
              新規登録ページに戻る
            </Link>
            <Link
              href="/"
              className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-center"
            >
              ホームに戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}