"use client";
import { categories } from "@/utils/Categories";
import { Container } from "@mui/material";
import React from "react";
import CategoriesItem from "./CategoriesItem";
import { usePathname, useSearchParams } from "next/navigation";

const Categories = () => {
  const params = useSearchParams();
  const category = params?.get("category");
  const pathname = usePathname();

  const isMainPage = pathname === "/";
  if (!isMainPage) return null;

  return (
    <div className="bg-white">
      <Container>
        <div className="pt-4 flex  flex-row items-center justify-between overflow-x-auto">
          {categories.map((item) => (
            <CategoriesItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              selected={
                category === item.label ||
                (category === null && item.label === "All")
              }
            />
          ))}
        </div>
      </Container>
    </div>
  );
};

export default Categories;
