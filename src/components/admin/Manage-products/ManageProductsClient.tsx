"use client";

import { Product } from "@prisma/client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { formatPrice } from "@/utils/formatPrice";
import Heading from "@/components/Heading";
import Status from "@/components/Status";
import {
  MdCached,
  MdClose,
  MdDelete,
  MdDone,
  MdRemoveRedEye,
} from "react-icons/md";
import ActionBtn from "@/components/ActionBtn";
import { useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { deleteObject, getStorage, ref } from "firebase/storage";
import firebaseApp from "@/utils/firebase";

interface ManageProductsClientProps {
  products: Product[];
}

const ManageProductsClient: React.FC<ManageProductsClientProps> = ({
  products,
}) => {
  const router = useRouter();
  const storage = getStorage(firebaseApp);

  let rows: any = [];

  if (products) {
    rows = products.map((product) => {
      return {
        id: product.id,
        name: product.name,
        price: formatPrice(product.price),
        category: product.category,
        brand: product.brand,
        inStock: product.inStock,
        images: product.images,
      };
    });
  }

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 220 },
    { field: "name", headerName: "Name", width: 220 },
    {
      field: "price",
      headerName: "Price(USD)",
      width: 100,
      renderCell: (params) => {
        return (
          <div className="font-bold text-slate-800">{params.row.price}</div>
        );
      },
    },
    { field: "category", headerName: "Category", width: 100 },
    { field: "brand", headerName: "Brand", width: 100 },
    {
      field: "inStock",
      headerName: "In Stock",
      width: 100,
      renderCell: (params) => {
        return (
          <div>
            {params.row.inStock === true ? (
              <Status
                text="in stock"
                bg="bg-teal-200"
                color="text-teal-700"
                icon={MdDone}
              />
            ) : (
              <Status
                text="out of stock"
                bg="bg-rose-200"
                color="text-rose-700"
                icon={MdClose}
              />
            )}
          </div>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="flex justify-between gap-4 w-full ">
            <ActionBtn
              onClick={() => {
                handleTogglerStock(params.row.id, params.row.inStock);
              }}
              icon={MdCached}
            />
            <ActionBtn
              onClick={() => {
                handleDeleteProduct(params.row.id, params.row.images);
              }}
              icon={MdDelete}
            />
            <ActionBtn
              onClick={() => {
                router.push(`product/${params.row.id}`);
              }}
              icon={MdRemoveRedEye}
            />
          </div>
        );
      },
    },
  ];

  const handleTogglerStock = useCallback(
    (id: string, inStock: boolean) => {
      axios
        .put("/api/product", {
          id,
          inStock: !inStock,
        })
        .then(() => {
          toast.success("Product status change");
          router.refresh();
        })
        .catch((error) => toast.error("Something wrong"));
    },
    [router]
  );

  const handleDeleteProduct = useCallback(
    async (id: string, images: any[]) => {
      toast("Deleting product, please wait...");
      const handleImageDelete = async () => {
        try {
          for (const item of images) {
            if (item.image) {
              const imageRef = ref(storage, item.image);
              await deleteObject(imageRef);
              console.log("image delete");
            }
          }
        } catch (error) {
          return console.log("Deleting images error", error);
        }
      };

      await handleImageDelete();
      axios
        .delete(`/api/product/${id}`)
        .then(() => {
          toast.success("Product delete successfully");
          router.refresh();
        })
        .catch((error) => toast.error("Something wrong"));
    },
    [router, storage]
  );
  return (
    <div className="max-w-[1150px] m-auto text-xl">
      <div className="mb-4 mt-8">
        <Heading title="Manage Products " center />
      </div>

      <div style={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 9 },
            },
          }}
          pageSizeOptions={[9, 20]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </div>
    </div>
  );
};

export default ManageProductsClient;
