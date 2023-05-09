import { render, screen } from '@testing-library/react';
import HomePage from '../pages/HomePage';

test('renders learn react link', () => {
  render(<HomePage />);
  const linkElement = screen.getByText(
    "Welcome to TOTD (Tip Of The Day) Application!"
  );
  expect(linkElement).toBeInTheDocument();
});
