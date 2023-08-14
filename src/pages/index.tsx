import Head from "next/head";
import { BeatSheet } from "~/components/BeatSheet";

export default function Home() {
  return (
    <>
      <Head>
        <title>Hello Spotter!</title>
        <meta name="description" content="Made with <3 for Spotter" />
        <link
          rel="icon"
          href="https://spotter.la/favicon-32x32.png?v=4a4629bbd528fe9bd72f2efdc6d8442e"
        />
      </Head>
      <main className="min-h-screen bg-black">
        <BeatSheet />
      </main>
    </>
  );
}
