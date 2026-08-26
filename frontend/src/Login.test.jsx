import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Login from './pages/Login';

describe('Login Component', () => {

    it('renders the login heading', () => {
        render(<BrowserRouter><Login /></BrowserRouter>);
        expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
    });

    it('renders username input', () => {
        render(<BrowserRouter><Login /></BrowserRouter>);
        expect(screen.getByPlaceholderText('Enter Username')).toBeInTheDocument();
    });

    it('renders password input', () => {
        render(<BrowserRouter><Login /></BrowserRouter>);
        expect(screen.getByPlaceholderText('Enter the Password')).toBeInTheDocument();
    });

    it('renders login button', () => {
        render(<BrowserRouter><Login /></BrowserRouter>);
        expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    });

    it('renders sign up link', () => {
        render(<BrowserRouter><Login /></BrowserRouter>);
        expect(screen.getByText('Sign Up')).toBeInTheDocument();
    });


});