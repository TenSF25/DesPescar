import { useCallback, useEffect, useState, useRef, useMemo } from 'react';
import type { FlightSeatMapResponse, SeatsWebSockets } from '../bookings.types';
import { api } from '@/config/api';
import { useFlightWebSocket } from './useFlightWebSocket';
import { useAuthStore } from '@/store/useAuthStore';
import { useFlightStore } from '@/store/useFlightStore';

type SeatUpdate = {
  seatNumber: string;
  seatStatus: string;
  blockedByUserId?: string | number | null;
};

const isSeatUpdate = (update: unknown): update is SeatUpdate => {
  if (typeof update !== 'object' || update === null) return false;
  const candidate = update as Record<string, unknown>;
  return typeof candidate.seatNumber === 'string' && typeof candidate.seatStatus === 'string';
};

export const useSeats = () => {
  const myUserId = useAuthStore((state) => state.user?.id);
  const departureId = useFlightStore((state) => state.selectedDepartureFlight);
  const passengers = useFlightStore((state) => state.passengers);
  const selectedSeats = useFlightStore((state) => state.selectedSeats);
  const setStoredSeats = useFlightStore((state) => state.setSelectedSeats);
  const { setSelectedSeats } = useFlightStore();

  const passengersLimit = useMemo(() => {
    if (Array.isArray(passengers)) return Math.max(1, passengers.length);
    const num = Number(passengers);
    return Math.max(1, isNaN(num) ? 1 : num);
  }, [passengers]);

  const [seatsMap, setSeatsMap] = useState<FlightSeatMapResponse>();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const selectedSeatsRef = useRef<string[]>(selectedSeats);
  const hasFetchedInitialRef = useRef(false);

  const seatsMapRef = useRef<FlightSeatMapResponse | undefined>(undefined);

  const updateSelectedSeats = useCallback(
    (newSeats: string[]) => {
      selectedSeatsRef.current = newSeats;
      setStoredSeats(newSeats);
    },
    [setStoredSeats],
  );

  useEffect(() => {
    selectedSeatsRef.current = selectedSeats;
  }, [selectedSeats]);

  const updateSeatsMapState = (newMap: FlightSeatMapResponse | undefined) => {
    seatsMapRef.current = newMap;
    setSeatsMap(newMap);
  };

  useEffect(() => {
    if (!departureId || !myUserId) return;

    if (hasFetchedInitialRef.current) return;

    setSelectedSeats([]);

    const seatsFetch = async () => {
      setIsLoading(true);
      try {
        const resSeats = await api.get(`/api/bookings/flights/${departureId}/seats`);

        if (!resSeats || !resSeats.data) return;

        const resSeatsMap = await api.get(
          `/api/bookings/flights/${departureId}/seat-map?selectionLimit=${passengersLimit}`,
        );

        if (!resSeatsMap || !resSeatsMap.data) return;

        const dynamicSeats: SeatsWebSockets[] = resSeats.data;
        const staticMap: FlightSeatMapResponse = resSeatsMap.data;

        const seatStatusMap = new Map();
        dynamicSeats.forEach((seat) => {
          seatStatusMap.set(seat.numberSeat, seat);
        });

        const misAsientosPrevios = new Set<string>();

        const mergedLayout = staticMap.layout.map((element) => {
          if (element.type === 'row') {
            return {
              ...element,
              items: element.items.map((item) => {
                if (item.type === 'seat') {
                  const realState = seatStatusMap.get(item.displayNumber);

                  if (realState) {
                    if (
                      realState.statusSeat === 'RESERVADO_TEMPORAL' &&
                      String(realState.blockedByUserId) === String(myUserId)
                    ) {
                      misAsientosPrevios.add(item.seatUuid || item.displayNumber);
                    }

                    return {
                      ...item,
                      status: realState.statusSeat,
                      blockedByUserId: realState.blockedByUserId,
                    };
                  }
                }
                return item;
              }),
            };
          }
          return element;
        });

        updateSeatsMapState({ ...staticMap, layout: mergedLayout });

        const merged = Array.from(new Set([...selectedSeatsRef.current, ...misAsientosPrevios]));
        updateSelectedSeats(merged);
        hasFetchedInitialRef.current = true;
      } catch {
        setError(`Ha ocurrido un error al obtener los asientos del vuelo con Id: ${departureId}`);
      } finally {
        setIsLoading(false);
      }
    };

    seatsFetch();
  }, [departureId, myUserId, passengersLimit, updateSelectedSeats]);

  const handleSeatUpdate = useCallback(
    (update: unknown) => {
      if (!isSeatUpdate(update)) return;

      let resolvedSeatId = update.seatNumber;
      const currentMap = seatsMapRef.current;

      if (currentMap?.layout) {
        for (const element of currentMap.layout) {
          if (element.type === 'row') {
            const foundSeat = element.items.find(
              (item) =>
                item.type === 'seat' &&
                (item.seatUuid === update.seatNumber || item.displayNumber === update.seatNumber),
            );
            if (foundSeat?.type === 'seat') {
              resolvedSeatId = foundSeat.seatUuid || foundSeat.displayNumber;
              break;
            }
          }
        }
      }

      setSeatsMap((prev) => {
        if (!prev) return prev;
        const updatedMap = {
          ...prev,
          layout: prev.layout.map((element) => {
            if (element.type === 'row') {
              return {
                ...element,
                items: element.items.map((item) => {
                  if (
                    item.type === 'seat' &&
                    (item.seatUuid === update.seatNumber ||
                      item.displayNumber === update.seatNumber)
                  ) {
                    return {
                      ...item,
                      status: update.seatStatus as typeof item.status,
                      blockedByUserId:
                        update.blockedByUserId == null ? undefined : Number(update.blockedByUserId),
                    };
                  }
                  return item;
                }),
              };
            }
            return element;
          }),
        };
        seatsMapRef.current = updatedMap;
        return updatedMap;
      });

      const isMine =
        update.blockedByUserId != null && String(update.blockedByUserId) === String(myUserId);

      if (update.seatStatus === 'RESERVADO_TEMPORAL' && isMine) {
        if (!selectedSeatsRef.current.includes(resolvedSeatId)) {
          updateSelectedSeats([...selectedSeatsRef.current, resolvedSeatId]);
        }
      } else {
        if (selectedSeatsRef.current.includes(resolvedSeatId)) {
          updateSelectedSeats(selectedSeatsRef.current.filter((id) => id !== resolvedSeatId));
        }
      }
    },
    [myUserId, updateSelectedSeats],
  );

  const { selectSeat, deselectSeat } = useFlightWebSocket(departureId || '', handleSeatUpdate);

  const handleSeatClick = useCallback(
    (clickedId: string, currentStatus: string, blockedByUserId?: number | string) => {
      if (!clickedId) return;

      let canonicalId = clickedId;
      if (seatsMapRef.current?.layout) {
        for (const element of seatsMapRef.current.layout) {
          if (element.type === 'row') {
            const found = element.items.find(
              (item) =>
                item.type === 'seat' &&
                // Comparamos contra las 3 posibles propiedades
                (item.seatUuid === clickedId ||
                  item.seatUuid === clickedId ||
                  item.displayNumber === clickedId),
            );

            if (found?.type === 'seat') {
              canonicalId = found.seatUuid || found.displayNumber;
              break;
            }
          }
        }
      }

      if (!canonicalId.includes('-') && canonicalId.length < 10) {
        console.warn(
          '⚠️ ALERTA: Estás enviando un número de asiento corto (ej. 12A) en lugar de un UUID. El backend rechazará esto.',
        );
      }

      const miIdStr = String(myUserId);
      const dueñoStr = blockedByUserId != null ? String(blockedByUserId) : undefined;
      const isMine = currentStatus === 'RESERVADO_TEMPORAL' && dueñoStr === miIdStr;

      const isOccupiedByOther =
        currentStatus === 'OCUPADO' ||
        currentStatus === 'BLOQUEADO' ||
        (currentStatus === 'RESERVADO_TEMPORAL' && !isMine);

      if (isOccupiedByOther) return;

      const currentSelected = selectedSeatsRef.current;
      const isAlreadySelected = currentSelected.includes(canonicalId) || isMine;

      if (isAlreadySelected) {
        if (deselectSeat) deselectSeat(canonicalId);
        const newSeats = currentSelected.filter((id) => id !== canonicalId);
        updateSelectedSeats(newSeats);
      } else {
        if (currentSelected.length >= passengersLimit) return;
        const newSeats = [...currentSelected, canonicalId];
        updateSelectedSeats(newSeats);
        if (selectSeat) selectSeat(canonicalId);
      }
    },
    [myUserId, passengersLimit, deselectSeat, selectSeat, updateSelectedSeats],
  );

  return {
    seatsMap,
    error,
    isLoading,
    selectedSeats,
    handleSeatClick,
  };
};
