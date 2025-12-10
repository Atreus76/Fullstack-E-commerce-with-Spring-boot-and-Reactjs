import React from "react";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { IconButton, Button } from "@mui/material";

const CartItem = () => {
  return (
    <div className="p-5 shadow-lg border rounded-md">
      <div className="flex items-center">
        <div className="w-[5rem] h-[5rem] lg:w-[9rem] lg:h-[9rem]">
          <img
            src="https://img.freepik.com/free-vector/
                shopping-supermarket-cart-with-grocery-pictogram_1284-11697.jpg?semt=ais_hybrid&w=740&q=80"
            alt="product image"
            className="w-full h-full object-cover object-top"
          />
          
        </div>
        <div className="ml-5 space-y-1">
          <p className="font-semibold">New Jeans</p>
          <p className="opacity-70">Size: XL, Pink</p>
          <p className="opacity-70 mt-2">Seller: Black Market</p>
          <div className="flex space-x-5 items-center text-lg lg:text-xl text-gray-900 pt-6">
            <p className="font-semibold">$199</p>
            <p className="opacity-50 line-through">$211</p>
            <p className="text-green-600 font-semibold">5% off</p>
          </div>
        </div>
      
      </div>
        <div className="lg:flex items-center lg:space-x-10 pt-4">
            <div className="flex items-center space-x-2">
                <IconButton>
                    <RemoveCircleOutlineIcon />
                </IconButton>
                <span className="py-5 px-7 border rounded-sm">1</span>
                <IconButton sx={{color:"RGB(145 85 253)"}}>
                    <AddCircleOutlineIcon />
                </IconButton>
                
            </div>
            <div>
                <Button sx={{color:"RGB(145 85 253)"}}>Remove</Button>
            </div>
        </div>
    </div>
  );
};

export default CartItem;
