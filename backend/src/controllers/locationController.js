import * as locationServices from '../services/locationServices.js';


export const getAllLocations = async (req, res, next) => {
    try {
        const locations = await locationServices.getDepartamentos();
        res.status(200).json(locations);
    } catch (error) {
        next(error);
    }
}

