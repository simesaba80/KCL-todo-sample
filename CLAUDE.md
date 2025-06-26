# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

Next.js 15、TypeScript、React 19、Tailwind CSS 4を使用したTodoアプリケーションです。現在はローカル状態管理で実装されていますが、Supabase認証とバックエンドへの移行要件が文書化されています。基本的なログイン・ユーザー登録ページが実装済みです。

## 開発コマンド

- `npm run dev` - 開発サーバー起動 (http://localhost:3000)
- `npm run build` - 本番用ビルド
- `npm run start` - 本番サーバー起動
- `npm run lint` - ESLint実行

## アーキテクチャ

### 現在の実装（フロントエンドのみ）
- **状態管理**: `src/app/page.tsx`でReactの`useState`を使用
- **コンポーネント構造**: 入力、リスト、個別アイテム用の分離されたコンポーネント
- **ID生成**: TodoのIDに`Date.now()`を使用
- **スタイリング**: レスポンシブデザインのTailwind CSS

### コンポーネント構造
- `src/app/page.tsx` - 状態管理とCRUD操作を含むメインページ（ログイン・登録ボタン付き）
- `src/app/login/page.tsx` - ログインページ（ベーシック認証フォーム）
- `src/app/register/page.tsx` - ユーザー登録ページ（パスワード確認機能付き）
- `src/components/TodoInput.tsx` - 追加機能付きの入力フィールド
- `src/components/TodoList.tsx` - 空状態処理を含むリストコンテナ
- `src/components/TodoItem.tsx` - トグル/削除アクション付きの個別Todoアイテム

### Supabaseへの移行計画
プロジェクトにはSupabase認証とバックエンドへの移行に関する詳細な要件（`SUPABASE_REQUIREMENTS.md`）が含まれています：
- **認証機能**: Supabase Auth（Email + Password）
- **データベース**: PostgreSQLの`todos`テーブル（id, user_id, text, completed, timestamps）
- **セキュリティ**: Row Level Security（RLS）でユーザーごとのデータ分離
- **ID管理**: `Date.now()`からUUIDベースのIDに変更
- **リアルタイム**: ライブ更新のためのリアルタイム購読
- **作成予定のファイル**: 
  - `src/lib/supabase.ts` - Supabaseクライアント設定
  - `src/hooks/useAuth.ts` - 認証管理フック
  - `src/hooks/useTodos.ts` - TodoのCRUD操作フック
  - `src/types/auth.ts` - 認証型定義
  - `src/types/todo.ts` - Todo型定義
  - `src/components/AuthGuard.tsx` - 認証ガードコンポーネント
- **環境変数**: `NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_ANON_KEY`

### インターフェース定義
現在複数のファイルで定義されています（統合が必要）：
```typescript
// 現在のTodo型
interface Todo {
  id: number; // Supabaseでは文字列（UUID）に変更予定
  text: string;
  completed: boolean;
}

// Supabase移行後のTodo型（予定）
interface Todo {
  id: string; // UUID
  user_id: string; // ユーザーID
  text: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}
```

## 技術スタック

- **フレームワーク**: Next.js 15（App Router）
- **言語**: TypeScript 5
- **UI**: React 19、Tailwind CSS 4
- **リンティング**: Next.js設定のESLint
- **将来のバックエンド**: Supabase（PostgreSQL、Auth、REST API、Realtime）

## 認証機能

### 実装済み
- `/login` - ログインページ（Email + Password）
- `/register` - ユーザー登録ページ（パスワード確認機能付き）
- メインページにログイン・登録ボタン

### 未実装（Supabase移行時に実装予定）
- 実際のSupabase認証連携
- セッション管理
- 認証ガード機能
- ログアウト機能
- パスワードリセット機能