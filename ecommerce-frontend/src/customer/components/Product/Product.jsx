// src/pages/Products.jsx
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../../../api/client';
import useCartStore from '../../../store/cartStore';

export default function Products() {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category'); // e.g. ?category=3

  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['products', categoryId],
    queryFn: async () => {
      const params = categoryId ? { params: { category: categoryId } } : {};
      const res = await api.get('/products', params);
      return res.data; // array of products
    },
  });

  const addToCart = useCartStore((state) => state.addToCart);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">All Products</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-xl" />
              <div className="mt-4 h-6 bg-gray-200 rounded" />
              <div className="mt-2 h-5 bg-gray-200 rounded w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">Failed to load products.</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
        {categoryId ? 'Category Products' : 'All Products'}
      </h1>
      <p className="text-lg text-gray-600 mb-12">
        {products.length} {products.length === 1 ? 'product' : 'products'} available
      </p>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500">No products found in this category.</p>
          <Link to="/" className="mt-6 inline-block text-indigo-600 hover:text-indigo-500">
            ← Back to home
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              <Link to={`/product/${product.slug || product.id}`}>
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={product.images?.[0] || '/placeholder.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="mt-2 text-2xl font-bold text-indigo-600">
                    ${product.price}
                  </p>
                </div>
              </Link>

              {/* Add to Cart Button */}
              <button
                onClick={() => addToCart(product.id)}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 w-11/12 bg-indigo-600 text-white py-3 rounded-lg font-medium opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-indigo-700"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}