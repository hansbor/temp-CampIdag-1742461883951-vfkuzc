import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface PackingItem {
  id: string;
  text: string;
  completed: boolean;
  person: string;
  day_name: string;
  user_id: string;
}

interface PackingListProps {
  dayName: string;
  items: PackingItem[];
  onUpdate: () => void;
  travelId?: string; // Add travelId as a prop
}

export function PackingList({ dayName, items, onUpdate, travelId }: PackingListProps) {
  const [newItem, setNewItem] = useState('');
  const [person, setPerson] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [defaultItems, setDefaultItems] = useState<PackingItem[]>([]);

  // Fetch default packing items
  useEffect(() => {
    const fetchDefaultItems = async () => {
      if (!travelId) return;

      const { data, error } = await supabase
        .from('default_packing_items')
        .select('*')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (error) {
        console.error('Error fetching default items:', error);
        return;
      }
        console.log("defaultItems", data)
      if (data) {
        // Map default items to the structure of PackingItem, setting day_name and travel_id
          const mappedDefaultItems = data.map((item) => ({
              ...item,
              day_name: dayName,
              completed: false, // Ensure default items start as not completed
          }));
        setDefaultItems(mappedDefaultItems);
      }
    };

    fetchDefaultItems();
  }, [dayName, travelId]);

    const handleAddDefaultItem = async (defaultItem: any) => {

        const { error } = await supabase.from('packing_list_items').insert({
            text: defaultItem.text,
            person: defaultItem.person,
            day_name: dayName,
            user_id: defaultItem.user_id,
            completed: false
        });

        if (!error) {
            onUpdate();
        }
    };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    const { error } = await supabase.from('packing_list_items').insert({
      text: newItem,
      person,
      day_name: dayName,
      user_id: (await supabase.auth.getUser()).data.user?.id
    });

    if (!error) {
      setNewItem('');
      setPerson('');
      onUpdate();
    }
  };

  const handleToggle = async (item: PackingItem) => {
    const { error } = await supabase
      .from('packing_list_items')
      .update({ completed: !item.completed })
      .eq('id', item.id);

    if (!error) {
      onUpdate();
    }
  };

  const startEdit = (item: PackingItem) => {
    setEditingId(item.id);
    setEditText(item.text);
  };

  const handleEdit = async (id: string) => {
    if (!editText.trim()) return;

    const { error } = await supabase
      .from('packing_list_items')
      .update({ text: editText })
      .eq('id', id);

    if (!error) {
      setEditingId(null);
      onUpdate();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('packing_list_items')
      .delete()
      .eq('id', id);

    if (!error) {
      onUpdate();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Packing List</h2>
      </div>

      <form onSubmit={handleAddItem} className="mb-4 space-y-2">
        <input
          type="text"
          value={person}
          onChange={(e) => setPerson(e.target.value)}
          placeholder="Enter person's name"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <div className="flex gap-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Add a new packing item"
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

      {/* Default Items Section - Removed Heading */}
      <ul className="space-y-2 mb-4">
        {defaultItems.map((item) => (
          <li key={item.id} className="flex items-center gap-2">
            <button
              onClick={() => handleAddDefaultItem(item)}
              className="p-1 text-white bg-green-500 rounded-md hover:bg-green-600"
            >
              <PlusCircle className="w-4 h-4" />
            </button>
            <span>{item.text} ({item.person})</span>
          </li>
        ))}
      </ul>

      {/* Added Items Section - Removed Heading */}
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
              <div className="flex-1">
                <span className={item.completed ? 'line-through text-gray-500' : ''}>
                  {item.text}
                </span>
                <span className="ml-2 text-sm text-gray-500">({item.person})</span>
              </div>
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
