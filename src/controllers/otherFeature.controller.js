const { LogoModel, BannerModel, ShopSystemModel } = require("../models/otherFeature.model");

class LogoController {
  /** get all */
  static getAllLogo = async (req, res) => {
    try {
      const find = await LogoModel.find();
      res.status(200).json(find);
    } catch (err) {
      res.status(500).json(err);
    }
  };

  /** get detail logo */
  static getDetailLogo = async (req, res) => {
    try {
        const {id} = req.params;
        const findOne = await LogoModel.findById(id);
        res.status(200).json(findOne);
    } catch (err) {
        res.status(500).json(err)
    }
  }

  /** create logo */
  static createLogo = async (req, res) => {
    try {
      /** delete old */
      await LogoModel.deleteMany();
      const newLogo = await LogoModel(req.body);
      await newLogo.save();
      res.status(200).json({ message: "upload logo is successfully" });
    } catch (err) {
      res.status(500).json(err);
    }
  };

  /** update logo */
  static updateLogo = async (req, res) => {
    try{
        const {id} = req.params;
        const findById = await LogoModel.findById(id);
        if(!findById) return res.status(404).json({message: 'logo is not found'});

        await findById.updateOne({$set: req.body});
        res.status(200).json({message: "update logo successfully"})
    } catch(err) {
        res.status(500).json(err)
    }
  };

  /** delete logo  */
  static deleteLogo = async (req, res) => {
    try {
        const {id} = req.params;
        const findById = await LogoModel.findById(id);
        if(!findById) return res.status(404).json({message: "logo is not found"});
        await LogoModel.findByIdAndDelete(id);
        res.status(200).json({message: 'delete logo successfully'})
    } catch (err) {
        res.status(500).json(err)
    }
  }
}

/** banner */
class BannerController {
    /** get all */
    static getAllBanner = async(req, res) => {
        try {
            const findAll = await BannerModel.find().sort({createdAt: -1});
            res.status(200).json(findAll);
        } catch(err) {
            res.status(500).json(err)
        }
    };

    /** get detail */
    static getDetailBanner = async(req, res) => {
        try {
            const {id} = req.params;
            const findById = await BannerModel.findById(id);
            if(!findById) return res.status(404).json({message: 'banner is not found'});

            res.status(200).json(findById);
        } catch(err) {res.status(500).json(err)}
    }

    /** create banner */
    static createBanner = async (req, res) => {
        try {  
            const newBanner = await BannerModel(req.body);
            await newBanner.save();
            res.status(200).json({message: 'create banner successfully'});

        } catch(err) {
            res.status(500).json(err)
        }
    };

    /** upate */
    static updateBanner = async (req, res) => {
        try {
            const {id} = req.params;
            const findById = await BannerModel.findById(id);
            if(!findById) return res.status(404).json({message: "banner is not found"});
            await findById.updateOne({$set: req.body});

            res.status(200).json({message: "update banner is successfully"})
        } catch (err) {
            res.status(500).json(err)
        }
    };

    /** delete banner  */
    static deleteBanner = async (req, res) => {
        try {
            const {id} = req.params;
            const findById = await BannerModel.findById(id);
            if(!findById) return res.status(404).json({message: "banner is not found"});
            
            await BannerModel.findByIdAndDelete(id);
            res.status(200).json({message: 'delete banner is successfully'})

        } catch(err) {
            res.status(500).json(err)
        }
    }
}

/** shop system */
class ShopSystemController {
    /** get all */
    static getAll = async(req, res) => {
        try {
            const find = await ShopSystemModel.find().sort({role: 'asc'});
            res.status(200).json(find);
        } catch(err) {
            res.status(500).json(err)
        }
    };

    /** get detail  */
    static getDetail = async(req, res) => {
        try{
            const {id} = req.params;
            const findById = await ShopSystemModel.findById(id);
            if(!findById) return res.status(200).json({message: "shop system is not found"});

            res.status(200).json(findById);
        } catch(err) {
            res.status(500).json(err)
        }
    }

    /** create shop system */
    static createShopSystem = async (req, res) => {
        try {
            const {role, title, slug} = req.body;
            const findRole = await ShopSystemModel.findOne({role})
            if(findRole) return res.status(400).json({message: 'role already exist'})
            const newShopSystem = await ShopSystemModel({role, title, slug});
            await newShopSystem.save();
            res.status(200).json({message: "add shop system is successfully"});
        } catch (err) {
            res.status(500).json(err)
        }
    }

    /** udpate shop system */
    static updateShopSystem = async (req, res) => {
        try {
            const {role, title, slug} = req.body;
            const {id} = req.params;
            const findById = await ShopSystemModel.findById(id);
            if(!findById) return res.status(404).json({message: "shop system is not found"});

            const findRole = await ShopSystemModel.findOne({role});
            
            if(findRole) {
                res.status(400).json({message: "role already exist"})
            }

            await findById.updateOne({$set: {role, title, slug}});
            res.status(200).json({message: "update shop system successfully"})

        } catch(err) {
            res.status(500).json(err);
        }
    };

    /** delete shop system */
    static deleteShopSystem = async(req, res) => {
        try {
            const {id} = req.params;
            const findById = await ShopSystemModel.findById(id);
            if(!findById) return res.status(404).json({message: "shop system is not found"})
            await ShopSystemModel.findByIdAndDelete(id);
            res.status(200).json({message: 'delete shop system is successfully'})
        } catch(err) {
            res.status(500).json(err)
        }
    }
}


module.exports = {
    LogoController,
    BannerController,
    ShopSystemController
}
