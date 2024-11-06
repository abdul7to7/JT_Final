const {
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const File = require("../models/fileModel");
const { where } = require("sequelize");

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

exports.getFiles = async (req, res) => {
  const jobId = req.jobId;

  try {
    const files = await File.findAll({
      where: {
        jobId: jobId,
      },
    });

    if (files.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No files found for this job." });
    }

    // Generate pre-signed URLs for each file
    const filesWithUrls = await Promise.all(
      files.map(async (file) => {
        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: `uploads/${file.filename}`, // Include the "uploads/" folder in the key
        };

        const command = new GetObjectCommand(params);
        const url = await getSignedUrl(s3Client, command, { expiresIn: 300 }); // URL valid for 5 minutes

        return {
          ...file.dataValues,
          // Include all file fields
          url, // Add the pre-signed URL
        };
      })
    );

    res.json({ success: true, files: filesWithUrls });
  } catch (error) {
    console.error("Error retrieving files:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.postFile = async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ message: "No file uploaded or file is too large." });
  }
  console.log(req.file);
  await File.create({
    jobId: req.jobId,
    name: req.file.originalname,
    type: req.file.mimetype,
    url: req.file.location,
    key: req.file.key,
  });
  res.json({
    success: true,
    message: "File uploaded successfully",
    file: req.file,
  });
};

exports.deleteFile = async (req, res) => {
  const { fileKey } = req.params;
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploads/${fileKey}`, // Include the "uploads/" folder in the key
    };

    const command = new DeleteObjectCommand(params);
    await s3Client.send(command);

    // Optionally, remove the file reference from your database if applicable
    const completeKey = "uploads/" + fileKey;
    await File.destroy({
      where: {
        key: completeKey,
      },
    });
    res.status(204).send({ success: true }); // No content
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getFile = async (req, res) => {};
