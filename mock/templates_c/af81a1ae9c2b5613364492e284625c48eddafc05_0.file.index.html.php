<?php /* Smarty version 3.1.26, created on 2016-01-20 08:53:21
         compiled from "C:\work\demotest\view\index.html" */ ?>
<?php
/*%%SmartyHeaderCode:20444569f4b01be82e8_19034827%%*/
if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'af81a1ae9c2b5613364492e284625c48eddafc05' => 
    array (
      0 => 'C:\\work\\demotest\\view\\index.html',
      1 => 1453280000,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '20444569f4b01be82e8_19034827',
  'variables' => 
  array (
    'content' => 0,
  ),
  'has_nocache_code' => false,
  'version' => '3.1.26',
  'unifunc' => 'content_569f4b01d11121_11383500',
),false);
/*/%%SmartyHeaderCode%%*/
if ($_valid && !is_callable('content_569f4b01d11121_11383500')) {
function content_569f4b01d11121_11383500 ($_smarty_tpl) {

$_smarty_tpl->properties['nocache_hash'] = '20444569f4b01be82e8_19034827';
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta http-equiv="x-ua-compatible" content="ie=edge">
	<title>demo</title>
	<meta name="description" content="">
	<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
	<meta name="format-detection" content="telephone=no">
	<meta name="format-detection" content="email=no">
	<?php echo '<script'; ?>
 src="../lib/jquery.js"><?php echo '</script'; ?>
>
	<?php echo '<script'; ?>
 src="../lib/language.js"><?php echo '</script'; ?>
>
</head>
<body>

<div id="langBox">
	<span data-action="msg_language"></span><span data-action="sign_colon"></span>
	<select id="lang">
		<!-- <option value="browser">Indicated by the browser</option> -->
		<option value="en">ENGLISH</option>
		<option value="ch">中文</option>
	</select>
	<span id="langBrowser"></span>
</div>


<span data-action="msg_backreport"></span>
<span data-action="sign_colon"></span>
<span data-action="msg_unsubcribed"></span>
<span data-action="sign_comma"></span>
<span data-action="msg_cause"></span>
<span data-action="sign_colon"></span>
<span data-action="msg_refused"></span>
<span data-action="sign_excalm"></span>
<div data-action="msg_help_sent"></div>
<hr>
<div data-action="msg_explain_sent"></div>
<div data-action="msg_<?php echo $_smarty_tpl->tpl_vars['content']->value;?>
"></div>
</body>
</html>
<?php }
}
?>