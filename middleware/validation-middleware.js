const Joi = require('@hapi/joi');
const createError = require('http-errors');
const debug = require('debug');
const validator = require('validator');

const error = debug('validation:error');

const personalInfoRegex = /^.{1,50}$/;
const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
const messageRegex = /^.{1,1000}$/;

const contactInfoSchema = Joi.object().keys({
  name: Joi.string().regex(personalInfoRegex).required(),
  emailAddress: Joi.string().email().required(),
  phoneNumber: Joi.string().regex(phoneRegex).required(),
  message: Joi.string().regex(messageRegex).required()
}).max(4);

const personalInfoScrubRegex = '\\w\'.,& -';
const messageScrubRegex = '\\w\\s\'".,%@+$!?-';

const scrub = contactInfo => {
  contactInfo.emailAddress = validator.normalizeEmail(contactInfo.emailAddress);
  contactInfo.name = validator.whitelist(contactInfo.name, personalInfoScrubRegex);
  contactInfo.message = validator.whitelist(contactInfo.message, messageScrubRegex);
  return contactInfo;
};

exports.validateContactInfo = (req, res, next) => {
  const contactInfo = req.body;
  const result = Joi.validate(contactInfo, contactInfoSchema);
  if (result.error) {
    error(result.error);
    return next(createError(400, 'Bad request. Contact info JSON did not pass validation.', {
      code: 'EBADJSON'
    }));
  }
  req.body = scrub(contactInfo);
  next();
};