const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

const cloudUpload = async function (req) {
  let URL = "";
  if (req.file) {
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };
    let result = await streamUpload(req);
    return result.url;
  }
};

const productImgUpload = async function (req) {
  const imgArry = [];
  for (i = 0; i < req.files.length; i++) {
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });
        streamifier.createReadStream(req.files[i].buffer).pipe(stream);
      });
    };
    let result = await streamUpload(req);
    imgArry.push(result.url);
    //return result.url;
  }
  return imgArry;
};
const removeImage = async function (url) {
  //https://res.cloudinary.com/mynodecloudstorage/image/upload/v1656060003/mcclysyh7854ogciosfo.jpg
  cloudinary.uploader.destroy(url);
};
function getImageID(imgLink) {
  let text = imgLink;
  let url = "";
  if (text.includes("jpeg")) {
    url = text.substr(text.length - 25, 20);
  } else {
    url = text.substr(text.length - 24, 20);
  }
  return url;
}
module.exports = { cloudUpload, productImgUpload, removeImage, getImageID };
