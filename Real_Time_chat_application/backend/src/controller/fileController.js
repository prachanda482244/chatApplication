import expressAsyncHandler from "express-async-handler";
import { baseUrl } from "../config/config.js";
export let createFile = expressAsyncHandler(async (req, res, next) => {
    let result = `${baseUrl}/${req.file.filename}`;
    res.status(201)
    res.send("File created" + result)

});
export let createFiles = expressAsyncHandler(async (req, res, next) => {
    console.log(req.files);

    let result = req.files.map((value, i) => {
        let path = `${baseUrl}/${value.filename}`;
        return path;
    });

    // let result = `localhost:8000/${req.file.filename}`;
    res.status(201)
    res.send("File created")
});
