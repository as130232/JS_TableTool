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
