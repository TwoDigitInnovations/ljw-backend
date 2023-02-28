const Jobs = require("../model/jobsModel");
const Workers = require("../model/workersModel");
const response = require("../responses");

module.exports = {
  addWorkers: async (req, res) => {
    const payload = req.body;
    console.log(payload);
    if (payload.type === "new") {
      let worker = new Workers({
        fullName: payload.fullName,
        user_id: payload.user_id,
      });
      const w = await worker.save();
      if (w) {
        let jobworker = {
          fullName: payload.fullName,
          color: payload.color,
          pcs: payload.pcs,
          rate: payload.rate,
          job_id: payload.job_id,
          worker_id: w._id,
        };
        await Jobs.findByIdAndUpdate(
          payload.job_id,
          { $push: { workers: jobworker } },
          { new: true, upsert: true }
        );

        return response.created(res, { jobworker });
      }
    } else {
      let jobworker = {
        fullName: payload.fullName,
        color: payload.color,
        pcs: payload.pcs,
        rate: payload.rate,
        job_id: payload.job_id,
        worker_id: payload.worker_id,
      };

      await Jobs.findByIdAndUpdate(
        payload.job_id,
        { $push: { workers: jobworker } },
        { new: true, upsert: true }
      );
      return response.created(res, { jobworker });
    }
  },

  getAllWorkers: async (req, res) => {
    const payload = req.body;
    const job = await Workers.find({
      user_id: payload.user_id,
    });
    return response.ok(res, job);
  },

  getJobById: async (req, res) => {
    const payload = req.body;
    const job = await Jobs.find({
      _id: payload.job_id,
    });
    return response.ok(res, job);
  },

  getJobByworker: async (req, res) => {
    const payload = req.body;
    const job = await Jobs.find({
      workers: { $elemMatch: { worker_id: payload.worker_id } },
    });
    return response.ok(res, job);
  },
};
