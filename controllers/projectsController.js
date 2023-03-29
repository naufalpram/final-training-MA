const prisma = require("../db")
const ProjectData = require('../dto/ProjectData')

const getAllProjects = async (req, res) => {
    const getAllWithSkills = await prisma.projects.findMany({ include: { skills: true } })
    
    if (getAllWithSkills.length < 1) return res.status(200).json({ message: "Belum ada project"})

    return res.status(200).json({ experiences: getAllWithSkills, message: "OK"})
}

const createProject = async (req, res) => {
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
    const { id } = req.body
    
    if (!id) return res.status(400).json({ message: "Data tidak lengkap"})

    const projectExist = await prisma.projects.findUnique({ where: { id }})
    if (!projectExist) return res.status(400).json({ message: "Request tidak dapat diproses: ID project tidak ditemukan" })

    const deleteProject = await prisma.projects.delete({ where: { id }})

    if (!deleteProject) return res.status(400).json({ message: "Project tidak berhasil dihapus" })

    return res.status(200).json({ message: "Project berhasil dihapus" })
}

module.exports = { getAllProjects, createProject, updateProject, deleteProject}
