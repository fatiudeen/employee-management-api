import multer from "multer";
import path from 'path'
//
//import S3 from 'aws-sdk/clients/s3'
import { S3Client, AbortMultipartUploadCommand } from "@aws-sdk/client-s3"
import fs from 'fs'


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads')
    },
    filename: function(req, file, cb){
        const uniqueSuffix = Date.now() +'-'+Math.round(Math.random()* 1E9) + path.extname(file.originalname)
        cb(null, file.fieldname + '-' + uniqueSuffix)

    }
})

const fileFilter =(req, res, cb)=>{
    if (file.mimetype ==='image/jpeg' || file.mimetype === 'image/png' ){
        cb(null, true)
    }else{
        cb(err, false)
    }

}
//export const  uploadFiles = multer({storage: storage})
const uploadAvi =  multer({storage: storage}, {fileFilter: fileFilter})

////////////////////////////////////////////////////////////////aws s3
const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKey = process.env.AWS_ACCESS_KEY
const secretKey = process.env.AWS_SECRET_KEY

const s3 = new S3Client({
        region,
        accessKey,
        secretKey
})

////////// upload to s3

function cloudUpload(file) {
    const fileStream = fs.createReadStream(file.path)

    const uploadParams = {
        bucket: bucketName,
        body:fileStream,
        key:file.filename
    }

    return s3.upload(uploadParams).promise()
}

///////////download to s3

function cloudDownload(key) {

    const downloadParams = {
        key:key,
        bucket: bucketName
    }

    return s3.getObject(downloadParams).createReadStream()
}
function cloudDelete(key) {

    const downloadParams = {
        key:key,
        bucket: bucketName
    }

    return s3.deleteObject(downloadParams).promise()
}

export{
    uploadAvi,
    cloudUpload,
    cloudDownload,
    cloudDelete
}