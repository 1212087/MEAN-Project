angular.module('postService',[])
.factory('Post',['$http', '$window', function($http, $window){
    // var currentPost;
    // var previousPosts = [];

    return {
        getCurrentPost : function(){
            return $window.localStorage.getItem("currentPost");
        },
        setCurrentPost : function(value){
            $window.localStorage.setItem("currentPost", value);
        },
        getPreviousPosts : function(){
            return JSON.parse($window.localStorage.getItem("previousPosts"));
        },
        // thêm 1 post vào đầu danh sách các post đã xem
        unshiftPreviousPosts : function(id){
            var previousPosts = JSON.parse($window.localStorage.getItem("previousPosts"));

            // nếu chưa có xem bài post nào trước đó thì add luôn vào previous posts
            if(previousPosts === null){
                $window.localStorage.setItem("previousPosts", JSON.stringify({1: id}));
            }
            // nếu đã xem bài post thì kiểm tra xem bài post này có trùng với bài nào đã xem ko
            else{
                var length = 1;
                angular.forEach(previousPosts, function(value, key){
                    console.log(key + ': ' +value);
                    if(value === id){
                        console.log('trùng');
                        return false;
                    }else{
                        length++;
                    }
                });
                previousPosts[length] = id;
                $window.localStorage.setItem("previousPosts", JSON.stringify(previousPosts));
            }
            // angular.forEach(previousPosts, function(value, key){
            //     if(value === id){
            //         return;
            //     }
            // });
            
        },
        submit : function(post){
            console.log(post);
        	return $http.post('/api/post/NewPost', post);
        },
        get : function(){
        	return $http.get('/api/post/list');
        },
        getByCategory : function(categoryId){
            console.log(categoryId);
        	return $http.post('/api/post/getByCategory', categoryId);
        },
        getByProvince: function(provinceId){
        	return $http.post('/api/post/getByProvince', provinceId);
        },
        getById: function(postDetailId){
        	return $http.post('/api/post/getById', postDetailId);
        }
    }
}])