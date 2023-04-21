const Report = require("../../model/Report");
const History = require("../../model/History");

//function for get history by report id
const getHistoryByReportId = async (req, res) => {
  const reportId = req.params.id;

  try {
    const reportHistories = await Report.findById(reportId)
      .populate("histories")
      .then((data) => res.status(200).send(data))
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
    const saveNewHistory = await postNewHistory
      .save()
      .then(() => {
        console.log("History saved successfully");
      })
      .catch((err) => {
        console.error(err);
      });

    Report.findByIdAndUpdate(history.reportId, {
      $push: { histories: postNewHistory._id },
    })
      .then(() => {
        console.log("Comment updated successfully");
      })
      .catch((err) => {
        console.error(err);
      });

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
