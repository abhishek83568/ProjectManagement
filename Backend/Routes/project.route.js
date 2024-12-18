const express = require("express");
const ProjectModel = require("../Models/project.model");
const UserModel = require("../Models/user.model");
const Authorize = require("../Middlewares/Authorize.middleware");
const mongoose = require("mongoose");

const projectRouter = express.Router();

// Employer Routes

projectRouter.get("/get-myProject", Authorize("employer"), async (req, res) => {
  try {
    const userId = req.user._id;
    const projectList = await ProjectModel.find({
      assignedBy: userId,
    });

    const assignedToIds = projectList.map((project) => project.assignedTo);
    const employeeList = await UserModel.find({ _id: { $in: assignedToIds } });
    res.status(200).json({
      message: "All Projects created retrieved",
      projectList,
      employeeList,
    });
  } catch (error) {
    res.status(404).send(`Error while retrieving all projects created`);
  }
});

projectRouter.get(
  "/get-trackProject/:id",
  Authorize("employer"),
  async (req, res) => {
    try {
      const projectId = req.params.id;
      const Project = await ProjectModel.findOne({ _id: projectId });
      console.log(Project);
      // const employer = await UserModel.findOne({ _id: Project.assignedBy });
      const employee = await UserModel.findOne({
        _id: Project.assignedTo,
      });
      console.log(employee);
      res.status(200).json({
        message: "employer retrieving assigned project",
        Project,
        employee,
      });
    } catch (error) {
      res
        .status(404)
        .send(`Error while retrieving my assigned Project ${error}`);
    }
  }
);

projectRouter.post(
  "/create-project",
  Authorize("employer"),
  async (req, res) => {
    try {
      const userId = req.user._id;
      const { title, description, assignedTo, assignedBy } = req.body;
      const employeeList = await UserModel.find({
        role: "employee",
        isShortlisted: false,
      });
      const employee = employeeList.find(
        (emp) => emp._id.toString() === assignedTo.toString()
      );
      console.log(employee);
      if (!employee) {
        return res
          .status(404)
          .send(
            "Employee not found or already assigned or already shortlisted"
          );
      }
      const projectAssign = new ProjectModel({
        title,
        description,
        assignedTo: employee._id,
        assignedBy: userId,
      });
      await projectAssign.save();
      const updatedEmployeeDetail = await UserModel.findByIdAndUpdate(
        employee._id,
        { isShortlisted: true }
      );

      res.status(201).json({
        message: "Project Assigned successfully",
        projectAssign,
        updatedEmployeeDetail,
      });
    } catch (error) {
      res.status(404).send(`Error while assigning project ${error}`);
    }
  }
);

projectRouter.get(
  "/get-shortlistedEmployee",
  Authorize("employer"),
  async (req, res) => {
    try {
      const employeeList = await UserModel.find({
        role: "employee",
        isShortlisted: true,
      });
      res
        .status(200)
        .json({ message: "Shortlisted employee retrieved", employeeList });
    } catch (error) {
      res.status(404).send(`Error while retrieving all employees`);
    }
  }
);

projectRouter.get(
  "/get-unassignedEmployee",
  Authorize("employer"),
  async (req, res) => {
    try {
      const employeeList = await UserModel.find({
        role: "employee",
        isShortlisted: false,
      });
      res
        .status(200)
        .json({ message: "Shortlisted employee retrieved", employeeList });
    } catch (error) {
      res.status(404).send(`Error while retrieving all employees`);
    }
  }
);

//   "/update-projectDesc/:id",
//   Authorize("employer"),
//   async (req, res) => {
//     try {
//       const projectId = req.params.id;
//       const userId = req.user._id;
//       const { title, description, assignedTo } = req.body;

