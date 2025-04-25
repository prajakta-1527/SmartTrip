import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/button';  // adjust the path according to your project structure
import '@testing-library/jest-dom';  // for extended matchers like 'toBeInTheDocument'

describe('Button Component', () => {
  it('should render a button with the default variant and size', () => {
    render(<Button>Default Button</Button>);
    
    const button = screen.getByText('Default Button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary');
    expect(button).toHaveClass('h-9');
  });

  it('should render a button with the destructive variant', () => {
    render(<Button variant="destructive">Destructive Button</Button>);
    
    const button = screen.getByText('Destructive Button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-destructive');
  });

  it('should render a button with the outline variant', () => {
    render(<Button variant="outline">Outline Button</Button>);
    
    const button = screen.getByText('Outline Button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('border-input');
  });

  it('should render a button with the icon size', () => {
    render(<Button size="icon">Icon Button</Button>);
    
    const button = screen.getByText('Icon Button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('h-9');
    expect(button).toHaveClass('w-9');
  });

  it('should render a button with the link variant', () => {
    render(<Button variant="link">Link Button</Button>);
    
    const button = screen.getByText('Link Button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('text-primary');
  });

  it('should call the onClick function when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Clickable Button</Button>);
    
    const button = screen.getByText('Clickable Button');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should render as a child component when asChild is true', () => {
    render(
      <Button asChild>
        <span>Child Button</span>
      </Button>
    );
    
    const span = screen.getByText('Child Button');
    expect(span).toBeInTheDocument();
  });

  it('should disable the button when the disabled prop is passed', () => {
    render(<Button disabled>Disabled Button</Button>);
    
    const button = screen.getByText('Disabled Button');
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });
});
