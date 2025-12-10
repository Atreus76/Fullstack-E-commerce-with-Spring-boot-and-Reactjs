import React from "react";

const HomeSectionCard = ({ product }) => {
  return (
    <div
      className="cursor-pointer flex flex-col items-center 
    bg-white rounded-lg shadow-md overflow-hidden w-[15rem] mx-3"
    >
      <div className="h-[13rem] w-[10rem]">
        <img className="object-cover object-top h-full w-full"
        src={product.imageUrl}
        alt="" />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{product.brand}</h3>
        <p className="text-gray-600 text-sm">
          {product.title}
        </p>
      </div>
    </div>
  );
};

export default HomeSectionCard;
