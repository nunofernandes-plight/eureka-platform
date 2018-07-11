import mongo from 'then-mongo/index';

const collections = ['authors','reviews'];
const db = mongo('localhost/eurekaDB', collections);

export default db;