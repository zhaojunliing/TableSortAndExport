jQuery(document).ready(function() {
	initTableSorter(); //初始化表格排序
	loadData(); //加载数据
	$('#export').on("click",function(){
		exportData();//导出数据
	});
});

/**
 * 加载数据
 */
function loadData() {
	fillTable(mockData); //用模拟数据填充表格
}

/**
 * 通过ajax方法从服务器获取数据并初始化表格
 */
function loadDataFromServer() {
	$.ajax({
		type: "POST",
		dataType: "json",
		url: 'posturl', //服务请求地址 
		success: function(data) {
			fillTable(data); //数据填充表格
		}
	});
}

/**
 * 填充表格
 * 
 * @param data
 * @returns
 */
function fillTable(data) {
	var html = new Array();
	for(var i = 0; i < data.length; i++) {
		html.push('<tr class="even" id=\'' + data[i].id + '\'>');
		html.push(
			'<td scope="row">' + i + '</td>');
		html.push('<td>' + data[i].name + '</td>');
		html.push('<td>' + data[i].author + '</td>');
		html.push('<td>' + data[i].pubdate + '</td>');
		html.push('<td>' + data[i].pagesum + '</td>');
		html.push('</tr>');
	}
	$('tbody').append(html.join(''));
	updateTableSorter(); //动态添加数据后更新排序数据和样式
	addThIndex(); //为表单添加序号
}

/**
 * 表格排序初始化
 * 
 * @returns
 */
function initTableSorter(){
	$("table").tablesorter({
		'headers': { 0:{sorter: false}}
	}).bind("sortEnd",function() { //排序完成后绑定事件
		addThIndex();
	});
}

/**
 * 动态添加数据后更新排序数据和样式
 * 
 * @returns
 */
function updateTableSorter(){
	$("table").trigger("update"); //更新排序数据
	$("table").trigger("applyWidgets"); //更新样式
}


/**
 * 动态为表格添加序号
 * 
 * @returns
 */
function addThIndex() {
	$('td[scope="row"]').each(function() {
		$(this).text($(this).parent().index() + 1);
	});
}

/**
 * 导出数据
 * @returns
 */
function exportData(){
	var tableNameStr = "book-info"; //定义文件名
	doExport(tableNameStr, 'table',{type: 'csv'});
}

/**
 * 执行导出数据的方法
 * @param selector 
 * @param params
 * @returns
 */
function doExport(tableNameStr, selector, params) {
  var options = {
    fileName: tableNameStr,
    tableName: tableNameStr,
    worksheetName: tableNameStr
  };
  $.extend(true, options, params);
  $(selector).tableExport(options);
}