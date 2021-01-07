const mongoose = require("mongoose");

const warningSchema = mongoose.Schema ({
  username: String,
  userID: String,
  raison_warn: Array,
  raison_mute: Array,
  raison_ban: Array,
  archives: Array,
});

module.exports = mongoose.model("Warning", warningSchema);
