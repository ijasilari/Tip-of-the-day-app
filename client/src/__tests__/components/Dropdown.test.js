import { render, fireEvent, screen } from '@testing-library/react';
import Dropdown from '../../components/Dropdown';

test("should contain categories",() => {
    const categoryOptions = [
        {value: 1, label: "CSS"},
        {value: 2, label: "Java"},
        {value: 3, label: "JavaScript"},
        {value: 4, label: "HTTP"},
        {value: 5, label: "Python"},
        {value: 6, label: "CPP"},
        {value: 7, label: "Dart"},
        {value: 8, label: "Flutter"},
        {value: 9, label: "Rust"},
        {value: 10, label: "Linux"}
      ]
    render(<Dropdown
        isSearchable
        placeHolder="Select..."
        options={categoryOptions}
        onChange={() => console.log("test")}
      />);
    const dropdownButton = screen.getByText('Select...');
    fireEvent.click(dropdownButton);

    const CSS = screen.getByText('CSS');
    fireEvent.click(CSS);
    expect(screen.getByText('CSS')).toBeInTheDocument();
})