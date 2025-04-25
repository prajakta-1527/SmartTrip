import { render, screen, fireEvent } from '@testing-library/react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose } from '@/components/dialog';
import '@testing-library/jest-dom';  // for extended matchers like 'toBeInTheDocument'

describe('Dialog Components', () => {
  it('should render DialogTrigger correctly', () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog description text goes here.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>Close</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    // Check if the trigger button is rendered
    const triggerButton = screen.getByText('Open Dialog');
    expect(triggerButton).toBeInTheDocument();
  });

  it('should open Dialog when Trigger is clicked', () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>Close</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    // Click the DialogTrigger to open the Dialog
    const triggerButton = screen.getByText('Open Dialog');
    fireEvent.click(triggerButton);

    // Check if the DialogContent is rendered
    const dialogTitle = screen.getByText('Dialog Title');
    expect(dialogTitle).toBeInTheDocument();
  });

  it('should close Dialog when Close button is clicked', () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>Close</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    // Click the DialogTrigger to open the Dialog
    const triggerButton = screen.getByText('Open Dialog');
    fireEvent.click(triggerButton);

    // Verify dialog content is displayed
    const dialogTitle = screen.getByText('Dialog Title');
    expect(dialogTitle).toBeInTheDocument();

    // Click the Close button to close the Dialog
    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);

    // Verify dialog content is removed (the dialog should close)
    expect(dialogTitle).not.toBeInTheDocument();
  });

  it('should render DialogHeader and DialogFooter correctly', () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Header</DialogTitle>
            <DialogDescription>This is a description</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>Close</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    const dialogHeader = screen.getByText('Dialog Header');
    const dialogDescription = screen.getByText('This is a description');
    const dialogCloseButton = screen.getByText('Close');

    // Verify if DialogHeader, DialogTitle, DialogDescription, and DialogFooter are rendered
    expect(dialogHeader).toBeInTheDocument();
    expect(dialogDescription).toBeInTheDocument();
    expect(dialogCloseButton).toBeInTheDocument();
  });

  it('should have correct classes for Dialog components', () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>Close</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    const dialogContent = screen.getByText('Dialog Title').closest('div');
    const dialogCloseButton = screen.getByText('Close');

    // Check for correct class names (from the provided Dialog component code)
    expect(dialogContent).toHaveClass('fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg');
    expect(dialogCloseButton).toHaveClass('absolute right-4 top-4 rounded-sm opacity-70');
  });
});
