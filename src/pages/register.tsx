import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { CreateUserInput } from "../schema/user.schema";
import styles from "../styles/Home.module.css";
import { trpc } from "../utils/trpc";

const RegisterPage: NextPage = () => {
  const { handleSubmit, register } = useForm<CreateUserInput>();
  const router = useRouter();
  const { mutate, error } = trpc.useMutation(["users.register-user"], {
    onSuccess: () => {
      console.log("success");
      router.push("/login");
    },
    onError: () => {
      console.log("error");
    },
  });

  const onSubmit = (data: CreateUserInput) => {
    mutate({
      email: data.email,
      name: data.name,
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {error && <div>{error.message}</div>}
        <h1>Register</h1>
        <input
          type='email'
          placeholder='jane.doe@example.com'
          {...register("email")}></input>
        <input type='text' placeholder='Tom' {...register("name")}></input>
        <button type='submit'>Register</button>
      </form>
      <Link href='/login'>Login</Link>
    </>
  );
};

export default RegisterPage;
