import { render, screen } from '@testing-library/react';
import ButtonAppBar from '../../components/ButtonAppBar';
import { BrowserRouter } from 'react-router-dom';

test('should have basic buttons', () => {
    render(<BrowserRouter><ButtonAppBar /></BrowserRouter>);
    const homPageBttn = screen.queryByText('HomePage');
    const loginBttn = screen.getByText('Login');
    const tipsBttn = screen.getByText('View All Tips');
    expect(homPageBttn).toBeInTheDocument();
    expect(loginBttn).toBeInTheDocument();
    expect(tipsBttn).toBeInTheDocument();
})