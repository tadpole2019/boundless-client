import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FaHeart } from 'react-icons/fa'
import category from '@/data/instrument/instrument_category.json'

export default function InstrumentCard({
  puid,
  name,
  price,
  discount,
  category_name,
  img_small,
  sales,
}) {
  //   const categoryName = category.find((v, i) => {
  //     return categoryID === v.id
  //   })
  //   // console.log(categoryName.name)
  //   // console.log('categoryName:', categoryName)
  //   // console.log(
  //   //   'categoryName.name:',
  //   //   categoryName ? categoryName.name : 'Category not found'
  //   // )
  //   console.log(categoryName.name)
  const [isDiscount, setIsDiscount] = useState(!!discount)
  const [toLocalePrice, setToLocalePrice] = useState('')
  
  useEffect(() => {
    if(price){
      const priceString = price.toLocaleString()
    setToLocalePrice(priceString)
    }
  }, [price])
  return (
    <>
      <Link href={`/instrument/${category_name}/${puid}`}>
        <div className="product-card">
          <FaHeart
            size={24}
            style={{
              position: 'absolute',
              zIndex: '30',
              color: '#b9b9b9',
              right: '14px',
              top: '8px',
            }}
          />
          <div style={{ padding: '10px', width: '100%', height: '100%' }}>
            <div className="product-image-wrapper">
              <img
                src={`/instrument/${category_name}/small/${img_small}`}
                alt={name}
                className="product-image"
              />
            </div>
          </div>

          <div className="product-details">
            <h3 className="product-title">{name}</h3>
            <p className="product-price">NT${toLocalePrice}</p>
            <p className="product-sold">已售出 {sales}</p>
          </div>
        </div>
        <style jsx>{`
          .product-card {
            max-width: 240px;
            width: 240px;
            height: 350px; /* 保證卡片高度和內容一致 */
            border-radius: 5px;
            border: 1px solid #b9b9b9;
            background-color: #fff;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            position: relative;
            @media screen and (max-width: 576px) {
              width: 190px;
            }
          }
          .product-image-wrapper {
            display: flex;
            justify-content: center;
            overflow: hidden;
            position: relative;
            height: 160px;
            width: 100%;
             {
              /* width: 100%; */
            }
          }
          .product-image {
            width: 100%;
            height: 100%; /* 保證圖片填充整個容器 */
            object-fit: contain;
            object-position: center;
          }
          .icon-image {
            position: absolute;
            width: 20px;
            bottom: 12px;
            right: 12px;
          }
          .product-details {
            display: flex;
            flex-direction: column;
            gap: 6px;
            color: #1d1d1d;
            font-weight: 400;
            padding: 14px 12px;
          }
          .product-title {
            font-size: 16px;
            font-family: Noto Sans TC, sans-serif;
            margin: 0;
          }
          .product-price {
            font-size: 18px;
            font-family: Noto Sans TC, sans-serif;
            font-weight: 700;
            height: 60px;
          }
          .product-sold {
            color: #5a5a5a;
            text-align: right;
            font-size: 14px;
            font-family: Noto Sans TC, sans-serif;
             {
              /* margin-top: 46px; */
            }
          }
          .products-container {
            flex: 0 0 50%;
          }
        `}</style>
      </Link>
    </>
  )
}

// Usage of ProductCard component with hypothetical data
// function ProductsContainer() {
//   const products = [
//     {
//       productName: 'Fender Telecaster model 1970',
//       productPrice: 'NT$ 22,680',
//       productSold: 10,
//       productImage: 'path/to/telecaster.jpg',
//       iconImage: 'path/to/icon.jpg',
//     },
//     // Add more products as needed
//   ]

//   return (
//     <section className="products-container">
//       {products.map((product, index) => (
//         <InstrumentCard
//           key={index}
//           productName={product.productName}
//           productPrice={product.productPrice}
//           productSold={product.productSold}
//           productImage={product.productImage}
//           iconImage={product.iconImage}
//         />
//       ))}
//     </section>
//   )
// }
