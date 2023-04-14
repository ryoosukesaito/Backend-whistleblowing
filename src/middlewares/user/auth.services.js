const JWT = require("jsonwebtoken")
const crypto = require("crypto")
const bcrypt = require('bcryptjs')

const sendEmail = require("../utils/email/sendEmail")
const User = require("../models/User")
const Token = require("../models/Token")