import { ReactNode } from 'react';
import Header from './header';
import { useAuth } from '../context/AuthContext';
import Aside from './aside';

const Template = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  return (
    <div>
      <Header userName={user?.nome || ''} />

      <main className="container row m-auto">
        <div className="col-6 col-md-3">
          <Aside />
        </div>

        <div className="col-6 col-md-9">{children}</div>
      </main>
    </div>
  );
};

export default Template;
