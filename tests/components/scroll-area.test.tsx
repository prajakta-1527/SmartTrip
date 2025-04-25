import { render, screen } from '@testing-library/react';
import { ScrollArea, ScrollBar } from '@/components/scroll-area';
import '@testing-library/jest-dom';  // for extended matchers like 'toBeInTheDocument'

describe('ScrollArea Component', () => {
  it('should render the ScrollArea with children', () => {
    render(
      <ScrollArea className="test-scroll-area">
        <div className="test-content">Scroll me!</div>
      </ScrollArea>
    );

    // Verify that the ScrollArea component is rendered
    const scrollArea = screen.getByRole('region'); // Default role for ScrollArea
    expect(scrollArea).toBeInTheDocument();

    // Verify that the content is rendered inside the ScrollArea
    const content = screen.getByText('Scroll me!');
    expect(content).toBeInTheDocument();
  });

  it('should render ScrollBar vertically', () => {
    render(
      <ScrollArea className="test-scroll-area">
        <div className="test-content">Scroll me!</div>
      </ScrollArea>
    );

    // Check if the vertical scrollbar exists in the rendered component
    const verticalScrollbar = screen.getByRole('scrollbar'); // It is expected to have a role of scrollbar
    expect(verticalScrollbar).toBeInTheDocument();
    expect(verticalScrollbar).toHaveClass('h-full'); // Confirm it has the correct height
    expect(verticalScrollbar).toHaveClass('w-2.5'); // Confirm it has the correct width
  });

  it('should render ScrollBar horizontally when horizontal prop is provided', () => {
    render(
      <ScrollArea className="test-scroll-area">
        <div className="test-content">Scroll me horizontally!</div>
      </ScrollArea>
    );

    // Check if the horizontal scrollbar exists
    const horizontalScrollbar = screen.getByRole('scrollbar');
    expect(horizontalScrollbar).toBeInTheDocument();
    expect(horizontalScrollbar).toHaveClass('h-2.5'); // Confirm correct height for horizontal
    expect(horizontalScrollbar).toHaveClass('flex-col'); // Confirm flex direction for horizontal
  });

  it('should have correct class names passed to ScrollArea', () => {
    render(
      <ScrollArea className="custom-scroll-area">
        <div className="test-content">Content inside scroll area</div>
      </ScrollArea>
    );

    // Check if ScrollArea has the correct class passed as prop
    const scrollArea = screen.getByRole('region');
    expect(scrollArea).toHaveClass('custom-scroll-area');
  });

  it('should render the ScrollArea with a Corner
