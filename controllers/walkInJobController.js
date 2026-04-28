import WalkInJob from '../models/WalkInJob.js';

// Get all Walk-In jobs with pagination and filters
export const getWalkInJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, location, sort, workMode } = req.query;
    
    // Only return active and non-expired jobs for user facing API
    const query = { status: 'active', expiryDate: { $gte: new Date() } }; 

    if (search) {
      query.$text = { $search: search };
    }
    if (location) {
      query.location = new RegExp(location, 'i');
    }
    if (workMode) {
      query.workMode = workMode;
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'Salary') sortOption = { salary: -1 };
    if (sort === 'Deadline') sortOption = { expiryDate: 1 };

    const skip = (page - 1) * limit;

    const walkInJobs = await WalkInJob.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await WalkInJob.countDocuments(query);

    res.status(200).json({
      success: true,
      data: walkInJobs,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single Walk-In job
export const getWalkInJobById = async (req, res) => {
  try {
    const job = await WalkInJob.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    res.status(200).json({ success: true, job: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a new Walk-In job
export const createWalkInJob = async (req, res) => {
  try {
    const newJob = new WalkInJob({
      ...req.body,
      createdBy: req.admin ? req.admin._id : null
    });
    const savedJob = await newJob.save();
    res.status(201).json({ success: true, data: savedJob });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update Walk-In job
export const updateWalkInJob = async (req, res) => {
  try {
    const updatedJob = await WalkInJob.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedJob) return res.status(404).json({ success: false, message: 'Job not found' });
    res.status(200).json({ success: true, data: updatedJob });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete Walk-In job
export const deleteWalkInJob = async (req, res) => {
  try {
    const deletedJob = await WalkInJob.findByIdAndDelete(req.params.id);
    if (!deletedJob) return res.status(404).json({ success: false, message: 'Job not found' });
    res.status(200).json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Admin Walk-In Jobs (no filter on active/expiry)
export const getAdminWalkInJobs = async (req, res) => {
    try {
        const jobs = await WalkInJob.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: jobs });
    } catch(error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
