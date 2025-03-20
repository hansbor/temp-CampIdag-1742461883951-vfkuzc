import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ImageUploader } from '../components/ImageUploader';

export function Settings() {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();
  }, []);

  const handleUpdateSettings = () => {
    alert('Settings updated!');
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      {user && (
        <div className="mb-4">
          <p>Email: {user.email}</p>
        </div>
      )}
      <ImageUploader />
      <button
        onClick={handleUpdateSettings}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Update Settings
      </button>
    </div>
  );
}
