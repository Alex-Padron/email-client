var Persister = function(db) {
  var that = Object.create(Persister);

  /**
     @param object {Object} to be persisted in the database. Must match the
     model that was passed when the persister was created
     @param callback {function} to be called with the result of the insertion
   */
  that.persist = function(object, callback) {
    db.create(object, callback);
  }

  /**
     @param matcher {Object} to be matched against for removing elements.
     Must match the model that was passed to the persister when created.
     @param callback {function} to be called with the result of removing
     from the db
   */
  that.remove = function(matcher, callback) {
    db.remove(matcher, callback);
  }

  /**
     Loads all data from the table and passes it to callback
     @param callback {function} to be called with the data loaded
     from the database.
   */
  that.load = function(callback) {
    db.find(function(err, object_list) {
      if (err) {
	callback(err, undefined);
      } else {
	callback(undefined, object_list);
      }
    });
  }

  Object.freeze(that);
  return that;
};

module.exports = Persister;
