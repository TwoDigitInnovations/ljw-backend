const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const JobsSchema = new Schema(
  {
    title: {
      type: "string",
    },
    partyname: {
      type: "string",
    },
    date: {
      type: "string",
    },
    status: {
      type: "string",
    },
    pcs: {
      type: "string",
    },
    price: {
      type: "string",
    },
    Jobcompletedate: {
      type: Date,
    },
    billno: {
      type: "string",
    },
    suittype: {
      type: "string",
    },
    pctype: {
      type: "string",
    },
    client_id: {
      type: mongoose.Types.ObjectId,
      ref: "Clients",
    },
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    workers: [
      {
        fullName: {
          type: "string",
        },
        color: {
          type: "string",
        },
        pcs: {
          type: "string",
        },
        rate: {
          type: "string",
        },
        job_id: {
          type: mongoose.Types.ObjectId,
          ref: "Jobs",
        },
        worker_id: {
          type: mongoose.Types.ObjectId,
          ref: "Workers",
        },
      },
    ],

    report: [
      {
        title: {
          type: "String",
        },
        desc: {
          type: "String",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Jobs = mongoose.model("Jobs", JobsSchema);
module.exports = Jobs;
