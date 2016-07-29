angular.module('postService', [])
    .factory('Post', ['$http', '$window', function($http, $window) {
        // var currentPost;
        // var previousPosts = [];

        return {
            getCurrentPost: function() {
                return $window.localStorage.getItem("currentPost");
            },
            setCurrentPost: function(value) {
                $window.localStorage.setItem("currentPost", value);
            },
            getPreviousPosts: function() {
                if ($.isEmptyObject(JSON.parse($window.localStorage.getItem('previousPosts')))) {
                    return null;
                } else {
                    var posts = JSON.parse($window.localStorage.getItem("previousPosts"));
                    var previousPosts = [];
                    angular.forEach(posts, function(value, key) {
                        previousPosts.push(value);
                    });

                    return previousPosts;
                }
            },
            // thêm 1 post vào đầu danh sách các post đã xem
            unshiftPreviousPosts: function(post) {
                var previousPosts = JSON.parse($window.localStorage.getItem("previousPosts"));

                // nếu chưa có xem bài post nào trước đó thì add luôn vào previous posts
                if (previousPosts === null) {
                    $window.localStorage.setItem("previousPosts", JSON.stringify({
                        1: post
                    }));
                }
                // nếu đã xem bài post thì kiểm tra xem bài post này có trùng với bài nào đã xem ko
                else {
                    var length = 1;
                    var found = false; // kiểm tra đã xem bài post đó chưa
                    angular.forEach(previousPosts, function(value, key) {
                        if (!found) {
                            if (value._id === post._id) { // bài này đã xem rồi
                                found = true;
                            } else {
                                length++;
                            }
                        }
                    });
                    if (!found) { // chưa xem thì thêm vào danh sách bài viết vừa xem
                        previousPosts[length] = post;
                        $window.localStorage.setItem("previousPosts", JSON.stringify(previousPosts));
                    }
                }
                // angular.forEach(previousPosts, function(value, key){
                //     if(value === id){
                //         return;
                //     }
                // });

            },
            submit: function(post) {
                console.log(post);
                return $http.post('/api/post/NewPost', post);
            },
            get: function() {
                return $http.get('/api/post/list');
            },
            getByCategory: function(categoryId) {
                console.log(categoryId);
                return $http.post('/api/post/getByCategory', categoryId);
            },
            getByProvince: function(provinceId) {
                return $http.post('/api/post/getByProvince', provinceId);
            },
            getByProvinceAndCategory: function(value) {
                return $http.post('/api/post/getByProvinceAndCategory', value);
            },
            getById: function(postDetailId) {
                return $http.post('/api/post/getById', postDetailId);
            },
            getByUser: function(user) {
                return $http.post('/api/post/getByUser', user);
            },
            update: function(post){
                return $http.post('/api/post/update', post);
            }
        };
    }]);