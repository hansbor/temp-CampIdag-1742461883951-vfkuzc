import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { TodoList } from '../components/TodoList';
import { PackingList } from '../components/PackingList';
import { ShoppingList } from '../components/ShoppingList';
import { PlanningTable } from '../components/PlanningTable';
import { Settings, PlusCircle, Edit, Check, X, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function Home() {
  const [currentDay, setCurrentDay] = useState<{ id: string; travel: string } | null>(null);
  const [days, setDays] = useState<Array<{ id: string; travel: string }>>([]);
  const [todos, setTodos] = useState<any[]>([]);
  const [packingItems, setPackingItems] = useState<any[]>([]);
  const [shopItems, setShopItems] = useState<any[]>([]);
  const [planningItems, setPlanningItems] = useState<any[]>([]);
  const [isEditingDayName, setIsEditingDayName] = useState(false);
  const [editDayName, setEditDayName] = useState('');

  useEffect(() => {
    fetchDays();
  }, []);

  useEffect(() => {
    if (currentDay) {
      fetchAllItems();
    }
  }, [currentDay]);

  const fetchDays = async () => {
    const { data, error } = await supabase
      .from('days')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setDays(data);
      if (data.length > 0) {
        setCurrentDay(data[0]);
      }
    }
  };

  const fetchAllItems = async () => {
    if (!currentDay) return;

    // Fetch todos
    const { data: todosData } = await supabase
      .from('todos')
      .select('*')
      .eq('day_id', currentDay.id)
      .order('created_at', { ascending: false });
    setTodos(todosData || []);

    // Fetch packing items
    const { data: packingData } = await supabase
      .from('packing_list_items')
      .select('*')
      .eq('day_name', currentDay.travel)
      .order('created_at', { ascending: false });
    setPackingItems(packingData || []);

    // Fetch shop items
    const { data: shopData } = await supabase
      .from('shop_list_items')
      .select('*')
      .eq('day_name', currentDay.travel)
      .order('created_at', { ascending: false });
    setShopItems(shopData || []);

    // Fetch planning items
    const { data: planningData } = await supabase
      .from('planning_items')
      .select('*')
      .eq('day_name', currentDay.travel)
      .order('created_at', { ascending: false });
    setPlanningItems(planningData || []);
  };

  const handleAddDay = async () => {
    const newTravelName = `Travel ${days.length + 1}`;
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) return;
    
    const { data, error } = await supabase
      .from('days')
      .insert({
        travel: newTravelName,
        user_id: userId
      })
      .select()
      .single();
    
    if (!error && data) {
      const newDayId = data.id;
      
      // Add default todo items
      const { data: defaultTodos } = await supabase
        .from('default_todo_items')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (defaultTodos?.length) {
        const { error: todoError } = await supabase.from('todos').insert(
          defaultTodos.map(todo => ({
            text: todo.text,
            day_id: newDayId,
            user_id: userId,
            list_type: 'todo'
          }))
        );
        if (todoError) console.error('Error adding default todos:', todoError);
      }
      
      // Add default packing items
      const { data: defaultPackingItems } = await supabase
        .from('default_packing_items')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (defaultPackingItems?.length) {
        const { error: packingError } = await supabase.from('packing_list_items').insert(
          defaultPackingItems.map(item => ({
            text: item.text,
            person: item.person,
            day_name: newTravelName,
            user_id: userId
          }))
        );
        if (packingError) console.error('Error adding default packing items:', packingError);
      }

      // Update days list and set current day
      const { data: updatedDays } = await supabase
        .from('days')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (updatedDays) {
        setDays(updatedDays);
        setCurrentDay(data);
        // Fetch all items for the new day
        await fetchAllItems();
      }
    }
  };

  const handleEditDayName = async () => {
    if (!currentDay || !editDayName.trim()) return;

    const { error } = await supabase
      .from('days')
      .update({ travel: editDayName })
      .eq('id', currentDay.id);

    if (!error) {
      setIsEditingDayName(false);
      fetchDays();
    }
  };

  const startEditingDayName = (travel: string) => {
    setEditDayName(travel);
    setIsEditingDayName(true);
  };

  const handleDeleteDay = async () => {
    if (!currentDay) return;
    
    if (!window.confirm(`Are you sure you want to delete "${currentDay.travel}"? This action cannot be undone.`)) {
      return;
    }

    const { error } = await supabase
      .from('days')
      .delete()
      .eq('id', currentDay.id);

    if (!error) {
      setCurrentDay(null);
      fetchDays();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <select
                  value={currentDay?.id || ''}
                  onChange={(e) => {
                    const day = days.find(d => d.id === e.target.value);
                    setCurrentDay(day || null);
                    setIsEditingDayName(false);
                  }}
                  className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  {days.map((day) => (
                    <option key={day.id} value={day.id}>
                      {day.travel}
                    </option>
                  ))}
                </select>
                {currentDay && !isEditingDayName && (
                  <button
                    onClick={() => startEditingDayName(currentDay.travel)}
                    className="p-2 text-gray-400 hover:text-indigo-600"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                )}
                {isEditingDayName && (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editDayName}
                      onChange={(e) => setEditDayName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleEditDayName()}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      autoFocus
                    />
                    <button
                      onClick={handleEditDayName}
                      className="p-2 text-green-600 hover:text-green-700"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsEditingDayName(false)}
                      className="p-2 text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={handleAddDay}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PlusCircle className="w-4 h-4 mr-1" />
                Add Travel
              </button>
            </div>
            <div className="flex items-center gap-2">
              {currentDay && (
                <button
                  onClick={handleDeleteDay}
                  className="p-2 text-gray-400 hover:text-red-600"
                  title="Delete Travel"
                >
                  <Trash2 className="w-6 h-6" />
                </button>
              )}
              <button className="p-2 text-gray-400 hover:text-indigo-600">
                <Settings className="w-6 h-6" />
              </button>
            </div>
          </div>

          {currentDay && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <TodoList
                  dayId={currentDay.id}
                  todos={todos}
                  onUpdate={fetchAllItems}
                />
                <PackingList
                  dayName={currentDay.travel}
                  items={packingItems}
                  onUpdate={fetchAllItems}
                />
                <ShoppingList
                  dayName={currentDay.travel}
                  items={shopItems}
                  onUpdate={fetchAllItems}
                />
              </div>
              <PlanningTable
                dayName={currentDay.travel}
                todos={todos}
                packingItems={packingItems}
                planningItems={planningItems}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
