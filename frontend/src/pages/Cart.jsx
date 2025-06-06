
import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  // Sync cart items with local state
  useEffect(() => {
    if (cartItems && typeof cartItems === 'object') {
      const tempData = Object.entries(cartItems).flatMap(([productId, sizes]) =>
        Object.entries(sizes)
          .filter(([, quantity]) => quantity > 0)
          .map(([size, quantity]) => ({
            _id: productId,
            size,
            quantity,
          }))
      );
      setCartData(tempData);
    }
  }, [cartItems]);

  const isCartEmpty = cartData.length === 0;

  return (
    <div className='border-t pt-14'>
      <div className='mb-3 text-2xl'>
        <Title text1='YOUR' text2='CART' />
      </div>

      <div>
        {cartData.map((item, index) => {
          const productData = products.find((product) => product._id === item._id);

          if (!productData) return null; // Prevent rendering if product not found

          return (
            <div
              key={index}
              className='grid py-4 text-gray-700 border-t border-b grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'
            >
              <div className='flex items-start gap-6'>
                <img className='w-16 sm:w-20' src={productData.image[0]} alt={productData.name} />
                <div>
                  <p className='text-sm font-medium sm:text-lg'>{productData.name}</p>
                  <div className='flex items-center gap-5 mt-2'>
                    <p>
                      {currency}&nbsp;
                      {productData.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <p className='px-2 border sm:px-3 sm:py-1 bg-slate-50'>{item.size}</p>
                  </div>
                </div>
              </div>
              <input
                onChange={(e) =>
                  e.target.value === '' || e.target.value === '0'
                    ? null
                    : updateQuantity(item._id, item.size, Number(e.target.value))
                }
                className='px-1 py-1 border max-w-10 sm:max-w-20 sm:px-2'
                type='number'
                min={1}
                value={item.quantity}
              />
              <img
                onClick={() => updateQuantity(item._id, item.size, 0)}
                className='w-4 mr-4 cursor-pointer sm:w-5'
                src={assets.bin_icon}
                alt='Remove'
              />
            </div>
          );
        })}
      </div>

      <div className='flex justify-end my-20'>
        <div className='w-full sm:w-[450px]'>
          <CartTotal />
          <div className='w-full text-end'>
            <button
              onClick={() => navigate('/place-order')}
              className={`px-8 py-3 my-8 text-sm text-white bg-black active:bg-gray-700 ${
                isCartEmpty ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isCartEmpty}
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
""
