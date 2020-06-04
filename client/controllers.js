angular.module('myApp')
.controller('loginCtrl', function($scope,AuthService,$state,$stateParams){
    $scope.user = {email:'', password:''};
    if($stateParams.obj !==null){
        $scope.message =$stateParams.obj;
    };
    $scope.login = function(){
        AuthService.login($scope.user).then(function(msg){
            $state.go('profile')
        },function(errMsg){
            $scope.user= {email:'', password:''};
            var alertMsg={
                title:'Login Failed',
                template:errMsg
            };
            $state.go('home.login',{obj:alertMsg});
        }
        );
    };
})
.controller('registerCtrl', function($scope,AuthService,$state,$stateParams){
    $scope.user={email:'',password:''};
    if($stateParams.obj !==null){
        $scope.message = $stateParams.obj;
    };
    $scope.register = function(){
        AuthService.register($scope.user).then(function(msg){
            var alertMsg={
                title:'register success',
                template:msg
            };
            $state.go('home.login',{obj:alertMsg})
        },function(errMsg){
            $scope.user= {email:'', password:''};
            var alertMsg={
                title:'Register Failed',
                template:errMsg
            };
            $state.go('home.register',{obj:alertMsg});
        }
        );
    };
})
.controller('profileCtrl', function(){
    $scope.getInfo = function(){
        $http.get('http://localhost:4000/profile').then(function(response){
            $scope.user=response.data.user;
        });
    };
    $scope.logout = function(){
        AuthService.logout();
        $state.go('home.login');
    };
    $scope.killSession= function(){
        AuthService.logout();
    };

})
.controller('AppCtrl', function($scope,$state,AuthService){
    $scope.$on('auth-not-authenticated', function(event){
        AuthService.logout();
        var alertMsg ={
            title:'Session is lost',
            template:'need to login again'
        };
        $state.go('home.login',{obj:alertMsg});
    })
    
})