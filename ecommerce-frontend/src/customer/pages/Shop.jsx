import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import api from '../../api/client';
import ProductCard from '../components/Product/ProductCard';

const sortOptions = [
  { label: 'Newest', sortBy: 'createdAt', direction: 'desc' },
  { label: 'Price: Low to High', sortBy: 'price', direction: 'asc' },
  { label: 'Price: High to Low', sortBy: 'price', direction: 'desc' },
  { label: 'Name A-Z', sortBy: 'name', direction: 'asc' },
];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => ({
    keyword: searchParams.get('search') || '',
    categoryId: searchParams.get('categoryId') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    page: Number(searchParams.get('page') || 0),
    sortIndex: Number(searchParams.get('sort') || 0),
  }), [searchParams]);

  const selectedSort = sortOptions[filters.sortIndex] || sortOptions[0];

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then((res) => res.data),
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['shop-products', filters, selectedSort],
    queryFn: () => api.get('/products/search', {
      params: {
        keyword: filters.keyword || undefined,
        categoryId: filters.categoryId || undefined,
        minPrice: filters.minPrice || undefined,
        maxPrice: filters.maxPrice || undefined,
        page: filters.page,
        size: 12,
        sortBy: selectedSort.sortBy,
        direction: selectedSort.direction,
      },
    }).then((res) => res.data),
  });

  const updateFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== 'page') next.set('page', '0');
    setSearchParams(next);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shop</h1>
          <p className="mt-2 text-gray-600">
            {data ? `${data.totalElements} products found` : 'Search and filter products'}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <input
            value={filters.keyword}
            onChange={(e) => updateFilter('search', e.target.value)}
            placeholder="Search products"
            className="rounded-lg border border-gray-300 px-3 py-2"
          />
          <select
            value={filters.categoryId}
            onChange={(e) => updateFilter('categoryId', e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          <input
            type="number"
            min="0"
            value={filters.minPrice}
            onChange={(e) => updateFilter('minPrice', e.target.value)}
            placeholder="Min price"
            className="rounded-lg border border-gray-300 px-3 py-2"
          />
          <input
            type="number"
            min="0"
            value={filters.maxPrice}
            onChange={(e) => updateFilter('maxPrice', e.target.value)}
            placeholder="Max price"
            className="rounded-lg border border-gray-300 px-3 py-2"
          />
          <select
            value={filters.sortIndex}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2"
          >
            {sortOptions.map((option, index) => (
              <option key={option.label} value={index}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-gray-600">Loading products...</div>
      ) : error ? (
        <div className="py-20 text-center text-red-600">Failed to load products.</div>
      ) : !data?.content?.length ? (
        <div className="py-20 text-center text-gray-600">No products matched your filters.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {data.content.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              disabled={data.first}
              onClick={() => updateFilter('page', String(filters.page - 1))}
              className="rounded-lg border px-4 py-2 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {data.number + 1} of {data.totalPages || 1}
            </span>
            <button
              disabled={data.last}
              onClick={() => updateFilter('page', String(filters.page + 1))}
              className="rounded-lg border px-4 py-2 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Shop;
