const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const { create, getAllProjects, getProjectById, removeProject, updateProject } = require('../services/projectService');


router.use(authMiddleware);

router.get('/', async (req, res) => {
    const projects = await getAllProjects();
    return res.send({ projects });
});

router.get('/:projectId', async (req, res) => {
    const project = await getProjectById({...req.params});
    return res.send({project});
});

router.post('/', async (req, res) => {
    const projects = await create({ ...req.body, user: req.userId });
    return res.send({ projects });
});

router.put('/:projectId', async (req, res) => {
    const project = await updateProject({ ...req.params, ...req.body, user: req.userId });
    return res.send({ project });
});

router.delete('/:projectId', async (req, res) => {
    await removeProject({ ...req.params });
    return res.send();
});

module.exports = app => app.use('/projects', router);