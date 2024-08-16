import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
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

    // this is very convenient for testing:
    // more info: https://testing-library.com/docs/dom-testing-library/api-debugging/#screenlogtestingplaygroundurl
    screen.logTestingPlaygroundURL();

    // todo: the rest of test
  });
});
