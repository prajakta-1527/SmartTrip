import { render, screen, fireEvent } from '@testing-library/react';
import { Command, CommandDialog, CommandInput, CommandList, CommandItem, CommandEmpty, CommandGroup, CommandSeparator } from '@/components/command';
import '@testing-library/jest-dom';  // for extended matchers like 'toBeInTheDocument'

describe('Command Components', () => {
  it('should render Command correctly', () => {
    render(<Command>Test Command</Command>);
    const command = screen.getByText('Test Command');
    expect(command).toBeInTheDocument();
    expect(command).toHaveClass('flex h-full w-full flex-col overflow-hidden');
  });

  it('should render CommandDialog correctly', () => {
    render(<CommandDialog open={true}>Test Dialog</CommandDialog>);
    const dialogContent = screen.getByText('Test Dialog');
    expect(dialogContent).toBeInTheDocument();
    expect(dialogContent).toHaveClass('overflow-hidden p-0');
  });

  it('should render CommandInput correctly', () => {
    render(<CommandInput placeholder="Search here..." />);
    const input = screen.getByPlaceholderText('Search here...');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('flex h-10 w-full rounded-md');
  });

  it('should render CommandList correctly', () => {
    render(<CommandList><CommandItem>Item 1</CommandItem></CommandList>);
    const item = screen.getByText('Item 1');
    expect(item).toBeInTheDocument();
    expect(item).toHaveClass('relative flex cursor-default gap-2');
  });

  it('should render CommandItem correctly', () => {
    render(<CommandItem>Item 1</CommandItem>);
    const item = screen.getByText('Item 1');
    expect(item).toBeInTheDocument();
    expect(item).toHaveClass('relative flex cursor-default gap-2');
  });

  it('should render CommandEmpty correctly', () => {
    render(<CommandEmpty>No results found</CommandEmpty>);
    const emptyMessage = screen.getByText('No results found');
    expect(emptyMessage).toBeInTheDocument();
    expect(emptyMessage).toHaveClass('py-6 text-center text-sm');
  });

  it('should render CommandGroup correctly', () => {
    render(<CommandGroup><CommandItem>Group Item</CommandItem></CommandGroup>);
    const groupItem = screen.getByText('Group Item');
    expect(groupItem).toBeInTheDocument();
    expect(groupItem).toHaveClass('overflow-hidden p-1 text-foreground');
  });

  it('should render CommandSeparator correctly', () => {
    render(<CommandSeparator />);
    const separator = screen.getByRole('separator');
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveClass('-mx-1 h-px bg-border');
  });

  it('should render CommandShortcut correctly', () => {
    render(<CommandShortcut>Cmd+K</CommandShortcut>);
    const shortcut = screen.getByText('Cmd+K');
    expect(shortcut).toBeInTheDocument();
    expect(shortcut).toHaveClass('ml-auto text-xs tracking-widest text-muted-foreground');
  });
  
  it('should open the CommandDialog on trigger', () => {
    render(
      <CommandDialog open={true}>
        <CommandInput placeholder="Type command" />
        <CommandList>
          <CommandItem>First Item</CommandItem>
          <CommandItem>Second Item</CommandItem>
        </CommandList>
      </CommandDialog>
    );

    const input = screen.getByPlaceholderText('Type command');
    expect(input).toBeInTheDocument();

    const firstItem = screen.getByText('First Item');
    expect(firstItem).toBeInTheDocument();
  });

});
