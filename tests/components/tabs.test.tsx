import { render, screen, fireEvent } from '@testing-library/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/tabs';
import '@testing-library/jest-dom';  // for extended matchers like 'toBeInTheDocument'

describe('Tabs Component', () => {
  it('should render Tabs with correct children', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content for Tab 1</TabsContent>
        <TabsContent value="tab2">Content for Tab 2</TabsContent>
      </Tabs>
    );

    // Verify that the Tabs component is rendered
    const tab1 = screen.getByText('Tab 1');
    const tab2 = screen.getByText('Tab 2');
    const content1 = screen.getByText('Content for Tab 1');
    const content2 = screen.getByText('Content for Tab 2');

    // Ensure the Tab 1 is visible by default (as it is the default value)
    expect(tab1).toBeInTheDocument();
    expect(content1).toBeInTheDocument();
    expect(tab2).toBeInTheDocument();
    expect(content2).toBeInTheDocument();
  });

  it('should change tab content when a different tab is clicked', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content for Tab 1</TabsContent>
        <TabsContent value="tab2">Content for Tab 2</TabsContent>
      </Tabs>
    );

    // Initially, Tab 1 content should be visible
    expect(screen.getByText('Content for Tab 1')).toBeInTheDocument();
    expect(screen.queryByText('Content for Tab 2')).not.toBeInTheDocument();

    // Click on Tab 2
    fireEvent.click(screen.getByText('Tab 2'));

    // After clicking Tab 2, its content should be visible
    expect(screen.getByText('Content for Tab 2')).toBeInTheDocument();
    expect(screen.queryByText('Content for Tab 1')).not.toBeInTheDocument();
  });

  it('should apply active state to the selected tab', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content for Tab 1</TabsContent>
        <TabsContent value="tab2">Content for Tab 2</TabsContent>
      </Tabs>
    );

    // Tab 1 should be active by default
    const tab1 = screen.getByText('Tab 1');
    expect(tab1).toHaveClass('data-[state=active]:bg-background');

    // Click on Tab 2 and verify that it becomes active
    fireEvent.click(screen.getByText('Tab 2'));
    expect(tab1).not.toHaveClass('data-[state=active]:bg-background');
    const tab2 = screen.getByText('Tab 2');
    expect(tab2).toHaveClass('data-[state=active]:bg-background');
  });

  it('should have correct class names passed to Tabs components', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList className="custom-tabs-list">
          <TabsTrigger value="tab1" className="custom-tab">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2" className="custom-tab">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1" className="custom-content">Content for Tab 1</TabsContent>
        <TabsContent value="tab2" className="custom-content">Content for Tab 2</TabsContent>
      </Tabs>
    );

    // Check if the class names are applied correctly
    const tabsList = screen.getByRole('tablist');
    const tab1 = screen.getByText('Tab 1');
    const tab2 = screen.getByText('Tab 2');
    const content1 = screen.getByText('Content for Tab 1');
    const content2 = screen.getByText('Content for Tab 2');

    expect(tabsList).toHaveClass('custom-tabs-list');
    expect(tab1).toHaveClass('custom-tab');
    expect(tab2).toHaveClass('custom-tab');
    expect(content1).toHaveClass('custom-content');
    expect(content2).toHaveClass('custom-content');
  });
});
