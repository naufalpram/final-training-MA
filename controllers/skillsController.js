const prisma = require("../db")

const getAllSkills = async (req, res) => {
    const getAll = await prisma.skills.findMany()

    if (getAll.length < 1) return res.status(200).json({ message: "Belum ada skill"})
  
    return res.status(200).json({ skills: getAll, message: "OK"})
}

const getSkillById = async (req, res) => {
    const id = parseInt(req.params.id)

    if (!id) return res.status(400).json({ message: "Data yang dikirim tidak lengkap"})

    const skill = await prisma.skills.findUnique({ where: { id }})

    if (!skill) return res.status(400).json({ message: "Skill tidak ditemukan"})
    
    return res.status(200).json({ skill: skill, message: "Skill berhasil ditemukan"})
}

const createSkill = async (req, res) => {
    const { icon, title } = req.body

    if (!title) return res.status(400).json({ message: "Data yang dikirim tidak lengkap"})

    try {
        await prisma.skills.create({
            data: { icon, title }
        })
    } catch (error) {
        return res.status(400).json({ message: `Skill tidak berhasil dibuat: ${error}`})
    }
        

    return res.status(201).json({ message: "Skill berhasil dibuat"})
}

const updateSkill = async (req, res) => {
    const { id, icon, title} = req.body

    if (!id || !(title || icon)) return res.status(400).json({ message: "Data yang dikirim tidak lengkap"})

    const skillExist = await prisma.skills.findUnique({ where: { id }})

    if (!skillExist) {
        return res.status(400).json({ message: "Request tidak dapat diproses: ID Skill tidak ditemukan"})
    }

    const updateSkill = await prisma.skills.update({
        data: { icon, title },
        where: { id }
    })

    if (!updateSkill) {
        return res.status(400).json({ message: "Skill tidak berhasil diperbarui"})
    }

    return res.status(200).json({ message: "Skill berhasil diperbarui"})
}

const deleteSkill = async (req, res) => {
    const { id } = req.body

    if (!id) return res.status(400).json({ message: "Data yang dikirim tidak lengkap"})

    const skillExist = await prisma.skills.findUnique({ where: { id }})

    if (!skillExist) {
        return res.status(400).json({ message: "Request tidak dapat diproses: ID Skill tidak ditemukan"})
    }

    const deleteSkill = await prisma.skills.delete({ where: { id } })


    if (!deleteSkill) {
        return res.status(400).json({ message: "Skill tidak berhasil dihapus"})
    }

    return res.status(200).json({ message: "Skill berhasil dihapus"})
}

module.exports = { getAllSkills, createSkill, updateSkill, deleteSkill, getSkillById}
