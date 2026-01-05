import { Link } from "react-router-dom";
import CartDrawer from "./CartDrawer";

export default function Cart() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">Shopping Cart</h1>
      {/* Reuse drawer content but full width */}
      <div className="max-w-3xl mx-auto">
        <CartDrawer isOpen={true} onClose={() => {}} /> {/* Always open */}
      </div>
    </div>
  );
}