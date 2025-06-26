'use client';

import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import TodoInput from '@/components/TodoInput';
import TodoList from '@/components/TodoList';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface AuthenticatedHomeProps {
  user: User;
}

export default function AuthenticatedHome({ user }: AuthenticatedHomeProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState('');

  const addTodo = () => {
    if (inputText.trim() !== '') {
      setTodos([...todos, {
        id: Date.now(),
        text: inputText.trim(),
        completed: false
      }]);
      setInputText('');
    }
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Todo App
          </h1>
          <div className="flex gap-2">
            <a
              href="/private"
              className="px-3 py-1 text-sm bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              プロフィール
            </a>
            <form action="/auth/signout" method="post" className="inline">
              <button
                type="submit"
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                ログアウト
              </button>
            </form>
          </div>
        </div>

        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700">
            ようこそ、<span className="font-medium">{user.email}</span>さん！
          </p>
        </div>
        
        <TodoInput
          value={inputText}
          onChange={setInputText}
          onAdd={addTodo}
        />

        <TodoList
          todos={todos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
        />
      </div>
    </div>
  );
}