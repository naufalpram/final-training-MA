const prisma = require("../db")
const ProjectData = require('../dto/ProjectData')

const getAllProjects = async (req, res) => {
    const getAllWithSkills = await prisma.projects.findMany({ include: { skills: true } })
    
    if (getAllWithSkills.length < 1) return res.status(200).json({ message: "Belum ada project"})

    return res.status(200).json({ projects: getAllWithSkills, message: "OK"})
}

const getProjectById = async (req, res) => {
    const id = parseInt(req.params.id)

    if (!id) return res.status(400).json({ message: "Data yang dikirim tidak lengkap"})

    const project = await prisma.projects.findUnique({ where: { id }})

    if (!project) return res.status(400).json({ message: "Project tidak ditemukan"})
    
    return res.status(200).json({ project: project, message: "Project berhasil ditemukan"})
}

const createProject = async (req, res) => {
    if (req.role !== "ADMIN") return res.status(403).json({ message: "Unauthorized: tidak bisa membuat project selain role ADMIN"})

    const projectData = new ProjectData(req.body)
    if (!projectData.title || !projectData.affiliation || !projectData.description || !projectData.dateStarted)
        return res.status(400).json({ message: "Data project tidak lengkap"})

    const newProject = await prisma.projects.create({
        data: {
            picture: projectData.picture,
            title: projectData.title,
            affiliation: projectData.affiliation,
            description: projectData.description,
            dateStarted: projectData.dateStarted,
            dateEnded: projectData.dateEnded,
            skills: {
                connectOrCreate: projectData.skillNames.map((name) => {
                    return {
                        where: { title: name },
                        create: { title: name}
                    }
                })
            }
        }
    })

    if (!newProject) return res.status(400).json({ message: "Project tidak berhasil dibuat" })

    return res.status(201).json({ message: "Project berhasil dibuat"})
}

const updateProject = async (req, res) => {
    if (req.role !== "ADMIN") return res.status(403).json({ message: "Unauthorized: tidak bisa memperbarui project selain role ADMIN"})

    const projectData = new ProjectData(req.body)
    if (!projectData.id || !(projectData.title || projectData.affiliation || projectData.description || projectData.dateStarted || projectData.dateEnded || projectData.skillNames))
        return res.status(400).json({ message: "Data update tidak lengkap"})
    
    const projectExist = await prisma.projects.findUnique({ where: {id: projectData.id}})
    if (!projectExist)
        return res.status(400).json({ message: "Request tidak dapat diproses: ID project tidak ditemukan"})
    
    const updateProject = await prisma.projects.update({
        data: {
            picture: projectData.picture,
            title: projectData.title,
            affiliation: projectData.affiliation,
            dateStarted: projectData.dateStarted,
            dateEnded: projectData.dateEnded,
            skills: {
                connectOrCreate: projectData.skillNames.map((name) => {
                    return {
                        where: { title: name },
                        create: { title: name}
                    }
                })
            }
        },
        where: { id: projectData.id }
    })

    if (!updateProject)
        return res.status(400).json({ message: "Project tidak berhasil dibuat"})
    
    return res.status(200).json({ message: "Project berhasil diperbarui" })

}

const deleteProject = async (req, res) => {
    if (req.role !== "ADMIN") return res.status(403).json({ message: "Unauthorized: tidak bisa menghapus project selain role ADMIN"})

    const { id } = req.body
    
    if (!id) return res.status(400).json({ message: "Data tidak lengkap"})

    const projectExist = await prisma.projects.findUnique({ where: { id }})
    if (!projectExist) return res.status(400).json({ message: "Request tidak dapat diproses: ID project tidak ditemukan" })

    const deleteProject = await prisma.projects.delete({ where: { id }})

    if (!deleteProject) return res.status(400).json({ message: "Project tidak berhasil dihapus" })

    return res.status(200).json({ message: "Project berhasil dihapus" })
}

module.exports = { getAllProjects, createProject, updateProject, deleteProject, getProjectById}
