import { getContactsByClientId } from '../src/data-access/contacts';
import { ClientId } from '@/db/schema';

async function testGetContactsByClientId() {
  const testClientId: ClientId = 9; // Replace with a valid test client ID

  try {
    const contacts = await getContactsByClientId(testClientId);
    console.log('Retrieved contacts:', contacts);
  } catch (error) {
    console.error('Error retrieving contacts:', error);
  }
}

testGetContactsByClientId();
