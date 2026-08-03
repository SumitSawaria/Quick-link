import User from "../models/user.model.js"

export const findUserByEmail = async (email) => {
  return await User.findOne({ email: email.toLowerCase() })
}

export const findUserById = async (id) => {
  return await User.findById(id)
}

export const createUser = async (payload) => {
  const newUser = new User(payload)
  await newUser.save()
  return newUser
}

export const updateUserById = async (id, update) => {
  return await User.findByIdAndUpdate(id, update, { new: true })
}
