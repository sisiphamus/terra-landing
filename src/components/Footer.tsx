export default function Footer() {
  return (
    <footer className="w-full border-t border-earth-brown/10 py-10 px-6">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-earth-brown/50 tracking-wide">
          &copy; {new Date().getFullYear()} Terra. All rights reserved.
        </p>
        <div className="flex gap-6">
          <a
            href="#"
            className="text-xs text-earth-brown/50 hover:text-earth-dark transition-colors tracking-wide"
          >
            Privacy
          </a>
          <a
            href="#"
            className="text-xs text-earth-brown/50 hover:text-earth-dark transition-colors tracking-wide"
          >
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
}
