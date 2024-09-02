// // import '@testing-library/jest-dom/extend-expect';
// import '@testing-library/jest-dom';
// import { describe, jest, test } from '@jest/globals';
// import { render, screen } from '@testing-library/react';
// import React from 'react';
// import ProfileForm from './ProfileForm';

// jest.mock('next/navigation', () => ({
//   useRouter() {
//     return {
//       refresh: jest.fn(),
//       prefetch: () => null,
//     };
//   },
// }));

// // Mock user data
// const mockUser = {
//   id: 1,
//   firstname: 'Jane',
//   lastname: 'Doe',
//   username: 'janedoe',
//   bio: 'Developer',
//   profileImgUrl: '',
// };

// describe('ProfileForm', () => {
//   test('submits correct values to API', () => {
//     render(<ProfileForm user={mockUser} />);
//     screen.logTestingPlaygroundURL();
//     const editBtn = screen.getByRole('button', { name: /edit/i });
//   });
// });
