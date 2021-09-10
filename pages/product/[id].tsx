import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

const ProductPage = () => {
  const [avo, setavo] = useState<TProduct>();
  const { query: {id} } = useRouter()

  useEffect(() => {
    (id) && window.fetch(`/product/${id}`)
      .then(res => res.json())
      .then(data => setavo(data))
      .catch(error => console.error(error))
  }, [id])

  return (
    <section>
      <h1>Página producto</h1>
      <h2>Nombre: {avo?.name}</h2>
      <h3>ID: {avo?.id}</h3>
      <p>Características: {avo?.attributes.description}</p>
    </section>
  )
}

export default ProductPage
