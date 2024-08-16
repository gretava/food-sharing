import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ProfileForm, { ProfileFormProps } from './ProfileForm';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: jest.fn(),
  }),
}));

describe('ProfileForm', () => {
  it('fills the form and submits values to the API', async () => {
    const defaultProps: ProfileFormProps = {
      user: {
        id: 1,
        firstname: 'User',
        lastname: 'Name',
        username: 'username',
      },
    };
    render(<ProfileForm {...defaultProps} />);
    screen.logTestingPlaygroundURL();
    expect(1 + 1).toBe(2);
    // todo: the rest of test
  });
});
