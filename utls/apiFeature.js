class Apifeature {
  constructor(queryStr, mongooseQuery) {
    this.queryStr = queryStr;
    this.mongooseQuery = mongooseQuery;
  }

  pagination(countDocuments) {
    const page = this.queryStr.page || 1;
    const limit = this.queryStr.limit || 50;
    const skip = (page - 1) * limit;
    const endPageIndex = page * limit;
    /////////////////////
    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numperOfPages = Math.ceil(countDocuments / limit);
    // next page
    if (endPageIndex < countDocuments) {
      pagination.next = page + 1;
    }
    // prev page
    if (skip > 0) {
      pagination.prev = page - 1;
    }
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.paginationReult = pagination;
    return this;
  }

  filter() {
    const queryStringObkct = { ...this.queryStr };
    const excludeFields = ["page", "limit", "sort", "fields", "keyword"];
    excludeFields.forEach((field) => delete queryStringObkct[field]);
    let queryStr = JSON.stringify(queryStringObkct);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
    return this;
  }

  sorting() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  fields() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  search(modelName) {
    if (this.queryStr.keyword) {
      let  query = {};
      if(modelName=== 'product') {
        // eslint-disable-next-line prefer-destructuring
        const keyword = this.queryStr.keyword;
        query.$or = [
          { title: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ];
      }else {
        const {keyword} = this.queryStr;
        
        query = { name: { $regex: keyword, $options: "i" } }
      }
      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }
}
module.exports = Apifeature;
