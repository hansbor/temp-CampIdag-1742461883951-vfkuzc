import React from 'react';
    import { PlusCircleIcon, HelpCircle, Mail, Sun, Moon } from 'lucide-react';
    import { v4 as uuidv4 } from 'uuid';

    interface AdminMenuProps {
      onAddActivityDay: () => void;
      activityDays: Record<string, { shop: { id: string; text: string; completed: boolean }[] }>;
      selectedDay: string;
      theme: 'light' | 'dark';
      toggleTheme: () => void;
    }

    const AdminMenu: React.FC<AdminMenuProps> = ({ onAddActivityDay, activityDays, selectedDay, theme, toggleTheme }) => {
      const handleHelpClick = () => {
        alert(
          "Help Information:\n\n" +
          "- Use the buttons to navigate between days.\n" +
          "- Click the '+' button to add a new day.\n" +
          "- Click the list names to edit them.\n" +
          "- Click the day names to edit them.\n" +
          "- Add items to each list using the input fields.\n" +
          "- Click the checkboxes to mark items as complete/incomplete.\n" +
          "- Click the 'x' button to delete items.\n" +
          "- Click the edit button to edit items.\n" +
          "- The planning table shows all items from all lists for the selected day."
        );
      };

        const handleSendEmail = () => {
        const shoppingList = activityDays[selectedDay]?.shop;
        if (!shoppingList || shoppingList.length === 0) {
          alert('The shopping list is empty.');
          return;
        }

        const subject = `Shopping List for ${selectedDay}`;
        let body = 'Shopping List:\n\n';
        shoppingList.forEach((item) => {
          body += `${item.completed ? '[x]' : '[ ]'} ${item.text}\n`;
        });

        const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;
      };

      return (
        <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-md shadow-md flex items-center justify-between w-full max-w-7xl mb-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 dark:hover:bg-blue-800 flex items-center"
            onClick={handleHelpClick}
          >
            <HelpCircle className="mr-2" />
            Help
          </button>
           <button
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800 flex items-center"
            onClick={handleSendEmail}
          >
            <Mail className='mr-2' />
            Send Shopping List
          </button>

          {/* Theme Toggle */}
          <button
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-md hover:bg-gray-400 dark:hover:bg-gray-600 flex items-center"
            onClick={toggleTheme}
          >
            {theme === 'light' ? <Moon className="mr-2" /> : <Sun className="mr-2" />}
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>

          <button
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800 flex items-center"
            onClick={onAddActivityDay}
          >
            <PlusCircleIcon className="mr-2" />
            Add Travel
          </button>
        </div>
      );
    };

    export default AdminMenu;
