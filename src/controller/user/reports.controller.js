const {
    getReports,
    createReport,
    getReportById,
    getHistoriesByReportId,
    putNewHistory
  } = require("../../middlewares/user/reports.services");


//ログインユーザーに紐づくレポートデータを返す
const userGetReportsController = async (req, res, next) => {
    const token = req.header('x-auth-token');
    const getReportService = await getReports(token);
    return res.json(getReportService);
  };


//新規レポート作成
const userPostReportsController = async (req, res, next) => {
    const {report} = req.body
    const token = req.header('x-auth-token');
    // insert reportのfunction
    const createReportService = await createReport(token,report)
    return res.json(createReportService);
}

//レポート詳細取得
const userGetReportByIdController = async (req, res, next) => {
    // レポート取得
    try {
        
        const token = req.header('x-auth-token');
        const report = await getReportById(token,req.params.id)
        console.log(report)
        const histories = await getHistoriesByReportId(token,req.params.id)
        return res.json(
            {
                report:report,
                histories:histories
            }
            )
        } catch (error) {
            throw error
        }
    
}

//レポートへ新しいhistoryを投稿
const userPutReortHistoryController = async (req, res, next) => {
    const history = req.body 
    const token = req.header('x-auth-token');  
    const putNewHistoryService = await putNewHistory(token,history,req.params.id)
    return res.json(putNewHistoryService);

} 


module.exports = {
    userGetReportsController,
    userPostReportsController,
    userGetReportByIdController,
    userPutReortHistoryController,
  };