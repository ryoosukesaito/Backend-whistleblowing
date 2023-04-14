const getReportById = async (id) =>{
    // mongodbからレポートを取得
    return ({
        reports_id:"", 
        reports_created_at:"", 
        reports_updated_at:"",
        users_name:"",
        reports_department:"",
        category_name:"",
        reports_subject:"",
        reports_description:"",
        file:""
    })
}

const getHistoriesByReportId = async(reportId) =>{
    // mongoDBからhisory複数件を取得

    return ([
        {
            name:"",
            created_at:"",
            file:"",
            message:""
        },
        {
            name:"",
            created_at:"",
            file:"",
            message:""
        }
    ])
}

module.exports = {
    getReportById,
    getHistoriesByReportId,
}