const Project = require('../models/ProjectsSchema');

async function checkAndUpdateProjectStatus() {
    try {
        const currentDate = new Date();
        console.log("Current:", currentDate);
        const projects = await Project.find({ status: 'approved' });
        if (projects.length === 0) {
            console.log("there is no approved projects in our platform.");
        }
        else {
            for (const project of projects) {
                console.log("endDate:", project.expiredDate);
                if (currentDate >= project.expiredDate) {
                    project.status = 'expired';
                    console.log('Project statuses updated successfully');
                    await project.save();
                }
            }
            
        }
    } catch (error) {
        console.error('Error updating project statuses:', error);
    }
}

module.exports = checkAndUpdateProjectStatus;