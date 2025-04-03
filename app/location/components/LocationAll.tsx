import getConversationById from '@/app/actions/getConversationById';
import getCurrentUser from '@/app/actions/getCurrentUser';

interface User {
  id: string;
  name: string;
  location: string;
}

interface Conversation {
  id: string;
  participants: User[];
}

async function getAllLocations(conversationId: string): Promise<string[]> {
  try {
    const conversation: Conversation | null = await getConversationById(conversationId);
    
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    const locations = conversation.participants.map(user => user.location);
    return Array.from(new Set(locations)); // Remove duplicates
  } catch (error) {
    console.error('Error fetching locations:', error);
    return [];
  }
}
