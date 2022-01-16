import type { NextPage } from "next";
import Head from "next/head";
import { Game } from "../components/Game";
import { Nav } from "../components/Nav";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Word Guesser game" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="mx-auto max-w-lg">
        <Nav />
        <Game />
      </main>
    </div>
  );
};

export default Home;
