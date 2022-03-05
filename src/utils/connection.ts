import { Connection, ConnectionOptions, createConnection, getConnectionManager } from 'typeorm';
import ormConfig from '../../ormconfig';

export const getConnection = async () => {
  let connection: Connection;
  let CONNECTION_NAME = ormConfig.name ?? 'default';

  const hasConnection = getConnectionManager().has(CONNECTION_NAME);
  if (hasConnection) {
    connection = getConnectionManager().get(CONNECTION_NAME);
    if (!connection.isConnected) {
      connection = await connection.connect();
    }
  } else {
    const connectionOptions: ConnectionOptions = { ...ormConfig };
    connection = await createConnection(connectionOptions);
  }
  return connection;
};

