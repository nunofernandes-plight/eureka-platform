import db from './db';

const collectionName = 'authors';


export default {
    getAllAuthors: () => {
        return db
            .collection(collectionName)
            .find()
            .toArray();
    },
    createAuthor: ({ethereumAdress, prename , lastname}) => {
        return db.collection(collectionName).insert({
            ethereumAdress, // rating: rating
            prename,
            lastname
        });
    }
};
