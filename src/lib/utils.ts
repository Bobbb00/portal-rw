export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatShortDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatTime(time: string): string {
  return time.replace(':', '.');
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'upcoming':
      return 'Akan Datang';
    case 'ongoing':
      return 'Sedang Berlangsung';
    case 'completed':
      return 'Selesai';
    default:
      return status;
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'upcoming':
      return 'bg-blue-100 text-blue-700';
    case 'ongoing':
      return 'bg-green-100 text-green-700';
    case 'completed':
      return 'bg-gray-100 text-gray-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'Umum': 'bg-blue-100 text-blue-700',
    'Keamanan': 'bg-red-100 text-red-700',
    'Kebersihan': 'bg-green-100 text-green-700',
    'Kesehatan': 'bg-pink-100 text-pink-700',
    'Pelayanan': 'bg-purple-100 text-purple-700',
    'Kegiatan': 'bg-amber-100 text-amber-700',
    'Darurat': 'bg-orange-100 text-orange-700',
  };
  return colors[category] || 'bg-gray-100 text-gray-600';
}

export function generatePlaceholderImage(
  width: number,
  height: number,
  text: string,
  bgColor: string = '#16a34a',
  textColor: string = '#ffffff'
): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="${width}" height="${height}" fill="${bgColor}"/>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="${textColor}" font-family="sans-serif" font-size="${Math.min(width, height) * 0.08}">${text}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
