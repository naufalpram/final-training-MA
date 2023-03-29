module.exports = class ExperienceData {
    id;
    icon;
    title;
    employmentType;
    description;
    dateStarted;
    dateEnded;
    
    constructor(data){
        this.id = data.id
        this.icon = data.icon;
        this.title = data.title;
        this.employmentType = data.employmentType;
        this.description = data.description
        this.dateStarted = data.dateStarted;
        this.dateEnded = data.dateEnded;
    }
}