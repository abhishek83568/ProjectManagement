const express = require("express");
const ProjectTrackerModel = require("../Models/projectTracker.model");
const Authorize = require("../Middlewares/Authorize.middleware");
const ProjectModel = require("../Models/project.model");

const projectTrackerRouter = express.Router();

projectTrackerRouter.post(
  "/change-status",
  Authorize("employee"),
  async (req, res) => {
    try {
      const { status, marks } = req.body;
      const userid = req.user._id;
      console.log("userId", userid);
      const project = await ProjectModel.findOne({ assignedTo: userid });
      const prevStatus = await ProjectTrackerModel.findOneAndDelete({
        userId: userid,
      });
      console.log(prevStatus);
      const projectStatus = new ProjectTrackerModel({
        status: status,
        marks,
        userId: userid,
        projectId: project._id,
      });
      await projectStatus.save();
      res
        .status(201)
        .json({ message: "Project status created", projectStatus, prevStatus });
    } catch (error) {
      res.status(404).send(`Error while status creation ${error} `);
    }
  }
);

projectTrackerRouter.get(
  "/get-marks",
  Authorize("employee"),
  async (req, res) => {
    try {
      const userid = req.user._id;
      console.log(userid);
      const marks = await ProjectTrackerModel.findOne({ userId: userid });

      res.status(200).json({
        message: "Marks retrieved by employee",
        marks,
      });
    } catch (error) {
      res.status(404).send(`Error while recieving marks ${error}`);
    }
  }
);

projectTrackerRouter.get(
  "/get-status/:id",
  Authorize("employer"),
  async (req, res) => {
    try {
      const projectId = req.params.id;
      console.log(projectId);
      const status = await ProjectTrackerModel.findOne({
        projectId: projectId,
      });
      console.log(status);
      res.status(200).json({
        message: "Status retrieved by employee",
        status,
      });
    } catch (error) {
      res.status(404).send(`Error while recieving status ${error} by Employer`);
    }
  }
);

projectTrackerRouter.patch(
  "/update-marks/:id",
  Authorize("employer"),
  async (req, res) => {
    try {
      const projectId = req.params.id;

      const { marks } = req.body;
      const updateMarks = await ProjectTrackerModel.findOneAndUpdate(
        { projectId },
        { marks },
        { new: true }
      );

      if (!updateMarks) {
        return res
          .status(404)
          .json({ message: "No project found with the given ID" });
      }

      res
        .status(202)
        .json({ message: "Marks updated by employer", updateMarks });
    } catch (error) {
      res.status(404).send(`Error while updating marks ${error}`);
    }
  }
);

module.exports = projectTrackerRouter;
