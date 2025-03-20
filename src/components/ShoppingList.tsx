import React, { useState } from 'react';
import { PlusCircle, Edit, Trash, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ShopItem {
  id: string;
  text: string;
  completed: boolean;
  day_name: string;
  user_id: string;
}

interface ShoppingListProps {
  dayName: string;
  items: ShopItem[];
  onUpdate: () => void;
}

export function ShoppingList({ dayName, items, onUpdate }: ShoppingListProps) {
  const [newItem, setNewItem] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    const { error } = await supabase.from('shop_list_items').insert({
      text: newItem,
      day_name: dayName,
      user_id: (await supabase.auth.getUser()).data.user?.id
    });

    if (!error) {
      setNewItem('');
      onUpdate();
    }
  };

  const handleToggle = async (item: ShopItem) => {
    const { error } = await supabase
      .from('shop_list_items')
      .update({ completed: !item.completed })
      .eq('id', item.id);

    if (!error) {
      onUpdate();
    }
  };

  const startEdit = (item: ShopItem) => {
    setEditingId(item.id);
    setEditText(item.text);
  };

  const handleEdit = async (id: string) => {
    if (!editText.trim()) return;

    const { error } = await supabase
      .from('shop_list_items')
      .update({ text: editText })
      .eq('id', id);

    if (!error) {
      setEditingId(null);
      onUpdate();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('shop_list_items')
      .delete()
      .eq('id', id);

    if (!error) {
      onUpdate();
    }
  };

  const handleSendList = () => {
    const list = items.map(item => `- ${item.text}`).join('\n');
    const mailtoLink = `mailto:?subject=Shopping List for ${dayName}&body=${encodeURIComponent(list)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Shop</h2>
        <button
          onClick={handleSendList}
          className="flex items-center gap-2 px-3 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
        >
          <Mail className="w-4 h-4" />
          <span>Send Shopping List</span>
        </button>
      </div>
      
      <form onSubmit={handleAddItem} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Add a new shop item"
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
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => handleToggle(item)}
              className="h-4 w-4 text-indigo-600 rounded"
            />
            {editingId === item.id ? (
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="flex-1 px-3 py-1 border border-gray-300 rounded-md"
                  onBlur={() => handleEdit(item.id)}
                  onKeyPress={(e) => e.key === 'Enter' && handleEdit(item.id)}
                  autoFocus
                />
              </div>
            ) : (
              <span className={`flex-1 ${item.completed ? 'line-through text-gray-500' : ''}`}>
                {item.text}
              </span>
            )}
            <button
              onClick={() => startEdit(item)}
              className="p-1 text-gray-400 hover:text-indigo-600"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(item.id)}
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
