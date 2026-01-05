// src/pages/ProductDetails.jsx
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../../api/client';
import useCartStore from '../../../store/cartStore';
import toast from 'react-hot-toast';

export default function ProductDetails() {
  const { slug } = useParams(); // from route /product/:productId or :slug
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const addToCart = useCartStore((state) => state.addToCart);

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const res = await api.get(`/products/${slug}`);
      return res.data; // { id, name, slug, price, images[], description, stock, ... }
    },
  });

  const handleAddToCart = () => {
    if (!product || product.stock < quantity) {
      toast.error('Not enough stock');
      return;
    }
    addToCart(product.id, quantity);
    console.log(product.id, quantity);
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square bg-gray-200 rounded-xl animate-pulse" />
          <div className="space-y-6">
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 bg-gray-200 rounded w-32 animate-pulse" />
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center">
        <p className="text-xl text-red-600">Product not found</p>
        <Link to="/products" className="mt-6 inline-block text-indigo-600 hover:underline">
          ← Back to products
        </Link>
      </div>
    );
  }

  const images = product.images || [];
  const inStock = product.stock > 0;
  const stockText = inStock
    ? product.stock > 10
      ? 'In stock'
      : `Only ${product.stock} left`
    : 'Out of stock';

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="flex text-sm mb-8">
        <Link to="/" className="text-gray-500 hover:text-gray-700">
          Home
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <Link to="/products" className="text-gray-500 hover:text-gray-700">
          Products
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square overflow-hidden rounded-xl bg-gray-100">
            <img
              src={images[selectedImage] || '/placeholder.jpg'}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                    selectedImage === index
                      ? 'border-indigo-600 opacity-100'
                      : 'border-gray-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
            <p className="mt-4 text-3xl font-bold text-indigo-600">${product.price}</p>
          </div>

          {/* Stock Status */}
          <p className={`text-lg font-medium ${inStock ? 'text-green-600' : 'text-red-600'}`}>
            {stockText}
          </p>

          {/* Description */}
          {product.description && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="flex items-center gap-6">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="px-4 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-50"
              >
                -
              </button>
              <span className="px-6 py-3 font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                disabled={!inStock || quantity >= product.stock}
                className="px-4 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-50"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className="flex-1 bg-indigo-600 text-white py-4 px-8 rounded-lg font-semibold text-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}