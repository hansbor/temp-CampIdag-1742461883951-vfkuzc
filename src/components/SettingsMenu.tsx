import React, { useState } from 'react';

interface SettingsMenuProps {
  initialTodos: { id: string; text: string; completed: boolean }[];
  initialPacking: { id: string; text: string; completed: boolean; person?: string }[];
  onSave: (
    newTodos: { id: string; text: string; completed: boolean }[],
    newPacking: { id: string; text: string; completed: boolean; person?: string }[]
  ) => void;
  onCancel: () => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ initialTodos, initialPacking, onSave, onCancel }) => {
  const [todos, setTodos] = useState(initialTodos);
  const [packing, setPacking] = useState(initialPacking);

  const handleTodoChange = (index: number, text: string) => {
    const newTodos = [...todos];
    newTodos[index] = { ...newTodos[index], text };
    setTodos(newTodos);
  };

  const handlePackingChange = (index: number, text: string, person?: string) => {
    const newPacking = [...packing];
    newPacking[index] = { ...newPacking[index], text, person };
    setPacking(newPacking);
  };

  const handleAddTodo = () => {
    setTodos([...todos, { id: '', text: '', completed: false }]);
  };

  const handleAddPacking = () => {
    setPacking([...packing, { id: '', text: '', completed: false, person: '' }]);
  };

  const handleRemoveTodo = (index: number) => {
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
  };

  const handleRemovePacking = (index: number) => {
    const newPacking = [...packing];
    newPacking.splice(index, 1);
    setPacking(newPacking);
  };

  const handleSave = () => {
    onSave(todos, packing);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4">Edit Default Values</h2>

        <h3 className="text-xl font-semibold mt-4 mb-2">Default Todos</h3>
        {todos.map((todo, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              value={todo.text}
              onChange={(e) => handleTodoChange(index, e.target.value)}
              className="border rounded-md px-2 py-1 mr-2 w-full"
            />
            <button onClick={() => handleRemoveTodo(index)} className="text-red-500 hover:text-red-700">
              Remove
            </button>
          </div>
        ))}
        <button onClick={handleAddTodo} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Add Todo
        </button>

        <h3 className="text-xl font-semibold mt-4 mb-2">Default Packing List</h3>
        {packing.map((item, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              value={item.text}
              onChange={(e) => handlePackingChange(index, e.target.value, item.person)}
              className="border rounded-md px-2 py-1 mr-2 w-1/2"
              placeholder="Item"
            />
            <input
              type="text"
              value={item.person || ''}
              onChange={(e) => handlePackingChange(index, item.text, e.target.value)}
              className="border rounded-md px-2 py-1 mr-2 w-1/2"
              placeholder="Person"
            />
            <button onClick={() => handleRemovePacking(index)} className="text-red-500 hover:text-red-700">
              Remove
            </button>
          </div>
        ))}
        <button onClick={handleAddPacking} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Add Packing Item
        </button>

        <div className="mt-6 flex justify-end">
          <button onClick={onCancel} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2">
            Cancel
          </button>
          <button onClick={handleSave} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsMenu;
