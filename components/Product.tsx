"use client";
import { useEffect, useState, useRef } from "react";
import { IoEllipsisHorizontalSharp } from "react-icons/io5";
import {
  MdOutlineRemoveRedEye,
  MdOutlineSystemUpdateAlt,
  MdOutlineDeleteOutline,
} from "react-icons/md";
import { CiEdit } from "react-icons/ci";
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
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
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

  // Update Function
  const openUpdateModal = (product: Product) => {
    setCurrentProduct(product);
    setIsUpdateModalOpen(true);
    setDropdownOpen(null); // Close the dropdown
  };

  const openImageModal = (imageUrl: string) => {
    setCurrentImage(imageUrl);
    setIsImageModalOpen(true);
    setDropdownOpen(null); // Close the dropdown
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setCurrentProduct(null);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setCurrentImage(null);
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
      setDropdownOpen(null); // Close the dropdown
    } catch (error: any) {
      console.error("Error updating product:", error.message);
      setError(error.message);
    }
  };

  const deleteProduct = async (productId: string) => {
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
      setDropdownOpen(null); // Close the dropdown
    } catch (error: any) {
      console.error("Error deleting product:", error.message);
      setError(error.message);
    }
  };

  const toggleDropdown = (productId: string) => {
    if (dropdownOpen === productId) {
      setDropdownOpen(null);
    } else {
      setDropdownOpen(productId);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className="">
        <div className="flex flex-wrap items-center justify-between pb-5">
          <h3 className="text-2xl fw-bold">Products</h3>
          <div>
            <button
              className="bg-green-500 text-white px-3 py-2 rounded-lg"
              onClick={() => router.push("/Products/AddProduct")}
            >
              Add Products
            </button>
          </div>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="min-w-[1000px] w-full bg-white border border-gray-300">
            <thead className="border-b fs-600 fw-bold">
              <tr className="whitespace-nowrap text-left">
                <th className="p-2">#</th>
                <th className="p-2">Name</th>
                <th className="p-2">Price</th>
                <th className="p-2">Quantity</th>
                <th className="p-2">Status</th>
                <th className="p-2">Created At</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => {
                const totalQuantity = product.variants.reduce(
                  (acc, variant) => acc + variant.quantity,
                  0
                );
                return (
                  <tr
                    key={product._id}
                    className="text-left border-b hover:bg-gray-100 cursor-pointer whitespace-nowrap"
                  >
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3 text-left">
                      <div className="flex gap-5 items-center">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-9 h-9 object-cover object-center cursor-pointer rounded-lg"
                          onClick={() => openImageModal(product.images[0])}
                        />
                        {product.name}
                      </div>
                    </td>
                    <td
                      className="p-3"
                      onClick={() => openUpdateModal(product)}
                    >
                      रू{" "}
                      {typeof product.selling_price === "number"
                        ? product.selling_price.toFixed(2)
                        : "N/A"}
                    </td>
                    <td
                      className="p-3"
                      onClick={() => openUpdateModal(product)}
                    >
                      {product.availableQuantity}
                    </td>
                    <td
                      className="p-3"
                      onClick={() => openUpdateModal(product)}
                    >
                      <span
                        className={`${
                          totalQuantity > 0
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        } rounded-lg p-1`}
                      >
                        {totalQuantity > 0 ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td
                      className="p-3"
                      onClick={() => openUpdateModal(product)}
                    >
                      {product.createdAt
                        ? new Date(product.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="p-3">
                      <div className="inline-block group">
                        <button
                          className="bg-gray-200 p-2 rounded-full"
                          onClick={() => toggleDropdown(product._id)}
                        >
                          <IoEllipsisHorizontalSharp size={24} />
                        </button>
                        {dropdownOpen === product._id && (
                          <div className="absolute right-0 mt-2 mr-[7vw] p-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                            <button
                              className="flex items-center w-full p-2 text-left hover:bg-gray-100 gap-3"
                              onClick={() => openImageModal(product.images[0])}
                            >
                              <MdOutlineRemoveRedEye
                                size={20}
                                className="mr-2"
                              />
                              View
                            </button>
                            <button
                              className="flex items-center w-full p-2 text-left hover:bg-gray-100 gap-3"
                              onClick={() => openUpdateModal(product)}
                            >
                              <CiEdit size={20} className="mr-2" />
                              Edit
                            </button>
                            <button
                              className="flex items-center w-full p-2 text-left hover:bg-gray-100 gap-3"
                              onClick={() => openUpdateModal(product)}
                            >
                              <MdOutlineSystemUpdateAlt
                                size={20}
                                className="mr-2"
                              />
                              Update
                            </button>
                            <div className="flex flex-col mt-5 w-full border-t border-gray-100 ">
                              <span className="text-gray-500 text-sm px-2 pt-2">
                                Danger Zone
                              </span>
                              <button
                                className="flex gap-2 w-full text-left text-lg mt-1 p-1 text-red-600 hover:bg-gray-100"
                                onClick={() => deleteProduct(product._id)}
                              >
                                <MdOutlineDeleteOutline size={24} />
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
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
