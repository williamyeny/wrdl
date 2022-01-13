import type { NextPage } from "next";
import Head from "next/head";
import { Nav } from "../components/Nav";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Word Racer game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto max-w-lg">
        <Nav />
      </main>
    </div>
  );
};

export default Home;
