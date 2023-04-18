const {
    getReport,
    sessionCheck,
    createReport,
    getReportById,
    getHistoriesByReportId,
    putNewHistory
  } = require("../../middlewares/user/reports.services");


//ログインユーザーに紐づくレポートデータを返す
const userGetReportsController = async (req, res, next) => {
    const{ email, session } = req.body
    const getReportService = await getReport(email, session);
    return res.json(getReportService);
  };


//新規レポート作成
const userPostReportsController = async (req, res, next) => {
    const { email, session, report } = req.body
    console.log(report)
    // セッションチェック
    const sessionCheckService = await sessionCheck(email, session)
    if(!sessionCheckService){
        // 4xxエラーをreturnする
    }
    // insert reportのfanction
    const createReportService = await createReport(report)
    if(createReportService){
        // return 200　成功
    }else{
        // return 5xx 失敗
    }
   
}

//レポート詳細取得
const userGetReportByIdController = async (req, res, next) => {
    // セッションチェック

    // レポート取得
    const report = getReportById(req.params.id)
    const histories = getHistoriesByReportId(req.params.id)
    return res.json(
        {
            report:report,
            histories:histories
        }
    )
    
}

//レポートへ新しいhistoryを投稿
const userPutReortHistoryController = async (req, rea, next) => {
    // セッションチェック

    //historyを紐づけるレポートを取得
    const {history} = req.body   
    const putNewHistoryService = await putNewHistory(history)
    return res.json(putNewHistoryService);

} 


module.exports = {
    userGetReportsController,
    userPostReportsController,
    userGetReportByIdController,
    userPutReortHistoryController,
  };