//       const project = await ProjectModel.findOne({ _id: projectId });
//       if (!project) {
//         return res.status(404).send("Project not found");
//       }
//       const employeeList = await UserModel.find({
//         role: "employee",
//         isShortlisted: false,
//       });
//       console.log(employeeList);
//       const employee = employeeList.find((emp) =>
//         assignedTo != undefined
//           ? emp._id.toString() === assignedTo.toString()
//           : ""
//       );
//       // if (!employee) {
//       //   res.status(404).send("Employee not found or shortlisted already");
//       // }
//       if (title != undefined) {
//         project.title = title;
//       }
//       if (description != undefined) {
//         project.description = description;
//       }
//       if (
//         assignedTo != undefined &&
//         project.assignedTo.toString() !== assignedTo.toString()
//       ) {
//         const previousAssignedTo = project.assignedTo;
//         project.assignedTo = assignedTo;
//         await UserModel.findByIdAndUpdate(assignedTo, {
//           isShortlisted: true,
//         });

//         await UserModel.findByIdAndUpdate(previousAssignedTo, {
//           isShortlisted: false,
//           isAssigned: false,
//         });
//       }

//       await project.save();

//       res.status(200).json({
//         message: "Project updated successfully",
//         project,
//       });
//     } catch (error) {
//       res.status(404).send(`Error while updating ${error}`);
//     }
//   }
// );

projectRouter.patch(
  "/update-projectDesc/:id",
  Authorize("employer"),
  async (req, res) => {
    try {
      const projectId = req.params.id;
      const { title, description, assignedTo } = req.body;

      if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
        return res.status(400).send("Invalid project ID");
      }

      const project = await ProjectModel.findOne({ _id: projectId });
      if (!project) {
        return res.status(404).send("Project not found");
      }

      if (assignedTo && !mongoose.Types.ObjectId.isValid(assignedTo)) {
        return res.status(400).send("Invalid assignedTo ID");
      }
      if (title) project.title = title;
      if (description) project.description = description;

      if (
        assignedTo &&
        project.assignedTo.toString() !== assignedTo.toString()
      ) {
        const previousAssignedTo = project.assignedTo;
        project.assignedTo = assignedTo;

        await UserModel.findByIdAndUpdate(assignedTo, { isShortlisted: true });
        await UserModel.findByIdAndUpdate(previousAssignedTo, {
          isShortlisted: false,
          isAssigned: false,
        });
      }

      await project.save();

      res.status(200).json({
        message: "Project updated successfully",
        project,
      });
    } catch (error) {
      console.error("Error while updating project:", error);
      res.status(500).send(`Error while updating project: ${error.message}`);
    }
  }
);

projectRouter.delete(
  "/delete-project/:id",
  Authorize("employer"),
  async (req, res) => {
    try {
      const projectId = req.params.id;

      const project1 = await ProjectModel.findOne({ _id: projectId });
      if (!project1) {
        return res.status(404).json({ message: "Project not found" });
      }

      const project2 = await ProjectModel.findByIdAndDelete(projectId);

      const user = await UserModel.findByIdAndUpdate(project1.assignedTo, {
        isShortlisted: false,
        isAssigned: false,
      });

      res.status(200).json({
        message: "Project deleted successfully",
        deletedProject: project2,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: `Error while deleting project: ${error.message}` });
    }
  }
);

// Employee Routes
projectRouter.get(
  "/get-myEmployeeProject",
  Authorize("employee"),
  async (req, res) => {
    try {
      const userId = req.user._id;
      const Project = await ProjectModel.findOne({ assignedTo: userId });
      const employer = await UserModel.findOne({ _id: Project.assignedBy });
      const employee = await UserModel.findOne({ _id: userId });
      res.status(200).json({
        message: "My Assigned Project retrieved",
        Project,
        employer,
        employee,
      });
    } catch (error) {
      res
        .status(404)
        .send(`Error while retrieving my assigned Project ${error}`);
    }
  }
);

projectRouter.patch(
  "/update-assignProject",
  Authorize("employee"),
  async (req, res) => {
    try {
      const userId = req.user._id;
      const employee = await UserModel.findByIdAndUpdate(userId, {
        isAssigned: true,
      });
      await employee.save();
      res.status(201).json({ message: "employee accepted project", employee });
    } catch (error) {
      res
        .status(404)
        .json({ message: `Error while accepting Project ${error}` });
    }
  }
);

module.exports = projectRouter;
