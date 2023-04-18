const responseHandler = require('../handlers/response.handler.js')

const productModel = require('../models/M_Products')
const categoryModel = require('../models/M_Categories')

const getList = async (req, res) => {
  try {
    const response = await productModel.find().exec(async (err, data) => {
      if (err) {
        res.send({ kq: 0, msg: 'Connect failed to DB' })
      } else {
        typeCate = [
          'Electronic',
          'Clothes',
          'Office Suply',
          'Books',
          'Bedding',
          'Other'
        ]

        var dataCate = await categoryModel.find()

        var arr = []
        for (var i = 0; i < typeCate.length; i++) {
          var count = 0
          for (var j = 0; j < dataCate.length; j++) {
            if (typeCate[i] == dataCate[j].type) {
              count = 1
            }
          }

          if (count == 0) {
            arr.push({
              name: typeCate[i],
              check: 0
            })
          } else {
            arr.push({
              name: typeCate[i],
              check: 1
            })
          }
        }

        res.send({ kq: 1, msg: data, msgDouble: arr })
      }
    })
    // return responseHandler.ok(res, response)
  } catch (error) {
    responseHandler.error(res)
  }
}

const getDetail = async (req, res) => {
  try {
    const { productId } = req.params
    const response = await productModel.findById(productId)
    return responseHandler.ok(res, response)
  } catch (error) {
    responseHandler.error(res)
  }
}

// router.get('/list', async (req, res) => {})

// router.get('/getProduct_by_slug/:slug', (req, res) => {
//   productModel.find({ cateName: req.params.slug }).exec((err, data) => {
//     if (err) res.send({ kq: 0, msg: 'Connect failed to DB' })

//     res.send({ kq: 1, msg: data })
//   })
// })

// router.get('/info_product_by_slug/:slug', (req, res) => {
//   productModel.find({ name: req.params.slug }).exec((err, data) => {
//     if (err) res.send({ kq: 0, msg: 'Connect failed to DB' })

//     res.send({ kq: 1, msg: data })
//   })
// })

// router.get('/getProductRelation/:cate/:name', function (req, res) {
//   var cate = req.params.cate
//   var name = req.params.name

//   const check_obj = { cateName: cate, $nor: [{ name: name }] }
//   productModel.find(check_obj).exec((err, data) => {
//     if (err) {
//       res.send({ kq: 0, msg: 'Connect failed to DB' })
//     } else {
//       res.send({ kq: 1, msg: data })
//     }
//   })
// })

module.exports = { getList, getDetail }