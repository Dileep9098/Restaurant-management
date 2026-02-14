// import AddOnGroup from "../models/AddOnGroup.js";
// import AddOn from "../models/AddOn.js";
import AddOnGroup from "../models/addOnGroupModel.js";
import AddOn from "../models/addOnModel.js";


export const createAddOnGroup = async (req, res) => {
    try {

        const {
            restaurant,
            menuItem,
            name,
            isRequired,
            maxSelection
        } = req.body;

        if (!restaurant || !menuItem || !name) {
            return res.status(400).json({
                success: false,
                message: "Required fields missing"
            });
        }

        const exists = await AddOnGroup.findOne({
            menuItem,
            name
        });

        if (exists) {
            return res.status(400).json({
                success: false,
                message: "AddOn group already exists"
            });
        }

        const group = await AddOnGroup.create({
            restaurant,
            menuItem,
            name,
            isRequired,
            maxSelection
        });

        res.status(201).json({
            success: true,
            message: "AddOn group created",
            data: group
        });

    } catch (err) {

        if (err.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Duplicate group"
            });
        }

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
export const getAddOnGroups = async (req, res) => {
    try {

        const { menuItemId } = req.params;

        const groups = await AddOnGroup.find({
            menuItem: menuItemId,
            isActive: true
        }).sort({ createdAt: 1 });

        res.json({
            success: true,
            data: groups
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
export const updateAddOnGroup = async (req, res) => {
    try {

        const { id } = req.params;

        const group = await AddOnGroup.findById(id);

        if (!group) {
            return res.status(404).json({
                success: false,
                message: "Group not found"
            });
        }

        Object.assign(group, req.body);

        await group.save();

        res.json({
            success: true,
            message: "Group updated",
            data: group
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
export const deleteAddOnGroup = async (req, res) => {
    try {

        const { id } = req.params;

        await AddOnGroup.findByIdAndUpdate(
            id,
            { isActive: false }
        );

        res.json({
            success: true,
            message: "Group deleted"
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


export const createAddOn = async (req, res) => {
    try {

        const {
            restaurant,
            menuItem,
            addOnGroup,
            name,
            price,
            isVeg
        } = req.body;

        console.log(req.body);

        if (!restaurant || !menuItem || !addOnGroup || !name) {
            return res.status(400).json({
                success: false,
                message: "Required fields missing"
            });
        }

        if (price < 0) {
            return res.status(400).json({
                success: false,
                message: "Price cannot be negative"
            });
        }

        const groupExists = await AddOnGroup.findById(addOnGroup);

        if (!groupExists) {
            return res.status(404).json({
                success: false,
                message: "AddOn group not found"
            });
        }

        const exists = await AddOn.findOne({
            menuItem,
            addOnGroup,
            name
        });

        if (exists) {
            return res.status(400).json({
                success: false,
                message: "AddOn already exists"
            });
        }

        const addOn = await AddOn.create({
            restaurant,
            menuItem,
            addOnGroup,
            name,
            price,
            isVeg
        });

        res.status(201).json({
            success: true,
            message: "AddOn created",
            data: addOn
        });

    } catch (err) {

        if (err.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Duplicate AddOn"
            });
        }

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
export const getAddOnsByGroup = async (req, res) => {
    try {

        const { addOnGroupId } = req.params;
        console.log("dfdd",req.params)

        const addOns = await AddOn.find({
            addOnGroup: addOnGroupId,
            isActive: true
        }).sort({ price: 1 });

        res.json({
            success: true,
            data: addOns
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
export const updateAddOn = async (req, res) => {
    try {

        const { id } = req.params;

        const addOn = await AddOn.findById(id);

        if (!addOn) {
            return res.status(404).json({
                success: false,
                message: "AddOn not found"
            });
        }

        Object.assign(addOn, req.body);

        await addOn.save();

        res.json({
            success: true,
            message: "AddOn updated",
            data: addOn
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export const deleteAddOn = async (req, res) => {
    try {

        const { id } = req.params;

        await AddOn.findByIdAndUpdate(
            id,
            { isActive: false }
        );

        res.json({
            success: true,
            message: "AddOn deleted"
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
