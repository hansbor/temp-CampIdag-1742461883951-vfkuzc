import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useEffect, useState, useCallback } from 'react';
import { Navbar } from '../components/Navbar';
import { Search, Filter, Table, Grid, Database } from 'lucide-react';
import { AdBanner } from '../components/AdBanner';
import { supabase } from '../lib/supabase';
import { ColDef } from 'ag-grid-community';

type TableName = 'todos' | 'days' | 'packing_list_items' | 'planning_items' | 'shop_list_items' | 'default_packing_items';

export function Explorer() {
  const [viewMode, setViewMode] = React.useState<'list' | 'grid'>('list');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<TableName>('todos');

  const tables: { name: TableName; label: string }[] = [
    { name: 'days', label: 'Travels' },
    { name: 'todos', label: 'Todo Items' },
    { name: 'packing_list_items', label: 'Packing List' },
    { name: 'planning_items', label: 'Planning Items' },
    { name: 'shop_list_items', label: 'Shopping List' },
    { name: 'default_packing_items', label: 'Default Packing Items' } // Added default_packing_items
  ];

  const onGridReady = useCallback(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from(selectedTable)
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setData(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : `Failed to fetch ${selectedTable}`);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [selectedTable]);

  const travelColumnDefs: ColDef[] = [
    { 
      field: 'travel',
      headerName: 'Travel Name',
      flex: 2,
      minWidth: 200
    },
    {
      field: 'created_at',
      headerName: 'Created At',
      flex: 1,
      minWidth: 150,
      sort: 'desc',
      valueFormatter: (params: any) => {
        return new Date(params.value).toLocaleString();
      }
    }
  ];

  const todoColumnDefs: ColDef[] = [
    { 
      field: 'title',
      headerName: 'Title',
      flex: 2,
      minWidth: 200
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 3,
      minWidth: 300
    },
    {
      field: 'category',
      headerName: 'Category',
      flex: 1,
      minWidth: 150,
      cellRenderer: (params: any) => {
        if (!params.value) return '';
        return `<span class="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">${params.value}</span>`;
      }
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      minWidth: 150,
      cellRenderer: (params: any) => {
        if (!params.value) return '';
        const colors: { [key: string]: string } = {
          Active: 'text-green-600 bg-green-50',
          'In Review': 'text-yellow-600 bg-yellow-50',
          Planning: 'text-blue-600 bg-blue-50'
        };
        const colorClass = colors[params.value] || 'text-gray-600 bg-gray-50';
        return `<span class="text-xs font-medium px-2 py-1 rounded-full ${colorClass}">${params.value}</span>`;
      }
    },
    {
      field: 'progress',
      headerName: 'Progress',
      flex: 1,
      minWidth: 150,
      cellRenderer: (params: any) => {
        const value = params.value || 0;
        return `<div class="w-full bg-gray-200 rounded-full h-2.5"><div class="bg-indigo-600 h-2.5 rounded-full" style="width: ${value}%"></div></div>`;
      }
    }
  ];

  const defaultColumnDefs: ColDef[] = [
    { field: 'id', headerName: 'ID', hide: true },
    { field: 'created_at', headerName: 'Created At', sort: 'desc' },
    { field: 'user_id', headerName: 'User ID', hide: true },
    { field: 'travel', headerName: 'Travel', flex: 1 }
  ];

  const tableColumnDefs: { [key in TableName]: ColDef[] } = {
    days: travelColumnDefs,
    todos: todoColumnDefs,
    packing_list_items: [
      { field: 'text', headerName: 'Item', flex: 2 },
      { field: 'completed', headerName: 'Completed', flex: 1 },
      { field: 'person', headerName: 'Person', flex: 1 },
      { field: 'day_name', headerName: 'Day', flex: 1 },
      ...defaultColumnDefs
    ],
    planning_items: [
      { field: 'text', headerName: 'Item', flex: 2 },
      { field: 'completed', headerName: 'Completed', flex: 1 },
      { field: 'day_name', headerName: 'Day', flex: 1 },
      ...defaultColumnDefs
    ],
    shop_list_items: [
      { field: 'text', headerName: 'Item', flex: 2 },
      { field: 'completed', headerName: 'Completed', flex: 1 },
      { field: 'day_name', headerName: 'Day', flex: 1 },
      ...defaultColumnDefs
    ],
    default_packing_items: [ // Added column definitions for default_packing_items
      { field: 'text', headerName: 'Item', flex: 2 },
      { field: 'person', headerName: 'Person', flex: 1 },
      ...defaultColumnDefs
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Explorer</h1>
                <div className="flex items-center space-x-4">
                  <select
                    value={selectedTable}
                    onChange={(e) => setSelectedTable(e.target.value as TableName)}
                    className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    {tables.map((table) => (
                      <option key={table.name} value={table.name}>
                        {table.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400'}`}
                  >
                    <Table className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400'}`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <AdBanner position="top" />

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </button>
              </div>

              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.map((item, index) => {
                  // Insert ad banner every 6 items
                  const elements = [];
                  elements.push(
                  <div
                    key={index}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden p-4 hover:shadow-md transition-shadow"
                  >
                    <h3 className="text-lg font-medium text-gray-900">
                      {item.title || item.travel || item.text || 'Untitled'}
                    </h3>
                    {item.description && (
                      <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                    )}
                    {item.completed !== undefined && (
                      <p className="mt-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.completed ? 'Completed' : 'Pending'}
                        </span>
                      </p>
                    )}
                    {item.person && (
                      <p className="mt-2 text-sm text-gray-500">
                        Assigned to: {item.person}
                      </p>
                    )}
                    {item.day_name && (
                      <p className="mt-2 text-sm text-gray-500">
                        Travel: {item.day_name}
                      </p>
                    )}
                  </div>
                  );
                  
                  if ((index + 1) % 6 === 0) {
                    elements.push(
                      <AdBanner key={`ad-${index}`} position="grid" />
                    );
                  }
                  
                  return elements;
                }).flat()}
                </div>
              ) : (
                <div className="ag-theme-alpine w-full" style={{ height: '500px' }}>
                  <AgGridReact
                    onGridReady={onGridReady}
                    rowData={data}
                    columnDefs={tableColumnDefs[selectedTable]}
                    pagination={true}
                    paginationPageSize={10}
                    animateRows={true}
                    enableCellTextSelection={true}
                    defaultColDef={{
                      resizable: true,
                      sortable: true,
                      filter: true,
                      // enableMove: true   // this property is deprecated
                    }}
                    rowHeight={48}
                    headerHeight={48}
                    suppressMovableColumns={false} // set this property to false to enable column moving
                    onFirstDataRendered={(params) => {
                      // Insert ad rows every 5 rows
                      const rowData = params.api.getModel().rowsToDisplay;
                      if (rowData.length > 0) {
                        for (let i = 4; i < rowData.length; i += 6) {
                          params.api.applyTransactionAsync({
                            add: [{ isAd: true }],
                            addIndex: i
                          });
                        }
                      }
                    }}
                    isFullWidthCell={(rowNode) => rowNode.data?.isAd}
                    fullWidthCellRenderer={(props) => {
                      return (
                        <div className="w-full h-full p-2">
                          <AdBanner position="table" />
                        </div>
                      );
                    }}
                  />
                </div>
              )}
              {loading && (
              <div className="flex justify-center items-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
