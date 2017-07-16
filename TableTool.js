$(function () {
    init();
});


function init() {

    var workpieceList = getInfo();

    function getInfo() {
        var obj1 = {
            moldNo: "TC170010",
            partNo: "A001",
            subPartNo: "AAA",
            taskStatus: 1
        };
        var obj2 = {
            moldNo: "TC170011",
            partNo: "A002",
            subPartNo: "AAB",
            taskStatus: 2
        };
        var arr = [obj1, obj2];
        return arr;
    }


    var tableBean = new TableBean();

    tableBean.thead.id = "workpieceThead";
    tableBean.tbody.id = "workpieceTbody";

    var rowBean = new RowBean();
    var moldNoColumn = new ColumnBean("", "moldNo", "模號", "moldNo_i18n");
    var partNoColumn = new ColumnBean("", "partNo", "件號", "partNo_i18n");
    var subPartNoColumn = new ColumnBean("", "subPartNo", "分件號", "subPartNo_i18n");
    var taskStatusColumn = new ColumnBean("", "taskStatus", "狀態", "taskStatus_i18n");
    var operationColumn = new ColumnBean("", "operation", "操作", "");
    rowBean.columnArray = [moldNoColumn, partNoColumn, subPartNoColumn, taskStatusColumn, operationColumn];
    tableBean.thead.appendRowBean(rowBean);


    workpieceList.forEach(function (workpiece) {
        var rowBean = new RowBean();
        rowBean.setData("workpiece", workpiece);

        var moldNo = new ColumnBean("", "moldNo", workpiece.moldNo, "");
        var partNo = new ColumnBean("", "partNo", workpiece.partNo, "");
        var subPartNo = new ColumnBean("", "subPartNo", workpiece.subPartNo, "");
        var taskStatus = new ColumnBean("", "taskStatus", workpiece.taskStatus, "");
        rowBean.appendColumnBean(partNo);
        rowBean.appendColumnBean(subPartNo);
        rowBean.appendColumnBean(moldNo);
        rowBean.appendColumnBean(taskStatus);


        var operation = new ColumnBean();
        var updateButton = $("<button>", {class:"btn updateButton", html:"更新"});
        operation.setDomObject(updateButton);

        rowBean.appendColumnBean(operation);


        tableBean.tbody.appendRowBean(rowBean);
        
    });

    var tableTool = new TableTool();
    var table = tableTool.create(tableBean);
    $("#test").append(table);

    var tableId = "test2";
    tableTool.createByTableId(tableBean, tableId);
    
    tableBean.thead = {};
    var tableId2 = "test3";
    tableTool.createTbodyByTableId(tableBean, tableId2);
}

//test setData
$(document).on('click', ".updateButton", function(){
    var data = $(this).closest("tr").data("workpiece");
    console.log(data);
});







function TableBean(id, className, name, i18n) {
    BasicBean.call(this, id, className, name, i18n);
    this.thead = new TheadBean();
    this.tbody = new TbodyBean();

}

function TheadBean(id, className, name, i18n) {
    BasicBean.call(this, id, className, name, i18n);
    //this.tr = new RowBean();
    this.rowArray = [];
    this.appendRowBean = function(rowBean) {
        this.rowArray.push(rowBean);
    }
}

function TbodyBean(id, className, name, i18n) {
    BasicBean.call(this, id, className, name, i18n);

    this.rowArray = [];
    this.appendRowBean = function(rowBean) {
        this.rowArray.push(rowBean);
    }
}

function RowBean(id, className, name, i18n){
    BasicBean.call(this, id, className, name, i18n);

    this.columnArray = [];
    this.appendColumnBean = function (columnBean) {
        this.columnArray.push(columnBean);
    }
    this.data = {};
    this.setData = function (dataName, dataObject){
        this.data.dataName = dataName;
        this.data.dataObject = dataObject;
    }
}

function ColumnBean(id, className, name, i18n) {
    BasicBean.call(this, id, className, name, i18n);

    this.domObject = {};
    this.setDomObject = function (domObject) {
        this.domObject = domObject;
    }

    this.data = {};
    this.setData = function (dataName, dataObject){
        this.data.dataName = dataName;
        this.data.dataObject = dataObject;
    }
}
function DomObject(id, className, name, i18n) {
    BasicBean.call(this, id, className, name, i18n);

    this.domType = "";
    this.setDomType = function (domType){
        this.domType = domType;
    }

}

function BasicBean(id, className, name, i18n) {
    this.id = id;
    this.className = className;
    this.name = name;
    this.i18n = i18n;
    this.css = {};

    this.setId = function (id) {
        this.id = id;
    }
    this.setClassName = function (className) {
        this.className = className;
    }
    this.setName = function (name) {
        this.name = name;
    }
    this.setI18n = function (i18n) {
        this.i18n = i18n;
    }
}

