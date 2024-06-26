"use client";
import Header from "@/components/Header";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";

interface Variant {
  size: string;
  color: string;
  quantity: number;
  sku: string;
}

interface ProductFormData {
  name: string;
  description: string;
  category: string;
  cost_price: string;
  selling_price: string;
  images: string[]; // URLs of images
  variants: Variant[];
}

interface Category {
  _id: string;
  name: string;
  description: string;
}

const AddProduct: React.FC = () => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    category: "",
    cost_price: "",
    selling_price: "",
    images: [],
    variants: [],
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [message, setMessage] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
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
          if (result.data.length > 0) {
            setFormData((prevFormData) => ({
              ...prevFormData,
              category: result.data[0]._id,
            }));
          }
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

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name) newErrors.name = "Product name is required.";
    if (!formData.description)
      newErrors.description = "Description is required.";
    if (!formData.category) newErrors.category = "Category is required.";
    if (!formData.cost_price || isNaN(parseFloat(formData.cost_price))) {
      newErrors.cost_price = "Valid cost price is required.";
    }
    if (!formData.selling_price || isNaN(parseFloat(formData.selling_price))) {
      newErrors.selling_price = "Valid selling price is required.";
    }

    formData.variants.forEach((variant, index) => {
      if (!variant.size)
        newErrors[`variants[${index}].size`] = "Size is required.";
      if (!variant.color)
        newErrors[`variants[${index}].color`] = "Color is required.";
      if (variant.quantity === undefined || variant.quantity < 0) {
        newErrors[`variants[${index}].quantity`] =
          "Valid quantity is required.";
      }
      if (!variant.sku)
        newErrors[`variants[${index}].sku`] = "SKU is required.";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "category") {
      const selectedCategory = categories.find(
        (category) => category._id === value
      );
      if (selectedCategory) {
        setFormData({ ...formData, category: selectedCategory._id });
      }
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
    updatedVariants[index] = { ...updatedVariants[index], [name]: value };
    setFormData({ ...formData, variants: updatedVariants });
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [
        ...formData.variants,
        { size: "", color: "", quantity: 0, sku: "" },
      ],
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          cost_price: parseFloat(formData.cost_price),
          selling_price: parseFloat(formData.selling_price),
          variants: formData.variants.map((v) => ({
            ...v,
            quantity: parseInt(v.quantity.toString(), 10),
          })),
        }),
      });
      if (res.ok) {
        const result = await res.json();
        setMessage(`Product created: ${result}`);
        setFormData({
          name: "",
          description: "",
          category: "",
          cost_price: "",
          selling_price: "",
          images: [],
          variants: [],
        });
      } else {
        const errorResponse = await res.json();
        if (typeof errorResponse === "string") {
          setMessage(`Failed to create product: ${errorResponse}`);
        } else {
          setMessage(
            `Failed to create product: ${JSON.stringify(errorResponse)}`
          );
        }
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <>
      <Layout>
        <div className="flex gap-2 mb-4 text-2xl fw-bold items-center">
          <span>
            <FaArrowLeft onClick={() => router.push("/Products")} />
          </span>
          <h3 className="">Add Products</h3>
        </div>
        <form onSubmit={handleSubmit} className="border p-4">
          <div className="lg:grid grid-cols-2 gap-4 mb-4">
            <div className="bg-background">
              <div className="flex flex-col gap-2 mb-4">
                <label htmlFor="name" className="block fw-bold tracking-tight">
                  Product Name
                </label>

                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
                {errors.name && <p className="text-red-500">{errors.name}</p>}
              </div>
              <div className="flex flex-col gap-2 bg-background">
                <label
                  htmlFor="description"
                  className="block fw-bold tracking-tight"
                >
                  Product Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                ></Textarea>
                {errors.description && (
                  <p className="text-red-500">{errors.description}</p>
                )}
              </div>
            </div>
            <div className="">
              <div className="bg-background flex flex-col gap-2 mb-4">
                <label htmlFor="images" className="block fw-bold">
                  Image URLs
                </label>
                <Input
                  type="text"
                  id="images"
                  name="images"
                  value={formData.images.join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      images: e.target.value.split(", "),
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Enter image URLs separated by commas"
                />
                {errors.images && (
                  <p className="text-red-500">{errors.images}</p>
                )}
              </div>
              <div className="bg-background">
                <div className="bg-background flex flex-col gap-2 mb-0">
                  <label htmlFor="categories" className="block fw-bold">
                    Categories
                  </label>
                  {categories && categories.length > 0 ? (
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    >
                      {/* Render options from fetched categories */}
                      {categories.map((category) => {
                        return (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        );
                      })}
                    </select>
                  ) : (
                    <p>No categories available</p>
                  )}

                  {errors.category && (
                    <p className="text-red-500">{errors.category}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-background">
              <div className="flex flex-col gap-2 mb-4">
                <label htmlFor="name" className="block fw-bold tracking-tight">
                  Cost Price
                </label>

                <Input
                  id="cost_price"
                  type="number"
                  name="cost_price"
                  value={formData.cost_price}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
                {errors.cost_price && (
                  <p className="text-red-500">{errors.cost_price}</p>
                )}
              </div>
              <div className="flex flex-col gap-2 bg-background">
                <label
                  htmlFor="selling_price"
                  className="block fw-bold tracking-tight"
                >
                  Selling Price
                </label>
                <Input
                  id="selling_price"
                  type="number"
                  name="selling_price"
                  value={formData.selling_price}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                ></Input>
                {errors.selling_price && (
                  <p className="text-red-500">{errors.selling_price}</p>
                )}
              </div>
            </div>
            {/* Variant Section */}
            <div className="bg-background ">
              <div className="flex flex-col gap-2 mb-4">
                <label htmlFor="name" className="block fw-bold tracking-tight">
                  Variant
                </label>
                <div className="mb-4">
                  {formData.variants.map((variant, index) => (
                    <div key={index} className="mb-4 border rounded-lg p-4">
                      <div className="mb-4">
                        <label
                          htmlFor={`size-${index}`}
                          className="block text-gray-700"
                        >
                          Size
                        </label>
                        <Input
                          type="text"
                          id={`size-${index}`}
                          name="size"
                          value={variant.size}
                          onChange={(e) => handleVariantChange(index, e)}
                          className="w-full px-3 py-2 border rounded-lg"
                          required
                        />
                        {errors[`variants[${index}].size`] && (
                          <p className="text-red-500">
                            {errors[`variants[${index}].size`]}
                          </p>
                        )}
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor={`color-${index}`}
                          className="block text-gray-700"
                        >
                          Color
                        </label>
                        <Input
                          type="text"
                          id={`color-${index}`}
                          name="color"
                          value={variant.color}
                          onChange={(e) => handleVariantChange(index, e)}
                          className="w-full px-3 py-2 border rounded-lg"
                          required
                        />
                        {errors[`variants[${index}].color`] && (
                          <p className="text-red-500">
                            {errors[`variants[${index}].color`]}
                          </p>
                        )}
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor={`quantity-${index}`}
                          className="block text-gray-700"
                        >
                          Quantity
                        </label>
                        <Input
                          type="number"
                          id={`quantity-${index}`}
                          name="quantity"
                          value={variant.quantity}
                          onChange={(e) => handleVariantChange(index, e)}
                          className="w-full px-3 py-2 border rounded-lg"
                          required
                        />
                        {errors[`variants[${index}].quantity`] && (
                          <p className="text-red-500">
                            {errors[`variants[${index}].quantity`]}
                          </p>
                        )}
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor={`sku-${index}`}
                          className="block text-gray-700"
                        >
                          SKU
                        </label>
                        <input
                          type="text"
                          id={`sku-${index}`}
                          name="sku"
                          value={variant.sku}
                          onChange={(e) => handleVariantChange(index, e)}
                          className="w-full px-3 py-2 border rounded-lg"
                          required
                        />
                        {errors[`variants[${index}].sku`] && (
                          <p className="text-red-500">
                            {errors[`variants[${index}].sku`]}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}

                  <Button
                    onClick={addVariant}
                    className="w-full bg-blue-500 text-white py-2 rounded-lg"
                  >
                    Add Variant
                  </Button>
                </div>
              </div>
            </div>
          </div>
          {message && <div className="text-center text-red-500">{message}</div>}
          <Button type="submit">Add Product</Button>
        </form>
      </Layout>
    </>
  );
};

export default AddProduct;
