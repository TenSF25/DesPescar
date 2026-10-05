export const Footer = () => {
  return (
    <footer className="mx-auto grid w-full grid-cols-2 gap-8 bg-[#031636] px-6 py-10 text-white/70 md:grid-cols-4 md:p-[60px_30px]">
      <div className="col-span-2 w-full max-w-70 md:col-span-1">
        <h5 className="text-alert text-2xl font-bold">DesPescar</h5>
        <p>© 2026 DesPescar Aeronáutica. Sistema de Gestión de Precisión.</p>
      </div>
      <div className="flex w-full flex-col gap-3">
        <h6 className="font-bold">Legal</h6>
        <a href="" className="hover:text-white">
          Términos Legales
        </a>
        <a href="" className="hover:text-white">
          Privacidad
        </a>
      </div>
      <div className="flex w-full flex-col gap-3">
        <h6 className="font-bold">Plataforma</h6>
        <a href="" className="hover:text-white">
          Términos Legales
        </a>
        <a href="" className="hover:text-white">
          Privacidad
        </a>
      </div>
      <div className="flex w-full flex-col gap-3">
        <h6 className="font-bold">Empresa</h6>
        <a href="" className="hover:text-white">
          Términos Legales
        </a>
        <a href="" className="hover:text-white">
          Privacidad
        </a>
      </div>
    </footer>
  );
};
