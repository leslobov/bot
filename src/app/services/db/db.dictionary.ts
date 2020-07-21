export const DB_URL: string = 'mongodb+srv://bot_begemot:bot_begemot_1@cluster0.elijk.mongodb.net/bot_data?retryWrites=true&w=majority';

export enum DBEntity {
    User = 'user',
    Program = 'program'
}

export interface IDBResponse {
    success: boolean;
}
