angular.module('postService',[])
.factory('Post',['$http', function($http){
    return {
        get: function(){
            var posts = $http.get('/api/post/list');
            console.log("Posts recieved: "+ provinces);
            return provinces;
        }
    }
}])