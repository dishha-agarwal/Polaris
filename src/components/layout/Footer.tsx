export default function Footer() {
  return (
    <footer className="mt-auto border-t border-polar-300/10 bg-polar-950/80 backdrop-blur-md pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-xl font-bold text-white mb-4">POLARIS</h2>
            <p className="text-polar-300 text-sm leading-relaxed max-w-md">
              An AI-powered Polar Knowledge Intelligence & Outreach Layer connecting India's existing polar research sources into one semantic, multimodal and provenance-aware ecosystem.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Explore</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-polar-400 hover:text-polar-200 text-sm transition-colors">AI Polar Explorer</a></li>
              <li><a href="#" className="text-polar-400 hover:text-polar-200 text-sm transition-colors">Knowledge Hub</a></li>
              <li><a href="#" className="text-polar-400 hover:text-polar-200 text-sm transition-colors">Interactive Polar Map</a></li>
              <li><a href="#" className="text-polar-400 hover:text-polar-200 text-sm transition-colors">Expeditions</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-polar-400 hover:text-polar-200 text-sm transition-colors">Datasets</a></li>
              <li><a href="#" className="text-polar-400 hover:text-polar-200 text-sm transition-colors">Media Library</a></li>
              <li><a href="#" className="text-polar-400 hover:text-polar-200 text-sm transition-colors">For Educators</a></li>
              <li><a href="#" className="text-polar-400 hover:text-polar-200 text-sm transition-colors">Admin Verification</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-polar-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-polar-500 text-sm">
            © {new Date().getFullYear()} National Centre for Polar and Ocean Research (NCPOR), MoES.
          </p>
          <div className="flex items-center gap-4 text-sm text-polar-500">
            <a href="#" className="hover:text-polar-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-polar-300 transition-colors">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
