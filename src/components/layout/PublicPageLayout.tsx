import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

type PublicPageLayoutProps = {
  children: React.ReactNode;
  mainId: string;
  ariaLabel: string;
};

export function PublicPageLayout({
  children,
  mainId,
  ariaLabel,
}: PublicPageLayoutProps) {
  return (
    <>
      <Header />
      <main
        id={mainId}
        tabIndex={-1}
        className="flex flex-1 flex-col outline-none"
        aria-label={ariaLabel}
      >
        {children}
      </main>
      <Footer />
    </>
  );
}
