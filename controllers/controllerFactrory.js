const asyncHandler = require("express-async-handler");
const ApiError = require("../utls/apiError");
const Apifeature = require("../utls/apiFeature");

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }
    document.remove();
    res.status(204).send();
  });

exports.updateOne = (model) =>
  asyncHandler(async (req, res, next) => {
    const document = await model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!document) {
      return next(new ApiError(`no document fo this id ${req.params.id}`, 404));
    }
    document.save();
    res.status(200).json({ data: document });
  });

exports.createOne = (model) =>
  asyncHandler(async (req, res) => {
    const doc = await model.create(req.body);
    res.status(201).json({ data: doc });
  });
exports.getOne = (Model, populationOpt) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // 1) Build query
    let query = Model.findById(id);
    if (populationOpt) {
      query = query.populate(populationOpt);
    }

    // 2) Execute query
    const document = await query;

    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }
    res.status(200).json({ data: document });
  });
exports.getAll = (Model, modelName = "") =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    // Build query  Model.find(filter)
    const documentsCounts = await Model.countDocuments();
    const apiFeatures = new Apifeature(req.query, Model.find(filter))
      .pagination(documentsCounts)
      .filter()
      .search(modelName)
      .fields()
      .sorting();

    // Execute query
    const { mongooseQuery, paginationReult } = apiFeatures;
    const documents = await mongooseQuery;

    res
      .status(200)
      .json({ results: documents.length, paginationReult, data: documents });
  });
