"use client";
import React, {
  ChangeEvent,
  Fragment,
  useCallback,
  useEffect,
  useState,
} from "react";
import { ImageType } from "../admin/AddProductForm";
import SelectImage from "./SelectImage";
import Button from "../Button";

interface SelectColorProps {
  item: ImageType;
  addImageToState: (value: ImageType) => void;
  removeImageFormState: (value: ImageType) => void;
  isProductCreated: boolean;
}

const SelectColor: React.FC<SelectColorProps> = ({
  addImageToState,
  isProductCreated,
  item,
  removeImageFormState,
}) => {
  const [isSelected, setIsSelected] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  useEffect(() => {
    if (isProductCreated) {
      setIsSelected(false);
      setFile(null);
    }
  }, [isProductCreated]);

  const handleFileChange = useCallback(
    (value: File) => {
      setFile(value);
      addImageToState({ ...item, image: value });
    },
    [addImageToState, item]
  );

  const handleCheck = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setIsSelected(e.target.checked);
      if (!e.target.checked) {
        setFile(null);
        removeImageFormState(item);
      }
    },
    [item, removeImageFormState]
  );
  return (
    <Fragment>
      <div className="gid grid-cols-1 md:grid-cols-1 overflow-y-auto border-b-[2px] border-slate-200 items-center p-2">
        <div className="flex flex-row gap-2 items-center h-[60px]">
          <input
            id={item.color}
            type="checkbox"
            checked={isSelected}
            onChange={handleCheck}
            className="cursor-pointer"
          />
          <label htmlFor={item.color} className="font-medium">
            {item.color}
          </label>
        </div>
        <Fragment>
          {isSelected && !file && (
            <div className="col-span-2 text-center">
              <SelectImage handleFileChange={handleFileChange} item={item} />
            </div>
          )}
          {file && (
            <div className="flex flex-row gap-2 text-sm col-span-2 items-center justify-between">
              <p>{file.name}</p>
              <div className="w-[70px]">
                <Button
                  label="Cancel"
                  onClick={() => {
                    setFile(null);
                    removeImageFormState(item);
                  }}
                />
              </div>
            </div>
          )}
        </Fragment>
      </div>
    </Fragment>
  );
};

export default SelectColor;
