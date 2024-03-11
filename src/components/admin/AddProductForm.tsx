/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import Heading from "../Heading";
import Input from "../inputs/Input";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import TextArea from "../inputs/TextArea";
import CustomCheckBox from "../inputs/CustomCheckBox";
import { categories } from "@/utils/Categories";
import CategoryInput from "../inputs/CategoryInput";
import { colors } from "@/utils/Colors";
import SelectColor from "../inputs/SelectColor";
import Button from "../Button";
import toast from "react-hot-toast";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import firebaseApp from "@/utils/firebase";
import axios from "axios";
import { useRouter } from "next/navigation";

export type ImageType = {
  color: string;
  colorCode: string;
  image: File | null;
};

export type UploadedImageType = {
  color: string;
  colorCode: string;
  image: string;
};

const AddProductForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<ImageType[] | null>();
  const [isProductCreated, setIsProductCreated] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      category: "",
      brand: "",
      images: [],
      inStock: false,
    },
  });

  useEffect(() => {
    setCustomValue("images", images);
  }, [images]);

  useEffect(() => {
    if (isProductCreated) {
      reset();
      setImages(null);
      setIsProductCreated(false);
    }
  }, []);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    let uploadImages: UploadedImageType[] = [];
    if (!data.category) {
      setIsLoading(false);
      return toast.error("Category is not selected");
    }
    if (!data.images || data.images.length === 0) {
      setIsLoading(false);
      return toast.error("Image not selected");
    }

    const handleImageUploads = async () => {
      toast("Creating product,please wait...");

      try {
        for (const item of data.images) {
          if (item.image) {
            const fileName = new Date().getTime() + "-" + item.image.name;

            const storage = getStorage(firebaseApp);
            const storageRef = ref(storage, `products/${fileName}`);
            const uploadTask = uploadBytesResumable(storageRef, item.image);
            await new Promise<void>((resolve, reject) => {
              uploadTask.on(
                "state_changed",
                (snapshot) => {
                  const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  switch (snapshot.state) {
                    case "paused":
                      toast("Upload is paused");
                      break;
                    case "running":
                      toast("Upload is running");
                      break;
                  }
                },
                (error) => {
                  console.log("Image upload error", error);
                  reject(error);
                },
                () => {
                  getDownloadURL(uploadTask.snapshot.ref)
                    .then((downloadURL) => {
                      uploadImages.push({ ...item, image: downloadURL });
                      resolve();
                    })
                    .catch((error) => {
                      console.log("Error getting url", error);
                      reject(error);
                    });
                }
              );
            });
          }
        }
      } catch (error) {
        setIsLoading(false);
        console.log("Error handle image upload", error);
        toast.error("error occurred");
      }
    };

    await handleImageUploads();
    if (uploadImages) {
      const productDate = {
        ...data,
        images: uploadImages,
        price: parseFloat(data.price),
      };

      axios
        .post("/api/product", productDate)
        .then(() => {
          toast.success("Product created"), setIsProductCreated(true);
          reset();
          router.refresh();
        })
        .catch((error) => {
          setIsLoading(false);
          toast.error("SomethingWent wrong");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      toast.error("Woo hoo! You forgot to select image");
    }
  };

  const category = watch("category");

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const addImageToState = useCallback((value: ImageType) => {
    setImages((prev) => {
      if (!prev) {
        return [value];
      }
      return [...prev, value];
    });
  }, []);
  const removeImageFromState = useCallback((value: ImageType) => {
    setImages((prev) => {
      if (prev) {
        const filteredImages = prev.filter(
          (item) => item.color !== value.color
        );
        return filteredImages;
      }
      return prev;
    });
  }, []);

  return (
    <Fragment>
      <Heading title="Add a products" />
      <Input
        label="Name"
        id="name"
        disabled={isLoading}
        errors={errors}
        register={register}
        required
        type="text"
      />
      <Input
        label="Price"
        id="price"
        disabled={isLoading}
        errors={errors}
        register={register}
        required
        type="number"
      />
      <Input
        label="Brand"
        id="brand"
        disabled={isLoading}
        errors={errors}
        register={register}
        required
        type="text"
      />
      <TextArea
        label="Description"
        id="description"
        disabled={isLoading}
        errors={errors}
        register={register}
        required
      />
      <CustomCheckBox
        id="inStock"
        register={register}
        label="This product is in stock"
      />
      <div className="w-full font-medium">
        <div className="mb-2 font-semibold">Select a Category</div>
        <div className="grid grid-cols-2 md:grid-cols-3 max-h-[50vh]  gap-3 overflow-y-auto">
          {categories.map((item) => {
            if (item.label === "All") {
              return null;
            }

            return (
              <div key={item.label} className="col-span">
                <CategoryInput
                  onClick={(category) => setCustomValue("category", category)}
                  selected={category === item.label}
                  label={item.label}
                  icon={item.icon}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="w-full flex flex-col flex-wrap gap-4">
        <div>
          <div className="font-bold">
            Select the available colors and uploads their images
          </div>
          <div className="text-sm">
            You must upload an imag for each of the color selected otherwise
            your color selection will be ignore
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {colors.map((item, index) => (
            <SelectColor
              key={index}
              item={item}
              addImageToState={addImageToState}
              removeImageFormState={removeImageFromState}
              isProductCreated={isProductCreated}
            />
          ))}
        </div>
      </div>
      <Button
        label={isLoading ? "Loading..." : "Add product"}
        onClick={handleSubmit(onSubmit)}
      />
    </Fragment>
  );
};

export default AddProductForm;
