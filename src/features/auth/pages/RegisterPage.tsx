import { LayoutAuth } from '../components/LayoutAuth';
import { RegisterForm } from '../components/RegisterForm';

export const RegisterPage = () => {
  return (
    <div className="flex flex-1">
      <LayoutAuth className="order-last">
        <RegisterForm></RegisterForm>
      </LayoutAuth>
    </div>
  );
};
