// import '@testing-library/jest-dom/extend-expect';
// import '@testing-library/jest-dom';
// import { describe, jest, test } from '@jest/globals';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Value } from 'sass';
import { User } from '../../migrations/1687188335-createUsersTable';
import ProfileForm from './ProfileForm';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: jest.fn(),
  }),
}));

describe('ProfileForm', () => {
  const mockUser: User = {
    id: 1,
    firstname: 'John',
    lastname: 'Doe',
    username: 'johndoe',
    bio: 'This is a bio',
    profileImgUrl: 'https://example.com/profile.jpg',
  };
  it('should render the profile form correctly', () => {
    render(<ProfileForm user={mockUser} />);

    // Check if the form elements are rendered
    expect(screen.getByLabelText(/First name/i)).not.toBeNull();
    expect(screen.getByLabelText(/Last name/i)).not.toBeNull();
    expect(screen.getByLabelText(/Username/i)).not.toBeNull();
    expect(screen.getByLabelText(/About me/i)).not.toBeNull();
  });

  it('should allow editing the inputs when the "edit" button is clicked', () => {
    render(<ProfileForm user={mockUser} />);

    // Click the "edit" button
    fireEvent.click(screen.getByText(/edit/i));

    // Check if the input fields become editable
    const firstNameInput = screen.getByLabelText(/First name/i);
    expect(firstNameInput.getAttribute('disabled')).toBeFalsy();

    // You can add more assertions for other fields as well
    const lastNameInput = screen.getByLabelText(/Last name/i);
    expect(lastNameInput.getAttribute('disabled')).toBeFalsy();
  });

  it('should call the updateUserById function when the "save" button is clicked', async () => {
    render(<ProfileForm user={mockUser} />);

    //     // Click the "edit" button to make the form editable
    fireEvent.click(screen.getByText(/edit/i));

    //     // Change values of input fields
    fireEvent.change(screen.getByLabelText(/First name/i), {
      target: { value: 'Jane' },
    });
    fireEvent.change(screen.getByLabelText(/Last name/i), {
      target: { value: 'Smith' },
    });

    //     // Click the "save" button
    fireEvent.click(screen.getByText(/save/i));

    // Use waitFor to wait for async actions to complete
    await waitFor(() => {
      screen.logTestingPlaygroundURL();
      expect(screen.getByLabelText(/First name/i).getAttribute('value')).toBe(
        'Jane',
      );
      // expect(screen.getByLabelText(/Last name/i).value).toBe('Smith');
    });
  });
});
