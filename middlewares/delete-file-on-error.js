import { request, response } from "express";
import { cloudinary } from "./file-uploader.js";

export const cleanUploaderFileOnFinish = (request, response, next) => {
    if(request.file){
        response.on('finish', async () => {
            try {
                if(response.statusCode >= 400) {
                    const publicId = request.file.public_id || request.file.filename;
                    if(publicId) {
                        await cloudinary.uploader.destroy(publicId);
                        console.log(
                            `Archivo Cloudinary eliminado por respuesta ${response.statusCode}: ${publicId}`
                        );
                    }
                }
            } catch (error) {
                console.error(`Error al eliminar archivo de cloudinary tras error de respuesta: ${error.message}`);
            }
        });
    }

    next();
}

export const deleteFileOnError = async (error, request, response, next) => {
    try {
        if(request.file){
            const publicId = request.file.publicId || request.file.filename;
            if(publicId){
                await cloudinary.uploader.destroy(publicId);
                console.log(
                    `Archivo Cloudinary eliminado por error en cadena: ${publicId}`
                );
            }
        }
    } catch (unlinkError) {
        console.error(
            `Error al eliminar archivo de Cloudinary (error handler): ${unlinkError.message}`
        );
    }
    return next(error);
}