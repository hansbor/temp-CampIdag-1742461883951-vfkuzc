import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function ImageUploader() {
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    const fetchImages = async () => {
      try {
        const { data, error } = await supabase.storage
          .from('image')
          .list('images/', { // Specify the folder path
            limit: 100,
            offset: 0,
            sortBy: { column: 'created_at', order: 'asc' },
          });

        if (error) {
          console.error("Error listing images:", error);
          setError(error.message || 'Failed to fetch images');
          return;
        }

        if (data) {
          const urls = await Promise.all(data.map(async (item) => {
            try {
              const { data: { publicUrl }, error: publicUrlError } = supabase.storage
                .from('image')
                .getPublicUrl(`images/${item.name}`);

              if (publicUrlError) {
                console.error(`Error getting public URL for ${item.name}:`, publicUrlError);
                return null;
              }
              return publicUrl;
            } catch (err: any) {
              console.error(`Error getting public URL for ${item.name}:`, err);
              return null;
            }
          }));

          // Filter out any null URLs (failed to fetch)
          setImageUrls(urls.filter(url => url !== null) as string[]);
        }
      } catch (err: any) {
        console.error("Error in fetchImages:", err);
        setError(err.message || 'Failed to fetch images');
      }
    };

    fetchUser();
    fetchImages();
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!image) {
      setError('Please select an image to upload.');
      return;
    }

    if (!user) {
      setError('You must be logged in to upload an image.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const fileExt = image.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('image')
        .upload(filePath, image, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('image')
        .getPublicUrl(filePath);

      setImageUrl(publicUrl);
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/png, image/jpeg"
        onChange={handleImageChange}
        className="mb-4"
      />
      {imageUrl && (
        <img src={imageUrl} alt="Uploaded" className="max-w-md mb-4" />
      )}
      <button
        onClick={handleUpload}
        disabled={uploading || !image}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}

      <div>
        <h3>Uploaded Images:</h3>
        <div className="flex flex-wrap">
          {imageUrls.map((url, index) => (
            <img key={index} src={url} alt={`Uploaded ${index}`} className="max-w-xs m-2" />
          ))}
        </div>
      </div>
    </div>
  );
}
