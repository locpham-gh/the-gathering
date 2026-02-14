import Resource from '../models/Resource.js';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';

/**
 * @desc    Get all resources with filtering and search
 * @route   GET /api/resources
 * @access  Public
 */
const getResources = asyncHandler(async (req, res, next) => {
    const { search, type, format, page = 1, limit = 10 } = req.query;

    const query = { isPublic: true };

    // Filtering by content type
    if (type && type !== 'all') {
        query.content_type = type;
    }

    // Filtering by format
    if (format) {
        query.format = format;
    }

    // Text Search
    if (search) {
        query.$text = { $search: search };
    }

    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const resources = await Resource.find(query)
        .sort(search ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
        .skip(skip)
        .limit(limitNumber);

    const total = await Resource.countDocuments(query);

    res.status(200).json({
        success: true,
        count: resources.length,
        total,
        pages: Math.ceil(total / limitNumber),
        data: resources,
    });
});

/**
 * @desc    Get single resource
 * @route   GET /api/resources/:id
 * @access  Public
 */
const getResourceById = asyncHandler(async (req, res, next) => {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
        return next(new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: resource,
    });
});

/**
 * @desc    Create a resource
 * @route   POST /api/resources
 * @access  Private/Admin
 */
const createResource = asyncHandler(async (req, res, next) => {
    const resource = await Resource.create(req.body);

    res.status(201).json({
        success: true,
        data: resource,
    });
});

/**
 * @desc    Update a resource
 * @route   PUT /api/resources/:id
 * @access  Private/Admin
 */
const updateResource = asyncHandler(async (req, res, next) => {
    let resource = await Resource.findById(req.params.id);

    if (!resource) {
        return next(new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404));
    }

    resource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        data: resource,
    });
});

/**
 * @desc    Delete a resource
 * @route   DELETE /api/resources/:id
 * @access  Private/Admin
 */
const deleteResource = asyncHandler(async (req, res, next) => {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
        return next(new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404));
    }

    await resource.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Resource removed',
    });
});

export {
    getResources,
    getResourceById,
    createResource,
    updateResource,
    deleteResource,
};
