import WalkIn from '../models/WalkIn.js';

export const createWalkIn = async (req, res) => {
  try {
    const { applyLink } = req.body;
    if (!applyLink || !applyLink.startsWith("http")) {
      return res.status(400).json({ success: false, message: "Valid apply link required" });
    }
    const newWalkIn = new WalkIn(req.body);
    const savedWalkIn = await newWalkIn.save();
    res.status(201).json({
      success: true,
      job: savedWalkIn
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getWalkIns = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, workMode, sort } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { jobTitle: new RegExp(search, 'i') },
        { companyName: new RegExp(search, 'i') }
      ];
    }
    if (workMode) {
      query.workMode = workMode;
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'Salary') sortOption = { salary: -1 };
    if (sort === 'Deadline') sortOption = { walkInDate: 1 };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const jobs = await WalkIn.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    const totalCount = await WalkIn.countDocuments(query);

    res.status(200).json({
      success: true,
      jobs: jobs || [],
      totalCount: totalCount || 0
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, jobs: [], totalCount: 0 });
  }
};

export const updateWalkIn = async (req, res) => {
  try {
    const updatedJob = await WalkIn.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedJob) return res.status(404).json({ success: false, message: 'Walk-in job not found' });
    res.status(200).json({
      success: true,
      job: updatedJob
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteWalkIn = async (req, res) => {
  try {
    const deletedJob = await WalkIn.findByIdAndDelete(req.params.id);
    if (!deletedJob) return res.status(404).json({ success: false, message: 'Walk-in job not found' });
    res.status(200).json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSingleWalkIn = async (req, res) => {
  try {
    const job = await WalkIn.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    res.json({
      success: true,
      job
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
