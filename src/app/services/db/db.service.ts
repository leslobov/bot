/**
 * Created by Faroukh on 28.08.2016.
 */
import {DB_URL, IDBResponse} from './db.dictionary';

let mongodb = require('mongodb');

let MongoClient = mongodb.MongoClient;

abstract class DBService {
    public db = null;
    public startConnecting = false;

    public connect(): Promise<void> {
        this.startConnecting = true;
        return new Promise((resolve, reject) => {
            MongoClient.connect(DB_URL, (err, db) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    this.db = db;
                    resolve(db);
                }
            });
        });
    }

    protected dropCollection(collectionName: string) {
        return this.db.collection(collectionName)
            .drop();
    }

    protected _getItem<G extends { id: string, _id?: string }>(collectionName: string, filterObj: any = {}): Promise<G> {

        return this.db.collection(collectionName)
            .findOne(this.prepareObjectForDB(filterObj))
            .then((item: G) => this.revertDBObject(item)) as Promise<G>;
    }

    protected _getItems<G extends { id: string, _id?: string }>(collectionName: string, filterObj: any = {}): Promise<Array<G>> {

        return this.db.collection(collectionName)
            .find(this.prepareObjectForDB(filterObj))
            .toArray()
            .then((items: Array<G>) => {
                return items.map((item: G) => this.revertDBObject(item));
            }) as Promise<Array<G>>;
    }

    protected _updateItem<G extends { id: string, _id?: string }>(collectionName: string,
                                                                  item: G): Promise<IDBResponse> {

        let itemClone = this.prepareObjectForDB(item);

        return this.db.collection(collectionName)
            .replaceOne({
                _id: itemClone._id
            }, itemClone, {
                upsert: true
            })
            .then(result => {
                return {
                    success: result && (result.modifiedCount > 0 || result.upsertedCount > 0 || result.matchedCount > 0)
                } as IDBResponse;
            });
    }

    protected _insertItem<G extends { id: string, _id?: string }>(collectionName: string,
                                                                  item: G): Promise<IDBResponse> {

        return this.db
            .collection(collectionName)
            .insertOne(this.prepareObjectForDB(item))
            .then((result) => {
                return {
                    success: result && (result.insertedCount > 0 || result.upsertedCount > 0 || result.matchedCount > 0)
                } as IDBResponse;
            });
    }

    protected _insertItems<G extends { id: string, _id?: string }>(collectionName: string,
                                                                   items: Array<G>): Promise<IDBResponse> {
        if (items.length > 0) {

            return this.db
                .collection(collectionName)
                .insertMany(items.map((item: G) => this.prepareObjectForDB(item)))
                .then(result => {
                    return {
                        success: result && result.insertedCount > 0
                    } as IDBResponse;
                });
        } else {
            return Promise.resolve({
                success: true
            } as IDBResponse);
        }
    }

    protected _deleteItem(collectionName: string,
                          _id: string): Promise<IDBResponse> {
        return this.db
            .collection(collectionName)
            .deleteOne({
                _id
            })
            .then(result => {
                return {
                    success: result && result.deletedCount > 0
                } as IDBResponse;
            });
    }

    protected _deleteItems(collectionName: string,
                           filterObj: any = {}): Promise<IDBResponse> {

        return this.db
            .collection(collectionName)
            .deleteMany(this.prepareObjectForDB(filterObj))
            .then(result => {
                return {
                    success: result && result.deletedCount > 0
                } as IDBResponse;
            });
    }

    private prepareObjectForDB(obj) {
        let objectForDB = Object.assign({}, obj);
        if (objectForDB.id) {
            objectForDB._id = objectForDB.id;
            delete objectForDB.id;
        }
        return objectForDB;
    }

    private revertDBObject(obj) {
        if (obj) {
            let revertedObject = Object.assign({}, obj);
            if (revertedObject._id) {
                revertedObject.id = revertedObject._id;
                delete revertedObject._id;
            }
            return revertedObject;
        }
        return obj;
    }
}

export {DBService};
