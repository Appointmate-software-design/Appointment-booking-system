import React from 'react';
import { render, act } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs } from "firebase/firestore";
import CancelBooking from './CancelBooking';

// mock the router dom
jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}));

//mock of the database
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
  deleteDoc: jest.fn(),
}));

// Mock the module that uses firebase/firestore
jest.mock('../firebase', () => ({
  db: {},
}));

describe('CancelBooking', () => {
  //test to see if component renders correctly and calls correct functions to the database.
  it('renders successfully and calls firestore functions', async () => {
    const mockCancelId = '12345';
    useParams.mockReturnValue({ cancelId: mockCancelId });

    getDocs.mockReturnValue({
      forEach: (callback) => {
        callback({ ref: 'mockRef' });
      },
    });

    await act(async () => {
      render(<CancelBooking />);
    });

    expect(collection).toHaveBeenCalledWith(expect.anything(), 'bookedEvents');
    expect(where).toHaveBeenCalledWith('cancelId', '==', mockCancelId);
    expect(query).toHaveBeenCalled();
    expect(getDocs).toHaveBeenCalled();
  });
});
