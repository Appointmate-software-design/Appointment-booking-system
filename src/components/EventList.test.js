import { render, act, fireEvent } from '@testing-library/react';
import EventList from './EventList';
import { collection as collectionMock, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';


// Mock firebase hooks
jest.mock('react-firebase-hooks/firestore', () => ({
  useCollection: () => ([
    {
      docs: [
        {
          id: '1',
          data: () => ({ title: 'testEvent' }),
        },
      ],
    },
    false,
    undefined,
  ]),
}));

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  useParams: () => ({ id: '1' }),
}));

// Mock react context
jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    currentUser: {
      uid: '1',
    },
  }),
}));

// ...

test('renders successfully and calls firestore functions', async () => {
    // Arrange
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
  
    // Act
    const { findByRole } = render(<EventList />);
  
    const button = await findByRole('button', { name: /Create New Event/i });
    fireEvent.click(button);
  
    // Assert
    expect(mockNavigate).toHaveBeenCalledWith('create-event');
  });
