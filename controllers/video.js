var models = require('../models');
var Vcategory = models.Vcategory;
var Video = models.Video;

// --------------- 前台 -----------------
exports.index = function (req, res, next) {
  Vcategory.findOne({_id: req.params.id}, function(error, vcategory){
    if (error) {
      return next(error);
    }
    Video.find({vcategoryId: vcategory.id}).exec(function(err, videos){
      if (err) {
        return next(err);
      }
      res.render('video/index', { videos: videos, vcategory: vcategory });
    });
  });
};

exports.show = function (req, res, next) {
  Video.findOne({_id: req.params.id}).exec(function(err, video){
    if (err) {
      return next(err);
    };
    Vcategory.findOne({_id: video.vcategoryId}, function(error, vcategory){
      if (error) {
        return next(error);
      };
      res.render('video/show', { video: video, vcategory: vcategory });
    });
  });
};

// -------------- 后台管理部分 ---------------
// for video category
exports.vcategoryindex = function (req, res, next) {
  Vcategory.find({}, function(err, vcategories){
    if (err) {
      return next(err);
    }

    res.send(vcategories);
  });
};

exports.vcategoryshow = function (req, res, next) {
  Vcategory.findOne({_id: req.params.id}, function(err, vcategory){
    if (err) {
      return next(err);
    }

    res.send(vcategory);
  });
};

exports.vcategorycreate = function (req, res, next) {
  var vcategory = new Vcategory();
  vcategory.name = req.body.name;
  vcategory.save(function(err){
    if (err) {
      return next(err);
    };
    res.send({result: 'success'});
  });
};

exports.vcategoryupdate = function (req, res, next) {
  Vcategory.findOne({_id: req.params.id}, function (err, vcategory){
    vcategory.name = req.body.name;
    vcategory.save(function(err){
      if (err) {
        console.log(err.err);
        return next(err);
      };
      res.send({result: 'success'});
    });
  });
};

exports.vcategorydestroy = function (req, res, next) {
  Vcategory.remove({_id: req.params.id}, function (err) {
    if (err) return next(err);
  });
};

// for video
exports.videoindex = function (req, res, next) {
  Video.find({vcategoryId: req.params.cid}).exec(function(err, videos){
    if (err) {
      return next(err);
    }

    res.send(videos);
  });
};

exports.videoshow = function (req, res, next) {
  Video.findOne({_id: req.params.id, vcategoryId: req.params.cid}, function(err, video){
    if (err) {
      return next(err);
    };
    res.send(video);
  });
};


exports.videocreate = function (req, res, next) {
  video = new Video();
  video.name = req.body.name;
  video.url = req.body.url;
  video.vcategoryId = req.body.vcategoryId;
  video.save(function(err){
    if (err) {
      return res.send({result: 'failure', message: '出现了某些错误!'});
    };
    res.send({result: 'success'});
  });
};

exports.videoupdate = function (req, res, next) {
  Video.findOne({_id: req.params.id, vcategoryId: req.params.cid}, function (err, video){
    video.name = req.body.name;
    video.url = req.body.url;
    video.save(function(err){
      if (err) {
        console.log(err.err);
        return res.send({result: 'failure', message: '出现了某些错误!'});
        //return next(err);
      };
      res.send({result: 'success'});
    });
  });
};

exports.videodestroy = function (req, res, next) {
  Video.remove({_id: req.params.id, vcategoryId:req.params.cid}, function(err){
    if (err) return next(err);
  });
};
