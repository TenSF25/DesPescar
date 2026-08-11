import { FormRegister } from '../components/FormRegister';
import { LayoutSection } from '../components/LayoutSection';

export const RegisterPage = () => {
  return (
    <LayoutSection className="flex flex-row-reverse">
      <FormRegister />
    </LayoutSection>
  );
};
