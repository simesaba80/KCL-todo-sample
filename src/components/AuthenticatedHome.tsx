'use client';

import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';
import axiosInstance from '@/utils/axios'; // Import axios instance
import TodoInput from '@/components/TodoInput';
import TodoList from '@/components/TodoList';
import { Todo } from '@/types/todo';

interface AuthenticatedHomeProps {
  user: User;
}

export default function AuthenticatedHome({ user }: AuthenticatedHomeProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState('');
  const supabase = createClient(); // Still needed for real-time

  // Fetch todos using axios
  const fetchTodos = async () => {
    try {
      const response = await axiosInstance.get('/todos?select=*&order=created_at.asc');
      setTodos(response.data || []);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  useEffect(() => {
    fetchTodos();

    // Real-time subscription remains the same
    const channel = supabase
      .channel('todos')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'todos' },
        (payload) => {
          fetchTodos(); // Re-fetch data on change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  // Add todo using axios
  const addTodo = async () => {
    if (inputText.trim() !== '') {
      try {
        await axiosInstance.post('/todos', {
          todo_text: inputText.trim(),
          user_id: user.id,
        });
        setInputText('');
        fetchTodos(); // Re-fetch after adding
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    }
  };

  // Delete todo using axios
  const deleteTodo = async (id: string) => {
    try {
      await axiosInstance.delete(`/todos?id=eq.${id}`);
      fetchTodos(); // Re-fetch after deleting
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  // Toggle todo using axios
  const toggleTodo = async (id: string) => {
    const todoToToggle = todos.find((todo) => todo.id === id);
    if (!todoToToggle) return;

    try {
      await axiosInstance.patch(`/todos?id=eq.${id}`, {
        completed: !todoToToggle.completed,
      });
      fetchTodos(); // Re-fetch after toggling
    } catch (error) {
      console.error('Error toggling todo:', error);
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