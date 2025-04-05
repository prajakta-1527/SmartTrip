import { Metadata } from 'next';
import getUsers from '../actions/getUsers';
import Sidebar from '../components/sidebar/Sidebar';
import UserList from './components/UserList';
import getConversations from '../actions/getConversations';
import ConversationList from '../conversations/components/ConversationList';
export const metadata: Metadata = {
  title: 'All Users | SmartTrip - Your Ultimate Experience'
};

export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const users = await getUsers();
  const conversations = await getConversations();
  // console.log('convos', convos);
  return (
    <Sidebar>
      <div className="h-full">
        <UserList users={users} initialConversations={conversations} />
        {children}
      </div>
    </Sidebar>
  );
}
