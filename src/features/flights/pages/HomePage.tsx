import { OffersDay } from '../components/OffersDay';
import { SearchFly } from '../components/SearchFly';
import { TrendFly } from '../components/TrendFly';

export const HomePage = () => {
  return (
    <>
      <SearchFly />
      <OffersDay />
      <TrendFly />
    </>
  );
};
