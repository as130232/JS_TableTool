$(function(){
});

function TableTool(){
	
	/**
	 * 資料綁定
	 * @author charles.chen
	 * @date 2017年7月16日 上午4:30:09
	 * @param tableBean
	 * @return	tableBean
	 */
	this.bind = function(data){
		var tableBean = new TableBean();
		//bind data
		
		return tableBean;
	}
	
	/**
	 * 根據tableBean的資料動態產生table
	 * 缺點沒有自動依照className排序，必須注意資料欄位是否有對到標頭名稱
	 * @author charles.chen
	 * @date 2017年7月16日 上午4:30:09
	 * @param tableBean
	 * @return table DOM object
	 */
    this.create = function(tableBean){
        var table = $("<table/>", {id : tableBean.id , class : tableBean.className});
        table.css({"font-family":"微軟正黑體", "border":"none", "padding":"0px", "width": "95%"});
        table.addClass("cim3");
        
        var thead = $("<thead/>", {id : tableBean.thead.id , class : tableBean.thead.className});
        var tbody = $("<tbody/>", {id : tableBean.tbody.id , class : tableBean.tbody.className});
       
        var rowArrayForThead = tableBean.thead.rowArray;
        rowArrayForThead.forEach(function(rowBean){
            var trForThead = createTr();
            renderTheadTr(trForThead, rowBean);
            thead.append(trForThead);
        });
        table.append(thead);

        var rowArrayForTbody = tableBean.tbody.rowArray;
        rowArrayForTbody.forEach(function(rowBean){
            var trForTbody = createTr();
            renderTbodyTr(trForTbody, rowBean);
            tbody.append(trForTbody);
        });
        table.append(tbody);
        return table;
    }
    
	/**
	 * 根據tableBean的資料，新增至已存在table DOM object
	 * 具有自動依照className排序，必須注意標頭欄位與資料欄位的className必需一致
	 * @author charles.chen
	 * @date 2017年7月16日 上午4:30:09
	 * @param tableBean
	 * @param tableId dom物件中table的id
	 * @return void
	 */
    this.createByTableId = function(tableBean, tableId){
    	
        var table = renderTable(tableId);
        var thead = $("<thead/>", {id : tableBean.thead.id , class : tableBean.thead.className});
        var tbody = $("<tbody/>", {id : tableBean.tbody.id , class : tableBean.tbody.className});

        table.append(thead);
        table.append(tbody);
        
        renderTitle(table, tableBean);

        var rowArrayForThead = tableBean.thead.rowArray;

        rowArrayForThead.forEach(function(rowBean){
            var trForThead = createTr();
            renderTheadTr(trForThead, rowBean);
            thead.append(trForThead);
        });

        var theadColumnLength = tableBean.thead.rowArray[0].columnArray.length;

        var rowArrayForTbody = tableBean.tbody.rowArray;

        rowArrayForTbody.forEach(function(rowBean){
        	renderTbodyTrAutoSort(tbody, rowBean, theadColumnLength);
        });
        
        //檢查是否有合併欄位
        checkIsRowspan(tableBean, tableId);
    }

	/**
	 * 根據tableBean的資料，新增至已存在table 和 thead 的DOM object
	 * 具有自動依照className排序，必須注意標頭欄位與資料欄位的className必需一致
	 * @author charles.chen
	 * @date 2017年7月16日 上午4:30:09
	 * @param tableBean
	 * @param tableId dom物件中table的id
	 * @return void
	 */
    this.createTbodyByTableId = function(tableBean, tableId){

    	var table = renderTable(tableId);
        
        renderTitle(table, tableBean);
        
        
        //取得已經先建立好的thead欄位數量，(取最後一行tr的用意為，若thead tr th 有些頁面可能會多抓取到標頭的欄位)
        var theadColumnLength = table.find("thead tr:last-child th").length;
        var tbody = table.find("tbody");

        var rowArrayForTbody = tableBean.tbody.rowArray;
        rowArrayForTbody.forEach(function(rowBean){
        	renderTbodyTrAutoSort(tbody, rowBean, theadColumnLength);
        });
        
        //檢查是否有合併欄位
        checkIsRowspan(tableBean, tableId);
    }
    
    
    function renderTable(tableId){
    	if(!document.getElementById(tableId)){
            console.error('該tableId不存在');
            return false;
        }
    	
        var table = $("#" + tableId);
        table.css({"font-family":"微軟正黑體", "border":"none", "padding":"0px"});
        //table.addClass("cim7");
        return table;
    }
    
    function renderTitle(table, tableBean){
    	if(!isEmptyObject(tableBean.title)){
    		var title = tableBean.title;
    		//若是i18n
    		if(title.match("i18n")){
    			title = $.i18n.prop(tableBean.title);
    		}
        	var trForTitle = createTr();
        	var tdForTitle = $("<td/>", {colspan:"100%"});
        	trForTitle.css({"border":"none", "text-align":"left", "font-size":"14px"});
        	tdForTitle.css({"border":"none", "padding":"0px"});
        	
        	var spanForTitle = $("<span/>",{class:"lab i18n_html", html:title});
        	tdForTitle.append(spanForTitle);
        	trForTitle.append(tdForTitle);
        	table.find("thead").append(trForTitle);
        }
    }
    function createTr(){
    	var tr = $("<tr/>", {align: 'center'});
    	tr.css({"font-size":"14px"});
    	return tr;
    }
    
    //根據用戶自定義的標頭欄位陣列進行渲染
    function renderTheadTr(tr, rowBean){
        if(isEmptyObject(rowBean.data)){
            tr.data(rowBean.data.dataName, rowBean.data.dataObject);
        }
        var columnArray = rowBean.columnArray;
        columnArray.forEach(function(columnBean){
            var th = $("<th/>");
            checkColumnBeanAndRenderTd(th, columnBean);
            tr.append(th);
        });
    }
    
    //根據用戶自定義的資料欄位陣列進行渲染
    function renderTbodyTr(tr, rowBean){
    	setCssAttribute(tr, rowBean);
    	
    	 var isHover = rowBean.isHover;
         if(isHover){
        	 tr.hover(function() {
 				$(this).css('backgroundColor','#F8F8FF');
 			}, function() {
 				$(this).css('backgroundColor','#fff');
 			});
         }
    	
        if(isEmptyObject(rowBean.data)){
            tr.data(rowBean.data.dataName, rowBean.data.dataObject);
        }

        var columnArray = rowBean.columnArray;
        columnArray.forEach(function(columnBean){
        	var td = $("<td/>", {align: "center", "height":"30px"});
        	
        	setCssAttribute(td, columnBean);
            checkColumnBeanAndRenderTd(td, columnBean);
            tr.append(td);
        });
    }

	//資料欄位會根據標頭欄位自動排序後，再進行渲染
    function renderTbodyTrAutoSort(tbody, rowBean, theadColumnLength){
        var trForTbody = createTr();
        setCssAttribute(trForTbody, rowBean);
        //var rowColor = rowBean.css.backgroundColor;
        var isHover = rowBean.isHover;
        if(isHover){
			trForTbody.hover(function() {
				$(this).css('backgroundColor','#F8F8FF');
			}, function() {
				$(this).css('backgroundColor','#fff');
			});
        }
       
        if(rowBean.data){
            trForTbody.data(rowBean.data.dataName, rowBean.data.dataObject);
        }
        for(var i = 0; i < theadColumnLength; i++){
            var tdForTbody = $("<td/>", {align: "center", "height":"30px"});
            trForTbody.append(tdForTbody);
        }
        tbody.append(trForTbody);

        var columnArray = rowBean.columnArray;
        columnArray.forEach(function(columnBean){
        	//有可能有多個className，切割字串取第一個className
        	var classNameArr = columnBean.className.split(" ");
            //先取得thead中欄位的位置
            var theadColumnIndex = tbody.closest("table").find("thead").find("." + classNameArr[0]).index();
            //在取得tbody中對應欄位位置
            var td = trForTbody.find("td").eq(theadColumnIndex);
            //檢查ColumnBean中是否為空物件，否的話渲染欄位
            checkColumnBeanAndRenderTd(td, columnBean);
        });
    }
    
    //檢查ColumnBean中是否為空物件，否的話渲染欄位
    function checkColumnBeanAndRenderTd(td, columnBean){
         //i18n與顯示名稱擇一
        if(!isEmptyObject(columnBean.i18n)){
        	var i18n = $.i18n.prop(columnBean.i18n);
            td.append(i18n);
        }
        else if(!isEmptyObject(columnBean.text)){
            td.append(columnBean.text);
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
    
    function setCssAttribute(domObject, bean){
    	if(bean.css.backgroundColor){
    		var beanColor = bean.css.backgroundColor;
    		domObject.css('backgroundColor', beanColor);
    	}
    }

    /**
     * 檢查該tableBean的ColumnArray中的ColumnBean是否有isRowspan=true的屬性，有的話渲染並合併相同欄位
     * @author charles.chen
     * @date 2017年7月16日 上午4:30:09
     * @param object
     * @return boolean
     */
    function checkIsRowspan(tableBean, tableId){
    	var rowspanSelectorArray = [];
    	//判斷第一列的所有欄位即可
    	var rowBean = tableBean.tbody.rowArray[0];
    	if(!rowBean){
    		return false;
    	}
		rowBean.columnArray.forEach(function(columnBean){
			//先取得所有欲合併欄位的selectors(對應className)
			var isRowspan = columnBean.isRowspan;
			if(isRowspan){
				//有可能有多個className，取第一個
				var className = (columnBean.className.split(" "))[0];
				var mergeCellSelector = "." + className;
				rowspanSelectorArray.push(mergeCellSelector);
			}
		});
    	
    	var tableId = "#" + tableId;
    	rowspanSelectorArray.forEach(function(mergeCellSelector){
    		renderSameColumnRowspan(tableId, mergeCellSelector);
    	});
    }
    
    /**
     * 渲染並合併相同欄位
     * @author charles.chen
     * @date 2017年7月16日 上午4:30:09
     */
    function renderSameColumnRowspan(tableId, mergeCellSelector){
    	var $lastCell = null;
        $(tableId + " tbody " + mergeCellSelector).each(function () {
            //跟上列的td比較，是否相同
            if ($lastCell && $lastCell.text() == $(this).text()) {
                //取得上一列，將要合併欄位的rowspan + 1
                $lastCell.closest("tr").children(mergeCellSelector)
                .each(function () {
                    this.rowSpan = (this.rowSpan || 1) + 1;
                });
                //將本列被合併的欄位移除
                $(this).closest("tr").children(mergeCellSelector).remove();
            }
            else //若未發生合併，以目前的欄位作為上一欄位
                $lastCell = $(this);
        });
    }
}

/**
 * 檢查是否為空物件
 * @author charles.chen
 * @date 2017年7月16日 上午4:30:09
 * @param object
 * @return boolean
 */
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


//model Bean
function TableBean(id, className, text, i18n) {
    BasicBean.call(this, id, className, text, i18n);
    this.thead = new TheadBean();
    this.tbody = new TbodyBean();
    this.title = {};
    
}

function TheadBean(id, className, text, i18n) {
    BasicBean.call(this, id, className, text, i18n);
    //this.tr = new RowBean();
    this.rowArray = [];
    this.appendRowBean = function(rowBean) {
        this.rowArray.push(rowBean);
    }
}

function TbodyBean(id, className, text, i18n) {
    BasicBean.call(this, id, className, text, i18n);

    this.rowArray = [];
    this.appendRowBean = function(rowBean) {
        this.rowArray.push(rowBean);
    }
}

function RowBean(id, className, text, i18n){
    BasicBean.call(this, id, className, text, i18n);

    this.columnArray = [];
    this.appendColumnBean = function (columnBean) {
        this.columnArray.push(columnBean);
    }
    this.data = {};
    this.setData = function (dataName, dataObject){
        this.data.dataName = dataName;
        this.data.dataObject = dataObject;
    }
    //hover效果(預設是開)
    this.isHover = true;
    this.setIsHover = function(isHover) {
    	this.isHover = isHover;	
    }
}

function ColumnBean() {
	
	//只有一個參數時，傳遞進來的是物件
	if(arguments.length == 1){
		var id = isEmptyObject(arguments[0].id)?undefined : arguments[0].id;
		var className = isEmptyObject(arguments[0].className)?undefined : arguments[0].className;
		var text = isEmptyObject(arguments[0].text)?undefined : arguments[0].text;
		var i18n = isEmptyObject(arguments[0].i18n)?undefined : arguments[0].i18n;
		
	}
	//若是四個參數，則是一般建構式
	else if(arguments.length == 4){
		
	}
	BasicBean.call(this, id, className, text, i18n);
	
    this.domObject = {};
    this.setDomObject = function (domObject) {
        this.domObject = domObject;
    }

    this.data = {};
    this.setData = function (dataName, dataObject){
        this.data.dataName = dataName;
        this.data.dataObject = dataObject;
    }
    
	//合併欄位(預設是關閉)
    this.isRowspan = false;
    this.setIsRowspan = function(isRowspan) {
    	this.isRowspan = isRowspan;	
    }
}
//function ColumnBean(object) {
//	var id = object.id;
//	var className = object.className;
//	var text = object.text;
//	var i18n = object.i18n;
//	
//    BasicBean.call(this, id, className, text, i18n);
//
//    this.domObject = {};
//    this.setDomObject = function (domObject) {
//        this.domObject = domObject;
//    }
//
//    this.data = {};
//    this.setData = function (dataName, dataObject){
//        this.data.dataName = dataName;
//        this.data.dataObject = dataObject;
//    }
//}
//function ColumnBean(id, className, text, i18n) {
//	BasicBean.call(this, id, className, text, i18n);
//
//    this.domObject = {};
//    this.setDomObject = function (domObject) {
//        this.domObject = domObject;
//    }
//
//    this.data = {};
//    this.setData = function (dataName, dataObject){
//        this.data.dataName = dataName;
//        this.data.dataObject = dataObject;
//    }
//}
function DomObject(id, className, text, i18n) {
    BasicBean.call(this, id, className, text, i18n);

    this.domType = "";
    this.setDomType = function (domType){
        this.domType = domType;
    }

}

function BasicBean(id, className, text, i18n) {
    this.id = id;
    this.className = className;
    this.text = text;
    this.i18n = i18n;
    this.css = {};

    this.setId = function (id) {
        this.id = id;
    }
    this.setClassName = function (className) {
        this.className = className;
    }
    this.setText = function (text) {
        this.text = text;
    }
    this.setI18n = function (i18n) {
        this.i18n = i18n;
    }
}
