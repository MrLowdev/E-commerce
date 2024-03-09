"use client";

import { Fragment, useEffect, useState } from "react";
import Heading from "../Heading";
import Input from "../inputs/Input";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Button from "../Button";
import Link from "next/link";
import { AiOutlineGoogle } from "react-icons/ai";
import axios from "axios";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SafeUser } from "@/types";

interface RegisterFormProps {
  currentUser: SafeUser | null;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ currentUser }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    axios
      .post("/api/register", data)
      .then(() => {
        toast.success("Account created");
        signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        }).then((callback) => {
          if (callback?.ok) {
            router.push("/");
            router.refresh();
            toast.success("User sign up successfully");
          }

          if (callback?.error) {
            toast.error(callback.error);
          }
        });
      })
      .catch(() => toast.error("Something went wrong"))
      .finally(() => setIsLoading(false));
  };
  useEffect(() => {
    if (currentUser) {
      router.push("/");
      router.refresh();
    }
  }, [router, currentUser]);
  // Kingsuk kingsuk@gmail.com kingsuk990
  return (
    <Fragment>
      <Heading title="Sign up for E-shop" />
      <Button
        label="Sign up with google"
        icon={AiOutlineGoogle}
        onClick={() => {
          signIn("google");
        }}
        outline
      />
      <hr className="bg-slate-300 w-full" />
      <Input
        id="name"
        label="Name"
        disabled={isLoading}
        required
        register={register}
        errors={errors}
      />

      <Input
        id="email"
        label="Email"
        disabled={isLoading}
        required
        type="email"
        register={register}
        errors={errors}
      />
      <Input
        id="password"
        label="Password"
        disabled={isLoading}
        required
        register={register}
        errors={errors}
        type="password"
      />
      <Button
        label={isLoading ? "Processing" : "Sign up"}
        onClick={handleSubmit(onSubmit)}
      />
      <p className="text-sm">
        Already have an account?
        <Link className="underline" href="/login">
          Sign in
        </Link>
      </p>
    </Fragment>
  );
};

export default RegisterForm;
