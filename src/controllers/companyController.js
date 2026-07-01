import { 
  getCompanyProfileService, 
  saveOrUpdateProfileService, 
  deleteProfileService 
} from "../services/companyService.js";

export const getProfile = async (req, res) => {
  try {
    const profile = await getCompanyProfileService();
    return res.status(200).json({ success: true, data: profile || {} });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const saveProfile = async (req, res) => {
  try {
    const updatedProfile = await saveOrUpdateProfileService(req.body);
    return res.status(200).json({ success: true, data: updatedProfile });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

export const clearProfile = async (req, res) => {
  try {
    await deleteProfileService();
    return res.status(200).json({ success: true, message: "Profile cleared successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};