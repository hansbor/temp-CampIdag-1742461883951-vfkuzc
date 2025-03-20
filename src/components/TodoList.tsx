import React, { useState } from 'react';
import { PlusCircle, Edit, Trash } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  list_type: string;
  day_id: string;
  user_id: string;
}

interface TodoListProps {
  dayId: string;
  todos: Todo[];
  onUpdate: () => void;
}

export function TodoList({ dayId, todos, onUpdate }: TodoListProps) {
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    const { error } = await supabase.from('todos').insert({
      text: newTodo,
      list_type: 'todo',
      day_id: dayId,
      user_id: (await supabase.auth.getUser()).data.user?.id
    });

    if (!error) {
      setNewTodo('');
      onUpdate();
    }
  };

  const handleToggle = async (todo: Todo) => {
    const { error } = await supabase
      .from('todos')
      .update({ completed: !todo.completed })
      .eq('id', todo.id);

    if (!error) {
      onUpdate();
    }
  };

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const handleEdit = async (id: string) => {
    if (!editText.trim()) return;

    const { error } = await supabase
      .from('todos')
      .update({ text: editText })
      .eq('id', id);

    if (!error) {
      setEditingId(null);
      onUpdate();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);

    if (!error) {
      onUpdate();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Todo</h2>
      </div>
      
      <form onSubmit={handleAddTodo} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo item"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="p-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            <PlusCircle className="w-5 h-5" />
          </button>
        </div>
      </form>

      <ul className="space-y-2">
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggle(todo)}
              className="h-4 w-4 text-indigo-600 rounded"
            />
            {editingId === todo.id ? (
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="flex-1 px-3 py-1 border border-gray-300 rounded-md"
                  onBlur={() => handleEdit(todo.id)}
                  onKeyPress={(e) => e.key === 'Enter' && handleEdit(todo.id)}
                  autoFocus
                />
              </div>
            ) : (
              <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                {todo.text}
              </span>
            )}
            <button
              onClick={() => startEdit(todo)}
              className="p-1 text-gray-400 hover:text-indigo-600"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(todo.id)}
              className="p-1 text-gray-400 hover:text-red-600"
            >
              <Trash className="w-4 h-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
