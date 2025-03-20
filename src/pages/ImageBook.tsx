import React from 'react';
import { Navbar } from '../components/Navbar';
import { ImageUploader } from '../components/ImageUploader';

export function ImageBook() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Image Book</h1>
            <ImageUploader />
          </div>
        </div>
      </main>
    </div>
  );
}
