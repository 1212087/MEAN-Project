angular.module('messageService', [])
    .factory('Message', ['$http', '$window', function($http, $window) {
        return {
            new: function(message) {
                return $http.post('/api/message/new', message);
            },
            SentMessages : function(_id){
                return $http.post('/api/message/sent-messages', _id);
            },
            RecievedMessages: function(_id) {
                return $http.post('/api/message/recieved-messages', _id);
            }, 
            countUnread: function(_id){
                return $http.post('/api/message/countUnread', _id);
            }
        };
    }]);