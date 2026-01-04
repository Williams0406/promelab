import HomePage from "@/components/public/HomePage";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/common/WhatsAppButton";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 w-full">
        <HomePage />
      </main>

      <Footer />

      {/* Botón flotante WhatsApp */}
      <WhatsAppButton />
    </div>
  );
}
