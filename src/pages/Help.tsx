import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';

export function Help() {
  const [dependencies, setDependencies] = useState({});
  const [lastModified, setLastModified] = useState({});

  useEffect(() => {
    fetch('/dependencies.json')
      .then(response => response.json())
      .then(data => {
        setDependencies(data.dependencies);
      })
      .catch(error => {
        console.error('Error fetching dependencies:', error);
      });

    fetch('/last-modified.json')
      .then(response => response.json())
      .then(data => {
        setLastModified(data);
      })
      .catch(error => {
        console.error('Error fetching last modified dates:', error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 py-5 sm:p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Help &amp; About</h1>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Help</h2>
                <p className="text-gray-700">
                  Welcome to the Help &amp; About page! Here you can find information about GDPR compliance,
                  the frameworks and components used in this application, and other helpful details.
                </p>
                <p className="text-gray-700 mt-2">
                  If you have any questions or need further assistance, please contact us.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">GDPR Compliance</h2>
                <p className="text-gray-700">
                  This application is designed with GDPR compliance in mind. We do not store any personal data
                  beyond what is necessary for authentication and basic user preferences. You have the right to
                  access, modify, or delete your data at any time. For more information, please contact us.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Frameworks and Components</h2>
                <ul className="list-disc list-inside text-gray-700">
                  {Object.entries(dependencies).map(([name, version]) => (
                    <li key={name}>
                      {name}: {version}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Last Modified</h2>
                <ul className="list-disc list-inside text-gray-700">
                  {Object.entries(lastModified).map(([file, date]) => (
                    <li key={file}>
                      {file}: {new Date(date as string).toLocaleString()}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
