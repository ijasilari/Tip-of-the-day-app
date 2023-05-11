import { render, screen, cleanup } from '@testing-library/react';
import ViewTips from '../../pages/ViewTips';

afterEach(() => {
    cleanup();
  });

test('should render viewTips page', () =>{
    render(<ViewTips />);
    const page = screen.getByTestId('viewTipsPage');
    expect(page).toBeInTheDocument();
    expect(page).toHaveTextContent('Description');
    expect(page).toHaveTextContent('Tip');
    expect(page).toHaveTextContent('Functions');
});

test('on initial render there should not be buttons', () => {
  render(<ViewTips />);
  const button = screen.queryByText('Edit');
  const button2 = screen.queryByText('Delete');
  expect(button).not.toBeInTheDocument();
  expect(button2).not.toBeInTheDocument();
})