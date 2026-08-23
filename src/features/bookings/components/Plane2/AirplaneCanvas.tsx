import { CabinAmenity } from './CabinAmenity';
import { getColorSettings } from './ColorSettings';
import { SeatsRow } from './SeatsRow';

export const AirplaneCanvas = () => {
  const JSON = {
    aircraftName: 'Airbus A320',
    totalSelectedLimit: 4,
    fareClasses: {
      vip: {
        name: 'Primera Clase',
        price: 150,
        colorKey: 'gold',
      },
      business: {
        name: 'Clase Ejecutiva',
        price: 90,
        colorKey: 'blue',
      },
      economy: {
        name: 'Clase Turista',
        price: 45,
        colorKey: 'slate',
      },
    },
    layout: [
      {
        type: 'amenity',
        amenityType: 'services',
        servicesInfo: {
          left: 'wc',
          right: 'coffee',
        },
      },
      {
        type: 'amenity',
        amenityType: 'emergency',
      },
      {
        type: 'amenity',
        amenityType: 'columns',
      },
      {
        type: 'amenity',
        amenityType: 'class',
        classInfo: {
          name: 'Adelante',
          price: '30.970',
          color: 'blue',
          description: 'Adelantate a bajar primero',
        },
      },
      {
        type: 'row',
        rowNumber: 1,
        items: [
          { id: '1A', type: 'seat', fareClass: 'vip', status: 'available' },
          { id: '1B', type: 'seat', fareClass: 'vip', status: 'available' },
          { id: '1C', type: 'seat', fareClass: 'vip', status: 'available' },
          { type: 'aisle' },
          { type: 'empty' },
          { type: 'empty' },
          { type: 'empty' },
        ],
      },
      {
        type: 'row',
        rowNumber: 2,
        items: [
          { id: '2A', type: 'seat', fareClass: 'vip', status: 'available' },
          { id: '2B', type: 'seat', fareClass: 'vip', status: 'available' },
          { id: '2C', type: 'seat', fareClass: 'vip', status: 'available' },
          { type: 'aisle' },
          { id: '2D', type: 'seat', fareClass: 'vip', status: 'occupied' },
          { id: '2E', type: 'seat', fareClass: 'vip', status: 'available' },
          { id: '2F', type: 'seat', fareClass: 'vip', status: 'available' },
        ],
      },
      {
        type: 'row',
        rowNumber: 3,
        items: [
          { id: '3A', type: 'seat', fareClass: 'vip', status: 'available' },
          { id: '3B', type: 'seat', fareClass: 'vip', status: 'available' },
          { id: '3C', type: 'seat', fareClass: 'vip', status: 'available' },
          { type: 'aisle' },
          { id: '3D', type: 'seat', fareClass: 'vip', status: 'occupied' },
          { id: '3E', type: 'seat', fareClass: 'vip', status: 'available' },
          { id: '3F', type: 'seat', fareClass: 'vip', status: 'available' },
        ],
      },
      {
        type: 'amenity',
        amenityType: 'class',
        classInfo: {
          name: 'Standard adelante',
          price: '30.970',
          color: 'blue',
          description: 'Adelantate a bajar primero',
        },
      },
      {
        type: 'row',
        rowNumber: 4,
        items: [
          { id: '4A', type: 'seat', fareClass: 'vip', status: 'available' },
          { id: '4B', type: 'seat', fareClass: 'vip', status: 'available' },
          { id: '4C', type: 'seat', fareClass: 'vip', status: 'available' },
          { type: 'aisle' },
          { id: '4D', type: 'seat', fareClass: 'vip', status: 'occupied' },
          { id: '4E', type: 'seat', fareClass: 'vip', status: 'available' },
          { id: '4F', type: 'seat', fareClass: 'vip', status: 'available' },
        ],
      },
      {
        type: 'row',
        rowNumber: 5,
        items: [
          { id: '5A', type: 'seat', fareClass: 'vip', status: 'available' },
          { id: '5B', type: 'seat', fareClass: 'vip', status: 'available' },
          { id: '5C', type: 'seat', fareClass: 'vip', status: 'available' },
          { type: 'aisle' },
          { id: '5D', type: 'seat', fareClass: 'vip', status: 'occupied' },
          { id: '5E', type: 'seat', fareClass: 'vip', status: 'available' },
          { id: '5F', type: 'seat', fareClass: 'vip', status: 'available' },
        ],
      },
      {
        type: 'row',
        rowNumber: 6,
        items: [
          { id: '6A', type: 'seat', fareClass: 'vip', status: 'available' },
          { id: '6B', type: 'seat', fareClass: 'vip', status: 'available' },
          { id: '6C', type: 'seat', fareClass: 'vip', status: 'available' },
          { type: 'aisle' },
          { id: '6D', type: 'seat', fareClass: 'vip', status: 'occupied' },
          { id: '6E', type: 'seat', fareClass: 'vip', status: 'available' },
          { id: '6F', type: 'seat', fareClass: 'vip', status: 'available' },
        ],
      },
      {
        type: 'row',
        rowNumber: 7,
        items: [
          { id: '7A', type: 'seat', fareClass: 'vip', status: 'available' },
          { id: '7B', type: 'seat', fareClass: 'vip', status: 'available' },
          { id: '7C', type: 'seat', fareClass: 'vip', status: 'available' },
          { type: 'aisle' },
          { id: '7D', type: 'seat', fareClass: 'vip', status: 'occupied' },
          { id: '7E', type: 'seat', fareClass: 'vip', status: 'available' },
          { id: '7F', type: 'seat', fareClass: 'vip', status: 'available' },
        ],
      },
      {
        type: 'row',
        rowNumber: 8,
        items: [
          { id: '8A', type: 'seat', fareClass: 'vip', status: 'available' },
          { id: '8B', type: 'seat', fareClass: 'vip', status: 'available' },
          { id: '8C', type: 'seat', fareClass: 'vip', status: 'available' },
          { type: 'aisle' },
          { id: '8D', type: 'seat', fareClass: 'vip', status: 'occupied' },
          { id: '8E', type: 'seat', fareClass: 'vip', status: 'available' },
          { id: '8F', type: 'seat', fareClass: 'vip', status: 'available' },
        ],
      },
      {
        type: 'row',
        rowNumber: 9,
        items: [
          { id: '9A', type: 'seat', fareClass: 'vip', status: 'available' },
          { id: '9B', type: 'seat', fareClass: 'vip', status: 'available' },
          { id: '9C', type: 'seat', fareClass: 'vip', status: 'available' },
          { type: 'aisle' },
          { id: '9D', type: 'seat', fareClass: 'vip', status: 'occupied' },
          { id: '9E', type: 'seat', fareClass: 'vip', status: 'available' },
          { id: '9F', type: 'seat', fareClass: 'vip', status: 'available' },
        ],
      },
      {
        type: 'row',
        rowNumber: 10,
        items: [
          { id: '10A', type: 'seat', fareClass: 'vip', status: 'available' },
          { id: '10B', type: 'seat', fareClass: 'vip', status: 'available' },
          { id: '10C', type: 'seat', fareClass: 'vip', status: 'available' },
          { type: 'aisle' },
          { id: '10D', type: 'seat', fareClass: 'vip', status: 'occupied' },
          { id: '10E', type: 'seat', fareClass: 'vip', status: 'available' },
          { id: '10F', type: 'seat', fareClass: 'vip', status: 'available' },
        ],
      },
      {
        type: 'row',
        rowNumber: 11,
        items: [
          { id: '11A', type: 'seat', fareClass: 'vip', status: 'available' },
          { id: '11B', type: 'seat', fareClass: 'vip', status: 'available' },
          { id: '11C', type: 'seat', fareClass: 'vip', status: 'available' },
          { type: 'aisle' },
          { id: '11D', type: 'seat', fareClass: 'vip', status: 'occupied' },
          { id: '11E', type: 'seat', fareClass: 'vip', status: 'available' },
          { id: '11F', type: 'seat', fareClass: 'vip', status: 'available' },
        ],
      },
      {
        type: 'row',
        rowNumber: 12,
        items: [
          { id: '12A', type: 'seat', fareClass: 'vip', status: 'available' },
          { id: '12B', type: 'seat', fareClass: 'vip', status: 'available' },
          { id: '12C', type: 'seat', fareClass: 'vip', status: 'available' },
          { type: 'aisle' },
          { id: '12D', type: 'seat', fareClass: 'vip', status: 'occupied' },
          { id: '12E', type: 'seat', fareClass: 'vip', status: 'available' },
          { id: '12F', type: 'seat', fareClass: 'vip', status: 'available' },
        ],
      },
      {
        type: 'row',
        rowNumber: 13,
        items: [
          { id: '13A', type: 'seat', fareClass: 'vip', status: 'available' },
          { id: '13B', type: 'seat', fareClass: 'vip', status: 'available' },
          { id: '13C', type: 'seat', fareClass: 'vip', status: 'available' },
          { type: 'aisle' },
          { id: '13D', type: 'seat', fareClass: 'vip', status: 'occupied' },
          { id: '13E', type: 'seat', fareClass: 'vip', status: 'available' },
          { id: '13F', type: 'seat', fareClass: 'vip', status: 'available' },
        ],
      },
      {
        type: 'amenity',
        amenityType: 'class',
        classInfo: {
          name: 'Salida de emergencias',
          price: '30.970',
          color: 'blue',
          description: 'Adelantate a bajar primero',
        },
      },
      {
        type: 'amenity',
        amenityType: 'emergency',
      },
      {
        type: 'row',
        rowNumber: 14,
        items: [
          { id: '14A', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '14B', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '14C', type: 'seat', fareClass: 'economy', status: 'available' },
          { type: 'aisle' },
          { id: '14D', type: 'seat', fareClass: 'economy', status: 'occupied' },
          { id: '14E', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '14F', type: 'seat', fareClass: 'economy', status: 'available' },
        ],
      },
      {
        type: 'amenity',
        amenityType: 'emergency',
      },
      {
        type: 'row',
        rowNumber: 15,
        items: [
          { id: '15A', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '15B', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '15C', type: 'seat', fareClass: 'economy', status: 'available' },
          { type: 'aisle' },
          { id: '15D', type: 'seat', fareClass: 'economy', status: 'occupied' },
          { id: '15E', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '15F', type: 'seat', fareClass: 'economy', status: 'available' },
        ],
      },
      {
        type: 'amenity',
        amenityType: 'class',
        classInfo: {
          name: 'Standard',
          price: '30.970',
          color: 'blue',
          description: 'Adelantate a bajar primero',
        },
      },
      {
        type: 'row',
        rowNumber: 16,
        items: [
          { id: '16A', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '16B', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '16C', type: 'seat', fareClass: 'economy', status: 'available' },
          { type: 'aisle' },
          { id: '16D', type: 'seat', fareClass: 'economy', status: 'occupied' },
          { id: '16E', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '16F', type: 'seat', fareClass: 'economy', status: 'available' },
        ],
      },
      {
        type: 'row',
        rowNumber: 17,
        items: [
          { id: '17A', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '17B', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '17C', type: 'seat', fareClass: 'economy', status: 'available' },
          { type: 'aisle' },
          { id: '17D', type: 'seat', fareClass: 'economy', status: 'occupied' },
          { id: '17E', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '17F', type: 'seat', fareClass: 'economy', status: 'available' },
        ],
      },
      {
        type: 'row',
        rowNumber: 18,
        items: [
          { id: '18A', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '18B', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '18C', type: 'seat', fareClass: 'economy', status: 'available' },
          { type: 'aisle' },
          { id: '18D', type: 'seat', fareClass: 'economy', status: 'occupied' },
          { id: '18E', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '18F', type: 'seat', fareClass: 'economy', status: 'available' },
        ],
      },
      {
        type: 'row',
        rowNumber: 19,
        items: [
          { id: '19A', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '19B', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '19C', type: 'seat', fareClass: 'economy', status: 'available' },
          { type: 'aisle' },
          { id: '19D', type: 'seat', fareClass: 'economy', status: 'occupied' },
          { id: '19E', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '19F', type: 'seat', fareClass: 'economy', status: 'available' },
        ],
      },
      {
        type: 'row',
        rowNumber: 20,
        items: [
          { id: '20A', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '20B', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '20C', type: 'seat', fareClass: 'economy', status: 'available' },
          { type: 'aisle' },
          { id: '20D', type: 'seat', fareClass: 'economy', status: 'occupied' },
          { id: '20E', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '20F', type: 'seat', fareClass: 'economy', status: 'available' },
        ],
      },
      {
        type: 'row',
        rowNumber: 21,
        items: [
          { id: '21A', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '21B', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '21C', type: 'seat', fareClass: 'economy', status: 'available' },
          { type: 'aisle' },
          { id: '21D', type: 'seat', fareClass: 'economy', status: 'occupied' },
          { id: '21E', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '21F', type: 'seat', fareClass: 'economy', status: 'available' },
        ],
      },
      {
        type: 'row',
        rowNumber: 22,
        items: [
          { id: '22A', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '22B', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '22C', type: 'seat', fareClass: 'economy', status: 'available' },
          { type: 'aisle' },
          { id: '22D', type: 'seat', fareClass: 'economy', status: 'occupied' },
          { id: '22E', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '22F', type: 'seat', fareClass: 'economy', status: 'available' },
        ],
      },
      {
        type: 'row',
        rowNumber: 23,
        items: [
          { id: '23A', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '23B', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '23C', type: 'seat', fareClass: 'economy', status: 'available' },
          { type: 'aisle' },
          { id: '23D', type: 'seat', fareClass: 'economy', status: 'occupied' },
          { id: '23E', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '23F', type: 'seat', fareClass: 'economy', status: 'available' },
        ],
      },
      {
        type: 'row',
        rowNumber: 24,
        items: [
          { id: '24A', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '24B', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '24C', type: 'seat', fareClass: 'economy', status: 'available' },
          { type: 'aisle' },
          { id: '24D', type: 'seat', fareClass: 'economy', status: 'occupied' },
          { id: '24E', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '24F', type: 'seat', fareClass: 'economy', status: 'available' },
        ],
      },
      {
        type: 'row',
        rowNumber: 25,
        items: [
          { id: '25A', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '25B', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '25C', type: 'seat', fareClass: 'economy', status: 'available' },
          { type: 'aisle' },
          { id: '25D', type: 'seat', fareClass: 'economy', status: 'occupied' },
          { id: '25E', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '25F', type: 'seat', fareClass: 'economy', status: 'available' },
        ],
      },
      {
        type: 'row',
        rowNumber: 26,
        items: [
          { id: '26A', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '26B', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '26C', type: 'seat', fareClass: 'economy', status: 'available' },
          { type: 'aisle' },
          { id: '26D', type: 'seat', fareClass: 'economy', status: 'occupied' },
          { id: '26E', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '26F', type: 'seat', fareClass: 'economy', status: 'available' },
        ],
      },
      {
        type: 'row',
        rowNumber: 27,
        items: [
          { id: '27A', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '27B', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '27C', type: 'seat', fareClass: 'economy', status: 'available' },
          { type: 'aisle' },
          { id: '27D', type: 'seat', fareClass: 'economy', status: 'occupied' },
          { id: '27E', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '27F', type: 'seat', fareClass: 'economy', status: 'available' },
        ],
      },
      {
        type: 'row',
        rowNumber: 28,
        items: [
          { id: '28A', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '28B', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '28C', type: 'seat', fareClass: 'economy', status: 'available' },
          { type: 'aisle' },
          { id: '28D', type: 'seat', fareClass: 'economy', status: 'occupied' },
          { id: '28E', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '28F', type: 'seat', fareClass: 'economy', status: 'available' },
        ],
      },
      {
        type: 'row',
        rowNumber: 29,
        items: [
          { id: '29A', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '29B', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '29C', type: 'seat', fareClass: 'economy', status: 'available' },
          { type: 'aisle' },
          { id: '29D', type: 'seat', fareClass: 'economy', status: 'occupied' },
          { id: '29E', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '29F', type: 'seat', fareClass: 'economy', status: 'available' },
        ],
      },
      {
        type: 'row',
        rowNumber: 30,
        items: [
          { id: '30A', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '30B', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '30C', type: 'seat', fareClass: 'economy', status: 'available' },
          { type: 'aisle' },
          { id: '30D', type: 'seat', fareClass: 'economy', status: 'occupied' },
          { id: '30E', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '30F', type: 'seat', fareClass: 'economy', status: 'available' },
        ],
      },
      {
        type: 'row',
        rowNumber: 31,
        items: [
          { id: '31A', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '31B', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '31C', type: 'seat', fareClass: 'economy', status: 'available' },
          { type: 'aisle' },
          { id: '31D', type: 'seat', fareClass: 'economy', status: 'occupied' },
          { id: '31E', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '31F', type: 'seat', fareClass: 'economy', status: 'available' },
        ],
      },
      {
        type: 'row',
        rowNumber: 32,
        items: [
          { id: '32A', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '32B', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '32C', type: 'seat', fareClass: 'economy', status: 'available' },
          { type: 'aisle' },
          { id: '32D', type: 'seat', fareClass: 'economy', status: 'occupied' },
          { id: '32E', type: 'seat', fareClass: 'economy', status: 'available' },
          { id: '32F', type: 'seat', fareClass: 'economy', status: 'available' },
        ],
      },
      {
        type: 'amenity',
        amenityType: 'services',
        servicesInfo: {
          left: 'wc',
          right: 'coffee',
        },
      },
      {
        type: 'amenity',
        amenityType: 'emergency',
      },
    ],
  };

  return (
    <div className="plane relative mx-auto w-full max-w-full">
      <div className="head bg-gray-200 px-3 [clip-path:ellipse(50%_100%_at_50%_100%)]">
        <div className="head-plane h-100 w-120 bg-white [clip-path:ellipse(50%_100%_at_50%_100%)]"></div>
      </div>
      <div className="cabine bg-gray-200 px-3">
        <div className="cabine-plane flex h-max w-120 flex-col gap-8 bg-white p-1">
          {JSON.layout.map((layout) =>
            layout.type === 'row' ? (
              <SeatsRow
                rowNumber={String(layout.rowNumber)}
                items={layout.items}
                colorStyle={getColorSettings(layout.classInfo?.color)}
              />
            ) : (
              layout.amenityType && (
                <CabinAmenity
                  type={layout.amenityType}
                  classInfo={layout.classInfo}
                  servicesInfo={layout.servicesInfo}
                />
              )
            ),
          )}
        </div>
      </div>
      <div className="ariplane-tail h-140 bg-gray-200 px-3 [clip-path:ellipse(50%_100%_at_50%_0%)]">
        <div className="airplane-tail h-50 w-120 bg-white [clip-path:ellipse(50%_100%_at_50%_0%)]"></div>
      </div>
      <div className="airplane-wings relative -top-650 z-20 mx-auto h-40 w-126">
        <div className="wing-left absolute right-full z-10 -mx-1 h-200 w-180 bg-gray-200 [clip-path:polygon(0%_100%,0%_80%,100%_0%,100%_70%)]"></div>
        <div className="wing-right absolute left-full z-10 h-200 w-180 bg-gray-200 [clip-path:polygon(0%_0%,100%_80%,100%_100%,0%_70%)]"></div>
      </div>
    </div>
  );
};
