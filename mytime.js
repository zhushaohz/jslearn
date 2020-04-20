function h(){
	console.log('哈哈哈');
	var title = 'dd';
	var subtitle = 'ff';
	var body = 'ed';
	//$notify("Title", "Subtitle", '哈哈哈');
	$notification.post(title, subtitle, body)
}
h();