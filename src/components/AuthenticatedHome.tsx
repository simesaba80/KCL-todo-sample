'use client';

import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';
import TodoInput from '@/components/TodoInput';
import TodoList from '@/components/TodoList';
import { Todo } from '@/types/todo';

interface AuthenticatedHomeProps {
  user: User;
}

export default function AuthenticatedHome({ user }: AuthenticatedHomeProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState('');
  const supabase = createClient();

  useEffect(() => {
    const fetchTodos = async () => {
      const { data: todos, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching todos:', error);
      } else {
        setTodos(todos || []);
      }
    };

    fetchTodos();

    const channel = supabase
      .channel('todos')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'todos' },
        (payload) => {
          // console.log('Change received!', payload);
          fetchTodos(); // データを再取得してUIを更新
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const addTodo = async () => {
    if (inputText.trim() !== '') {
      const { data, error } = await supabase
        .from('todos')
        .insert([{ todo_text: inputText.trim(), user_id: user.id }])
        .select();

      if (error) {
        console.error('Error adding todo:', error);
      } else if (data) {
        // setTodos((prevTodos) => [...prevTodos, ...data]);
        setInputText('');
      }
    }
  };

  const deleteTodo = async (id: string) => {
    const { error } = await supabase.from('todos').delete().eq('id', id);

    if (error) {
      console.error('Error deleting todo:', error);
    } else {
      // setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    }
  };

  const toggleTodo = async (id: string) => {
    const todoToToggle = todos.find((todo) => todo.id === id);
    if (!todoToToggle) return;

    const { data, error } = await supabase
      .from('todos')
      .update({ completed: !todoToToggle.completed })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error toggling todo:', error);
    } else if (data) {
      // setTodos((prevTodos) =>
      //   prevTodos.map((todo) => (todo.id === id ? { ...todo, ...data[0] } : todo))
      // );
    }
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
            <form action="/api/auth/signout" method="post" className="inline">
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