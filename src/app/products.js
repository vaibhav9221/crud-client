import { useEffect, useState } from "react";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    _id: "",
    name: "",
    price: "",
    description: "",
    category: "",
  });

  const fetchProducts = () => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = form._id ? "PUT" : "POST";
    const url = form._id ? `/api/products/${form._id}` : "/api/products";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    }).then(() => {
      fetchProducts();
      setForm({ _id: "", name: "", price: "", description: "", category: "" });
    });
  };

  const handleEdit = (product) => {
    setForm({
      _id: product._id,
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
    });
  };

  const handleDelete = (id) => {
    fetch(`/api/products/${id}`, {
      method: "DELETE",
    }).then(() => {
      fetchProducts();
    });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Products</h1>
      <ul>
        {products.map((product) => (
          <li key={product._id}>
            {product.name} - ${product.price}
            <button onClick={() => handleEdit(product)}>Edit</button>
            <button onClick={() => handleDelete(product._id)}>Delete</button>
          </li>
        ))}
      </ul>

      <h2>{form._id ? "Edit Product" : "Add Product"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          type="text"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
        <button type="submit">{form._id ? "Update Product" : "Add Product"}</button>
      </form>
    </div>
  );
};

export default Products;
