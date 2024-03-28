import { createClient } from "tinacms/dist/client";
import { queries } from "./types";
export const client = createClient({ url: 'http://localhost:4001/graphql', token: '337030e2accb793281c5a4397c80fabde0a39724', queries,  });
export default client;
  