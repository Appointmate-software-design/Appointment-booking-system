import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ConfirmBookingView from "./ConfirmBookingView";
import { useDocumentData } from "react-firebase-hooks/firestore";
import EventDaySelection from "./EventDaySelection";
import { auth } from "../firebase";

jest.mock("react-firebase-hooks/firestore", () => ({
  useDocumentData: jest.fn(),
}));

jest.mock("./EventDaySelection", () => {
  return {
    __esModule: true,
    default: jest.fn(() => <div data-testid="event-day-selection-mock" />),
  };
});

jest.mock("../firebase", () => ({
  auth: {
    currentUser: {
      uid: "test-uid",
    },
  },
}));

describe("ConfirmBookingView", () => {
  it("renders loading state", () => {
    useDocumentData.mockReturnValue([null, true, null]);

    render(<ConfirmBookingView />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders error state", async () => {
    useDocumentData.mockReturnValue([null, false, new Error("Test error")]);

    render(<ConfirmBookingView />);

    await waitFor(() => screen.getByText("there was an error getting event"));
  });

  it("handles successful booking", async () => {
    useDocumentData.mockReturnValue([
      {
        title: "Test Event",
        description: "Test Description",
        duration: 60,
        startDate: "2023-04-20",
        endDate: "2023-04-30",
        checkedDays: [
          {
            day: "Monday",
            startTime: "10:00",
            endTime: "18:00",
          },
        ],
      },
      false,
      null,
    ]);

    render(<ConfirmBookingView />);

    await waitFor(() => screen.getByText("Test Event"));

    // Simulate user interactions
    fireEvent.change(screen.getByLabelText("Email:"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText("Name:"), { target: { value: "John" } });

    fireEvent.click(screen.getByText("no date selected"));

    const eventDaySelectionMock = screen.getByTestId("event-day-selection-mock");
    fireEvent.change(eventDaySelectionMock, { target: { value: new Date("2023-04-24") } });

    const timeSlotCheckbox = screen.getByLabelText("10:00-11:00");
    fireEvent.click(timeSlotCheckbox);

    const confirmBookingButton = screen.getByText("Confirm booking");
    fireEvent.click(confirmBookingButton);

    await waitFor(() => screen.getByText("Booking successful!"));
  });

  it("handles unsuccessful booking due to invalid email", async () => {
    useDocumentData.mockReturnValue([
      {
        title: "Test Event",
        description: "Test Description",
        duration: 60,
        startDate: "2023-04-20",
        endDate: "2023-04-30",
        checkedDays: [
          {
            day: "Monday",
            startTime: "10:00",
            endTime: "18:00",
          },
        ],
      },
      false,
      null,
    ]);

    render(<ConfirmBookingView />);

    await waitFor(() => screen.getByText("Test Event"));

    // Simulate user interactions
    fireEvent.change(screen.getByLabelText("Email:"), { target: { value: "invalid-email" } });
    fireEvent.change(screen.getByLabelText("Name:"), { target: { value: "John" } });

    fireEvent.click(screen.getByText("no date selected"));

    const eventDaySelectionMock = screen.getByTestId("event-day-selection-mock");
    fireEvent.change(eventDaySelectionMock, { target: { value: new Date("2023-04-24") } });

    const timeSlotCheckbox = screen.getByLabelText("10:00-11:00");
    fireEvent.click(timeSlotCheckbox);

    const confirmBookingButton = screen.getByText("Confirm booking");
    fireEvent.click(confirmBookingButton);

    await waitFor(() => screen.getByText("Invalid email address."));
  });
});

