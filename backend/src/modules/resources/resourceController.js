import db from "../../config/db.js";

/**
 * Get all resources with optional search and filtering
 */
export const getResources = async (req, res) => {
    const { search, type, category } = req.query;

    try {
        let query = "SELECT * FROM resources WHERE 1=1";
        const params = [];

        if (search) {
            params.push(`%${search}%`);
            query += ` AND (title ILIKE $${params.length} OR description ILIKE $${params.length})`;
        }

        if (type && type !== "all") {
            params.push(type);
            query += ` AND content_type = $${params.length}`;
        }

        if (category) {
            params.push(category);
            query += ` AND category = $${params.length}`;
        }

        query += " ORDER BY created_at DESC";

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
 * Get a single resource by ID
 */
export const getResourceById = async (req, res) => {
    const { id } = req.params;

    try {
        const { rows } = await db.query("SELECT * FROM resources WHERE id = $1", [id]);

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
