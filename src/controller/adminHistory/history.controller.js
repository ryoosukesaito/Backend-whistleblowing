const Report = require("../../model/Report");
const History = require("../../model/History");
const User = require("../../model/User");
const Unread = require("../../model/Unread");
const sendEmail = require("../../utils/email/sendEmail")
const CryptoJS = require("crypto-js")
const {
  cryptoSecret
} = require("../../config");

//function for get history by report id
const getHistoryByReportId = async (req, res) => {
  const reportId = req.params.id;

  try {
    const reportHistories = await Report.findById(reportId)
      .populate("histories")
      .then((data) => {
        console.log(data);
        if(data.histories){
          data.histories.forEach(history => {
            history.message = CryptoJS.AES.decrypt(history.message,cryptoSecret).toString(CryptoJS.enc.Utf8)
          });
        }
        res.status(200).send(data)
      })
      .catch((err) => console.log(err));
  } catch (error) {
    console.log(error.error);
    res.status(400).send(error.error);
  }
};

//Post a new history to History Schema
const postHistory = async (req, res) => {
  const history = req.body;
  
  try {
    const postNewHistory = await History.create({
      reportId: history.reportId,
      userId: history.userId,
      adminId: history.adminId,
      name: history.name,
      message: history.message,
      replierType: history.replierType,
    });
    // 保存処理が二重になっていた為、暗号化が複数回実行されてしまい複合出来なくなるためコメントアウト
    // const saveNewHistory = await postNewHistory
    //   .save()
    //   .then(() => {
    //     console.log("History saved successfully");
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //   });
    // adminIdに何も入っていなければ、hisotryを投降したadminIDを入れる
    let agentId = await Report.findById(history.reportId,"adminId").then(((data)=>data.adminId))
    console.log("agentID:"+agentId);

    if(!agentId){agentId = history.adminId}

    await Report.findByIdAndUpdate(history.reportId, {
      $push: { histories: postNewHistory._id },
      adminId:agentId
    })
      .then(() => {
        console.log("Comment updated successfully");
      })
      .catch((err) => {
        console.error(err);
      });

      // notice 実装
      const report = await Report.findById(history.reportId)
      const user = await User.findById(report.userId)
      console.log(user.email);
      sendEmail(
        user.email,
        "Your report is updated",
        {name:user.name, reportId: history.reportId },
        "./template/reportUpdatedByAdmin.handlebars"
      )

      const unread = new Unread({
        reportId: history.reportId,
        userId: user._id,
      });
      unread.save();
    res.status(200).send(postNewHistory);
  } catch (error) {
    let msg;
    if (error.code === 11000) {
      msg = "Can't post History";
    } else {
      msg = error.message;
    }
    console.log(error);
    res.status(400).json(msg);
  }
};

module.exports = {
  getHistoryByReportId,
  postHistory,
};
