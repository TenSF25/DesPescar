import { Button } from '../../../components/ui/Button';
import { Search } from '../../../components/ui/Search';

export const ReservationsPage = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-8">
      <div className="">
        <Search className="border bg-[#fdfdff]" />
      </div>
      <div className="grid w-full grid-cols-[0.8fr_2fr] gap-10">
        <div className="flex max-h-max w-full flex-col gap-6 rounded-2xl border p-5">
          <div>
            <h2 className="font-bold">Filtros</h2>
            <h6>32 Vuelos encontrados</h6>
          </div>
          <hr className="text-black/20" />
          <div className="flex flex-col gap-2">
            <h4 className="text-[14px] font-semibold">ESCALAS</h4>
            <div>
              <div className="flex gap-3">
                <input type="checkbox" name="directo" id="directo" className="accent-primary w-4" />
                <label htmlFor="directo">Directo</label>
              </div>
              <div className="flex gap-3">
                <input type="checkbox" name="escala" id="escala" className="accent-primary w-4" />
                <label htmlFor="escala">Con escala</label>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="text-[14px] font-semibold">RANGO DE PRECIO</h4>
            <div>
              <input type="range" name="" id="" className="accent-secondary/20 w-full" />
              <div className="flex justify-between">
                <label htmlFor="">$70.000</label>
                <label htmlFor="">$450.000</label>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="text-[14px] font-semibold">AEROLINEAS</h4>
            <div>
              <div className="flex gap-3">
                <input
                  type="checkbox"
                  name="aerolineasArgentinas"
                  id="aerolineasArgentinas"
                  className="accent-primary w-4"
                />
                <label htmlFor="aerolineasArgentinas">Aerolineas Argentinas</label>
              </div>
              <div className="flex gap-3">
                <input
                  type="checkbox"
                  name="flybondi"
                  id="flybondi"
                  className="accent-primary w-4"
                />
                <label htmlFor="flybondi">Flybondi</label>
              </div>
              <div className="flex gap-3">
                <input
                  type="checkbox"
                  name="jetSmart"
                  id="jetSmart"
                  className="accent-primary w-4"
                />
                <label htmlFor="jetSmart">JetSmart</label>
              </div>
              <div className="flex gap-3">
                <input type="checkbox" name="andes" id="andes" className="accent-primary w-4" />
                <label htmlFor="andes">Andes</label>
              </div>
              <div className="flex gap-3">
                <input
                  type="checkbox"
                  name="americanJet"
                  id="americanJet"
                  className="accent-primary w-4"
                />
                <label htmlFor="americanJet">American Jet</label>
              </div>
            </div>
          </div>
          <Button variant="secondary">Reiniciar</Button>
        </div>
        <div className="flex w-full flex-col gap-4">
          <div className="flex justify-between gap-8 text-center font-semibold">
            <div className="bg-secondary w-full rounded-4xl p-3 text-white">Mejor Valorado</div>
            <div className="bg-secondary w-full rounded-4xl p-3 text-white">Más Rápido</div>
            <div className="bg-secondary w-full rounded-4xl p-3 text-white">Barato</div>
            <div className="bg-secondary w-full rounded-4xl p-3 text-white">Salida Temprana</div>
          </div>
          <div className="flex w-full flex-col gap-4">
            <div className="grid max-w-full grid-cols-7 items-center gap-3 rounded-2xl border p-3 text-center">
              <div className="w-full">
                <img
                  src="https://www.latamairlines.com/content/dam/latamxp/sites/alianzas/aerolineasargentinas-logo-l.png"
                  alt=""
                  className="w-auto"
                />
              </div>
              <div className="flex flex-col">
                <h4 className="font-semibold">11:15</h4>
                <h6>SFO</h6>
              </div>
              <div className="flex flex-col gap-1">
                <h6>11h 05m</h6>
                <div className="relative flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary absolute rotate-90 text-[18px]!">
                    flight
                  </span>
                  <hr className="w-full border text-black/40" />
                </div>
                <h6>Directo</h6>
              </div>
              <div className="flex flex-col">
                <h4 className="font-semibold">14:20</h4>
                <h6>+1 NRT</h6>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex flex-row">
                  <span className="material-symbols-outlined">wifi</span>
                  <span className="material-symbols-outlined">mobile_charge</span>
                  <span className="material-symbols-outlined">movie</span>
                </div>
                <h6 className="text-[14px] font-semibold">Boeing 787-9</h6>
              </div>
              <div className="flex flex-col items-center">
                <h3 className="text-secondary text-2xl font-semibold">$850.000</h3>
                <h4 className="text-[14px] font-semibold">Por persona</h4>
              </div>
              <Button
                variant="secondary"
                className="bg-secondary hover:text-secondary text-white hover:bg-white"
              >
                Seleccionar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
