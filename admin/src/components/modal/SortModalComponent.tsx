import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../../utils/api';
import { SortModalLogicWrapper } from './SortModalLogicWrapper';

export const SortModalComponent = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SortModalLogicWrapper />
    </QueryClientProvider>
  );
};
