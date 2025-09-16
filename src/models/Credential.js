const mongoose = require('mongoose');

const credentialSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    serverName: { type: String, required: true, trim: true },
    serverIp: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          // Simple IPv4 regex, not exhaustive
          return /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/.test(v);
        },
        message: 'Invalid IPv4 address',
      },
    },
    serverUrl: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Credential', credentialSchema);


