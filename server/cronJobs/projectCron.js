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
                const endDate = new Date(project.approvalDate);
                const daysInMilliseconds = 1000 * 60 * 60 * 24; // Bir günün milisaniye cinsinden değeri
                const campaignDurationInDays = project.basicInfo.campaignDuration; // Projelerin kampanya süresi gün cinsinden
                const campaignDurationInMilliseconds = campaignDurationInDays * daysInMilliseconds; // Kampanya süresi milisaniye cinsinden
                endDate.setTime(endDate.getTime() + campaignDurationInMilliseconds);
                console.log("endDate:", endDate);
                if (currentDate >= endDate) {
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

checkAndUpdateProjectStatus();

