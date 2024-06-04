"use client";
import Header from "@/components/Header";
import Layout from "@/components/Layout";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UpdateCategoryModal from "@/components/UpdateCategoryModal";

interface Category {
  _id: string;
  name: string;
  description: string;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [showModal, setShowModal] = useState<boolean>(false);
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

  const handleRowClick = (category: Category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedCategory(null);
    setShowModal(false);
  };

  const handleUpdateCategory = (updatedCategory: Category) => {
    setCategories((prevCategories) =>
      prevCategories.map((cat) =>
        cat._id === updatedCategory._id ? updatedCategory : cat
      )
    );
    handleCloseModal();
  };

  return (
    <Layout>
      <div className="overflow-x-auto">
        <div className="flex justify-between items-center pt-3 pb-8">
          <h3 className="text-2xl fw-bold pb-2">Categories</h3>
          <button
            className="bg-green-500 text-white px-3 py-2 rounded-lg"
            onClick={() => router.push("/Categories/AddCategory")}
          >
            Add Category
          </button>
        </div>
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="border-b fs-600 fw-bold">
            <tr>
              <th className="w-16 p-4 text-left">#</th>
              <th className="w-auto p-4 text-left">Category Name</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={2} className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={2} className="text-center py-4">
                  Error: {error}
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={2} className="text-center py-4">
                  No categories found
                </td>
              </tr>
            ) : (
              categories.map((category, index) => (
                <tr
                  key={category._id}
                  className="border-b hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleRowClick(category)}
                >
                  <td className="p-4">{index + 1}</td>
                  <td>
                    <div className="p-4">{category.name}</div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {showModal && selectedCategory && (
          <UpdateCategoryModal
            category={selectedCategory}
            onClose={handleCloseModal}
            onUpdate={handleUpdateCategory}
          />
        )}
      </div>
    </Layout>
  );
};

export default Categories;
