import { Link } from "react-router-dom"
import useCartStore from "../../../store/cartStore"

export default function CartDrawer({ isOpen, onClose }) {
  const { items, totalPrice, updateQuantity, removeItem, isLoading } = useCartStore();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">Your Cart ({items.length})</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 flex-1">
          {isLoading ? (
            <p>Loading cart...</p>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">Your cart is empty</p>
              <Link
                to="/products"
                onClick={onClose}
                className="mt-6 inline-block text-indigo-600 hover:underline"
              >
                Continue shopping →
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-4 bg-gray-50 p-4 rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-indigo-600 font-semibold">${item.price}</p>

                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-8 h-8 rounded border flex items-center justify-center hover:bg-gray-200"
                      >
                        -
                      </button>
                      <span className="w-12 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="w-8 h-8 rounded border flex items-center justify-center hover:bg-gray-200"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="ml-auto text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t p-6">
            <div className="flex justify-between text-xl font-bold mb-6">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <Link
              to="/checkout"
              onClick={onClose}
              className="block w-full text-center bg-indigo-600 text-white py-4 rounded-lg font-semibold hover:bg-indigo-700"
            >
              Proceed to Checkout
            </Link>
            <p className="text-center text-sm text-gray-500 mt-4">
              Shipping & taxes calculated at checkout
            </p>
          </div>
        )}
      </div>
    </>
  );
}