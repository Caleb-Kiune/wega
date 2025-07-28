import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FormField } from '../forms/form-field';

describe('FormField', () => {
  const defaultProps = {
    label: 'Test Field',
    name: 'test',
    value: '',
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Text Input', () => {
    it('renders with proper accessibility attributes', () => {
      render(<FormField {...defaultProps} type="text" />);
      
      const input = screen.getByRole('textbox', { name: /test field/i });
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('id', 'test-field');
      expect(input).toHaveAttribute('name', 'test');
      expect(input).toHaveAttribute('aria-describedby');
    });

    it('shows error message when error is provided', () => {
      render(
        <FormField 
          {...defaultProps} 
          type="text" 
          error="This field is required" 
          touched={true}
        />
      );
      
      expect(screen.getByText('This field is required')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('calls onChange when value changes', () => {
      const onChange = jest.fn();
      render(<FormField {...defaultProps} type="text" onChange={onChange} />);
      
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'new value' } });
      
      expect(onChange).toHaveBeenCalledWith('new value');
    });

    it('calls onBlur when field loses focus', () => {
      const onBlur = jest.fn();
      render(<FormField {...defaultProps} type="text" onBlur={onBlur} />);
      
      const input = screen.getByRole('textbox');
      fireEvent.blur(input);
      
      expect(onBlur).toHaveBeenCalled();
    });

    it('shows required indicator when required is true', () => {
      render(<FormField {...defaultProps} type="text" required />);
      
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('is disabled when disabled prop is true', () => {
      render(<FormField {...defaultProps} type="text" disabled />);
      
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });
  });

  describe('Password Input', () => {
    it('renders password toggle button when showPasswordToggle is true', () => {
      render(
        <FormField 
          {...defaultProps} 
          type="password" 
          showPasswordToggle 
        />
      );
      
      const toggleButton = screen.getByRole('button', { name: /show password/i });
      expect(toggleButton).toBeInTheDocument();
    });

    it('toggles password visibility when toggle button is clicked', () => {
      render(
        <FormField 
          {...defaultProps} 
          type="password" 
          showPasswordToggle 
        />
      );
      
      const input = screen.getByRole('textbox');
      const toggleButton = screen.getByRole('button', { name: /show password/i });
      
      expect(input).toHaveAttribute('type', 'password');
      
      fireEvent.click(toggleButton);
      expect(input).toHaveAttribute('type', 'text');
      expect(screen.getByRole('button', { name: /hide password/i })).toBeInTheDocument();
      
      fireEvent.click(toggleButton);
      expect(input).toHaveAttribute('type', 'password');
    });
  });

  describe('Checkbox', () => {
    it('renders checkbox with proper accessibility', () => {
      render(<FormField {...defaultProps} type="checkbox" />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toHaveAttribute('id', 'test-field');
    });

    it('calls onChange when checkbox is clicked', () => {
      const onChange = jest.fn();
      render(
        <FormField 
          {...defaultProps} 
          type="checkbox" 
          value={false}
          onChange={onChange} 
        />
      );
      
      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);
      
      expect(onChange).toHaveBeenCalledWith(true);
    });
  });

  describe('Select', () => {
    const options = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
    ];

    it('renders select with options', () => {
      render(
        <FormField 
          {...defaultProps} 
          type="select" 
          options={options}
        />
      );
      
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
    });

    it('calls onChange when option is selected', () => {
      const onChange = jest.fn();
      render(
        <FormField 
          {...defaultProps} 
          type="select" 
          options={options}
          onChange={onChange}
        />
      );
      
      const select = screen.getByRole('combobox');
      fireEvent.click(select);
      
      const option = screen.getByText('Option 1');
      fireEvent.click(option);
      
      expect(onChange).toHaveBeenCalledWith('option1');
    });
  });

  describe('Textarea', () => {
    it('renders textarea with proper attributes', () => {
      render(<FormField {...defaultProps} type="textarea" rows={5} />);
      
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeInTheDocument();
      expect(textarea).toHaveAttribute('rows', '5');
    });
  });

  describe('Error Handling', () => {
    it('applies error styles when error is present', () => {
      render(
        <FormField 
          {...defaultProps} 
          type="text" 
          error="Error message" 
          touched={true}
        />
      );
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-red-500');
    });

    it('does not show error when touched is false', () => {
      render(
        <FormField 
          {...defaultProps} 
          type="text" 
          error="Error message" 
          touched={false}
        />
      );
      
      expect(screen.queryByText('Error message')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <FormField 
          {...defaultProps} 
          type="text" 
          error="Error message" 
          touched={true}
        />
      );
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-describedby');
    });

    it('has proper label association', () => {
      render(<FormField {...defaultProps} type="text" />);
      
      const label = screen.getByText('Test Field');
      const input = screen.getByRole('textbox');
      
      expect(label).toHaveAttribute('for', 'test-field');
      expect(input).toHaveAttribute('id', 'test-field');
    });

    it('has proper error association', () => {
      render(
        <FormField 
          {...defaultProps} 
          type="text" 
          error="Error message" 
          touched={true}
        />
      );
      
      const input = screen.getByRole('textbox');
      const error = screen.getByRole('alert');
      
      expect(input).toHaveAttribute('aria-describedby', 'test-error');
      expect(error).toHaveAttribute('id', 'test-error');
    });
  });
}); 