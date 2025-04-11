import handleFollowerNotifications from '../handlers/followers.handler';
import handleOwnerNotifications from '../handlers/owner.handler';
import { setupConsumer } from './consumer';

import { Server } from 'socket.io';

export const registerConsumers = async (io: Server, connectedUsers: Record<string, string>) => {
  await setupConsumer('followersNotifications', handleFollowerNotifications(io, connectedUsers));
  await setupConsumer('ownerNotifications', handleOwnerNotifications(io, connectedUsers));
};
