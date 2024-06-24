"use client";
import Header from "@/components/Header";
import Layout from "@/components/Layout";
import React, { useState } from "react";

interface CategoryFormData {
  name: string;
  description: string;
}

const AddCategory: React.FC = () => {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    description: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [message, setMessage] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name) newErrors.name = "Category name is required.";
    if (!formData.description)
      newErrors.description = "Category description is required."; // Optional validation

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const res = await fetch("./api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const result = await res.json();
        setMessage(`Category created: ${result}`);
        setFormData({ name: "", description: "" }); // Reset both fields
      } else {
        const errorResponse = await res.json();
        if (typeof errorResponse === "string") {
          setMessage(`Failed to create category: ${errorResponse}`);
        } else {
          setMessage(
            `Failed to create category: ${JSON.stringify(errorResponse)}`
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
        <div className="p-5">
          <div className="flex gap-2 py-5 px-6 text-2xl fw-bold">
            <span>Back | </span>
            <h3 className="">Add Category</h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="bg-secondary p-4">
              <div className="flex flex-col gap-2 mb-4">
                <label htmlFor="name" className="block fw-bold tracking-tight">
                  Category Name
                </label>
                <input
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
              <div className="flex flex-col gap-2 mb-4">
                <label
                  htmlFor="description"
                  className="block fw-bold tracking-tight"
                >
                  Category Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
                {errors.description && (
                  <p className="text-red-500">{errors.description}</p>
                )}
              </div>
            </div>
            {message && (
              <div className="text-center text-red-500">{message}</div>
            )}
            <button
              type="submit"
              className="mt-5 ml-2 w-32 bg-green-500 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Add Category
            </button>
          </form>
        </div>
      </Layout>
    </>
  );
};

export default AddCategory;
