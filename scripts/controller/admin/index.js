define(['app','downloader'], function (app,downloader) {
    app.controller('Admin', ['$scope', '$bus', '$location', 'ngProgress', '$http', '$constants', '$routeParams','$window', '$rootScope', '$timeout','notify', '$localStorage',
        function ($scope, $bus, $location, ngProgress, $http, $constants, $routeParams,$window, $rootScope, $timeout, notify, $localStorage) {

            $scope.validationMessages = $constants.validationMessages;

            $scope.formatBillingDate = function(startDate, endDate) {
                var month_names     = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                if (startDate && endDate) {
                    sDate = startDate.split("-")[0]+ ' ' + month_names[parseInt(startDate.split("-")[1])] + ' ' + startDate.split("-")[2];
                    eDate = endDate.split("-")[0]+ ' ' + month_names[parseInt(endDate.split("-")[1])] + ' ' + endDate.split("-")[2];
                    return sDate + ' - ' + eDate;
                }
                return $scope.constants.notAvailableText;
            };

            $scope.formatMonth = function(param){
                if(param) {
                    var dates = param.split('-');
                    
                    if(dates[1] < 10)
                        dates[1] = '0'+dates[1];

                    return dates[0]+'/'+dates[1]+'/'+dates[2];
                }
            }

            $scope.generateInvoiceDates = function() {

                var invoiceGenerationDates = [];

                for(var i=1;i<=$constants.adminInvoiceGeneration.numberOfMonths;i++) {
                    
                    var nowDate = new Date();
                    nowDate.setMonth(nowDate.getMonth() - (i));
                    var endDate = $constants.adminInvoiceGeneration.endDate+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getFullYear();
                    
                    var nowDate = new Date();
                    nowDate.setMonth(nowDate.getMonth() - (i+1));
                    var startDate = $constants.adminInvoiceGeneration.startDate+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getFullYear();

                    invoiceGenerationDates.push({stringDate:$scope.formatBillingDate(startDate,endDate),startDate:$scope.formatMonth(startDate),endDate:$scope.formatMonth(endDate)});

                } 

                return invoiceGenerationDates?invoiceGenerationDates:'';
            }
                


            $scope.getInvoiceDetails = function() {

                $scope.invoiceGenerationDates = $scope.generateInvoiceDates();

                $scope.selectedInvoiceDates = $scope.invoiceGenerationDates[0];

                $scope.loading = { nodata : true };
            }

            $scope.sendInvoiceDetails = function() {
                
                $scope.loading = { nodata : false, load : true };

                $scope.myData = [];
                
                $bus.fetch({
                      name: 'generateinvoice',
                      api: 'generateinvoice',
                      params:$scope.getQueryParam(),
                      data:null,
                      decodeuri: true
                  })
                .done(function (success) {
                    
                     $scope.loading = { nodata : true, load : false };

                    if(success.response && success.response.success && success.response.success.length) {
                        
                        $scope.myData = success.response.data.invoices;
                        
                        var invoices = [];
                        var data = success.response.data;
                        invoices = data.invoices;

                        $scope.fromRecord = Number(data.fromRecord);
                        $scope.toRecord = Number(data.toRecord);
                        $scope.totalRecord = Number(data.totalRecords);
                        $scope.setPagingData(invoices, (data.toRecord / (data.toRecord - data.fromRecord + 1)), (data.toRecord - data.fromRecord + 1), data.totalRecords);
                        $scope.setPageSizeClickLength();


                    } else {
                      
                      var errors = [];
                        _.forEach(success.response.errors, function (error) {
                            errors.push(error)
                        });
                        if (errors.length) {
                            notify.message($rootScope.pushJoinedMessages(errors));

                        } else {
                            notify.message(messages.invoiceGenerationError);
                        }
                    }
                }).fail(function (error) {
                    $rootScope.activateOverlay = false;
                    notify.message(messages.invoiceGenerationError);
                });

            }

            $scope.convertDateFormat = function (date, format, separator,toseparator) {
                var separator = separator || "/";
                var dates = date.split(separator);
                var dd, mm, yyyy;
                dd   = dates[0];
                mm   = dates[1];
                yyyy = dates[2];
                if      (format == "mm/dd/yyyy")    return mm + toseparator + dd + toseparator + yyyy;
                else if (format == "dd/mm/yyyy")    return dd + toseparator + mm + toseparator + yyyy;
                else if (format == "yyyy/mm/dd")    return yyyy + toseparator + mm + toseparator + dd;
            };

            $scope.sendBulkInvoiceDetails = function() {
                
                $rootScope.activateOverlay = true;

                $bus.fetch({
                      name: 'generatebulkinvoice',
                      api: 'generatebulkinvoice',
                      data: { 
                        fromdate :!_.isEmpty($scope.selectedInvoiceDates)?$scope.convertDateFormat($scope.selectedInvoiceDates.startDate,'yyyy/mm/dd','/','-'):'', 
                        todate : !_.isEmpty($scope.selectedInvoiceDates)?$scope.convertDateFormat($scope.selectedInvoiceDates.endDate,'yyyy/mm/dd','/','-'):''
                    }
                  })
                .done(function (success) {
                    
                    $rootScope.activateOverlay = false;

                    if(success.response && success.response.success && success.response.success.length) {
                        notify.message(messages.invoiceBulkGenerationSuccess,'','succ');
                    } else {
                      
                      var errors = [];
                        _.forEach(success.response.errors, function (error) {
                            errors.push(error)
                        });
                        if (errors.length) {
                            notify.message($rootScope.pushJoinedMessages(errors));

                        } else {
                            notify.message(messages.invoiceBulkGenerationError);
                        }
                    }
                }).fail(function (error) {
                    $rootScope.activateOverlay = false;
                    notify.message(messages.invoiceBulkGenerationError);
                });

            }

            $scope.paging = function (page, index) {

                if (index == 'last') {
                    page = Math.ceil($scope.totalRecord / $scope.pagingOptions.pageSize);
                }

                if ($scope.pagingOptions.currentPage != page && page > 0) {

                    $scope.pagingOptions.currentPage = page;
                    $scope.applyFilter();
                }
                $scope.pagingOptions.currentPage = (page > 0) ? page : $scope.pagingOptions.currentPage;
            }
            
            $scope.changePage = function(param){
                $scope.showingSize = param.pageSize;
                $localStorage.pagingOptions.products.pageSize = param.pageSize;
                $scope.applyFilter();
            }

            $scope.getQueryParam = function () {
                
                if ($routeParams.p)
                    $scope.pagingOptions.currentPage = Number($routeParams.p);

                $scope.pagingOptions.pageSize = $scope.showingSize = $localStorage.pagingOptions.products.pageSize;


                var params = {
                    p: $routeParams.p || null,
                    rcd: $scope.pagingOptions.pageSize || null,
                    fromdate :!_.isEmpty($scope.selectedInvoiceDates)?$scope.selectedInvoiceDates.startDate:null, 
                    todate : !_.isEmpty($scope.selectedInvoiceDates)?$scope.selectedInvoiceDates.endDate:null,
                };

                return _.omit(params, function (value, key) {
                    return !value;
                });
            }

            $scope.getPagingNum = function (currentPage, index) {
                return (currentPage + index);
            }

            $scope.setPageSizeClickLength = function () {
                var totalPages = Math.ceil($scope.totalRecord / $scope.pagingOptions.pageSize);
                $scope.pageSize = {
                    pageSizeClickLength: []
                }
                $scope.pageSize.pageSizeClickLength = [];

                //last
                if ($scope.pagingOptions.currentPage == totalPages) {
                    var count = 0;
                    for (var i = totalPages; i > 0; i--) {
                        count++;
                        $scope.pageSize.pageSizeClickLength.unshift(i);
                        if (count == 5) break;
                    }
                }

                //first
                else if ($scope.pagingOptions.currentPage == 1) {
                    var count = 0;
                    for (var i = 1; i <= totalPages; i++) {
                        count++;
                        $scope.pageSize.pageSizeClickLength.push(i);
                        if (count == 5) break;
                    }
                }

                //In - Between
                else {
                    var diffToStart, diffToEnd, count = 0,
                        startClickLength;
                    diffToStart = $scope.pagingOptions.currentPage - 1;
                    diffToEnd = totalPages - $scope.pagingOptions.currentPage;
                    if (totalPages <= 5 || diffToStart <= 2) startClickLength = 1;
                    else if (diffToStart >= 2 && diffToEnd >= 2) startClickLength = $scope.pagingOptions.currentPage - 2;
                    else if (diffToEnd < 2) startClickLength = $scope.pagingOptions.currentPage - 3;

                    for (var i = startClickLength; i <= totalPages; i++) {
                        count++;
                        $scope.pageSize.pageSizeClickLength.push(i);
                        if (count == 5) break;
                    }
                }
            }


            $scope.setPagingData = function (data, page, pageSize, totalSize) {
                $scope.myData = data;
                $scope.totalServerItems = totalSize;
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            };

            $scope.applyFilter = function (applyClicked) {
                
                var totalPageCount = Math.ceil($scope.totalRecord / $scope.pagingOptions.pageSize);
                var pageToFetch = ($scope.pagingOptions.currentPage > totalPageCount) ? totalPageCount : $scope.pagingOptions.currentPage;
                
                var filterQuery = $routeParams;
                
                var query = ($scope.pagingOptions.currentPage ? 'p=' + pageToFetch + '&' : '') + ($scope.pagingOptions.pageSize ? 's=' + $scope.pagingOptions.pageSize + '&' : '');
                
                if (query && ($location.url() != $location.path() + '?' + query)) {
                    $location.url($location.path() + '?' + query);
                    $timeout(function() {
                        $('#list-invoices').click();
                    }, 100);
                }
            };

            $scope.init = function () {
                
                var path = $location.path();

                $scope.pagingOptions = {
                    pageSizes: [10, 25, 50, 100],
                    pageSize: $localStorage.pagingOptions.products.pageSize,
                    currentPage: 1
                };

                switch (path) {
                    
                    case '/admin':
                        $scope.getInvoiceDetails();
                    break;
                }

            };
            
        }
    ]);
});