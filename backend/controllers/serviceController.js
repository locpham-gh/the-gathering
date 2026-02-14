import Service from '../models/Service.js';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';

/**
 * @desc    Get all services with filtering and search
 * @route   GET /api/services
 * @access  Public
 */
const getServices = asyncHandler(async (req, res, next) => {
    const { search, category, city, page = 1, limit = 10 } = req.query;

    const query = { status: 'active' };

    // Filtering by category
    if (category && category !== 'all') {
        query.category = category;
    }

    // Filtering by city
    if (city) {
        query['location.city'] = { $regex: city, $options: 'i' };
    }

    // Text Search
    if (search) {
        query.$text = { $search: search };
    }

    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const services = await Service.find(query)
        .populate('provider', 'username avatar')
        .sort(search ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
        .skip(skip)
        .limit(limitNumber);

    const total = await Service.countDocuments(query);

    res.status(200).json({
        success: true,
        count: services.length,
        total,
        pages: Math.ceil(total / limitNumber),
        data: services,
    });
});

/**
 * @desc    Get single service entry
 * @route   GET /api/services/:id
 * @access  Public
 */
const getService = asyncHandler(async (req, res, next) => {
    const service = await Service.findById(req.params.id)
        .populate('provider', 'username avatar email bio');

    if (!service) {
        return next(new ErrorResponse(`Service not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: service,
    });
});

/**
 * @desc    Create a service entry
 * @route   POST /api/services
 * @access  Private
 */
const createService = asyncHandler(async (req, res, next) => {
    // Add user to req.body as provider
    req.body.provider = req.user.id;

    const service = await Service.create(req.body);

    res.status(201).json({
        success: true,
        data: service,
    });
});

/**
 * @desc    Update a service entry
 * @route   PUT /api/services/:id
 * @access  Private (Provider/Admin)
 */
const updateService = asyncHandler(async (req, res, next) => {
    let service = await Service.findById(req.params.id);

    if (!service) {
        return next(new ErrorResponse(`Service not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is service provider or admin
    if (service.provider.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this service`, 401));
    }

    service = await Service.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        data: service,
    });
});

/**
 * @desc    Delete a service entry
 * @route   DELETE /api/services/:id
 * @access  Private (Provider/Admin)
 */
const deleteService = asyncHandler(async (req, res, next) => {
    const service = await Service.findById(req.params.id);

    if (!service) {
        return next(new ErrorResponse(`Service not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is service provider or admin
    if (service.provider.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this service`, 401));
    }

    await service.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Service entry removed',
    });
});

export {
    getServices,
    getService,
    createService,
    updateService,
    deleteService,
};
