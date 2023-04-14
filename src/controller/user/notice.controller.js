//ログインユーザーに紐づくunreadSchemaのヒストリーデータを返す
const userGetNoticeController = async (req, res, next) => {
    const{ email, session } = req.body
    const getNoticeService = await getNotice(email, session);
    return res.json(getNoticeService);
};



//ログインユーザーに紐づくunreadSchemaのヒストリーデータを削除する
const userDeleteNoticeController = async (req, res, next) => {
    const{ email, session } = req.body
    const deleteNoticeService = await deleteNotice(email, session);
    return res.json(deleteNoticeService);
};


module.exports = {
    userGetNoticeController,
    userDeleteNoticeController,
  };