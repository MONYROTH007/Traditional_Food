export default function Footer() {
  return (
    <footer className="bg-ink text-paper/80 mt-24">
      <div className="max-w-content mx-auto px-5 md:px-8 py-14 grid gap-10 md:grid-cols-3">
        <div>
          <p className="font-display italic text-2xl text-turmeric mb-2">Battambang Table</p>
          <p className="text-sm leading-relaxed text-paper/60 max-w-xs">
            Five dishes, five stories, gathered from the kitchens, market stalls
            and riverside carts of Battambang province, Cambodia.
          </p>
        </div>
        <div>
          <p className="font-mono-tag text-[11px] tracking-widest uppercase text-paper/50 mb-3">
            Dishes
          </p>
          <ul className="space-y-2 text-sm">
            <li><a className="hover:text-turmeric transition-colors" href="/recipes/mee-kola">Mee Kola</a></li>
            <li><a className="hover:text-turmeric transition-colors" href="/recipes/num-banh-chok">Num Banh Chok</a></li>
            <li><a className="hover:text-turmeric transition-colors" href="/recipes/larp-khmer">Larp Khmer</a></li>
            <li><a className="hover:text-turmeric transition-colors" href="/recipes/song-vak">Song Vak</a></li>
            <li><a className="hover:text-turmeric transition-colors" href="/recipes/prahok-ktis">Prahok Ktis</a></li>
          </ul>
        </div>
        <div>
          <p className="font-mono-tag text-[11px] tracking-widest uppercase text-paper/50 mb-3">
            A note
          </p>
          <p className="text-sm leading-relaxed text-paper/60">
            Recipes and stories here are told the way they are passed down at
            home — through memory rather than measuring spoons. Treat the
            quantities as a starting point, and season to your own table.
          </p>
        </div>
      </div>
      <div className="border-t border-paper/10 py-5 text-center font-mono-tag text-[11px] tracking-widest uppercase text-paper/40">
        Battambang Table — a tribute to Khmer home cooking
      </div>
    </footer>
  );
}
