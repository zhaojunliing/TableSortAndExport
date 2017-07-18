/*
 * 表格导出插件tableExport下载地址 
 * https://github.com/hhurz/tableExport.jquery.plugin
 * 
 * 表格排序插件tableSorter下载地址
 * https://github.com/Mottie/tablesorter
 * 
 * */

/**
 * 页面初始化
 */
jQuery(document).ready(function() {
	initTableSorter(); //初始化表格排序
	$('tbody').html("");//重新加载时清空原有数据
	loadData(); //加载数据
	$('#export').on("click",function(){ //定义点击事件
		exportData();//导出数据
	});
});

/**
 * 加载数据
 */
function loadData() {
	//mockData来自dataset.js定义的模拟数据
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
			fillTable(data); //用服务器获取的数据填充表格
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
	var html = new Array(); //新建数组
	for(var i = 0; i < data.length; i++) { //遍历数据
		html.push('<tr id=\'' + data[i].id + '\'>');
		html.push('<td scope="row">' + i + '</td>');  //序号
		html.push('<td>' + data[i].name + '</td>');   //书名
		html.push('<td>' + data[i].author + '</td>'); //作者
		html.push('<td>' + data[i].pubdate + '</td>');//出版日期
		html.push('<td>' + data[i].pagesum + '</td>');//总页数
		html.push('</tr>');
	}
	$('tbody').append(html.join('')); //将数据拼接后附加到当前表格
	updateTableSorter(); //动态添加数据后更新排序数据和样式
	addRowNum(); //为表格重新添加序号,让序号仍然按升序排列
}

/**
 * 表格排序初始化
 * 
 * @returns
 */
function initTableSorter(){
	$("table").tablesorter({
//		widgets: ['zebra'], //表格斑马纹
		'headers': { 0:{sorter: false}}
	}).bind("sortEnd",function() { //排序完成后绑定事件
		addRowNum();//为表格添加行数
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
function addRowNum(){
	$('tr').each(function(){
		//行数为当前<tr>元素相对于父元素的索引+1
		var rowNum = $(this).index()+1; 
		//将行数填入每行第一列
		$(this).find('td').eq(0).text(rowNum); 
	});
}

/**
 * 导出数据
 * @returns
 */
function exportData(){
	var tableNameStr = "book-info"; //定义文件名
	//第一个参数定义输出的文件名
	//第二个参数定义了表格元素的选择器
	//第三个参数定义了输出格式,此处是cvs格式
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
  //$.extend第一个参数为true,执行深度合并
  //如果options的属性是对象或数组,则递归地将params属性中的对象或数组添加到options
  //$.extend具体用法参照官网http://api.jquery.com/jQuery.extend/
  $.extend(true,options, params);
  //根据参数设定执行表格导出
  $(selector).tableExport(options);
}