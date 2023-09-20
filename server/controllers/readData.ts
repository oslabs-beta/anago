import newUserData from '../models/defaultUserData.ts';
import { NEW_USER, ACTIVE_DEPLOYMENT } from '../../user-config.ts';
// File Read/Write
import fs from 'fs';
import path from 'path';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import { fileURLToPath } from 'url';

export function readUserData(): any {
  if (NEW_USER) {
    // Create a new user from default data (for now?)
    return newUserData;
  }
  try {
    const readData = fs.readFileSync(
      path.resolve(__dirname, '../models/userData.json'),
      'utf-8'
    );
    const userData = JSON.parse(readData);
    if (
      !userData.hasOwnProperty('userId') ||
      !userData.hasOwnProperty('metrics')
    ) {
      console.log(
        'Read UserData is missing metrics. Using and saving default data.'
      );

      try {
        fs.writeFileSync(
          path.resolve(__dirname, '../models/userData.json'),
          JSON.stringify(newUserData)
        );
        return newUserData;
      } catch (err) {
        console.log(
          'Error reading User Data from disk in helper function readUserData.'
        );
        return;
      }
    }
    return userData;
  } catch (err) {
    console.log(
      'Error reading User Data from disk in helper function readUserData.'
    );
    return;
  }
}
