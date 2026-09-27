import { useNavigate } from 'react-router';

export const useCard = () => {
  const navigate = useNavigate();

  const handlerClick = (option: number) => {
    switch (option) {
      case 1:
        navigate('/booking/checkout/travelers-data');

        break;
      case 2:
        navigate('/booking/checkout/contact-data');
        break;
      case 3:
        navigate('/booking/checkout/payments-data');
        break;
      default:
        break;
    }
  };

  return {
    handlerClick,
  };
};
