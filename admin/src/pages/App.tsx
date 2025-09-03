import { Page } from '@strapi/strapi/admin';
import { Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <Routes>
      <Route path="*" element={<Page.Error />} />
    </Routes>
  );
};

export { App };
