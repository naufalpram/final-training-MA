module.exports = class ProjectData {
    id;
    picture;
    title;
    affiliation;
    description;
    dateStarted;
    dateEnded;
    skillNames;
    
    constructor(data){
        this.id = data.id
        this.picture = data.picture;
        this.title = data.title;
        this.affiliation = data.affiliation;
        this.description = data.description;
        this.dateStarted = data.dateStarted;
        this.dateEnded = data.dateEnded;
        this.skillNames = data.skillNames;
    }
}