$(function(){
	//语言默认英文
	var language = $('#lang :selected').val();
	//用语言种类选择
	$('#lang').change(function(){
		language = $('#lang :selected').val();
		langString()
	})
	//获得对应字段
	function langString(){
		$.getJSON("../language/language_"+language+".json",function(data){ 
					$this = $(this);
				$('[data-action]').each(function(){
					var msg = $(this).attr('data-action');
					$(this).text(data[msg])
		        })  
			})		
	}
	langString()
})