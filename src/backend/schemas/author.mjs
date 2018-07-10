const authorSchema = mongoose.Schema({
    ethereumAddress: String,
    preName: String,
    lastName: String
});

export default authorSchema;