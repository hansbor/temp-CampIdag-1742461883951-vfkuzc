import React from 'react';

interface AdBannerProps {
  position: 'top' | 'grid' | 'table';
}

export function AdBanner({ position }: AdBannerProps) {
  // Mock travel-related advertisements
  const ads = [
    {
      title: 'Travel Insurance',
      description: 'Protect your journey with comprehensive coverage',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=300&q=80',
      link: '#'
    },
    {
      title: 'Luggage Deals',
      description: 'Premium travel gear at unbeatable prices',
      image: 'https://images.unsplash.com/photo-1581553680321-4fffae59fccd?auto=format&fit=crop&w=300&q=80',
      link: '#'
    },
    {
      title: 'Travel Apps',
      description: 'Essential apps for your next adventure',
      image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=300&q=80',
      link: '#'
    }
  ];

  const randomAd = ads[Math.floor(Math.random() * ads.length)];

  if (position === 'top') {
    return (
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-indigo-900">{randomAd.title}</h3>
            <p className="text-sm text-indigo-700">{randomAd.description}</p>
          </div>
          <a href={randomAd.link} className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
            Learn More
          </a>
        </div>
      </div>
    );
  }

  if (position === 'grid') {
    return (
      <div className="col-span-1 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
        <img src={randomAd.image} alt={randomAd.title} className="w-full h-40 object-cover" />
        <div className="p-4">
          <h3 className="text-lg font-medium text-indigo-900">{randomAd.title}</h3>
          <p className="mt-1 text-sm text-indigo-700">{randomAd.description}</p>
          <a
            href={randomAd.link}
            className="mt-3 inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Learn More
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-lg my-4">
      <div className="flex items-center">
        <img src={randomAd.image} alt={randomAd.title} className="w-20 h-20 object-cover rounded-md" />
        <div className="ml-4 flex-1">
          <h3 className="text-lg font-semibold text-indigo-900">{randomAd.title}</h3>
          <p className="text-sm text-indigo-700">{randomAd.description}</p>
        </div>
        <a href={randomAd.link} className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
          Learn More
        </a>
      </div>
    </div>
  );
}
