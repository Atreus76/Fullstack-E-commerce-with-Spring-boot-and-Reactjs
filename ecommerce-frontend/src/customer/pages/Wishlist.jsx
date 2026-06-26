import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import ProductCard from '../components/Product/ProductCard';
import useWishlistStore from '../../store/wishlistStore';

const Wishlist = () => {
  const fetchWishlistIds = useWishlistStore((state) => state.fetchWishlistIds);

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const res = await api.get('/wishlist');
      await fetchWishlistIds();
      return res.data;
    },
  });

  if (isLoading) {
    return <div className="py-20 text-center text-gray-600">Loading wishlist...</div>;
  }

  if (error) {
    return <div className="py-20 text-center text-red-600">Please sign in to view your wishlist.</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Wishlist</h1>
          <p className="mt-2 text-gray-600">{products.length} saved products</p>
        </div>
        <Link to="/shop" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
          Continue shopping
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="rounded-xl bg-white py-20 text-center shadow-sm">
          <p className="text-lg text-gray-600">Your wishlist is empty.</p>
          <Link to="/shop" className="mt-4 inline-block rounded-lg bg-indigo-600 px-5 py-3 text-white">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