function TableTool(){

    /*
    *   方法敘述:根據tableBean的資料動態產生table
    *   缺點沒有自動依照className排序，必須注意資料欄位是否有對到標頭名稱
    *   param tableBean
    *   return table DOM object
    */
    this.create = function(tableBean){
        var table = $("<table/>", {id : tableBean.id , class : tableBean.className});
        var thead = $("<thead/>", {id : tableBean.thead.id , class : tableBean.thead.className});
        var tbody = $("<tbody/>", {id : tableBean.tbody.id , class : tableBean.tbody.className});
       
        var rowArrayForThead = tableBean.thead.rowArray;
        rowArrayForThead.forEach(function(rowBean){
            var trForThead = $("<tr/>");
            renderTr(trForThead, rowBean);
            thead.append(trForThead);
        });
        table.append(thead);

        var rowArrayForTbody = tableBean.tbody.rowArray;
        rowArrayForTbody.forEach(function(rowBean){
            var trForTbody = $("<tr/>");
            renderTr(trForTbody, rowBean);
            tbody.append(trForTbody);
        });
        table.append(tbody);
        return table;
    }
    

    /*
    *   方法敘述:根據tableBean的資料，新增至已存在table DOM object
    *   具有自動依照className排序，必須注意標頭欄位與資料欄位的className必需一致
    *   param tableBean
    *   param tableId
    *   return void，無回傳值
    */
    this.createByTableId = function(tableBean, tableId){
        if(!document.getElementById(tableId)){
            console.error('該tableId不存在');
            return false;
        }

        var table = $("#" + tableId);
        var thead = $("<thead/>", {id : tableBean.thead.id , class : tableBean.thead.className});
        var tbody = $("<tbody/>", {id : tableBean.tbody.id , class : tableBean.tbody.className});
        table.append(thead);
        table.append(tbody);
        
        var rowArrayForThead = tableBean.thead.rowArray;

        rowArrayForThead.forEach(function(rowBean){
            var trForThead = $("<tr/>");
            renderTr(trForThead, rowBean);
            thead.append(trForThead);
        });

        var theadColumnLength = tableBean.thead.rowArray[0].columnArray.length;

        var rowArrayForTbody = tableBean.tbody.rowArray;

        rowArrayForTbody.forEach(function(rowBean){
            renderTrAutoSort(tbody, rowBean, theadColumnLength);
        });
    }

    /*
    *   方法敘述:根據tableBean的資料，新增至已存在table 和 thead 的DOM object
    *   具有自動依照className排序，必須注意標頭欄位與資料欄位的className必需一致
    *   param tableBean
    *   param tableId
    *   return void，無回傳值
    */
    this.createTbodyByTableId = function(tableBean, tableId){

        if(!document.getElementById(tableId)){
            console.error('該tableId不存在');
            return false;
        }

        var table = $("#" + tableId);
        //取得已經先建立好的thead欄位數量
        var theadColumnLength = table.find("thead tr td").length
        var tbody = table.find("tbody");

        var rowArrayForTbody = tableBean.tbody.rowArray;
        rowArrayForTbody.forEach(function(rowBean){
            renderTrAutoSort(tbody, rowBean, theadColumnLength);
        });
    }

    //資料欄位會根據標頭欄位自動排序後，再進行渲染
    function renderTrAutoSort(tbody, rowBean, theadColumnLength){
        var trForTbody = $("<tr/>");
        if(rowBean.data){
            trForTbody.data(rowBean.data.dataName, rowBean.data.dataObject);
        }
        for(var i = 0; i < theadColumnLength; i++){
            var tdForTbody = $("<td/>");
            trForTbody.append(tdForTbody);
        }
        tbody.append(trForTbody);

        var columnArray = rowBean.columnArray;
        columnArray.forEach(function(columnBean){
            //先取得thead中欄位的位置
            var theadColumnIndex = tbody.closest("table").find("thead").find("." + columnBean.className).index();
            //在取得tbody中對應欄位位置
            var td = trForTbody.find("td").eq(theadColumnIndex);
            //檢查ColumnBean中是否為空物件，否的話渲染欄位
            checkColumnBeanAndRenderTd(td, columnBean);
        });
    }

    //根據用戶自定義的欄位陣列進行渲染
    function renderTr(tr, rowBean){
        if(isEmptyObject(rowBean.data)){
            tr.data(rowBean.data.dataName, rowBean.data.dataObject);
        }

        var columnArray = rowBean.columnArray;
        columnArray.forEach(function(columnBean){
            var td = $("<td/>");
            checkColumnBeanAndRenderTd(td, columnBean);
            tr.append(td);
        });
    }

    function checkColumnBeanAndRenderTd(td, columnBean){
         //i18n與顯示名稱擇一
        if(!isEmptyObject(columnBean.i18n)){
            td.append(columnBean.i18n);
        }
        else if(!isEmptyObject(columnBean.name)){
            td.append(columnBean.name);
        }

        if(!isEmptyObject(columnBean.id)){
            td.attr("id", columnBean.id);
        }

        if(!isEmptyObject(columnBean.className)){
            td.attr("class", columnBean.className);
        }
        
        //若有dom物件時
        if(!isEmptyObject(columnBean.domObject)){
            td.append(columnBean.domObject[0]);
        }
    }
}

//檢查是否為空物件
function isEmptyObject(obj) {
    //若值是int也會判定為空物件，應回傳false，table才會顯示
    if(typeof obj == "number"){
        return false;
    }
    for (var key in obj) {
        return false;
    }
    return true;
}