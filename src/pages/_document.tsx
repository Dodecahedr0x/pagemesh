import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);

    return initialProps;
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>
        <body>
          <script src="https://platform.twitter.com/widgets.js"></script>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
