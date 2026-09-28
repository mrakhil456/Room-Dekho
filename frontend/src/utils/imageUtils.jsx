/**
 * Resolve image URL for both local and remote images
 * Handles different path formats and uses VITE_API_BASE_URL if available
 */
export const getImageUrl = (imagePath, size = 'small') => {
  if (!imagePath) {
    const sizeMap = {
      small: '300x200',
      large: '600x400'
    };
    return `https://via.placeholder.com/${sizeMap[size] || '300x200'}?text=No+Image`;
  }

  // Get API base URL from environment or use localhost fallback
  let apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
  apiBaseUrl = apiBaseUrl.replace(/\/api\/?$/, '');

  // If already a full URL, return as-is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Normalize leading /api/uploads to /uploads
  if (imagePath.startsWith('/api/uploads')) {
    imagePath = imagePath.replace('/api/uploads', '/uploads');
  }

  // If relative path to uploads folder, prepend API base URL
  if (imagePath.startsWith('/uploads')) {
    return `${apiBaseUrl}${imagePath}`;
  }

  // If just a filename, assume it's in uploads folder
  return `${apiBaseUrl}/uploads/${imagePath}`;
};

/**
 * Get placeholder image for failed loads
 */
export const getPlaceholderUrl = (text = 'No Image', size = 'small') => {
  const sizeMap = {
    small: '300x200',
    large: '600x400'
  };
  return `https://via.placeholder.com/${sizeMap[size] || '300x200'}?text=${text.replace(/\s+/g, '+')}`;
};
