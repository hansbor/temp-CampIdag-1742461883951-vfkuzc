// No changes needed in TodoItem.tsx
    import React, { useState } from 'react';
    import { CheckCircle, Circle, Trash, Edit } from 'lucide-react';

    interface TodoItemProps {
      todo: { id: string; text: string; completed: boolean; person?: string };
      onToggleComplete: (id: string) => void;
      onDelete: (id: string) => void;
      onEdit: (id: string, newText: string, newPerson?: string) => void;
    }

    const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggleComplete, onDelete, onEdit }) => {
      const [isEditing, setIsEditing] = useState(false);
      const [editedText, setEditedText] = useState(todo.text);
      const [editedPerson, setEditedPerson] = useState(todo.person || '');

      const handleEdit = () => {
        onEdit(todo.id, editedText, editedPerson);
        setIsEditing(false);
      };

      return (
        <li className={`flex items-center justify-between py-2 border-b border-gray-200 ${todo.completed ? 'bg-green-100' : ''}`}>
          <div className="flex items-center">
            <button onClick={() => onToggleComplete(todo.id)} className="mr-2">
              {todo.completed ? <CheckCircle className="text-green-500" /> : <Circle className="text-gray-400" />}
            </button>
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="border rounded-md px-2 py-1 mr-2"
                />
                {todo.person !== undefined && ( // Only show person input if it's applicable
                  <input
                    type="text"
                    value={editedPerson}
                    onChange={(e) => setEditedPerson(e.target.value)}
                    className="border rounded-md px-2 py-1 mr-2"
                    placeholder="Person"
                  />
                )}
                <button onClick={handleEdit} className="text-blue-500 hover:text-blue-700">
                  Save
                </button>
              </>
            ) : (
              <span className={`text-gray-800 ${todo.completed ? 'line-through' : ''}`}>
                {todo.text} {todo.person && `(${todo.person})`}
              </span>
            )}
          </div>
          <div>
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="text-gray-500 hover:text-gray-700 mr-2">
                <Edit size={20} />
              </button>
            )}
            <button onClick={() => onDelete(todo.id)} className="text-red-500 hover:text-red-700">
              <Trash size={20} />
            </button>
          </div>
        </li>
      );
    };

    export default TodoItem;
