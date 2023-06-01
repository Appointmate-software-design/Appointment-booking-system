import { render, act } from '@testing-library/react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where, deleteDoc } from "firebase/firestore";
import RescheduleBooking from './RescheduleBooking';

//mock the router

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

//mock firestore database

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  deleteDoc: jest.fn(),
}));

jest.mock('../firebase', () => ({
  db: {},
}));

describe('RescheduleBooking', () => {
  //test to see if renders correctly and calls correct functions to the database
  it('renders successfully and calls firestore functions', async () => {
    const mockCancelId = '12345';
    const mockEventId = '67890';
    useParams.mockReturnValue({ cancelId: mockCancelId, eventId: mockEventId });

    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    getDocs.mockReturnValue({
      docs: [{ ref: 'mockRef1' }, { ref: 'mockRef2' }],
    });

    await act(async () => {
      render(<RescheduleBooking />);
    });

    expect(collection).toHaveBeenCalledWith(expect.anything(), 'bookedEvents');
    expect(where).toHaveBeenCalledWith('cancelId', '==', mockCancelId);
    expect(query).toHaveBeenCalled();
    expect(getDocs).toHaveBeenCalled();
    expect(deleteDoc).toHaveBeenCalledTimes(2); // Called once for each document
    expect(mockNavigate).toHaveBeenCalledWith(`/events/${mockEventId}`);
  });
});



