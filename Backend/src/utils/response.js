module.exports = {
  success(res, data, message = "Success") {
    return res.json({ success: true, message, data });
  },

  error(res, message = "Error", status = 500) {
    return res.status(status).json({ success: false, message });
  },
};
