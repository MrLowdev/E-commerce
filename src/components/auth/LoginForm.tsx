"use client";

import Link from "next/link";
import Input from "../inputs/Input";
import { Fragment, useEffect, useState } from "react";
import Heading from "../Heading";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { AiOutlineGoogle } from "react-icons/ai";
import Button from "../Button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { SafeUser } from "@/types";

interface LoginFormProps {
  currentUser: SafeUser | null;
}

const LoginForm: React.FC<LoginFormProps> = ({ currentUser }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    signIn("credentials", {
      ...data,
      redirect: false,
    }).then((callback) => {
      setIsLoading(false);
      if (callback?.ok) {
        router.push("/");
        router.refresh();
        toast.success("User sign up successfully");
      }

      if (callback?.error) {
        toast.error(callback.error);
      }
    });
  };

  useEffect(() => {
    if (currentUser) {
      router.push("/");
      router.refresh();
    }
  }, [router, currentUser]);
  return (
    <Fragment>
      <Heading title="Sign in for E-shop" />
      <Button
        label="Sign in with google"
        icon={AiOutlineGoogle}
        onClick={() => {
          signIn("google");
        }}
        outline
      />
      <hr className="bg-slate-300 w-full" />

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
        label={isLoading ? "Processing" : "Sign in"}
        onClick={handleSubmit(onSubmit)}
      />
      <p className="text-sm">
        New in E-shop?
        <Link className="underline" href="/register">
          Sign in
        </Link>
      </p>
    </Fragment>
  );
};

export default LoginForm;
