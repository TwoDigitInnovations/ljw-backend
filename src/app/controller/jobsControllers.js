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
      Jobcompletedate: payload.Jobcompletedate,
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

  getWorkerJobByStatus: async (req, res) => {
    const payload = req.body;
    const job = await Jobs.find({
      status: payload.status,
      workers: { $elemMatch: { worker_id: payload.worker_id } },
    });
    return response.ok(res, job);
  },

  getWorkerJobBymonth: async (req, res) => {
    const payload = req.body;
    let startOfCurrentMonth = new Date();
    let startOfNextMonth = new Date();
    let job = [];

    if (payload.type === "all") {
      job = await Jobs.find({
        workers: { $elemMatch: { worker_id: payload.worker_id } },
        status: "Complete",
      });
    } else {
      if (payload.type === "current") {
        startOfCurrentMonth.setDate(1);
        startOfNextMonth.setDate(1);
        startOfNextMonth.setMonth(startOfNextMonth.getMonth() + 1);
      }

      if (payload.type === "last") {
        startOfCurrentMonth.setDate(1);
        startOfCurrentMonth.setMonth(startOfNextMonth.getMonth() - 1);
        startOfNextMonth.setDate(1);
      }

      console.log(startOfCurrentMonth, startOfNextMonth);

      job = await Jobs.find({
        workers: { $elemMatch: { worker_id: payload.worker_id } },
        status: "Complete",
        Jobcompletedate: {
          $gte: startOfCurrentMonth,
          $lt: startOfNextMonth,
        },
      });
    }

    return response.ok(res, job);
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

  getClientJobBymonth: async (req, res) => {
    const payload = req.body;
    let startOfCurrentMonth = new Date();
    let startOfNextMonth = new Date();
    let job = [];

    if (payload.type === "all") {
      job = await Jobs.find({
        client_id: payload.client_id,
        status: "Complete",
      });
    } else {
      if (payload.type === "current") {
        startOfCurrentMonth.setDate(1);
        startOfNextMonth.setDate(1);
        startOfNextMonth.setMonth(startOfNextMonth.getMonth() + 1);
      }

      if (payload.type === "last") {
        startOfCurrentMonth.setDate(1);
        startOfCurrentMonth.setMonth(startOfNextMonth.getMonth() - 1);
        startOfNextMonth.setDate(1);
      }

      console.log(startOfCurrentMonth, startOfNextMonth);

      job = await Jobs.find({
        client_id: payload.client_id,
        status: "Complete",
        Jobcompletedate: {
          $gte: startOfCurrentMonth,
          $lt: startOfNextMonth,
        },
      });
    }

    return response.ok(res, job);
  },

  benifitAmount: async (req, res) => {
    const payload = req.body;
    let startOfCurrentMonth = new Date();
    let startOfNextMonth = new Date();
    let job = [];

    if (payload.type === "all") {
      job = await Jobs.find({
        user_id: payload.user_id,
        status: "Complete",
      }).populate("client_id");
    } else {
      if (payload.type === "current") {
        startOfCurrentMonth.setDate(1);
        startOfNextMonth.setDate(1);
        startOfNextMonth.setMonth(startOfNextMonth.getMonth() + 1);
      }

      if (payload.type === "last") {
        startOfCurrentMonth.setDate(1);
        startOfCurrentMonth.setMonth(startOfNextMonth.getMonth() - 1);
        startOfNextMonth.setDate(1);
      }

      console.log(startOfCurrentMonth, startOfNextMonth);

      job = await Jobs.find({
        user_id: payload.user_id,
        status: "Complete",
        Jobcompletedate: {
          $gte: startOfCurrentMonth,
          $lt: startOfNextMonth,
        },
      }).populate("client_id");
    }
    let formattedJobs = {
      client: {},
      workers: {},
    };
    let clients = [];
    let workers = [];
    let grandClientTotal = 0;
    let grandWorkerTotal = 0;
    job.map((j) => {
      if (formattedJobs.client[j.client_id.firm]) {
        formattedJobs.client[j.client_id.firm] =
          formattedJobs.client[j.client_id.firm] + j.pcs * j.price;
        j.workers.map((w) => {
          if (formattedJobs.workers[w.fullName]) {
            formattedJobs.workers[w.fullName] =
              formattedJobs.workers[w.fullName] + w.pcs * w.rate;
          } else {
            formattedJobs.workers[w.fullName] = w.pcs * w.rate;
          }
        });
      } else {
        j.workers.map((w) => {
          if (formattedJobs.workers[w.fullName]) {
            formattedJobs.workers[w.fullName] =
              formattedJobs.workers[w.fullName] + w.pcs * w.rate;
          } else {
            formattedJobs.workers[w.fullName] = w.pcs * w.rate;
          }
        });
        formattedJobs.client[j.client_id.firm] = j.pcs * j.price;
      }
    });
    for (const property in formattedJobs.client) {
      grandClientTotal = grandClientTotal + formattedJobs.client[property];
      clients.push({
        name: property,
        total: formattedJobs.client[property],
      });
    }

    for (const property in formattedJobs.workers) {
      grandWorkerTotal = grandWorkerTotal + formattedJobs.workers[property];
      workers.push({
        name: property,
        total: formattedJobs.workers[property],
      });
    }

    return response.ok(res, {
      clients,
      workers,
      grandClientTotal,
      grandWorkerTotal,
    });
  },
};
