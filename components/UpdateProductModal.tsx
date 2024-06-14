"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";

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
}

interface Category {
  _id: string;
  name: string;
  description: string;
}

interface UpdateProductModalProps {
  product: Product;
  onClose: () => void;
  onUpdate: (updatedProduct: Product) => void;
}

const UpdateProductModal: React.FC<UpdateProductModalProps> = ({
  product,
  onClose,
  onUpdate,
}) => {
  const [formData, setFormData] = useState<Product>({ ...product });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) {
          throw new Error(`Failed to fetch categories: ${res.statusText}`);
        }
        const result = await res.json();
        if (result && result.success) {
          setCategories(result.data);
        } else {
          throw new Error("Failed to fetch categories");
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "category") {
      const selectedCategory = categories.find((cat) => cat._id === value);
      if (selectedCategory) {
        setFormData({ ...formData, category: selectedCategory });
      }
    } else if (name === "cost_price" || name === "selling_price") {
      // Convert value to number for numerical inputs
      const numericValue = parseFloat(value);
      setFormData({ ...formData, [name]: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleVariantChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const updatedVariants = [...formData.variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [name]: name === "quantity" ? parseInt(value, 10) : value,
    };
    setFormData({ ...formData, variants: updatedVariants });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Update availableQuantity before sending the updated product
    const totalQuantity = formData.variants.reduce(
      (acc, variant) => acc + variant.quantity,
      0
    );
    const updatedProduct = { ...formData, availableQuantity: totalQuantity };

    // Call the parent onUpdate function with the updated product
    onUpdate(updatedProduct);

    // Optionally close the modal if needed
    onClose();
  };

  const totalQuantity = formData.variants.reduce(
    (acc, variant) => acc + variant.quantity,
    0
  );

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto z-50"
      onClick={onClose}
    >
      <div
        className="bg-background p-8 rounded-lg shadow-md w-full max-w-xl md:w-1/3 lg:w-1/3 relative h-[700px] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-gray-500"
          onClick={onClose}
        >
          ✕
        </button>
        <h3 className="text-2xl font-bold mb-4">Update Product</h3>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="mb-4 col-span-2">
              <label htmlFor="name" className="block text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg bg-background"
                required
              />
            </div>
            {/* Description */}
            <div className="mb-4 col-span-2">
              <label htmlFor="description" className="block text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg bg-background"
                required
              />
            </div>
            {/* Category */}
            <div className="mb-4 col-span-2">
              <label htmlFor="category" className="block text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category._id}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg bg-background"
                required
              >
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Cost Price */}
            <div className="mb-4 col-span-1">
              <label htmlFor="cost_price" className="block text-gray-700 mb-2">
                Cost Price
              </label>
              <input
                type="number"
                id="cost_price"
                name="cost_price"
                value={formData.cost_price}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg bg-background"
                required
              />
            </div>
            {/* Selling Price */}
            <div className="mb-4 col-span-1">
              <label
                htmlFor="selling_price"
                className="block text-gray-700 mb-2"
              >
                Selling Price
              </label>
              <input
                type="number"
                id="selling_price"
                name="selling_price"
                value={formData.selling_price}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg bg-background"
                required
              />
            </div>
            {/* Images */}
            <div className="mb-4 col-span-2">
              <label htmlFor="images" className="block text-gray-700 mb-2">
                Images
              </label>
              <input
                type="text"
                id="images"
                name="images"
                value={formData.images.join(", ")}
                onChange={(e) => {
                  const value = e.target.value
                    .split(",")
                    .map((img) => img.trim());
                  setFormData({ ...formData, images: value });
                }}
                className="w-full px-3 py-2 border rounded-lg bg-background"
                required
              />
            </div>
            {formData.images.length > 0 && (
              <img
                src={formData.images[0]}
                alt={formData.name}
                className="w-full mb-4 col-span-2"
              />
            )}
            {/* Total Quantity */}
            <div className="mb-4 col-span-2">
              <label className="block text-gray-700 mb-2">Total Quantity</label>
              <input
                type="number"
                value={totalQuantity}
                readOnly
                className="w-full px-3 py-2 border rounded-lg bg-background"
              />
            </div>
          </div>
          {/* Variant fields */}
          {formData.variants.map((variant, index) => (
            <div key={index} className="mb-4 border p-4 rounded-lg ">
              <h5 className="text-lg font-semibold mb-2">
                Variant {index + 1}
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Size */}
                <div className="mb-2">
                  <label
                    htmlFor={`variant-size-${index}`}
                    className="block text-gray-700"
                  >
                    Size
                  </label>
                  <input
                    type="text"
                    id={`variant-size-${index}`}
                    name="size"
                    value={variant.size}
                    onChange={(e) => handleVariantChange(index, e)}
                    className="w-full px-3 py-2 border rounded-lg bg-background"
                    required
                  />
                </div>
                {/* Color */}
                <div className="mb-2">
                  <label
                    htmlFor={`variant-color-${index}`}
                    className="block text-gray-700"
                  >
                    Color
                  </label>
                  <input
                    type="text"
                    id={`variant-color-${index}`}
                    name="color"
                    value={variant.color}
                    onChange={(e) => handleVariantChange(index, e)}
                    className="w-full px-3 py-2 border rounded-lg bg-background"
                    required
                  />
                </div>
                {/* Quantity */}
                <div className="mb-2">
                  <label
                    htmlFor={`variant-quantity-${index}`}
                    className="block text-gray-700"
                  >
                    Quantity
                  </label>
                  <input
                    type="number"
                    id={`variant-quantity-${index}`}
                    name="quantity"
                    value={variant.quantity}
                    onChange={(e) => handleVariantChange(index, e)}
                    className="w-full px-3 py-2 border rounded-lg bg-background"
                    required
                  />
                </div>
                {/* SKU */}
                <div className="mb-2">
                  <label
                    htmlFor={`variant-sku-${index}`}
                    className="block text-gray-700"
                  >
                    SKU
                  </label>
                  <input
                    type="text"
                    id={`variant-sku-${index}`}
                    name="sku"
                    value={variant.sku}
                    onChange={(e) => handleVariantChange(index, e)}
                    className="w-full px-3 py-2 border rounded-lg bg-background"
                    required
                  />
                </div>
              </div>
            </div>
          ))}
          {/* Update button */}
          <div className="flex justify-end gap-2">
            <Button onClick={onClose} variant={"secondary"}>
              Cancel
            </Button>

            <Button type="submit" variant={"ghost"}>
              Update
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProductModal;
