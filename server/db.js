const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/drawings');
const { Schema } = mongoose;

const drawingsSchema = new Schema({
  name: String,
  info: String
});

const Drawing = mongoose.model('Drawing', drawingsSchema);

console.log(Drawing);

const save = ((data) => {
  const doc = new Drawing(data);
  return doc.save();
});

const find = ((data)=> {
  if (data) {
    return Drawing.findOne({name: data});
  } else return Drawing.find();
})

const update = ((data) => {
  return Drawing.updateOne({name: data.name}, {info: data.info});
});

const remove = ((data) => {
  return Drawing.deleteOne({name: data.name});
})

module.exports.save = save;
module.exports.find = find;
module.exports.update = update;
module.exports.remove = remove;