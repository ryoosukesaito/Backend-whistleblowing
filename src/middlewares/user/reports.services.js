const User = require("../../model/User")
const Report = require("../../model/Report")
const History = require("../../model/History")
const Unread = require("../../model/Unread")
const Admin = require("../../model/AdminAccount")
const sendEmail = require("../../utils/email/sendEmail")

const { checkToken } = require("./auth.services");

const getReports = async (token) => {
  const targetUserId = await checkToken(token);
  try {
    if (targetUserId) {
      console.log(targetUserId);
      const reports = await Report.find({ userId: targetUserId }).sort({
        createdAt: -1,
      });
      console.log(reports);
      return (data = reports);
    }
  } catch (error) {
    throw error;
  }
};

const createReport = async (token, report) => {
  // セッション情報チェック
  const targetUserId = await checkToken(token);

  if (targetUserId) {
    const newReport = await new Report(report);
    newReport.save();

    const superAdmins = await Admin.find({ role: "superAdmin" });
    superAdmins.forEach((admin) => {
      const unread = new Unread({
        reportId: newReport._id,
        adminId: admin._id,
      });
      console.log(unread);
      unread.save();
      sendEmail(
        admin.email,
        "New report posted",
        { name: admin.name },
        "./template/newReportCrated.handlebars"
    )
    });
  } else {
    throw new Error("something wrong");
  }
  return (data = { msg: "success" });
};

const getReportById = async (token, id) => {
  // セッション情報チェック
  const targetUserId = await checkToken(token);

  if (targetUserId) {
    const report = await Report.findById(id);

    console.log(report);

    if (report.userId == targetUserId) {
      return report;
    } else {
      throw new Error("something Wrong");
    }
  } else {
    throw new Error("something Wrong");
  }
};

const getHistoriesByReportId = async (token, reportId) => {
  // mongoDBからhistory複数件を取得
  // セッション情報チェック
  const targetUserId = await checkToken(token);

  if (targetUserId) {
    const histories = History.find({ reportId: reportId });
    return histories;
  } else {
    throw new Error("something bad");
  }
};

const putNewHistory = async (token, history, reportId) => {
  const targetUserId = await checkToken(token);
  try {
    if (targetUserId) {
      const newHistory = new History({
        reportId:reportId,
        userId: targetUserId,
        replierType: "user",
        name: await getUserNameByReportId(reportId),
        message: history.message,
      });
      newHistory.save();
      const targetReport = await Report.findById(reportId);
      if (targetReport.adminId) {
        const newUnread = new Unread({
          reportId: reportId,
          adminId: targetReport.adminId,
        });
        newUnread.save();
        // 担当者がいる場合は通知メールを送る
        const admin = await Admin.findById(targetReport.adminId)
        sendEmail(
            admin.email,
            "New report posted",
            {name:admin.name, reportId: reportId },
            "./template/reportUpdated.handlebars"
        )
      }
    } else {
      throw new Error("something bad");
    }
  } catch (error) {
    throw error;
  }
};

const getUserNameByReportId = async (reportId) => {
  const report = await Report.findById(reportId);
  return report.userName;
};
module.exports = {
  getReports,
  createReport,
  getReportById,
  getHistoriesByReportId,
  putNewHistory,
};
