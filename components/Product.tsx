"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CaretSortIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";

import UpdateProductModal from "./UpdateProductModal";
import ImageModal from "./ImageModal";
import Image from "next/image";

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
  createdAt?: string;
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
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
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

  const openUpdateModal = (product: Product) => {
    setCurrentProduct(product);
    setIsUpdateModalOpen(true);
  };

  const openImageModal = (imageUrl: string) => {
    setCurrentImage(imageUrl);
    setIsImageModalOpen(true);
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
    } catch (error: any) {
      console.error("Error deleting product:", error.message);
      setError(error.message);
    }
  };

  const columns: ColumnDef<Product>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="flex items-center gap-1 sm:gap-5  overflow-hidden">
          <Image
            src={`/${row.original.images[0]}`}
            alt={row.original.name}
            height={60}
            width={60}
            priority
            className="w-8 h-8 object-cover object-center cursor-pointer rounded-lg"
            onClick={() => openImageModal(row.original.images[0])}
          />
          {row.original.name}
        </div>
      ),
    },
    {
      accessorKey: "selling_price",
      header: "Price",
      cell: ({ row }) => (
        <div className="overflow-hidden">
          रू ${row.original.selling_price.toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: "availableQuantity",
      header: "Quantity",
      cell: ({ row }) => row.original.availableQuantity,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const totalQuantity = row.original.variants.reduce(
          (acc, variant) => acc + variant.quantity,
          0
        );
        return (
          <div
            className={`w-24 p-2 text-center ${
              totalQuantity > 0 ? "bg-green-600" : "bg-red-600"
            } rounded-xl text-xs font-semi-bold text-white`}
          >
            {totalQuantity > 0 ? "In Stock" : "Out of Stock"}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) =>
        row.original.createdAt
          ? new Date(row.original.createdAt).toLocaleDateString()
          : "N/A",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const product = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => openImageModal(product.images[0])}
              >
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openUpdateModal(product)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => deleteProduct(product._id)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: products,
    columns,
    state: {
      sorting,
      rowSelection,
    },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
      <div className="flex justify-between mb-4">
        <h3 className="text-xl sm:text-2xl font-bold pb-2">Products</h3>
        <Button
          variant={"outline"}
          onClick={() => router.push("/Products/AddProduct")}
        >
          {" "}
          Add Product
        </Button>
      </div>
      <div className="mb-4 bg-background">
        <Input
          placeholder="Search..."
          onChange={(e) => {
            const value = e.target.value.toLowerCase();
            setProducts((prevProducts) =>
              prevProducts.filter((product) =>
                product.name.toLowerCase().includes(value)
              )
            );
          }}
        />
      </div>

      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
