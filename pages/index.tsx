import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar/Navbar'

const HomePage = () => {
  const [productList, setproductList] = useState<TProduct[]>([]);

  useEffect(() => {
    window.fetch('/api/avo')
    .then(res => res.json())
    .then(({data}) => {
      setproductList(data);
    })
  }, []);

  return (
    <div>
      <Navbar />
      <div>Platzi and Next.js!</div>
      {productList.map((product) => (
        <div>
          <h2>{product.name}</h2>
        </div>
      ))}
    </div>
  )
}

export default HomePage
