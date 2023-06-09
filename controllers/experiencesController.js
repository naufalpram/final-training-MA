const prisma = require("../db")
const ExperienceData = require('../dto/ExperienceData')

const getAllExperiences = async (req, res) => {
  const getAll = await prisma.experience.findMany()

  if (getAll.length < 1) return res.status(200).json({ message: "Belum ada experience"})

  return res.status(200).json({ experiences: getAll, message: "OK"})
}

const getExperienceById = async (req, res) => {
    const id = parseInt(req.params.id)

    if (!id) return res.status(400).json({ message: "Data yang dikirim tidak lengkap"})

    const exp = await prisma.experience.findUnique({ where: { id }})

    if (!exp) return res.status(400).json({ message: "Experience tidak ditemukan"})
    
    return res.status(200).json({ experience: exp, message: "Experience berhasil ditemukan"})
}

const createExperience = async (req, res) => {
    if (req.role !== "ADMIN") return res.status(403).json({ message: "Unauthorized: tidak bisa membuat experience selain role ADMIN"})

    const expData = new ExperienceData(req.body)
    if (!expData.title || !expData.employmentType || !expData.description || !expData.dateStarted) {
        return res.status(400).json({ message: "Data yang dikirim tidak lengkap"})
    }

    const newExp = await prisma.experience.create({
        data: {
            icon: expData.icon,
            title: expData.title,
            employmentType: expData.employmentType,
            description: expData.description,
            dateStarted: expData.dateStarted,
            dateEnded: expData.dateEnded
        },
    })

    if (!newExp) {
        return res.status(400).json({ message: "Experience tidak berhasil dibuat"})
    }
    return res.status(201).json({ message: "Experience berhasil dibuat"})
}

const updateExperience = async (req, res) => {
    if (req.role !== "ADMIN") return res.status(403).json({ message: "Unauthorized: tidak bisa memperbarui experience selain role ADMIN"})

    const expData = new ExperienceData(req.body)

    if (!expData.id || !(expData.title || expData.employmentType || expData.description || expData.dateStarted)) {
        return res.status(400).json({ message: "Data yang dikirim tidak lengkap"})
    }

    const updateExp = await prisma.experience.update({
        data: {
            icon: expData.icon,
            title: expData.title,
            employmentType: expData.employmentType,
            description: expData.description,
            dateStarted: expData.dateStarted,
            dateEnded: expData.dateEnded
        },
        where: { id: expData.id }
    })

    if (!updateExp) {
        return res.status(400).json({ message: "Experience tidak berhasil diperbarui"})
    }
    return res.status(201).json({ message: "Experience berhasil diperbarui"})
}

const deleteExperience = async (req, res) => {
    if (req.role !== "ADMIN") return res.status(403).json({ message: "Unauthorized: tidak bisa menghapus experience selain role ADMIN"})

    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: "Data yang dikirim tidak lengkap"})
    }

    const expExist = await prisma.experience.findUnique({ where: { id }})

    if (!expExist) {
        return res.status(400).json({ message: "Request tidak dapat diproses: ID tidak ditemukan"})
    }

    const deleteExp = await prisma.experience.delete({ where: { id } })


    if (!deleteExp) {
        return res.status(400).json({ message: "Experience tidak berhasil dihapus"})
    }

    return res.status(200).json({ message: "Experience berhasil dihapus"})
}

module.exports = { getAllExperiences, createExperience, updateExperience, deleteExperience, getExperienceById}
