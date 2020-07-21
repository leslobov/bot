import {DBService} from './db.service';
import {DBEntity, IDBResponse} from './db.dictionary';

class PrivateDBService extends DBService {
    public getItems<T extends { id: string }>(dbEntity: DBEntity,
                                              filterObj: any = {}): Promise<Array<T>> {
        return super._getItems<T>(
            this.getCollectionName(dbEntity),
            filterObj
        );
    }

    public getItemsMap<T extends { id: string }>(dbEntity: DBEntity,
                                                 filterObj: any = {}): Promise<Map<string, T>> {
        return this.getItems<T>(dbEntity, filterObj)
            .then((items: Array<T>) => {
                return new Map<string, T>(
                    items.map<[string, T]>((item: T) => [item.id, item])
                );
            });
    }

    public getItem<T extends { id: string }>(dbEntity: DBEntity, id: string): Promise<T> {
        return super._getItem<T>(
            this.getCollectionName(dbEntity),
            {
                id
            }
        );
    }

    public insertItem<T extends { id: string }>(dbEntity: DBEntity, item: T): Promise<IDBResponse> {
        return super._insertItem<T>(
            this.getCollectionName(dbEntity),
            item
        );
    }

    public insertItems<T extends { id: string }>(dbEntity: DBEntity, items: Array<T>): Promise<IDBResponse> {
        return super._insertItems<T>(
            this.getCollectionName(dbEntity),
            items
        );
    }

    public updateItem<T extends { id: string }>(dbEntity: DBEntity,
                                                item: T): Promise<IDBResponse> {
        return super._updateItem<T>(
            this.getCollectionName(dbEntity),
            item
        );
    }

    public updateItems<T extends { id: string }>(dbEntity: DBEntity,
                                                 items: Array<T>): Promise<IDBResponse> {
        return Promise.all(items.map((item: T) => {
            return this.updateItem<T>(dbEntity, item);
        })).then((results: Array<IDBResponse>) => {
            return {
                success: results.every(result => result.success)
            } as IDBResponse;
        });
    }

    public deleteItem<T>(dbEntity: DBEntity, id: string): Promise<IDBResponse> {
        return super._deleteItem(
            this.getCollectionName(dbEntity),
            id
        );
    }

    public deleteItems<T>(dbEntity: DBEntity, filterObj: any = {}): Promise<IDBResponse> {
        return super._deleteItems(
            this.getCollectionName(dbEntity),
            filterObj
        );
    }

    public deleteAllItems<T>(dbEntity: DBEntity): Promise<IDBResponse> {
        return this.deleteItems(dbEntity);
    }


    public getCollectionName(dbEntity: DBEntity | string): string {
        return `${dbEntity}s`;
    }
}

let privateDBService = new PrivateDBService();

export {PrivateDBService, privateDBService};
