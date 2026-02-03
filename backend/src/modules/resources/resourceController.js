import db from "../../config/db.js";

/**
 * Get all resources with optional search and filtering
 */
export const getResources = async (req, res) => {
    const { search, type, category, status } = req.query;
    const user = req.user;

    try {
        let query = `
             Caesar: SELECT r.*, u.username as uploader_username 
            FROM resources r 
            LEFT JOIN users u ON r.uploader_id = u.id 
            WHERE 1=1
        `.replace(' Caesar:', ''); // Clean up marker

        const params = [];

        // Admin can filter by any status, users only see approved
        if (user.role === 'admin') {
            if (status) {
                params.push(status);
                query += ` AND r.status = $${params.length}`;
            }
        } else {
            query += " AND r.status = 'approved'";
        }

        if (search) {
            params.push(`%${search}%`);
            query += ` AND (r.title ILIKE $${params.length} OR r.description ILIKE $${params.length})`;
        }

        if (type && type !== "all") {
            params.push(type);
            query += ` AND r.content_type = $${params.length}`;
        }

        if (category) {
            params.push(category);
            query += ` AND r.category = $${params.length}`;
        }

        query += " ORDER BY r.created_at DESC";

        const { rows } = await db.query(query, params);
        res.json({
            success: true,
            data: rows,
        });
    } catch (error) {
        console.error("Error fetching resources:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error while fetching resources",
        });
    }
};

/**
 * Upload a new resource (Admin uploads are approved, others pending)
 */
export const uploadResource = async (req, res) => {
    const { title, description, content_type, category, author, format } = req.body;
    const uploader_id = req.user.id;
    const role = req.user.role;

    // Handle uploaded files
    const file = req.files?.['file']?.[0];
    const thumbnail = req.files?.['thumbnail']?.[0];

    const fileUrl = file ? `/uploads/${file.filename}` : req.body.url;
    const thumbUrl = thumbnail ? `/uploads/${thumbnail.filename}` : req.body.thumbnail_url;

    try {
        const query = `
            INSERT INTO resources (title, description, content_type, url, thumbnail_url, category, author, format, uploader_id, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *
        `;
        const status = role === 'admin' ? 'approved' : 'pending';
        const values = [title, description, content_type, fileUrl, thumbUrl, category, author, format, uploader_id, status];

        const { rows } = await db.query(query, values);

        res.status(201).json({
            success: true,
            message: role === 'admin' ? "Resource published successfully" : "Resource uploaded and pending for review",
            data: rows[0]
        });
    } catch (error) {
        console.error("Error uploading resource:", error);
        res.status(500).json({
            success: false,
            message: "Failed to upload resource"
        });
    }
};

/**
 * Moderate a resource status (Admin only)
 */
export const moderateResource = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // 'approved' or 'rejected'

    if (!['approved', 'rejected', 'pending'].includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status" });
    }

    try {
        const { rows } = await db.query(
            "UPDATE resources SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
            [status, id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Resource not found" });
        }

        res.json({
            success: true,
            message: `Resource status updated to ${status}`,
            data: rows[0]
        });
    } catch (error) {
        console.error("Error moderating resource:", error);
        res.status(500).json({ success: false, message: "Failed to update resource status" });
    }
};

/**
 * Update an existing resource (Admin only)
 */
export const updateResource = async (req, res) => {
    const { id } = req.params;
    const { title, description, content_type, category, author, format } = req.body;

    try {
        // Find existing resource first to check if it exists
        const { rows: existingRows } = await db.query("SELECT * FROM resources WHERE id = $1", [id]);
        if (existingRows.length === 0) {
            return res.status(404).json({ success: false, message: "Resource not found" });
        }

        // Handle uploaded files
        const file = req.files?.['file']?.[0];
        const thumbnail = req.files?.['thumbnail']?.[0];

        // If new file uploaded, use new path, otherwise keep old
        const fileUrl = file ? `/uploads/${file.filename}` : existingRows[0].url;
        const thumbUrl = thumbnail ? `/uploads/${thumbnail.filename}` : existingRows[0].thumbnail_url;

        const query = `
            UPDATE resources 
            SET title = $1, 
                description = $2, 
                content_type = $3, 
                url = $4, 
                thumbnail_url = $5, 
                category = $6, 
                author = $7, 
                format = $8,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $9
            RETURNING *
        `;
        const values = [title, description, content_type, fileUrl, thumbUrl, category, author, format, id];

        const { rows } = await db.query(query, values);

        res.json({
            success: true,
            message: "Resource updated successfully",
            data: rows[0]
        });
    } catch (error) {
        console.error("Error updating resource:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update resource"
        });
    }
};

/**
 * Get a single resource by ID
 */
export const getResourceById = async (req, res) => {
    const { id } = req.params;

    try {
        const query = `
            SELECT r.*, u.username as uploader_username 
            FROM resources r 
            LEFT JOIN users u ON r.uploader_id = u.id 
            WHERE r.id = $1
        `;
        const { rows } = await db.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Resource not found",
            });
        }

        res.json({
            success: true,
            data: rows[0],
        });
    } catch (error) {
        console.error("Error fetching resource:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error while fetching resource",
        });
    }
};
