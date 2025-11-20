import express from "express";
import planetRoutes from "../routes/planetRoutes.js";
import chartRoutes from "../routes/chartRoutes.js";

const express = require("express");
const planetRoutes = require("../routes/planetRoutes");
const chartRoutes = require("../routes/chartRoutes");

const router = express.Router();

router.use("/planets", planetRoutes);
router.use("/charts", chartRoutes);

module.exports = router;