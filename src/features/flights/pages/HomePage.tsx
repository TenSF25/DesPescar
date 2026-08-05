import { OffersDay } from '../components/Home/OffersDay';
import { SearchFly } from '../components/Home/SearchFly';
import { TrendFly } from '../components/Home/TrendFly';

export const HomePage = () => {
  return (
    <>
      <SearchFly />
      <OffersDay />
      <TrendFly />
    </>
  );
};
