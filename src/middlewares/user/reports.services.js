const User = require("../../model/User");
const Report = require("../../model/Report");
const History = require("../../model/History");
const Unread = require("../../model/Unread");
const Admin = require("../../model/AdminAccount");
const sendEmail = require("../../utils/email/sendEmail");
const CryptoJS = require("crypto-js");
const { cryptoSecret } = require("../../config");

const { checkToken } = require("./auth.services");

const getReports = async (token) => {
  const targetUserId = await checkToken(token);
  try {
    if (targetUserId) {
      const reports = await Report.find({ userId: targetUserId })
        .sort({
          createdAt: -1,
        })
        .populate("histories")
        .populate("adminId");
      reports.forEach((report) => {
        report.subject = CryptoJS.AES.decrypt(
          report.subject,
          cryptoSecret
        ).toString(CryptoJS.enc.Utf8);
        report.description = CryptoJS.AES.decrypt(
          report.description,
          cryptoSecret
        ).toString(CryptoJS.enc.Utf8);
      });
      return (data = reports);
    }
  } catch (error) {
    throw error;
  }
};

const createReport = async (token, report) => {
  // セッション情報チェック
  const targetUserId = await checkToken(token);
  console.log(report);

  if (targetUserId) {
    if (!report.userName) report.userName = "Anonymous";
    const newReport = new Report(report);
    try {
      console.log(report);
      newReport.save();
      console.log("saved");
    } catch (error) {
      console.log(error);
    }

    const admins = await Admin.find({ deleteAt: { $exists: false } });
    admins.forEach((admin) => {
      const unread = new Unread({
        reportId: newReport._id,
        adminId: admin._id,
      });
      console.log("unread:");
      console.log(unread);
      unread.save();
      sendEmail(
        admin.email,
        "New report posted",
        { name: admin.name },
        "./template/newReportCrated.handlebars"
      );
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
    const report = await Report.findById(id)
      .populate("adminId")
      .populate("category_id");
    console.log(report);
    report.subject = CryptoJS.AES.decrypt(
      report.subject,
      cryptoSecret
    ).toString(CryptoJS.enc.Utf8);
    report.description = CryptoJS.AES.decrypt(
      report.description,
      cryptoSecret
    ).toString(CryptoJS.enc.Utf8);
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
    const histories = await History.find({ reportId: reportId });
    histories.forEach((history) => {
      history.message = CryptoJS.AES.decrypt(
        history.message,
        cryptoSecret
      ).toString(CryptoJS.enc.Utf8);
    });
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
        reportId: reportId,
        userId: targetUserId,
        replierType: "user",
        name: await getUserNameByReportId(reportId),
        message: history.message,
        file: history.file,
      });

      await newHistory.save();
      const today = Date.now();
      await Report.findByIdAndUpdate(reportId, {
        $push: { histories: newHistory._id },
        updatedAt: today,
      }).then((data) => console.log(data));
      const targetReport = await Report.findById(reportId);
      if (targetReport.adminId) {
        const newUnread = new Unread({
          reportId: reportId,
          adminId: targetReport.adminId,
        });

        newUnread.save();
        // 担当者がいる場合は通知メールを送る
        const admin = await Admin.findById(targetReport.adminId);
        sendEmail(
          admin.email,
          "Updated the report you asigned",
          { name: admin.name, reportId: reportId },
          "./template/reportUpdatedByUser.handlebars"
        );
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
