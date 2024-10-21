import { ReactNode } from 'react';
import Header from './header';
import { useAuth } from '../context/AuthContext';
import Aside from './aside';
import { useAlert } from '../hoooks/useAlert';
import { Alert } from 'reactstrap';

const Template = ({
  children,
  isLoading,
}: {
  children: ReactNode;
  isLoading?: boolean;
  error?: Error;
}) => {
  const { user } = useAuth();
  const { alert, closeAlert } = useAlert();

  if (typeof isLoading !== 'undefined' && isLoading) {
    return (
      <div
        className="w-100 d-flex justify-content-center align-items-center"
        style={{ height: '100vh' }}
      >
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div>
      <Header userName={user?.nome || ''} />

      <main className="container row m-auto">
        {alert.isOpen && (
          <Alert
            color={alert.type}
            toggle={closeAlert}
            className="position-fixed z-2"
            style={{ width: 300, top: 10, right: 10 }}
          >
            <button type="button" className="btn-close" onClick={closeAlert} />
            {alert.message}
          </Alert>
        )}
        <div className="col-6 col-md-3">
          <Aside />
        </div>

        <div className="col-6 col-md-9">{children}</div>
      </main>
    </div>
  );
};

export default Template;
