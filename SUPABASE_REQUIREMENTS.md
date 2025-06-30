# Supabase Todo App 要件書

## バックエンド要件（Supabase）

### 1. データベース設計

#### Todos テーブル

```sql
CREATE TABLE todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  todo_text TEXT NOT NULL,
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

- ユーザー認証機能を実装するため、各 Todo にユーザー ID を紐付け
- 各ユーザーは自分の Todo のみアクセス可能に RLS を設定
- 以下の RLS ポリシーを設定：
  - SELECT: ユーザーは自分の Todo のみ閲覧可能
  - INSERT: ユーザーは自分の Todo のみ作成可能
  - UPDATE: ユーザーは自分の Todo のみ更新可能
  - DELETE: ユーザーは自分の Todo のみ削除可能

### 2. 必要な Supabase 機能

- **Database**: PostgreSQL データベース
- **Authentication**: ユーザー認証（Email + Password）
- **Realtime**: リアルタイム更新（オプション）
- **API**: 自動生成される REST API
- **JavaScript Client**: フロントエンドからのアクセス用

### 3. API エンドポイント

Supabase が自動生成する REST API:

- `GET /rest/v1/todos` - Todo 一覧取得
- `POST /rest/v1/todos` - Todo 作成
- `PATCH /rest/v1/todos?id=eq.{id}` - Todo 更新
- `DELETE /rest/v1/todos?id=eq.{id}` - Todo 削除

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

- `src/lib/supabase.ts` - Supabase クライアント設定
- `src/hooks/useTodos.ts` - Todo の CRUD 操作フック
- `src/hooks/useAuth.ts` - 認証管理フック
- `src/types/todo.ts` - Todo 型定義
- `src/types/auth.ts` - 認証型定義
- `src/components/AuthGuard.tsx` - 認証ガードコンポーネント

#### 変更が必要なファイル

- `src/app/page.tsx` - 状態管理を Supabase フックに変更、認証ガード追加
- `src/app/login/page.tsx` - Supabase 認証機能に接続
- `src/app/register/page.tsx` - Supabase 認証機能に接続
- `src/components/TodoList.tsx` - 型定義を import に変更
- `src/components/TodoItem.tsx` - UUID 対応

### 4. 主な変更点

#### 認証機能の追加

- ユーザー登録・ログイン機能の実装
- セッション管理とログアウト機能
- 認証状態に応じたルーティング制御

#### 状態管理の変更

- `useState`から Supabase のリアルタイム購読に変更
- ローカル状態からサーバー状態への移行
- 認証状態管理の追加

#### ID 管理の変更

- `Date.now()`から UUID（Supabase 自動生成）に変更
- ユーザー ID と Todo の紐付け

#### エラーハンドリングの追加

- ネットワークエラーやデータベースエラーの処理
- 認証エラーの処理
- ローディング状態の管理

#### 非同期処理の対応

- すべての CRUD 操作が非同期になる
- 認証処理が非同期になる
- 楽観的 UI 更新の実装

## Supabase プロジェクトセットアップ手順

### 1. Supabase プロジェクト作成

1. https://supabase.com でアカウント作成
2. 新しいプロジェクトを作成
3. プロジェクトの URL と anon key を取得

### 2. データベースセットアップ

1. Supabase Dashboard の SQL Editor を開く
2. 上記の CREATE TABLE 文を実行
3. Row Level Security を設定（必要に応じて）

### 3. 環境設定

1. `.env.local`ファイルを作成
2. Supabase の URL とキーを設定
3. `.gitignore`に`.env.local`が含まれていることを確認

### 4. フロントエンド実装順序

1. Supabase クライアント設定
2. 型定義の作成（Todo、認証）
3. 認証管理フックの実装
4. Todo の CRUD 操作フックの実装
5. 認証ガードコンポーネントの実装
6. ログイン・登録ページの更新
7. メインページの更新（認証ガード追加）
8. エラーハンドリングの追加

## 将来の拡張可能性

### 認証機能の強化

- ソーシャルログイン（Google、GitHub 等）の追加
- パスワードリセット機能
- メール認証機能
- 2 段階認証

### 追加機能

- Todo 項目の並び替え（order 列追加）
- カテゴリ分け（category 列追加）
- 期限設定（due_date 列追加）
- リアルタイム同期機能の活用
