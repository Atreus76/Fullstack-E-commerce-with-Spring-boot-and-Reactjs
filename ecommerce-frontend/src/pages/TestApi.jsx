import { useQuery } from '@tanstack/react-query';
import api from '../api/client';

export default function TestApi() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then((res) => res.data),
  });

  if (isLoading) return <div className="p-10 text-2xl">Loading categories...</div>;
  if (error) return <div className="p-10 text-red-600">Error: {error.message}</div>;

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-8">Categories (Public API Test)</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {data.map((cat) => (
          <div key={cat.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <img src={cat.image} alt={cat.name} className="w-full h-64 object-cover" />
            <div className="p-4 text-center">
              <h3 className="text-xl font-semibold">{cat.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}