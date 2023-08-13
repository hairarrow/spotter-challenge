import Head from "next/head";
import BeatSheet from "~/components/BeatSheet";

export default function Home() {
  return (
    <>
      <Head>
        <title>Hello Spotter!</title>
        <meta name="description" content="Made with <3 for Spotter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-black">
        <BeatSheet />
      </main>
    </>
  );
}
