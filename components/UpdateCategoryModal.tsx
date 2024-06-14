"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "./ui/button";

interface Category {
  _id: string;
  name: string;
  description: string;
}

interface UpdateCategoryModalProps {
  category: Category;
  onClose: () => void;
  onUpdate: (updatedCategory: Category) => void;
}

const UpdateCategoryModal: React.FC<UpdateCategoryModalProps> = ({
  category,
  onClose,
  onUpdate,
}) => {
  const [formData, setFormData] = useState<Category>({ ...category });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <Card className="max-w-xl w-full relative">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Update Category</CardTitle>
            <Button
              size={"sm"}
              variant={"ghost"}
              className="text-gray-500"
              onClick={onClose}
            >
              ✕
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Update
          </button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UpdateCategoryModal;
