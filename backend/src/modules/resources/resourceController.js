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
 * Upload a new resource (pending approval)
 */
export const uploadResource = async (req, res) => {
    const { title, description, content_type, url, thumbnail_url, category, author, format } = req.body;
    const uploader_id = req.user.id;

    try {
        const query = `
            INSERT INTO resources (title, description, content_type, url, thumbnail_url, category, author, format, uploader_id, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending')
            RETURNING *
        `;
        const values = [title, description, content_type, url, thumbnail_url, category, author, format, uploader_id];

        const { rows } = await db.query(query, values);

        res.status(201).json({
            success: true,
            message: "Resource uploaded and pending for review",
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
