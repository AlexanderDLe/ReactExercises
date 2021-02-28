import { Login } from './login';
import ReactDOM from 'react-dom';
import React from 'react';
import { fireEvent, waitForElement } from '@testing-library/react';
import { LoginService } from './services/LoginService';

describe('Login Test Suite', () => {
    let container: HTMLDivElement;
    const loginServiceSpy = jest.spyOn(LoginService.prototype, 'login');

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        ReactDOM.render(<Login />, container);
    });

    afterEach(() => {
        document.body.removeChild(container);
        container.remove();
    });

    it('Renders correctly initial document with data-test query', () => {
        const form = container.querySelector('[data-test="login-form"]');
        const login = container.querySelector('[data-test="login-input"]');
        const password = container.querySelector(
            '[data-test="password-input"]'
        );
        const submit = container.querySelector('[data-test="submit-button"]');

        expect(form).toBeInTheDocument();
        expect(login).toBeInTheDocument();
        expect(password).toBeInTheDocument();
        expect(submit).toBeInTheDocument();

        expect(login?.getAttribute('name')).toBe('login');
        expect(password?.getAttribute('name')).toBe('password');
    });

    it('Passes credentials correctly', () => {
        const login = container.querySelector('[data-test="login-input"]');
        const submit = container.querySelector('[data-test="submit-button"]');
        const password = container.querySelector(
            '[data-test="password-input"]'
        );

        fireEvent.change(login as Node, { target: { value: 'someUser' } });
        fireEvent.change(password as Node, { target: { value: 'somePass' } });
        fireEvent.click(submit as Node);
        expect(loginServiceSpy).toBeCalledWith('someUser', 'somePass');
    });

    it('Renders label correctly - invalid login', async () => {
        const inputs = container.querySelectorAll('input');
        const submit = inputs[2];
        fireEvent.click(submit);
        const statusLabel = await waitForElement(() => {
            container.querySelector('label');
        });
        //
        expect(statusLabel).toBeInTheDocument();
    });
});
