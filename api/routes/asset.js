const assetRouter = require("express").Router();

const db = require("../../models");
const { Op } = require("sequelize");

const BASE = "/assets";

function getLink(id) {
  return `${BASE}/${id}`;
}

async function getAssetById(userId, assetId) {
  const filter = {
    where: {
      userId: { [Op.eq]: userId },
      id: { [Op.eq]: assetId },
    },
    attributes: { exclude: ["userId"] },
  };

  try {
    const asset = await db.asset.findOne(filter);
    return asset;
  } catch (err) {
    throw err;
  }
}

async function getAssetAncestors(userId, assetId) {
  let location = [];

  async function getAncestor(userId, assetId) {
    try {
      const asset = await getAssetById(userId, assetId);
      location.push(asset);
      if (!asset.locationId) {
        location.shift(); // removes the original asset from the array
        return location;
      }
      return await getAncestor(userId, asset.locationId);
    } catch (err) {
      throw err;
    }
  }

  try {
    const ancestors = await getAncestor(userId, assetId);
    return ancestors.map((ancestor) => ({
      ...ancestor.dataValues,
      links: { href: getLink(ancestor.id) },
    }));
  } catch (err) {
    throw err;
  }
}

async function getAssetChildren(userId, assetId) {
  const filter = {
    where: {
      userId: { [Op.eq]: userId },
      locationId: { [Op.eq]: assetId },
    },
    attributes: { exclude: ["userId"] },
    order: [["label", "ASC"]],
  };

  try {
    const children = await db.asset.findAll(filter);
    if (!children) {
      throw new Error("could not find asset children");
    }
    return children.map((child) => ({
      ...child.dataValues,
      links: { href: getLink(child.id) },
    }));
  } catch (err) {
    throw err;
  }
}

assetRouter.get("/", async function (req, res, next) {
  const typeId = req.query.typeId;
  const searchText = req.query.searchText;
  const filter = {
    where: {
      userId: { [Op.eq]: req.user.id },
    },
    attributes: { include: ["id", "label", "description", "typeId"] },
    order: [["label", "ASC"]],
  };

  if (typeId) {
    filter.where.typeId = typeId;
  }

  if (searchText) {
    filter.where.label = { [Op.iLike]: `%${searchText}%` };
  }

  try {
    const assets = await db.asset.findAll(filter);
    const assetsWithLinks = assets.map((asset) => {
      return { ...asset.dataValues, links: { href: `/assets/${asset.id}` } };
    });
    res.status(200).send({ assets: assetsWithLinks });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

assetRouter.get("/count", async function (req, res, next) {
  const filter = {
    where: {
      userId: { [Op.eq]: req.user.id },
    },
  };

  try {
    const count = await db.asset.count(filter);
    res.status(200).send({ count: count });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

assetRouter.post("/", async (req, res, next) => {
  console.log("req.body: ", req.body);
  const assetWithUser = { userId: req.user.id, ...req.body };
  try {
    const newAsset = await db.asset.create(assetWithUser);
    if (!newAsset) throw new Error("asset creation failed");
    const link = `/assets/${newAsset.id}`;
    res.status(201).send({ ...newAsset, links: { href: link } });
  } catch (err) {
    res.status(409).send({ error: err.message });
  }
});

assetRouter.get("/asset/:assetId", async (req, res, next) => {
  const userId = req.user.id;
  const assetId = req.params.assetId;

  try {
    const asset = await getAssetById(userId, assetId);
    if (!asset) throw new Error("asset not found");

    const ancestors = await getAssetAncestors(userId, assetId);
    if (!ancestors) {
      throw new Error("could not find asset tree");
    }
    asset.setDataValue("ancestors", ancestors);

    const children = await getAssetChildren(userId, assetId);
    if (!children) {
      throw new Error("could not find asset children");
    }
    asset.setDataValue("children", children);

    res.status(200).send(asset);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

assetRouter.patch("/asset/:assetId", async (req, res, next) => {
  const userId = req.user.id;
  const assetId = req.params.assetId;

  try {
    const asset = await getAssetById(userId, assetId);

    if (!asset) throw new Error("asset not found");

    const updatedAsset = await asset.update(req.body);

    if (!updatedAsset) throw new Error("asset could not be updated");

    const ancestors = await getAssetAncestors(userId, assetId);
    if (!ancestors) {
      throw new Error("could not find asset tree");
    }
    updatedAsset.setDataValue("ancestors", ancestors);

    const children = await getAssetChildren(userId, assetId);
    if (!children) {
      throw new Error("could not find asset children");
    }
    updatedAsset.setDataValue("children", children);

    res.status(200).send(updatedAsset);
  } catch (err) {
    res.status(409).send({ error: err.message });
  }
});

assetRouter.patch("/asset-types", async (req, res) => {
  const id = req.body.id;
  try {
    const assetType = await db.assetType.findByPk(id);

    if (!assetType) throw new Error(`asset type not found`);

    const updatedAssetType = await assetType.update(req.body);

    if (!updatedAssetType) throw new Error(`asset type could not be updated`);

    res.status(200).send(updatedAssetType);
  } catch (err) {
    res.status(409).send({ error: err.message });
  }
});

assetRouter.post("/asset-types", async (req, res) => {
  try {
    const newAssetType = await db.assetType.create(req.body);

    if (!newAssetType) throw new Error(`asset type could not be created`);

    res.status(200).send(newAssetType);
  } catch (err) {
    res.status(409).send({ error: err.message });
  }
});

module.exports = assetRouter;
