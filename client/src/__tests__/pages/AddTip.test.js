import { render, screen } from '@testing-library/react';
import AddTip from '../../pages/AddTip';

test('should render AddTip page', () =>{
    render(<AddTip />);
    const page = screen.getByTestId('addTipPage');
    expect(page).toBeInTheDocument();
    expect(page).toHaveTextContent('Add New Tip To The List');
    expect(page).toHaveTextContent('Attention!');
    expect(page).toHaveTextContent('This page supports markdown and syntax highlight code. To create codeblock with highlight write:');
    screen.getByRole('button', { name: /add new tip/i });
})