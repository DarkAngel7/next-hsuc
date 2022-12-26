const AWS = require('aws-sdk');
const Base = require('../base');
const fs = require('fs');

class Aws {
  constructor(options) {
    let credentials = {
      accessKeyId: options.accessKeyId,
      secretAccessKey: options.secretAccessKey
    }; //秘钥形式的登录上传
    AWS.config.update(credentials);
    AWS.config.region = options.region
    this.s3 = new AWS.S3({params: {Bucket: options.bucket}})
    this.options = options;
  }

  async exist(path, CDNPath){
    return new Promise((resolve, reject) => {
      this.s3.getObject( {
        Key: CDNPath,
      }, function(err, data) {
        if (err) {
          resolve(false)
        } else {
          resolve(true)
        }
      })
    })
  }

  async upload(path, CDNPath){
    return new Promise((resolve, reject) => {
      let req = {
        Key: CDNPath,
        Body: fs.createReadStream(path),
      }
      // css file
      if (CDNPath.indexOf('.css') !== -1) {
        req.ContentType = 'text/css'
      }
      this.s3.putObject(req, function(err, data) {
        if (err) {
          reject(err)
        } else {
          resolve(true)
        }
      })
    })
  }

  async getFilesByFolder(prefix){
    return new Promise((resolve, reject) => {
      this.s3.listObjects({Prefix: prefix}, function(err, data) {
        if (err) {
          reject(err)
        } else {
          let files = data.Contents;
          files = files.map(item => {
            item.name = item.Key;
            return item;
          });
          resolve(files)
        }
      })
    })
  }

  async deleteFile(path){
    return new Promise((resolve, reject) => {
      this.s3.deleteObject({Key: path}, function (err, data) {
        if (err) {
          reject(err)
        } else {
          resolve(true)
        }
      })
    })
  }
}

module.exports = Aws;
