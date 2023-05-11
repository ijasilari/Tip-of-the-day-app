import { render, screen, cleanup } from '@testing-library/react';
import Authenticate from '../../pages/Authenticate';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

afterEach(() => {
  cleanup();
});

describe('should render authtenticate page', () => {
    const queryClient = new QueryClient();
    it('renders without crashing', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <Authenticate />
                </BrowserRouter>
            </QueryClientProvider>
        );
        const page = screen.getByTestId('authPage');
        expect(page).toBeInTheDocument();
        expect(page).toHaveTextContent('Login');
    });
});
