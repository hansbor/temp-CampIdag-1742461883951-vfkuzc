import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { supabase } from '../lib/supabase';
import { Check, X } from 'lucide-react';

interface PlanningItem {
  id: string;
  text: string;
  completed: boolean;
  day_name: string;
  user_id: string;
}

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  list_type: string;
  day_id: string;
}

interface PackingItem {
  id: string;
  text: string;
  completed: boolean;
  person: string;
  day_name: string;
}

interface ShopItem {
  id: string;
  text: string;
  completed: boolean;
}

interface PlanningTableProps {
  dayName: string;
  todos: TodoItem[];
  packingItems: PackingItem[];
  planningItems: PlanningItem[];
  shopItems: ShopItem[];
}

export function PlanningTable({ dayName, todos, packingItems, planningItems, shopItems }: PlanningTableProps) {
  const [rowData, setRowData] = useState<any[]>([]);

  const handleStatusToggle = async (item: any) => {
    if (item.list === 'Todo') {
      const { error } = await supabase
        .from('todos')
        .update({ completed: !item.completed })
        .eq('id', item.id);
      
      if (!error) {
        const updatedData = rowData.map(row => 
          row.id === item.id ? { ...row, status: !item.completed ? 'Complete' : 'Incomplete' } : row
        );
        setRowData(updatedData);
      }
    } else if (item.list === 'Packing') {
      const { error } = await supabase
        .from('packing_list_items')
        .update({ completed: !item.completed })
        .eq('id', item.id);
      
      if (!error) {
        const updatedData = rowData.map(row => 
          row.id === item.id ? { ...row, status: !item.completed ? 'Complete' : 'Incomplete' } : row
        );
        setRowData(updatedData);
      }
    } else if (item.list === 'Shop') {
      // Assuming you have a 'shop_items' table in Supabase
      const { error } = await supabase
        .from('shop_items')
        .update({ completed: !item.completed })
        .eq('id', item.id);

      if (!error) {
        const updatedData = rowData.map(row =>
          row.id === item.id ? { ...row, status: !item.completed ? 'Complete' : 'Incomplete' } : row
        );
        setRowData(updatedData);
      }
    }
  };

  useEffect(() => {
    // Combine and format data for the grid
    const formattedData = [
      ...(todos || []).map(item => ({
        id: item.id,
        list: 'Todo',
        task: item.text,
        person: '-',
        status: item.completed ? 'Complete' : 'Incomplete',
        completed: item.completed
      })),
      ...(packingItems || []).map(item => ({
        id: item.id,
        list: 'Packing',
        task: item.text,
        person: item.person || '-',
        status: item.completed ? 'Complete' : 'Incomplete',
        completed: item.completed
      })),
      ...(shopItems || []).map(item => ({
        id: item.id,
        list: 'Shop',
        task: item.text,
        person: '-',
        status: item.completed ? 'Complete' : 'Incomplete',
        completed: item.completed
      }))
    ];
    setRowData(formattedData);
  }, [todos, packingItems, shopItems]);

  const columnDefs = [
    { 
      field: 'list',
      headerName: 'List',
      width: 120,
      filter: true
    },
    {
      field: 'task',
      headerName: 'Task',
      flex: 1,
      filter: true
    },
    {
      field: 'person',
      headerName: 'Person',
      width: 150,
      filter: true
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      filter: true,
      cellRenderer: (params: any) => (
        <button
          onClick={() => handleStatusToggle(params.data)}
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
            params.value === 'Complete' 
              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
              : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
          }`}
        >
          {params.value === 'Complete' ? (
            <Check className="w-3 h-3" />
          ) : (
            <X className="w-3 h-3" />
          )}
          {params.value}
        </button>
      )
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Planning Table</h2>
      </div>
      <div className="ag-theme-alpine" style={{ height: '500px', width: '100%' }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{
            sortable: true,
            resizable: true
          }}
          animateRows={true}
          rowHeight={48}
          headerHeight={48}
          pagination={true}
          paginationPageSize={10}
        />
      </div>
    </div>
  );
}
