import { SectionContainer } from '@/components/ui/SectionContainer';
import { BookingCard } from '../components/BookingCard';

export const Booking = () => {
  return (
    <SectionContainer className="flex flex-row justify-between">
      <div className="flex w-full max-w-240 flex-col gap-6">
        <h2 className="text-2xl font-semibold">
          ¡Ya casi estás! Completá tus datos y finalizá tu compra
        </h2>
        <div className="timer w-full">
          <div className="bg-primary h-2 w-full rounded-lg"></div>
        </div>
        <BookingCard
          title="Quiénes viajan"
          button="Completar"
          option={1}
          content={[
            {
              name: 'Adulto 1',
              icon: 'person',
            },
          ]}
        ></BookingCard>
        <BookingCard
          title="Datos de contacto"
          description="Son fundamentales para que recibas tus vouchers e información importante sobre tu viaje."
          button="Completar"
          option={2}
          content={[
            {
              name: 'Email',
              icon: 'email',
            },
            {
              name: 'Celular',
              icon: 'mobile',
            },
          ]}
        ></BookingCard>
        <BookingCard
          title="Formas de pago"
          button="Seleccionar"
          option={3}
          content={[
            {
              name: 'Forma de pago',
              icon: 'attach_money',
            },
          ]}
        ></BookingCard>
      </div>
      <div className="flex w-100 flex-col gap-6">
        <h2 className="text-2xl font-semibold">Detalle del pago</h2>
        <div className="rounded-lg border border-black/20">
          <div className="flex flex-col gap-4 border-b border-black/20 p-4">
            <div className="flex items-center justify-between">
              <h5 className="text-md">Vuelo para una persona</h5>
              <h6 className="text-sm">$ 209.100</h6>
            </div>
            <div className="flex items-center justify-between">
              <h5 className="text-md">Impuestos, tasas y cargos</h5>
              <h6 className="text-sm">$ 99.576</h6>
            </div>
          </div>
          <div className="flex items-center justify-between p-4">
            <h3 className="text-md font-semibold">SUBTOTAL</h3>
            <h2 className="">
              $ <span className="text-2xl font-bold">308.676</span>
            </h2>
          </div>
        </div>
        <div className="rounded-lg border border-black/20">
          <div className="flex flex-col gap-4 border-b border-black/20 p-4">
            <div className="text-md flex items-center justify-between">
              <h5 className="">Saldo restante:</h5>
              <h6 className="">$ 308.675,58</h6>
            </div>
          </div>
          <div className="text-md flex items-center justify-between p-4 font-semibold">
            <h3 className="">TOTAL:</h3>
            <h2 className="">$ 308.676</h2>
          </div>
        </div>
        <div className="flex flex-col gap-2 rounded-lg border border-black/20 p-4">
          <h3 className="text-xl font-semibold">Tu viaje</h3>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="material-symbols-outlined rotate-90">flight</span>
              <h6 className="">IDA</h6>
              <h6>Lun. 26 oct. 2026</h6>
            </div>
            <div className="flex justify-between">
              <div className="grid w-70 grid-cols-3">
                <div className="flex flex-col gap-1 text-xs">
                  <h6 className="font-medium">EZE</h6>
                  <p className="font-semibold">12:20</p>
                </div>
                <div className="flex flex-col gap-1 text-xs">
                  <h6 className="font-medium">BRC</h6>
                  <p className="font-semibold">14:41</p>
                </div>
                <div className="flex flex-col gap-1 text-xs">
                  <h6 className="font-medium">Directo</h6>
                  <p className="font-medium">2h 21m</p>
                </div>
              </div>
              <div className="flex">
                <span
                  className="material-symbols-outlined hover:text-primary cursor-pointer text-[24px] transition-colors"
                  title="Mochila personal incluida"
                >
                  backpack
                </span>
                <span
                  className="material-symbols-outlined hover:text-primary cursor-pointer text-[24px] transition-colors"
                  title="Equipaje de mano incluido"
                >
                  luggage
                </span>
                <span
                  className="material-symbols-outlined hover:text-primary cursor-pointer text-[24px] transition-colors"
                  title="Equipaje de bodega incluido"
                >
                  work
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="material-symbols-outlined -rotate-90">flight</span>
                <h6 className="">VUELTA</h6>
                <h6>Jue. 29 oct. 2026</h6>
              </div>
              <div className="flex justify-between">
                <div className="grid w-70 grid-cols-3">
                  <div className="flex flex-col gap-1 text-xs">
                    <h6 className="font-medium">BRC</h6>
                    <p className="font-semibold">20:43</p>
                  </div>
                  <div className="flex flex-col gap-1 text-xs">
                    <h6 className="font-medium">EZE</h6>
                    <p className="font-semibold">22:48</p>
                  </div>
                  <div className="flex flex-col gap-1 text-xs">
                    <h6 className="font-medium">Directo</h6>
                    <p className="font-medium">2h 5m</p>
                  </div>
                </div>
                <div className="flex">
                  <span
                    className="material-symbols-outlined hover:text-primary cursor-pointer text-[24px] transition-colors"
                    title="Mochila personal incluida"
                  >
                    backpack
                  </span>
                  <span
                    className="material-symbols-outlined hover:text-primary cursor-pointer text-[24px] transition-colors"
                    title="Equipaje de mano incluido"
                  >
                    luggage
                  </span>
                  <span
                    className="material-symbols-outlined hover:text-primary cursor-pointer text-[24px] transition-colors"
                    title="Equipaje de bodega incluido"
                  >
                    work
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};
