<?php
/*
    PHP 接受 FMS 的 POST 请求使用 Smarty 渲染页面
*/
date_default_timezone_set("Shanghai/Asia");

function __object_array ($array) {
    if(is_object($array)) {  
        $array = (array)$array;  
    }
    if(is_array($array)) {  
        foreach ($array as $key=>$value) {
            $array[$key] = __object_array($value);
        }  
    }
     return $array;  
}
$__settings = __object_array(json_decode($_POST['_fms']));

/*
    template            "news.php"
    templateDir         "/Users/nimojs/Documents/git/fms-demo/view/"
    templatePath        "/Users/nimojs/Documents/git/fms-demo/view/news.php"
    templatePluginDir   "/Users/nimojs/Documents/git/fms-demo/view/plugin/"
    data                "{"title":"论数据约定在前后端配合中的重要性"}"
*/

// smarty 初始化
require('libs/Smarty.class.php');
$_smarty = new Smarty();

// 设置模板目录
$_smarty->setTemplateDir($__settings['templateDir']);
// 配置标识符
$_smarty -> left_delimiter="{{";
$_smarty -> right_delimiter="}}";

function tojson ($settings) {
    return (isset($settings['data']) && !empty($settings['data'])) ? json_encode($settings['data']) : json_encode(array());
}
$_smarty->registerPlugin("function","JSON", "tojson");

// 渲染数据
foreach ($__settings['data'] as $key => $value) {
$_smarty->assign($key, $value);
}
// 渲染页面
$_smarty->display($__settings['templatePath']);


