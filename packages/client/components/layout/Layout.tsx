import Header from '../common/Header';
import Footer from '../common/Footer';

export default function Layout({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
