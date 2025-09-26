// tests/formValidation.test.ts
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SubmissionForm from '@/components/SubmissionForm';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock react-hook-form's useForm hook for more predictable testing
jest.mock('react-hook-form', () => ({
  useForm: () => ({
    handleSubmit: (fn: any) => (e: any) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const interests = formData.getAll('interests') as string[];
      const resumeText = formData.get('resumeText') as string;
      
      // Validate form data
      if (interests.length === 0 && (!resumeText || resumeText.trim().length === 0)) {
        return; // Don't submit if validation fails
      }
      
      fn({ interests, resumeText });
    },
    formState: { errors: {} },
    setValue: jest.fn(),
    clearErrors: jest.fn(),
    register: () => ({}),
  }),
}));

describe('SubmissionForm Validation', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('should show validation error when no fields are provided', async () => {
    render(<SubmissionForm onSubmit={mockOnSubmit} isLoading={false} />);
    
    const submitButton = screen.getByRole('button', { name: /generate my missions/i });
    
    // Button should be disabled when no input is provided
    expect(submitButton).toBeDisabled();
  });

  it('should enable submit button when interests are selected', async () => {
    render(<SubmissionForm onSubmit={mockOnSubmit} isLoading={false} />);
    
    // Select an interest
    const frontendButton = screen.getByRole('button', { name: /frontend development/i });
    fireEvent.click(frontendButton);
    
    const submitButton = screen.getByRole('button', { name: /generate my missions/i });
    
    // Button should be enabled after selecting an interest
    expect(submitButton).not.toBeDisabled();
  });

  it('should enable submit button when resume text is provided', async () => {
    render(<SubmissionForm onSubmit={mockOnSubmit} isLoading={false} />);
    
    // Fill in resume text
    const resumeTextarea = screen.getByLabelText(/resume or background/i);
    fireEvent.change(resumeTextarea, { 
      target: { value: 'I am a software engineer with 3 years of experience in React and Node.js' } 
    });
    
    const submitButton = screen.getByRole('button', { name: /generate my missions/i });
    
    // Button should be enabled after providing resume text
    expect(submitButton).not.toBeDisabled();
  });

  it('should call onSubmit with interests when form is submitted with interests', async () => {
    render(<SubmissionForm onSubmit={mockOnSubmit} isLoading={false} />);
    
    // Select interests
    const frontendButton = screen.getByRole('button', { name: /frontend development/i });
    const backendButton = screen.getByRole('button', { name: /backend development/i });
    
    fireEvent.click(frontendButton);
    fireEvent.click(backendButton);
    
    const submitButton = screen.getByRole('button', { name: /generate my missions/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        interests: expect.arrayContaining(['Frontend Development', 'Backend Development']),
        resumeText: undefined
      });
    });
  });

  it('should call onSubmit with resume text when form is submitted with resume', async () => {
    render(<SubmissionForm onSubmit={mockOnSubmit} isLoading={false} />);
    
    const resumeText = 'I am a software engineer with 3 years of experience in React and Node.js';
    
    // Fill in resume text
    const resumeTextarea = screen.getByLabelText(/resume or background/i);
    fireEvent.change(resumeTextarea, { target: { value: resumeText } });
    
    const submitButton = screen.getByRole('button', { name: /generate my missions/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        interests: undefined,
        resumeText: resumeText
      });
    });
  });

  it('should call onSubmit with both interests and resume text when both are provided', async () => {
    render(<SubmissionForm onSubmit={mockOnSubmit} isLoading={false} />);
    
    const resumeText = 'I am a software engineer with 3 years of experience';
    
    // Select an interest
    const frontendButton = screen.getByRole('button', { name: /frontend development/i });
    fireEvent.click(frontendButton);
    
    // Fill in resume text
    const resumeTextarea = screen.getByLabelText(/resume or background/i);
    fireEvent.change(resumeTextarea, { target: { value: resumeText } });
    
    const submitButton = screen.getByRole('button', { name: /generate my missions/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        interests: ['Frontend Development'],
        resumeText: resumeText
      });
    });
  });

  it('should limit interest selection to 5 items', async () => {
    render(<SubmissionForm onSubmit={mockOnSubmit} isLoading={false} />);
    
    // Try to select 6 interests
    const interestButtons = [
      'Frontend Development',
      'Backend Development', 
      'Full Stack Development',
      'Mobile Development',
      'Data Science',
      'Machine Learning' // This should be disabled after 5 selections
    ];
    
    // Select first 5 interests
    for (let i = 0; i < 5; i++) {
      const button = screen.getByRole('button', { name: new RegExp(interestButtons[i], 'i') });
      fireEvent.click(button);
    }
    
    // 6th button should be disabled
    const sixthButton = screen.getByRole('button', { name: /machine learning/i });
    expect(sixthButton).toBeDisabled();
  });

  it('should show loading state when isLoading is true', () => {
    render(<SubmissionForm onSubmit={mockOnSubmit} isLoading={true} />);
    
    // All interest buttons should be disabled during loading
    const frontendButton = screen.getByRole('button', { name: /frontend development/i });
    expect(frontendButton).toBeDisabled();
    
    // Submit button should show loading state
    const submitButton = screen.getByRole('button', { name: /generate my missions/i });
    expect(submitButton).toBeDisabled();
  });
});