import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link } from 'react-router-dom';
import useCartStore from '../../../store/cartStore';
import useWishlistStore from '../../../store/wishlistStore';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const wishlistIds = useWishlistStore((state) => state.ids);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isWishlisted = wishlistIds.includes(product.id);

  return (
    <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          toggleWishlist(product.id);
        }}
        className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2 shadow hover:bg-white"
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        {isWishlisted ? (
          <FavoriteIcon fontSize="small" className="text-red-500" />
        ) : (
          <FavoriteBorderIcon fontSize="small" className="text-gray-700" />
        )}
      </button>

      <Link to={`/product/${product.slug}`}>
        <div className="aspect-square bg-gray-100 overflow-hidden">
          <img
            src={product.images?.[0] || '/placeholder.jpg'}
            alt={product.name}
            className="h-full w-full object-cover object-center transition duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-500">{product.categoryName}</p>
          <h3 className="mt-1 min-h-12 text-base font-semibold text-gray-900 line-clamp-2">
            {product.name}
          </h3>
          <p className="mt-3 text-xl font-bold text-indigo-600">${product.price}</p>
        </div>
      </Link>

      <button
        type="button"
        onClick={() => addToCart(product.id)}
        className="mx-4 mb-4 flex w-[calc(100%-2rem)] items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
      >
        <ShoppingCartIcon fontSize="small" />
        Add to cart
      </button>
    </div>
  );
};

export default ProductCard;
