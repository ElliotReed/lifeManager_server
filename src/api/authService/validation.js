import Joi from 'joi';

const schema = Joi.object({
	email: Joi.string().required().email(),
	password: Joi.string().min(6).required(),
});

const loginValidation = (data) => {
	return schema.validate(data);
};

const registerValidation = (data) => {
	return schema.validate(data);
};

export { registerValidation, loginValidation };
