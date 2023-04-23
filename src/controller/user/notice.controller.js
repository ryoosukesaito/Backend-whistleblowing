const {
    getNotice,
    deleteNotice,
  } = require("../../middlewares/user/notice.services");


//ログインユーザーに紐づくunreadSchemaのヒストリーデータを返す
const userGetNoticeController = async (req, res, next) => {
  const token = req.header('x-auth-token');      
  const getNoticeService = await getNotice(token);
  return res.json(getNoticeService);
};



//ログインユーザーに紐づくunreadSchemaのヒストリーデータを削除する
const userDeleteNoticeController = async (req, res, next) => {
  const token = req.header('x-auth-token');
  const deleteNoticeService = await deleteNotice(token);
  return res.json(deleteNoticeService);
};


module.exports = {
    userGetNoticeController,
    userDeleteNoticeController,
  };