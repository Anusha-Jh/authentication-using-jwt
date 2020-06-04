angular.module('myApp')
.service('AuthService', function($q,$http){
    var LOCAL_TOKEN='anusha';
    var isAuthenticated = false;
    var authToken;
    function loadToken(){
        var token= window.localStorage.getItem(LOCAL_TOKEN);
        if (token) {
            useToken(token);
        }
    };
    function storeToken(token){
        window.localStorage.setItem(LOCAL_TOKEN,token);
        useToken(token);
    };
    function useToken(token){
        isAuthenticated= true;
        authToken=token;
        $http.defaults.headers.common.Authorization = authToken;
    };
    function destryToken(){
        authToken= undefined;
        var isAuthenticated= false;
        $http.defaults.headers.common.Authorization = undefined;
        window.localStorage.removeItem(LOCAL_TOKEN);

    };
    var register= function(user){
        return $q(function(resolve,reject){
            $http.post('http://localhost:4000/signup',user).then(function(response){
                if(response.data.success){
                    resolve(response.data.message);
                }else{
                    reject(response.data.message);
                }

            })
            
        })
    };
    var login= function(user){
        return $q(function(resolve,reject){
            $http.post('http://localhost:4000/signup',user).then(function(response){
                if(response.data.success){
                    storeToken(response.data.token);
                    resolve(response.data.message);
                }else{
                    reject(response.data.message);
                }

            })
        });
    };
    var logout= function(){
        destryToken();
    };
    loadToken();
    return{
        login:login,
        register: register,
        logout:logout,
        isAuthenticated: function(){ return isAuthenticated;}
    };

})
.factory('AutheIntercepter', function($rootScope, $q){
    return {
        responseError: function(response){
            $rootScope.$broadcast({
                401:'user not authenticated'}[response.status].response)
            return $q.reject(response);
            
        }
    }

})
.config(function($httpProvider){
    $httpProvider.intercepters.push('AuthIntercepter');
})