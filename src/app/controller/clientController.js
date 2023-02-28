const clents = require("../model/clientModel");
const response = require("../responses");

module.exports = {
  addClints: async (req, res) => {
    const payload = req.body;
    console.log(payload);
    let client = new clents({
      name: payload.name.toLowerCase(),
      firm: payload.firm,
      contact: payload.contact,
      email: payload.email.toLowerCase(),
      address: payload.address,
      textile: payload.textile,
      user_id: payload.user_id,
    });

    await client.save();
    return response.created(res, { client });
  },

  getAllClients: async (req, res) => {
    const payload = req.body;
    const user = await clents.find({ user_id: payload.user_id });
    return response.ok(res, user);
  },
};
