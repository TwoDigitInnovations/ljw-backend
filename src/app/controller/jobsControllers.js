const Jobs = require("../model/jobsModel");
const response = require("../responses");

module.exports = {
  addJobs: async (req, res) => {
    const payload = req.body;
    console.log(payload);
    let job = new Jobs({
      title: payload.title,
      partyname: payload.partyname,
      billno: payload.billno,
      date: payload.date,
      status: payload.status,
      pcs: payload.pcs,
      price: payload.price,
      suittype: payload.suittype,
      pctype: payload.pctype,
      client_id: payload.client_id,
      user_id: payload.user_id,
    });

    await job.save();
    return response.created(res, { job });
  },

  getAllJos: async (req, res) => {
    const payload = req.body;
    let job = [];
    if (payload.client_id) {
      job = await Jobs.find({
        user_id: payload.user_id,
        client_id: payload.client_id,
      });
    } else {
      job = await Jobs.find({
        user_id: payload.user_id,
      });
    }

    return response.ok(res, job);
  },

  getJobById: async (req, res) => {
    const payload = req.body;
    const job = await Jobs.find({
      _id: payload.job_id,
    });
    return response.ok(res, job);
  },
};
