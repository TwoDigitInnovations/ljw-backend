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

  updateJob: async (req, res) => {
    const payload = req.body;
    const job = await Jobs.findByIdAndUpdate(payload.job_id, payload, {
      new: true,
      upsert: true,
    });
    return response.ok(res, job);
  },

  addreport: async (req, res) => {
    const payload = req.body;
    const job = await Jobs.findByIdAndUpdate(
      payload.job_id,
      { $push: { report: payload } },
      { new: true, upsert: true }
    );
    return response.created(res, job);
  },

  deleteReport: async (req, res) => {
    const payload = req.body;
    console.log(payload);
    const query = { _id: payload.job_id };
    await Jobs.updateOne(
      query,
      { $pull: { report: { _id: payload._id } } },
      { new: true, upsert: true }
    );
    return response.created(res, {
      message: "Job report deleted successfully!",
    });
  },

  getClientJobByStatus: async (req, res) => {
    const payload = req.body;

    const job = await Jobs.find({
      user_id: payload.user_id,
      client_id: payload.client_id,
      status: payload.status,
    });

    return response.ok(res, job);
  },
};
