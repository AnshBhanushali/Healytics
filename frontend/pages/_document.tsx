// pages/_document.tsx
import Document, {
    Html,
    Head,
    Main,
    NextScript,
  } from "next/document";
  
  export default class MyDocument extends Document {
    render() {
      return (
        <Html lang="en">
          <Head />
          <body className="bg-slate-50 text-slate-800">
            <Main />
            <NextScript />
          </body>
        </Html>
      );
    }
  }
  