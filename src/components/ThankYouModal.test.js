import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ThankYouModal from './ThankYouModal';

describe('ThankYouModal', () => {
  const email = 'test@example.com';
  const onClose = jest.fn();

  test('renders nothing when isOpen is false', () => {
    // Render the ThankYouModal component with isOpen set to false
    render(<ThankYouModal isOpen={false} onClose={onClose} email={email} />);
    // Use screen.queryByText to check that "Booking Confirmed" text is not present
    expect(screen.queryByText('Booking Confirmed')).not.toBeInTheDocument();
  });

  test('renders modal when isOpen is true', () => {
    // Render the ThankYouModal component with isOpen set to true
    render(<ThankYouModal isOpen={true} onClose={onClose} email={email} />);
    // Use screen.getByText to check that "Booking Confirmed" text is present
    expect(screen.getByText('Booking Confirmed')).toBeInTheDocument();
    // Use screen.getByText with a function to check that the email text is present
    expect(screen.getByText((_, node) => {
        const hasText = (n) => n.textContent === `Thank you for booking with ${email}.`;
        const nodeHasText = hasText(node);
        const childrenDontHaveText = Array.from(node.children).every(
          (child) => !hasText(child)
        );
      
        return nodeHasText && childrenDontHaveText;
      })).toBeInTheDocument();
    // Use screen.getByText to check that the email details text is present
    expect(screen.getByText(/An email will be sent to you with the details of your booking./)).toBeInTheDocument();
  });

  test('calls onClose when Close button is clicked', () => {
    // Render the ThankYouModal component with isOpen set to true
    render(<ThankYouModal isOpen={true} onClose={onClose} email={email} />);
    // Use screen.getByText to get the Close button element
    const closeButton = screen.getByText('Close');
    // Fire a click event on the Close button
    fireEvent.click(closeButton);
    // Expect onClose to have been called
    expect(onClose).toHaveBeenCalled();
  });
});
