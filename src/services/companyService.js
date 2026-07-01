import CompanyProfile from "../models/CompanyProfile.js";

export const getCompanyProfileService = async () => {
  return await CompanyProfile.findOne();
};

export const saveOrUpdateProfileService = async (profileData) => {
  const existingProfile = await CompanyProfile.findOne();

  if (existingProfile) {
    return await CompanyProfile.findByIdAndUpdate(
      existingProfile._id,
      { $set: profileData },
      { new: true, runValidators: true }
    );
  }
  return await CompanyProfile.create(profileData);
};

export const deleteProfileService = async () => {
  return await CompanyProfile.deleteMany({});
};