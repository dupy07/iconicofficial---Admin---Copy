"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UpdateOrderModal from "./UpdateOrderModal";
import { IoEllipsisHorizontalSharp } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteOutline } from "react-icons/md";

interface Customer {
  name: string;
  email: string;
  phone: string;
}

interface Item {
  product: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  customer: Customer;
  items: Item[];
  totalAmount: number;
  discount: number;
  additionalPrice: number;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  createdDate?: string; // Optional createdAt field
}

const OrderComponent: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const resOrders = await fetch("/api/orders");

        if (!resOrders.ok) {
          throw new Error("Failed to fetch data");
        }
        const ordersResult = await resOrders.json();

        if (ordersResult.success) {
          setOrders(ordersResult.data);
        } else {
          throw new Error("Failed to fetch orders");
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const openUpdateModal = (order: Order) => {
    setCurrentOrder(order);
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setCurrentOrder(null);
  };

  const handleUpdateOrder = async (updatedOrder: Order) => {
    try {
      const res = await fetch(`/api/orders?id=${updatedOrder._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedOrder),
      });

      if (!res.ok) {
        throw new Error(`Failed to update order: ${res.statusText}`);
      }

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to update order");
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
      closeUpdateModal();
    } catch (error: any) {
      console.error("Error updating order:", error.message);
      setError(error.message);
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!window.confirm("Are you sure you want to delete this order?")) {
      return;
    }

    try {
      const res = await fetch(`/api/orders?id=${orderId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(`Failed to delete order: ${res.statusText}`);
      }

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to delete order");
      }

      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );
    } catch (error: any) {
      console.error("Error deleting order:", error.message);
      setError(error.message);
    }
  };

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "select",
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
      accessorKey: "customer.name",
      header: "Customer Name",
    },
    {
      accessorKey: "customer.phone",
      header: "Phone",
    },
    {
      accessorKey: "totalAmount",
      header: "Total Amount",
      cell: ({ row }) => `रू ${row.original.totalAmount.toFixed(2)}`,
    },
    {
      accessorKey: "orderStatus",
      header: "Order Status",
    },
    {
      accessorKey: "paymentStatus",
      header: "Payment Status",
    },
    {
      accessorKey: "paymentMethod",
      header: "Payment Method",
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const order = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <IoEllipsisHorizontalSharp size={24} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => openUpdateModal(order)}>
                <CiEdit size={20} className="mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => deleteOrder(order._id)}>
                <MdOutlineDeleteOutline size={20} className="mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: orders,
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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h3 className="text-xl sm:text-2xl font-bold pb-2">Orders</h3>
      <div className="flex flex-col sm:flex-row justify-between items-center pt-3 pb-8">
        <div className="flex flex-wrap gap-2 sm:gap-4">
          <Button className="rounded-none" variant={"secondary"}>
            Active
          </Button>{" "}
          <Button className="rounded-none" variant={"secondary"}>
            Pending
          </Button>{" "}
          <Button className="rounded-none" variant={"secondary"}>
            Completed
          </Button>
        </div>
        <div className="mt-4 sm:mt-0 w-full sm:w-auto">
          <Button
            onClick={() => router.push("/Orders/AddOrder")}
            variant={"outline"}
            className="w-full sm:w-auto"
          >
            Add Order
          </Button>{" "}
        </div>
      </div>

      <div className="overflow-x-auto rounded-md border bg-secondary">
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
                  className="cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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

      {isUpdateModalOpen && currentOrder && (
        <UpdateOrderModal
          order={currentOrder}
          onClose={closeUpdateModal}
          onUpdate={handleUpdateOrder}
        />
      )}
    </div>
  );
};

export default OrderComponent;
