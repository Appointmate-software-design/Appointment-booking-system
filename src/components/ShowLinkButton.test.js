// Importing necessary modules
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ShowLinkButton from './ShowLinkButton';

// Test suite for ShowLinkButton component
describe('ShowLinkButton', () => {
  const eventData = {
    id: 'eventID',
  };

  // Testing if the Show Link button is rendered
  test('renders Show Link button', () => {
    render(<ShowLinkButton eventData={eventData} />);
    const showLinkButton = screen.getByText(/Show Link/i);
    expect(showLinkButton).toBeInTheDocument();
  });

  // Testing if the link display and buttons are displayed when Show Link is clicked
  test('displays link and buttons when Show Link is clicked', () => {
    render(<ShowLinkButton eventData={eventData} />);
    const showLinkButton = screen.getByText(/Show Link/i);
    fireEvent.click(showLinkButton);

    const linkText = screen.getByText(`http://localhost:3000/${eventData.id}`);
    const copyLinkButton = screen.getByText(/Copy Link/i);
    const hideLinkButton = screen.getByText(/Hide Link/i);

    expect(linkText).toBeInTheDocument();
    expect(copyLinkButton).toBeInTheDocument();
    expect(hideLinkButton).toBeInTheDocument();
  });

  // Testing if the link display and buttons are hidden when Hide Link is clicked
  test('hides link and buttons when Hide Link is clicked', () => {
    render(<ShowLinkButton eventData={eventData} />);
    const showLinkButton = screen.getByText(/Show Link/i);
    fireEvent.click(showLinkButton);

    const hideLinkButton = screen.getByText(/Hide Link/i);
    fireEvent.click(hideLinkButton);

    expect(screen.queryByText(`http://localhost:3000/${eventData.id}`)).not.toBeInTheDocument();
    expect(screen.queryByText(/Copy Link/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Hide Link/i)).not.toBeInTheDocument();
  });

  // You can mock the navigator.clipboard.writeText function to test the copy link functionality
});
