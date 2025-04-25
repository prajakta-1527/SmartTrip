import { render, screen, fireEvent } from '@testing-library/react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/popover';
import '@testing-library/jest-dom';  // for extended matchers like 'toBeInTheDocument'

describe('Popover Components', () => {
  it('should render PopoverTrigger correctly', () => {
    render(
      <Popover>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent>
          <div>Popover content</div>
        </PopoverContent>
      </Popover>
    );

    // Check if PopoverTrigger is rendered correctly
    const triggerButton = screen.getByText('Open Popover');
    expect(triggerButton).toBeInTheDocument();
  });

  it('should open Popover when PopoverTrigger is clicked', () => {
    render(
      <Popover>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent>
          <div>Popover content</div>
        </PopoverContent>
      </Popover>
    );

    // Click the PopoverTrigger to open the Popover
    const triggerButton = screen.getByText('Open Popover');
    fireEvent.click(triggerButton);

    // Check if PopoverContent is rendered
    const popoverContent = screen.getByText('Popover content');
    expect(popoverContent).toBeInTheDocument();
  });

  it('should close Popover when PopoverTrigger is clicked again', () => {
    render(
      <Popover>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent>
          <div>Popover content</div>
        </PopoverContent>
      </Popover>
    );

    // Click to open the Popover
    const triggerButton = screen.getByText('Open Popover');
    fireEvent.click(triggerButton);

    // Verify if PopoverContent is displayed
    const popoverContent = screen.getByText('Popover content');
    expect(popoverContent).toBeInTheDocument();

    // Click again to close the Popover
    fireEvent.click(triggerButton);

    // Verify if PopoverContent is not displayed
    expect(popoverContent).not.toBeInTheDocument();
  });

  it('should render PopoverContent with correct classes', () => {
    render(
      <Popover>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent className="test-class">
          <div>Popover content</div>
        </PopoverContent>
      </Popover>
    );

    // Trigger the Popover to open
    const triggerButton = screen.getByText('Open Popover');
    fireEvent.click(triggerButton);

    // Verify that the PopoverContent contains the correct class
    const popoverContent = screen.getByText('Popover content').closest('div');
    expect(popoverContent).toHaveClass('test-class');
  });

  it('should render PopoverContent with correct align and sideOffset props', () => {
    render(
      <Popover>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent align="end" sideOffset={8}>
          <div>Popover content</div>
        </PopoverContent>
      </Popover>
    );

    // Trigger the Popover to open
    const triggerButton = screen.getByText('Open Popover');
    fireEvent.click(triggerButton);

    // Check if PopoverContent is rendered and has correct props
    const popoverContent = screen.getByText('Popover content').closest('div');
    expect(popoverContent).toHaveAttribute('data-[align="end"]');
    expect(popoverContent).toHaveAttribute('data-[sideoffset="8"]');
  });
});
