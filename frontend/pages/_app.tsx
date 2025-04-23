import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import Layout from "../components/Layout";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={`${inter.variable} font-sans bg-slate-50 min-h-screen`}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </main>
  );
}
