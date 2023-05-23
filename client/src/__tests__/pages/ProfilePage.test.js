import { render, screen, cleanup } from '@testing-library/react';
import ProfilePage from '../../pages/ProfilePage';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';

afterEach(() => {
    cleanup();
  });

  test('should render profilePage', () =>{
    const queryClient = new QueryClient();
    render(
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <ProfilePage />
            </BrowserRouter>
        </QueryClientProvider>);
    const page = screen.getByTestId('ProfilePage');
    expect(page).toBeInTheDocument();
    expect(page).toHaveTextContent('Profile');
    expect(page).toHaveTextContent('Account Settings');
    const button = screen.queryByText('Change Password');
    const button2 = screen.queryByText('Change Email');
    expect(button).toBeInTheDocument();
    expect(button2).toBeInTheDocument();
});

