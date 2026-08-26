import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Signup from './pages/Signup';

describe('Signup Component', () => {

    it('renders the register heading', () => {
        render(<BrowserRouter><Signup /></BrowserRouter>);
        expect(screen.getByRole('heading', { name: 'Register' })).toBeInTheDocument();
    });

    it('renders username input', () => {
        render(<BrowserRouter><Signup /></BrowserRouter>);
        const usernameInput = document.querySelector('input[type="text"]');
        expect(usernameInput).toBeInTheDocument();
    });

    it('renders password input', () => {
        render(<BrowserRouter><Signup /></BrowserRouter>);
        const passwordInputs = document.querySelectorAll('input[type="password"]');
        expect(passwordInputs.length).toBe(2);
    });
    it('renders register button', () => {
        render(<BrowserRouter><Signup /></BrowserRouter>);
        expect(screen.getByRole('button', { name: 'Register User' })).toBeInTheDocument();
    });

    it('renders login link', () => {
        render(<BrowserRouter><Signup /></BrowserRouter>);
        expect(screen.getByText(/login/i)).toBeInTheDocument();
    });

    it('renders password rules', () => {
        render(<BrowserRouter><Signup /></BrowserRouter>);
        expect(screen.getByText('At least 8 characters')).toBeInTheDocument();
    });

});