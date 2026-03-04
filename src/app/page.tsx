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

      {/* Hero text — no animation, static */}
      <section className="px-6 sm:px-12 lg:px-20 pt-12 sm:pt-20 pb-8">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl text-earth-deep tracking-wide leading-tight max-w-3xl">
          Explore Freely
        </h1>
        <p className="mt-4 text-base sm:text-lg text-earth-brown/70 leading-relaxed max-w-xl">
          The world is too vast to see from a screen. Terra connects you with
          trails, open skies, and a community that believes freedom starts
          where the road ends.
        </p>
      </section>

      {/* Polaroid carousel */}
      <Carousel />

      {/* Waitlist */}
      <Waitlist />

      {/* Footer */}
      <div className="mt-auto">
        <Footer />
      </div>
    </main>
  );
}
