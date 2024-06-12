const express = require("express");
const apiRouter = express.Router();
const axios = require("axios");
const Favourite = require("../models/favouritesModel");
const Applied = require("../models/appliedModel");

apiRouter.get("/searchAny", async (req, res) => {
  let query = "";
  if (req.query.search) {
    query = req.query.search;
  }

  if (query === "") {
    res.sendStatus(400);
    return;
  }

  const options = {
    method: "GET",
    url: "https://jsearch.p.rapidapi.com/search",
    params: {
      query: query,
      page: "1",
      num_pages: "1",
      date_posted: "all",
    },
    headers: {
      "x-rapidapi-key": process.env.KEY,
      "x-rapidapi-host": process.env.HOST,
    },
  };

  const { data } = await axios.request(options);
  res.send(data);
});
apiRouter.get("/searchFiltered", async (req, res) => {
  console.log(req.query);
  const values = {};
  values.query = req.query.query ? req.query.query : "";
  values.date = req.query.date ? req.query.date : "month";
  values.remote = req.query.remote ? req.query.remote : "false";
  values.type = req.query.type
    ? req.query.type
    : "FULLTIME,CONTRACTOR,PARTTIME,INTERN";
  values.reqs = req.query.reqs
    ? req.query.reqs
    : "under_3_years_experience,more_than_3_years_experience,no_experience,no_degree";

  if (values.query === "") {
    res.sendStatus(400);
    return;
  }

  const options = {
    method: "GET",
    url: "https://jsearch.p.rapidapi.com/search",
    params: {
      query: values.query,
      page: "1",
      num_pages: "1",
      date_posted: `${values.date}`,
      remote_jobs_only: `${values.remote}`,
      employment_types: `${values.type}`,
      job_requirements: `${values.reqs}`,
    },
    headers: {
      "x-rapidapi-key": process.env.KEY,
      "x-rapidapi-host": process.env.HOST,
    },
  };

  const { data } = await axios.request(options);
  res.send(data);
});
apiRouter.get("/searchSingle", async (req, res) => {
  if (req.query.id) {
    const options = {
      method: "GET",
      url: "https://jsearch.p.rapidapi.com/job-details",
      params: {
        job_id: req.query.id,
        extended_publisher_details: "false",
      },
      headers: {
        "x-rapidapi-key": process.env.KEY,
        "x-rapidapi-host": process.env.HOST,
      },
    };

    const { data } = await axios.request(options);
    res.send(data);
  }
});

apiRouter.get("/favouites", async () => {
  const favouries = await Favourite.where("user").equals(req.query.id);
  res.send(favouries);
});
apiRouter.get("/applied", async () => {
  const applied = await Applied.where("user").equals(req.query.id);
  res.send(applied);
});
apiRouter.post("/favouites", async () => {
  const fave = new Favourite({
    user: req.query.user,
    jobTitle: req.query.jobTitle,
    jobLocation: req.query.jobLocation,
    jobCompany: req.query.jobCompany,
    jobId: req.query.jobId,
    dateAdded: new Date(),
  });

  try {
    await fave.save();
  } catch (error) {
    res.status(500);
  }
});
apiRouter.post("/applied", async () => {
  const apply = new Applied({
    user: req.query.user,
    jobTitle: req.query.jobTitle,
    jobLocation: req.query.jobLocation,
    jobCompany: req.query.jobCompany,
    jobId: req.query.jobId,
    dateAdded: new Date(),
  });

  try {
    await apply.save();
  } catch (error) {
    res.status(500);
  }
});

module.exports = apiRouter;
