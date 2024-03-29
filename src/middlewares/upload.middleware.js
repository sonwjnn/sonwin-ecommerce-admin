const multer = require('multer')
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../assets/img/'))
  },
  filename: function (req, file, cb) {
    const [name, type] = file.originalname.split('.')
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const imageName = `${name}-${uniqueSuffix}.${type}`.replace(/ /g, '-')
    cb(null, imageName)
  }
})

const multerFilter = (req, file, cb) => {
  if (
    file.mimetype !== 'image/png' &&
    file.mimetype !== 'image/jpg' &&
    file.mimetype !== 'image/jpeg'
  ) {
    cb({ message: 'Wrong file type!' }, false)
  } else {
    cb(null, true)
  }
}

const uploadPhoto = multer({
  storage: storage,
  fileFilter: multerFilter,
  limits: { fileSize: 1000000 }
})

const productImageResize = async (req, res, next) => {
  if (!req.files) {
    return next()
  }
  await Promise.all(
    req.files.map(async file => {
      const outputPath = path.join(
        'src',
        'assets',
        'img',
        'products',
        file.filename
      )
      const outputDir = path.dirname(outputPath)
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true })
      }
      await sharp(file.path)
        .resize(300, 300)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(outputPath)
      fs.unlinkSync(outputPath)
    })
  )
  next()
}

const blogImgResize = async (req, res, next) => {
  if (!req.files) return next()
  await Promise.all(
    req.files.map(async file => {
      await sharp(file.path)
        .resize(300, 300)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/images/blogs/${file.filename}`)
      fs.unlinkSync(`public/images/blogs/${file.filename}`)
    })
  )
  next()
}
module.exports = { uploadPhoto, productImageResize, blogImgResize }
