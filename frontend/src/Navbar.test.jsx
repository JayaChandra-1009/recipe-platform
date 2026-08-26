import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Navbar from './components/Navbar';

describe('Navbar Component', () => {

    it('renders Recipe Platform brand', () => {
        render(<BrowserRouter><Navbar /></BrowserRouter>);
        expect(screen.getByText('Recipe Platform')).toBeInTheDocument();
    });

    it('renders Dashboard link', () => {
        render(<BrowserRouter><Navbar /></BrowserRouter>);
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('renders My Recipes link', () => {
        render(<BrowserRouter><Navbar /></BrowserRouter>);
        expect(screen.getByText('My Recipes')).toBeInTheDocument();
    });

    it('renders My Cookbooks link', () => {
        render(<BrowserRouter><Navbar /></BrowserRouter>);
        expect(screen.getByText('My Cookbooks')).toBeInTheDocument();
    });

    it('renders Logout button', () => {
        render(<BrowserRouter><Navbar /></BrowserRouter>);
        expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument();
    });

});