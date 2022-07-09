import { router } from "@trpc/server";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FunctionComponent, useState } from "react";
import { useForm } from "react-hook-form";
import { hashQueryKeyByOptions } from "react-query/types/core/utils";
import { CreateUserInput } from "../schema/user.schema";
import styles from "../styles/Home.module.css";
import { trpc } from "../utils/trpc";

const LoginForm: NextPage = () => {
  const { handleSubmit, register } = useForm<CreateUserInput>();
  const router = useRouter();
  const [success, setSuccess] = useState(false);

  const { mutate, error } = trpc.useMutation(["users.request-otp"], {
    onSuccess: () => {
      console.log("success");
      setSuccess(true);
    },
  });

  const onSubmit = (data: CreateUserInput) => {
    mutate({ ...data, redirect: router.asPath });
  };

  const hash = router.asPath.split("#token=")[1];
  if (hash) {
    return <VerifyToken hash={hash}></VerifyToken>;
  }
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {error && <div>{error.message}</div>}
        {success && <div>Check your email</div>}
        <h1>Login</h1>
        <input
          type='email'
          placeholder='jane.doe@example.com'
          {...register("email")}></input>
        <input type='text' placeholder='Tom' {...register("name")}></input>
        <button type='submit'>Login</button>
      </form>
      <Link href='/register'>Register</Link>
    </>
  );
};

export default LoginForm;

const VerifyToken: FunctionComponent<{ hash: string }> = ({ hash }) => {
  const router = useRouter();
  const { data, isLoading } = trpc.useQuery([
    "users.verify-otp",
    {
      hash,
    },
  ]);

  if (isLoading) {
    return <p> Verifying</p>;
  }
  router.push(data?.redirect.includes("login") ? "/" : data?.redirect || "/");
  return <p>Verifying</p>;
};
