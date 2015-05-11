function luantuSetSelectByName(name, textvalue) {
	var selectObjs = document.getElementsByName(name);
	for (j=0; j <selectObjs.length;j++) {
		var selectObj = selectObjs[j];
		if (selectObj.nodeName == "SELECT") {
			for (i=0; i< selectObj.options.length; i++){
				var curOptObj=selectObj.options[i];
				var curText=curOptObj.text;
				if(curText == textvalue){
					curOptObj.selected=true;
				}
			}
		}
	}
}

function luantuSetSelectById(id, textvalue) {
	var selectObj = document.getElementById(id);
	for (i=0; i< selectObj.options.length; i++){
		var curOptObj=selectObj.options[i];
		var curText=curOptObj.text;
		if(curText == textvalue){
			curOptObj.selected=true;
		}
	}
}

hasLoad = 0;
http_request = false;
function initAjax(){
	//开始初始化XMLHttpRequest对象
	if(window.XMLHttpRequest) { //Mozilla 浏览器
		http_request = new XMLHttpRequest();
		if (http_request.overrideMimeType) {//设置MiME类别
			http_request.overrideMimeType('text/xml');
		}
	}
	else if (window.ActiveXObject) { // IE浏览器
		try {
			http_request = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try {
				http_request = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e) {}
		}
	}
	if (!http_request) { // 异常，创建对象实例失败
		window.alert("不能创建XMLHttpRequest对象实例.");
		return false;
	}	

}

function operateInitProject(){
	if (http_request.readyState == 4) { // 判断对象状态
		if (http_request.status == 200) { // 信息已经成功返回，开始处理信息
			var projectArr = eval("("+unescape(http_request.responseText)+")");
			var projectLists = document.getElementsByName("projectList");
			for (j = 0; j < projectLists.length; j++) {
				var projectList = projectLists[j];
				if (projectList.nodeName == "SELECT") {
					projectList.length = 1;
					for(i=0;i<projectArr.length;i++){
						projectList.options[projectList.options.length] = new Option(projectArr[i],projectArr[i]);
					}
				}
			}
		}else{
			alert("获取编译工程有错");
		}
	}
}

function initProject(url){
	initAjax();
	//alert(url);
	http_request.onreadystatechange = operateInitProject;
	// 确定发送请求的方式和URL以及是否同步执行下段代码
	http_request.open("get", url,false);
	//http_request.setRequestHeader("content-type","application/x-www-form-urlencoded");
	http_request.send(null);
}

function operateInitBranch(){
	if (http_request.readyState == 4) { // 判断对象状态
		if (http_request.status == 200) { // 信息已经成功返回，开始处理信息
			var branchArr = eval("("+unescape(http_request.responseText)+")");
			//var branch = document.mainAndInstallForm.branchList;
			//document.mainAndInstallForm.branchList.length = 1;
			var branch = document.getElementsByName("branchList")[0];
			branch.length = 1;
			for(i=0;i<branchArr.length;i++){
				branch.options[branch.options.length] = new Option(branchArr[i],branchArr[i]);
			}
		}
	}
}

function loadBranch(project){
	if(project==""||project=="--请选择--") {
		return;
	}
	initAjax();
	url = "initProject.do?type=branch&project="+project;
	http_request.onreadystatechange = operateInitBranch;
	http_request.open("get",url,false);
	http_request.send(null);
}

function getNextElement(node){  
    if(node.nodeType == 1){  
        return node;  
    }  
    if(node.nextSibling){  
        return getNextElement(node.nextSibling);  
    }  
    return null;  
}

function saveDate() {
	var pl = "git-rgosm-build";
	var bl = "";
	var pt = "";
	var rv = "0";
	var type = "完整编译";
	
	//projectlist
	var pls = document.getElementsByName("projectList");
	for (i = 0; i < pls.length; i++) {
		if (pls[i].nodeName == "INPUT" && pls[i].value != "--请选择--") {
			pl = pls[i].value;
		}
	}
	window.localStorage.setItem("projectList", pl);
	
	//branchlist
	var selectObj = document.getElementsByName("branchList")[0];
	var index = selectObj.selectedIndex; // 选中索引
	var bl = selectObj.options[index].text; // 选中文本
	window.localStorage.setItem("branchList", bl);
	
	//product
	pt = document.getElementById("product").value;
	window.localStorage.setItem("product", pt);
	
	//main_revision
	rv = document.getElementById("main_revision").value;
	window.localStorage.setItem("main_revision", rv);
	
	
	alert("保存成功");
}

function injectDom() {
	var pl = "git-rgosm-build";
	var bl = "";
	var pt = "";
	var rv = "0";
	var type = "完整编译";
	initProject("initProject.do");
	
	var tmp_pl = window.localStorage.getItem('projectList');
	if (tmp_pl != "--请选择--" && tmp_pl != "") {
		pl = tmp_pl;
	}
	var tmp_bl = window.localStorage.getItem('branchList');
	if (tmp_bl != "--请选择--" && tmp_bl != "") {
		bl = tmp_bl;
	}
	
	pt = window.localStorage.getItem('product');
	rv = window.localStorage.getItem('main_revision');
	
	//编译工程
	var pls = document.getElementsByName("projectList");
	for (i = 0; i < pls.length; i++) {
		if (pls[i].nodeName == "INPUT") {
			pls[i].value = pl;
			var sib = getNextElement(pls[i].nextSibling);
			sib.value = pl;
		} else if (pls[i].nodeName == "SELECT") {
			for (j=0; j< pls[i].options.length; j++){
				var curOptObj=pls[j].options[i];
				var curText=pls[j].text;
				if(curText == pl){
					curOptObj.selected=true;
				}
			}
		}
	}
	//编译分支
	loadBranch(pl);
	
	luantuSetSelectByName("branchList", bl);

	//产品
	document.getElementById("product").value=pt;
	//版本
	document.getElementById("main_revision").value=rv;
	//编译类型
	luantuSetSelectByName("compileType", "完整编译");
}

//document.getElementById("mainAndInstallFormDiv").style.height="110px";

var div = document.createElement("div"); 
div.style.textAlign="center";
div.innerHTML = "<div text-align: right; style=\"width: 100%; height: 20px; margin-top: -63px; margin-left: 210px;\"><input name=\"loadlast\" id=\"loadlast\" type=\"button\" value=\"加载\"  style=\"font-size:13px; font-weight:bold; width:100px; height:26px; background-color:#C8DAF2; margin-left:150px;\" title=\"点击加载保存的编译信息\" onclick=\"javascript:injectDom()\"  />      <input name=\"savebt\" id=\"savebt\" type=\"button\" value=\"保存\"  style=\"font-size:13px; font-weight:bold; width:100px; height:26px; background-color:#C8DAF2; margin:10px auto ;\" onclick=\"javascript:saveData()\" title=\"点击保存当前的编译信息，如果当前信息为空，则清空\" /></div>"; 
document.getElementById("mainAndInstallFormDiv").appendChild(div);

var button = document.getElementById("loadlast");
button.addEventListener("click", injectDom, false);

var savebt = document.getElementById("savebt");
savebt.addEventListener("click", saveDate, false);

//window.onload=function(){ 
//	document.getElementById("product").value="New text!";
//} 

