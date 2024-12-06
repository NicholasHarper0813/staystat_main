const { Work } = require("../models/workModel");
const { User } = require("../models/userModel");

const createWork = async (req, res) => {
  const workCount = await Work.countDocuments();

  if (req.user.role !== "ADMIN") {
    res.status(201).json({ error: "You are not authorized to create a work" });
    return;
  }
  const { userName, workDetails, finishDeadline, serialNumber, remarks } =
    req.body;
  try {
    const newWork = await Work.create({
      userName,
      workDetails,
      finishDeadline,
      createdBy: req.user._id,
      remarks,
      serialNumber: workCount + 1,
    });

    if (!newWork) {
      res.status(400).json({ message: "Work not created", work: {} });
      return;
    }
    const populatedWork = await Work.findById(newWork._id).populate([
      {
        path: "userName",
        model: User,
      },
      {
        path: "createdBy",
        model: User,
      },
    ]);

    res.status(201).json({
      message: "Work created successfully",
      work: populatedWork,
    });
  } catch (error) {
    console.error("Create Work error:", error);
    res.status(500).json({
      message: "An error occurred while creating the work",
    });
  }
};

const updateWork = async (req, res) => {
  const { workId, userName, workDetails, finishDeadline, remarks } = req.body;

  try {
    const updatedWork = await Work.findByIdAndUpdate(
      workId,
      {
        workDetails,
        finishDeadline,
        remarks,
        userName,
      },
      { new: true }
    );
    const populatedWork = await Work.findById(updatedWork._id).populate([
      {
        path: "userName",
        model: User,
      },
      {
        path: "createdBy",
        model: User,
      },
    ]);

    if (!updatedWork) {
      res.status(404).json({ error: "Work not found" });
      return;
    }

    res.status(200).json({
      message: "Work updated successfully",
      work: populatedWork,
    });
  } catch (error) {
    console.error("Update Work error:", error);
    res.status(500).json({
      message: "An error occurred while updating the work",
    });
  }
};


const updateWorkStatus = async (req, res) => {
  const { id, workConfirm, remarks } = req.body;

  try {
    const updatedWork = await Work.findByIdAndUpdate(
      id,
      {
        workConfirm,
        remarks,
      },
      { new: true }
    );
    const populatedWork = await Work.findById(updatedWork._id).populate([
      {
        path: "userName",
        model: User,
      },
      {
        path: "createdBy",
        model: User,
      },
    ]);

    if (!updatedWork) {
      res.status(404).json({ error: "Work not found" });
      return;
    }

    res.status(200).json({
      message: "Work updated successfully",
      work: populatedWork,
    });
  } catch (error) {
    console.error("Update Work error:", error);
    res.status(500).json({
      message: "An error occurred while updating the work",
    });
  }
};

const deleteWork = async (req, res) => {
  const { workId } = req.body;
  try {
    const deletedWork = await Work.findByIdAndDelete(workId);

    if (!deletedWork) {
      res.status(404).json({ error: "Work not found" });
      return;
    }

    res.status(200).json({ message: "Work deleted successfully" });
  } catch (error) {
    console.error("Delete Work error:", error);
    res.status(500).json({
      message: "An error occurred while deleting the work",
    });
  }
};

const getAllWorks = async (req, res) => {


  // async function updateSerialNumbers() {
  //   try {
  //     const users = await Work.find().sort({ createdAt: 1 }); // Sort by creation date in ascending order

  //     // Update serial numbers
  //     for (let i = 0; i < users.length; i++) {
  //       const user = users[i];
  //       user.serialNumber = i + 1;
  //       await user.save();
  //     }

  //     console.log('Serial numbers updated successfully.');
  //   } catch (error) {
  //     console.error('Error updating serial numbers:', error);
  //   }
  // }
  // await updateSerialNumbers();


  let { page, limit, sortBy, sortOrder, location, addedByMe } = req.query;
  page = parseInt(page) ?? 1;
  limit = parseInt(limit) ?? 10;
  let skipIndex = (page - 1) * limit;
  try {
    const works = await Work.find()
      .sort({ createdAt: -1 }) // Sort by createdAt field in descending order (-1)
      .skip(skipIndex)
      .limit(limit)
      .populate([
        {
          path: "userName",
          model: User,
        },
        {
          path: "createdBy",
          model: User,
        },
      ]);
    const totalWorks = await Work.countDocuments();
    res.status(200).json({ works, worksCount: totalWorks ?? 0 });
  } catch (error) {
    console.error("Get All Works error:", error);

    res.status(500).json({
      message: "An error occurred while fetching all works",
    });
  }
};

const getWorksBySearch = async (req, res) => {
  const { query } = req.query;
  try {
    const regex = new RegExp(escapeRegex(query), "gi");

    const matchingUserIds = await User.find({
      $or: [{ name: regex }, { username: regex }],
    }).distinct("_id");

    const works = await Work.find()
      .or([
        { workDetails: regex },
        { remarks: regex },
        {
          $or: [
            { userName: { $in: matchingUserIds } },
            { createdBy: { $in: matchingUserIds } },
          ],
        },
      ])
      .populate([
        {
          path: "userName",
          model: User,
          select: "name email username",
        },
        {
          path: "createdBy",
          model: User,
          select: "name email username",
        },
      ]);

    if (works.length > 0) {
      res.status(200).json({ works });
    } else {
      res.status(200).json({
        works: [],
        message: "No result found for this search",
      });
    }
  } catch (error) {
    console.error("Get Works by Search error:", error);
    res.status(500).json({
      message: "An error occurred while fetching works by search",
    });
  }
};

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = {
  createWork,
  updateWork,
  deleteWork,
  getAllWorks,
  getWorksBySearch,
  updateWorkStatus
};
