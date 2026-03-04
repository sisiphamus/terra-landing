import Logo from "@/components/Logo";
import HamburgerMenu from "@/components/HamburgerMenu";
import Carousel from "@/components/Carousel";
import Waitlist from "@/components/Waitlist";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="w-full flex items-center justify-between px-6 sm:px-12 lg:px-20 py-6">
        <Logo />
        <HamburgerMenu />
      </nav>

      {/* Hero text — no animation, static, pushed right */}
      <section className="px-6 sm:px-12 lg:px-20 pt-12 sm:pt-20 pb-8 sm:ml-12 lg:ml-24">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl text-earth-deep tracking-wide leading-tight max-w-3xl">
          Get Outdoors
        </h1>
        <p className="mt-4 text-base sm:text-lg text-earth-brown/70 leading-relaxed max-w-xl">
          An agent that handles everything, so you can go do anything.
          Emails, scheduling, research, code, busywork. Outdoors takes it
          off your plate and gives you your life back.
        </p>
      </section>

      {/* Waitlist — above carousel */}
      <Waitlist />

      {/* Polaroid carousel */}
      <Carousel />

      {/* Footer */}
      <div className="mt-auto">
        <Footer />
      </div>
    </main>
  );
}
