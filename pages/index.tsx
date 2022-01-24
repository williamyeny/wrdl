import type { NextPage } from "next";
import Head from "next/head";
import { Game } from "../components/Game";
import { Nav } from "../components/Nav";
import { SolutionWordProvider } from "../components/SolutionWordContext";
import Cohere from "cohere-js";
import { useEffect } from "react";

const Home: NextPage = () => {
  useEffect(() => {
    Cohere.init("1MH_3R0kE5_sDbYkZdQULHCA");
  }, []);

  return (
    <div>
      <Head>
        <title>wrdl</title>
        <meta name="description" content="Guess the secret word!" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="mx-auto max-w-lg relative">
        <SolutionWordProvider>
          <Nav />
          <Game />
        </SolutionWordProvider>
      </main>
    </div>
  );
};

export default Home;
