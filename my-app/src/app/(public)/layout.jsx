import Script from "next/script";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/common/WhatsAppButton";

export default function PublicLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">

      {/* Culqi Checkout */}
      <Script
        src="https://checkout.culqi.com/js/v4"
        strategy="afterInteractive"
      />
      <Header />

      <main className="flex-1 w-full">
        {children}
      </main>

      <Footer />

      {/* Botón flotante WhatsApp */}
      <WhatsAppButton />
    </div>
  );
}
