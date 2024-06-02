"use client";
import { useEffect, useState } from "react";
import UpdateProductModal from "./UpdateProductModal";
import ImageModal from "./ImageModal"; // Import the ImageModal component
import { useRouter } from "next/navigation";

interface Variant {
  size: string;
  color: string;
  quantity: number;
  sku: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  category: Category;
  cost_price: number;
  selling_price: number;
  availableQuantity: number;
  images: string[];
  variants: Variant[];
  createdAt?: string; // Optional createdAt field
}

interface Category {
  _id: string;
  name: string;
  description: string;
}

const ProductComponent: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false); // State for image modal
  const [currentImage, setCurrentImage] = useState<string | null>(null); // State for the current image
  const router = useRouter();

  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        const resCategories = await fetch("/api/categories");
        const resProducts = await fetch("/api/products");

        if (!resProducts.ok || !resCategories.ok) {
          throw new Error("Failed to fetch data");
        }
        const categoriesResult = await resCategories.json();
        const productsResult = await resProducts.json();

        if (productsResult.success && categoriesResult.success) {
          setProducts(productsResult.data);
          setCategories(categoriesResult.data);
        } else {
          throw new Error("Failed to fetch products or categories");
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndCategories();
  }, []);

  async function deleteProduct(productId: string) {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const res = await fetch(`/api/products?id=${productId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(`Failed to delete product: ${res.statusText}`);
      }

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to delete product");
      }

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== productId)
      );
    } catch (error: any) {
      console.error("Error deleting product:", error.message);
      setError(error.message);
    }
  }

  // Update Function
  const openUpdateModal = (product: Product) => {
    setCurrentProduct(product);
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setCurrentProduct(null);
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
    try {
      const res = await fetch(`/api/products?id=${updatedProduct._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct),
      });

      if (!res.ok) {
        throw new Error(`Failed to update product: ${res.statusText}`);
      }

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to update product");
      }

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === updatedProduct._id ? updatedProduct : product
        )
      );
      closeUpdateModal();
    } catch (error: any) {
      console.error("Error updating product:", error.message);
      setError(error.message);
    }
  };

  const openImageModal = (imageUrl: string) => {
    setCurrentImage(imageUrl);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setCurrentImage(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className="relative flex flex-col mb-6 w-full">
        <div className="flex flex-wrap items-center justify-between p-5">
          <h3 className="text-2xl fw-bold pb-2">Products</h3>
          <div>
            <button
              className="bg-green-500 text-white px-3 py-2 rounded-lg"
              onClick={() => router.push("/Products/AddProduct")}
            >
              Add Products
            </button>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          <table className="w-full bg-white border border-gray-300">
            <thead className="border-b fs-600 fw-bold">
              <tr>
                <th className=" px-4 py-4">#</th>
                <th className=" px-4 py-4 text-left">Product Name</th>
                <th className=" px-4 py-4">Cost Price</th>
                <th className=" px-4 py-4">Selling Price</th>
                <th className=" px-4 py-4">Category</th>
                <th className=" px-4 py-4">Size</th>
                <th className=" px-4 py-4">Color</th>
                <th className=" px-4 py-4">
                  Quantity
                  <div className="flex justify-between gap-2">
                    <span>Total</span>
                    <span>Available</span>
                  </div>
                </th>
                <th className=" px-4 py-4">Inventory Status</th>
                <th className=" px-4 py-4">Created At</th>
                <th className=" px-4 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => {
                const totalQuantity = product.variants.reduce(
                  (acc, variant) => acc + variant.quantity,
                  0
                );
                const sizes = product.variants
                  .map((variant) => variant.size)
                  .join(", ");
                const colors = product.variants
                  .map((variant) => variant.color)
                  .join(", ");
                const categoryName = product.category.name;
                return (
                  <tr
                    key={product._id}
                    className="text-center border-b hover:bg-gray-100 cursor-pointer"
                  >
                    <td className="px-5 py-3">{index + 1}</td>
                    <td className="px-5 py-3 text-left">
                      <div className="flex gap-5 items-center">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-10 h-10 object-cover object-center cursor-pointer"
                          onClick={() => openImageModal(product.images[0])} // Add onClick to open the image modal
                        />
                        {product.name}
                      </div>
                    </td>
                    <td
                      className="px-5 py-3"
                      onClick={() => openUpdateModal(product)}
                    >
                      रू{" "}
                      {typeof product.cost_price === "number"
                        ? product.cost_price.toFixed(2)
                        : "N/A"}
                    </td>
                    <td
                      className="px-5 py-3"
                      onClick={() => openUpdateModal(product)}
                    >
                      रू{" "}
                      {typeof product.selling_price === "number"
                        ? product.selling_price.toFixed(2)
                        : "N/A"}
                    </td>
                    <td
                      className="px-5 py-3"
                      onClick={() => openUpdateModal(product)}
                    >
                      {categoryName}
                    </td>
                    <td
                      className="px-5 py-3 uppercase"
                      onClick={() => openUpdateModal(product)}
                    >
                      {sizes}
                    </td>
                    <td
                      className="px-5 py-3"
                      onClick={() => openUpdateModal(product)}
                    >
                      {colors}
                    </td>
                    <td
                      className="px-5 py-3"
                      onClick={() => openUpdateModal(product)}
                    >
                      <div className="flex justify-between">
                        <span>{totalQuantity}</span>
                        <span>{product.availableQuantity}</span>
                      </div>
                    </td>
                    <td
                      className="px-5 py-3"
                      onClick={() => openUpdateModal(product)}
                    >
                      {totalQuantity > 0 ? "In Stock" : "Out of Stock"}
                    </td>
                    <td
                      className="px-5 py-3"
                      onClick={() => openUpdateModal(product)}
                    >
                      {product.createdAt
                        ? new Date(product.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => deleteProduct(product._id)}
                        className="bg-red-500 text-white px-5 py-3 rounded-lg mr-2"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => openUpdateModal(product)}
                        className="bg-green-400 text-white px-4 py-3 rounded-lg"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {isUpdateModalOpen && currentProduct && (
        <UpdateProductModal
          product={currentProduct}
          onClose={closeUpdateModal}
          onUpdate={handleUpdateProduct}
        />
      )}
      {isImageModalOpen && currentImage && (
        <ImageModal imageUrl={currentImage} onClose={closeImageModal} />
      )}
    </>
  );
};

export default ProductComponent;
