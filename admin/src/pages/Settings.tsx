import { SettingsPage } from '../components/settings';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../utils/api';

const Settings = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SettingsPage />
    </QueryClientProvider>
  );
};

export default Settings;
