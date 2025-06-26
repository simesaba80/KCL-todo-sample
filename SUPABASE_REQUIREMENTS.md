# Supabase Todo App 要件書

## バックエンド要件（Supabase）

### 1. データベース設計

#### Todosテーブル
```sql
CREATE TABLE todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLSを有効化
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- RLSポリシーを設定
CREATE POLICY "Users can view own todos" ON todos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own todos" ON todos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own todos" ON todos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own todos" ON todos
  FOR DELETE USING (auth.uid() = user_id);
```

#### RLS (Row Level Security) 設定
- ユーザー認証機能を実装するため、各TodoにユーザーIDを紐付け
- 各ユーザーは自分のTodoのみアクセス可能にRLSを設定
- 以下のRLSポリシーを設定：
  - SELECT: ユーザーは自分のTodoのみ閲覧可能
  - INSERT: ユーザーは自分のTodoのみ作成可能
  - UPDATE: ユーザーは自分のTodoのみ更新可能
  - DELETE: ユーザーは自分のTodoのみ削除可能

### 2. 必要なSupabase機能
- **Database**: PostgreSQL データベース
- **Authentication**: ユーザー認証（Email + Password）
- **Realtime**: リアルタイム更新（オプション）
- **API**: 自動生成されるREST API
- **JavaScript Client**: フロントエンドからのアクセス用

### 3. API エンドポイント
Supabaseが自動生成するREST API:
- `GET /rest/v1/todos` - Todo一覧取得
- `POST /rest/v1/todos` - Todo作成
- `PATCH /rest/v1/todos?id=eq.{id}` - Todo更新
- `DELETE /rest/v1/todos?id=eq.{id}` - Todo削除

## フロントエンド変更要件

### 1. 依存関係の追加
```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.x.x"
  }
}
```

### 2. 環境変数設定
`.env.local` ファイルに以下を追加:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. ファイル構成変更

#### 新規作成ファイル
- `src/lib/supabase.ts` - Supabaseクライアント設定
- `src/hooks/useTodos.ts` - TodoのCRUD操作フック
- `src/hooks/useAuth.ts` - 認証管理フック
- `src/types/todo.ts` - Todo型定義
- `src/types/auth.ts` - 認証型定義
- `src/components/AuthGuard.tsx` - 認証ガードコンポーネント

#### 変更が必要なファイル
- `src/app/page.tsx` - 状態管理をSupabaseフックに変更、認証ガード追加
- `src/app/login/page.tsx` - Supabase認証機能に接続
- `src/app/register/page.tsx` - Supabase認証機能に接続
- `src/components/TodoList.tsx` - 型定義をimportに変更
- `src/components/TodoItem.tsx` - UUID対応

### 4. 主な変更点

#### 認証機能の追加
- ユーザー登録・ログイン機能の実装
- セッション管理とログアウト機能
- 認証状態に応じたルーティング制御

#### 状態管理の変更
- `useState`からSupabaseのリアルタイム購読に変更
- ローカル状態からサーバー状態への移行
- 認証状態管理の追加

#### ID管理の変更
- `Date.now()`からUUID（Supabase自動生成）に変更
- ユーザーIDとTodoの紐付け

#### エラーハンドリングの追加
- ネットワークエラーやデータベースエラーの処理
- 認証エラーの処理
- ローディング状態の管理

#### 非同期処理の対応
- すべてのCRUD操作が非同期になる
- 認証処理が非同期になる
- 楽観的UI更新の実装

## Supabaseプロジェクトセットアップ手順

### 1. Supabaseプロジェクト作成
1. https://supabase.com でアカウント作成
2. 新しいプロジェクトを作成
3. プロジェクトのURLとanon keyを取得

### 2. データベースセットアップ
1. Supabase DashboardのSQL Editorを開く
2. 上記のCREATE TABLE文を実行
3. Row Level Securityを設定（必要に応じて）

### 3. 環境設定
1. `.env.local`ファイルを作成
2. SupabaseのURLとキーを設定
3. `.gitignore`に`.env.local`が含まれていることを確認

### 4. フロントエンド実装順序
1. Supabaseクライアント設定
2. 型定義の作成（Todo、認証）
3. 認証管理フックの実装
4. TodoのCRUD操作フックの実装
5. 認証ガードコンポーネントの実装
6. ログイン・登録ページの更新
7. メインページの更新（認証ガード追加）
8. エラーハンドリングの追加

## 将来の拡張可能性

### 認証機能の強化
- ソーシャルログイン（Google、GitHub等）の追加
- パスワードリセット機能
- メール認証機能
- 2段階認証

### 追加機能
- Todo項目の並び替え（order列追加）
- カテゴリ分け（category列追加）
- 期限設定（due_date列追加）
- リアルタイム同期機能の活用