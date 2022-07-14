import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import LoginForm from "../components/LoginForm";
import { useUserContext } from "../context/user.context";
import styles from "../styles/Home.module.css";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const user = useUserContext();

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div>
      <div>Index {JSON.stringify(user)}</div>
      <Link href='/posts/new'>Create Post</Link>
      <Link href='/posts'>Posts</Link>
    </div>
  );
};

// export async function getServerSideProps() {
//   return {
//     redirect: {
//       permanent: false,
//       destination: "/login",
//     },
//   };
// }

export default Home;
