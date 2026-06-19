export const Footer = () => {
  return (
    <footer className="mx-auto grid w-full grid-cols-4 bg-[#031636] p-[60px_30px] text-white/70">
      <div className="w-full max-w-70">
        <h5 className="text-alert text-2xl font-bold">DesPescar</h5>
        <p>© 2024 DesPescar Aeronáutica. Sistema de Gestión de Precisión.</p>
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
