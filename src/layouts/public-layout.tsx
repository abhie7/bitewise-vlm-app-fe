import { Outlet } from 'react-router';

const PublicLayout = () => {
  return (
    <div className="flex h-screen w-full bg-background">
      <Outlet />
    </div>
  );
};

export default PublicLayout;
