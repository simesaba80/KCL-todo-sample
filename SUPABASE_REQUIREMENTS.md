# Supabase Todo App 要件書

## バックエンド要件（Supabase）

### 1. データベース設計

#### Todosテーブル
```sql
CREATE TABLE todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### RLS (Row Level Security) 設定
- 現在は認証なしのシンプル実装のため、すべてのユーザーがすべてのTodoにアクセス可能
- 将来的にユーザー認証を追加する場合は、user_id列を追加してRLSを設定

### 2. 必要なSupabase機能
- **Database**: PostgreSQL データベース
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
- `src/types/todo.ts` - Todo型定義

#### 変更が必要なファイル
- `src/app/page.tsx` - 状態管理をSupabaseフックに変更
- `src/components/TodoList.tsx` - 型定義をimportに変更
- `src/components/TodoItem.tsx` - UUID対応

### 4. 主な変更点

#### 状態管理の変更
- `useState`からSupabaseのリアルタイム購読に変更
- ローカル状態からサーバー状態への移行

#### ID管理の変更
- `Date.now()`からUUID（Supabase自動生成）に変更

#### エラーハンドリングの追加
- ネットワークエラーやデータベースエラーの処理
- ローディング状態の管理

#### 非同期処理の対応
- すべてのCRUD操作が非同期になる
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
2. 型定義の作成
3. カスタムフックの実装
4. コンポーネントの更新
5. エラーハンドリングの追加

## 将来の拡張可能性

### 認証機能追加時
- Supabase Authを使用したユーザー認証
- user_id列をtodosテーブルに追加
- RLSポリシーでユーザーごとのデータ分離

### 追加機能
- Todo項目の並び替え（order列追加）
- カテゴリ分け（category列追加）
- 期限設定（due_date列追加）
- リアルタイム同期機能の活用