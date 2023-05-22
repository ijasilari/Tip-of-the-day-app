import { render, waitFor, screen } from '@testing-library/react';
import renderer from "react-test-renderer";
import axiosMock from "axios";
import Card from '../../components/Card';

jest.mock("axios");
jest.useFakeTimers();

describe("Card", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render fetched data", async () => {
    const testData = {
      tip: {
        category: 1,
        description: "Some test data",
      },
    };

    axiosMock.get.mockResolvedValueOnce({ data: testData });

    let component;

    await renderer.act(async () => {
      component = renderer.create(<Card />);
    });
    const tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });
  /*it("fetches new data after 12 seconds", async () => {
    const responseData = {
      data:{
        tip:{
          category: 3,
          description: "This is a new tip.",
        }
      }
    };
    axiosMock.get.mockResolvedValueOnce({data: responseData.data.tip.category });

    const { getByText } = render(<Card />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText("Loading...")).not.toBeInTheDocument());

    expect(screen.getByText("JavaScript")).toBeInTheDocument();
    expect(screen.getByText("This is a new tip.")).toBeInTheDocument();

    const newResponseData = {
      data:{
        tip: {
          category: 5,
          description: "This is another new tip.",
        }
      }
    };
    axiosMock.get.mockResolvedValueOnce({data: newResponseData.data.tip.category });

    jest.advanceTimersByTime(12000);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText("Loading...")).not.toBeInTheDocument());

    expect(screen.getByText("Python")).toBeInTheDocument();
    expect(screen.getByText("This is another tip.")).toBeInTheDocument();
  });*/
});


