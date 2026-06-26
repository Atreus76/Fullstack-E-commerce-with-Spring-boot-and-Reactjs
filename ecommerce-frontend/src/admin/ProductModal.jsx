// src/pages/admin/ProductModal.jsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/client';

const MAX_PRODUCT_IMAGES = 5;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export default function ProductModal({ product, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price || '',
    stock: product?.stock || '',
    categoryId: product?.categoryId || product?.category?.id || '',
    description: product?.description || '',
    active: product?.active ?? true,
  });

  const [images, setImages] = useState([]); // new files
  const [existingImages] = useState(product?.images || []);

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then(res => res.data),
  });

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    const totalImages = existingImages.length + selectedFiles.length;

    if (totalImages > MAX_PRODUCT_IMAGES) {
      alert(`A product can have at most ${MAX_PRODUCT_IMAGES} images.`);
      e.target.value = '';
      setImages([]);
      return;
    }

    const oversizedFile = selectedFiles.find((file) => file.size > MAX_IMAGE_BYTES);
    if (oversizedFile) {
      alert('Each image must be 5MB or smaller.');
      e.target.value = '';
      setImages([]);
      return;
    }

    setImages(selectedFiles);
  };

  const appendProductFields = (data) => {
    data.append('name', formData.name);
    data.append('price', formData.price);
    data.append('stock', formData.stock);
    data.append('categoryId', formData.categoryId);
    data.append('description', formData.description);
    data.append('active', formData.active);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    appendProductFields(data);

    try {
      if (product) {
        images.forEach((file) => data.append('newImages', file));
        await api.put(`/admin/products/${product.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        images.forEach((file) => data.append('images', file));
        await api.post('/admin/products', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to save product');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-screen overflow-y-auto p-8">
        <h3 className="text-2xl font-bold mb-6">
          {product ? 'Edit Product' : 'Add New Product'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
              <input
                type="number"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Images {product ? '(Add new ones)' : ''}
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
            />
            <p className="mt-2 text-sm text-gray-500">
              Up to {MAX_PRODUCT_IMAGES} images, 5MB each.
            </p>
            {existingImages.length > 0 && (
              <div className="grid grid-cols-4 gap-4 mt-4">
                {existingImages.map((img, i) => (
                  <img key={i} src={img} alt="current" className="w-full h-32 object-cover rounded" />
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="active" className="text-sm font-medium text-gray-700">
              Active (visible in store)
            </label>
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
            >
              {product ? 'Update' : 'Create'} Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
