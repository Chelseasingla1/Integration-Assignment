// frontend/src/components/__tests__/ConnectionForm.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ConnectionForm from '../ConnectionForm';
import { connectToClickHouse } from '../../services/api';

// Mock the API service
jest.mock('../../services/api');

describe('ConnectionForm', () => {
    it('renders all input fields', () => {
        render(<ConnectionForm />);
        expect(screen.getByLabelText(/host/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/port/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/database/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/user/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/jwt token/i)).toBeInTheDocument();
    });

    it('handles successful connection', async () => {
        connectToClickHouse.mockResolvedValueOnce({ status: 'success' });
        
        render(<ConnectionForm />);
        
        fireEvent.click(screen.getByText(/connect/i));
        
        await waitFor(() => {
            expect(screen.getByText(/connected successfully/i)).toBeInTheDocument();
        });
    });
});