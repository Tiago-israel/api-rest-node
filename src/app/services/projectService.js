const Project = require('../models/project');
const Task = require('../models/task');

const create = async ({ title, description, tasks, user }) => {
    const project = await Project.create({ title, description, user });

    await Promise.all(tasks.map(async task => {
        const projectTask = new Task({ ...task, project: project._id });
        await projectTask.save();
        project.tasks.push(projectTask)
    }));

    await project.save();
    return project;
}

const updateProject = async ({ title, description, tasks, user, projectId }) => {
    const project = await Project.findByIdAndUpdate(projectId, {
        title,
        description
    }, { new: true });
    project.tasks = [];

    await Task.remove({ project: project._id });

    await Promise.all(tasks.map(async task => {
        const projectTask = new Task({ ...task, project: project._id });
        await projectTask.save();
        project.tasks.push(projectTask)
    }));

    await project.save();

    return project;
}

const getAllProjects = async () => {
    const projects = await Project.find().populate(['user', 'tasks']);
    return projects;
}

const getProjectById = async ({ projectId }) => {
    const project = await Project.findById(projectId).populate(['user', 'tasks']);
    return project;
}

const removeProject = async ({ projectId }) => {
    await Project.findByIdAndRemove(projectId);
}



module.exports = { create, getAllProjects, getProjectById, removeProject, updateProject };
