import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Title from './Title';
import renderer from 'react-test-renderer';

describe('Title component', () => {
  beforeEach(() => {
    render(<Title />);
  });

  test('renders the Appointmate text', () => {
    const titleElement = screen.getByText(/appointmate/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders the Appointmate logo', () => {
    const logoElement = screen.getByAltText(/Appointmate Logo/i);
    expect(logoElement).toBeInTheDocument();
    expect(logoElement).toHaveAttribute('src', expect.stringContaining('logo-appointmate.png'));
  });

  test('Appointmate text has gradient style', () => {
    const titleComponent = renderer.create(<Title />).toJSON();
    expect(titleComponent).toMatchSnapshot();
  });
});
