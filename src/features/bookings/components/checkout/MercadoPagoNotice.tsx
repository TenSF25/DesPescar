/** Aviso al elegir Mercado Pago: a dónde se redirige y en cuánto tiempo hay que pagar. */
export const MercadoPagoNotice = () => (
  <div className="flex flex-col gap-3 border-t border-black/10 pt-5 sm:col-span-2">
    <p className="text-secondary flex items-start gap-3 text-sm">
      <span className="material-symbols-outlined text-primary shrink-0">open_in_new</span>
      <span>
        Luego de hacer clic en <strong>«Continuar al pago seguro»</strong> te redireccionaremos a
        Mercado Pago, donde podrás abonar la compra.
      </span>
    </p>

    <p
      role="note"
      className="flex items-start gap-3 rounded-xl bg-amber-50 p-4 text-sm font-semibold text-amber-800"
    >
      <span className="material-symbols-outlined shrink-0">schedule</span>
      <span>
        Tenés una hora, a partir de la compra, para concretar el pago. De lo contrario, la solicitud
        quedará cancelada.
      </span>
    </p>
  </div>
);
