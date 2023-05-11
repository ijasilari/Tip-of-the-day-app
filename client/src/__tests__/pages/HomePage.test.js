import { render, screen, cleanup } from '@testing-library/react';
import HomePage from '../../pages/HomePage';

afterEach(() => {
  cleanup();
});

test('should render homePage', () => {
  render(<HomePage />);
  const homePage = screen.getByTestId('homePage');
  expect(homePage).toBeInTheDocument();
  expect(homePage).toHaveTextContent('Welcome to TOTD (Tip Of The Day) Application!');
});

