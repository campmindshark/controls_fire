$(document).ready(function() {
	console.log("Start");
	var base_url = "http://192.168.2.2:5000/";

	$("button.btn_ajax").each(function(){
		var $this = $(this);
		$this.on("click", function() {
		console.log('click');
		var url = base_url + $this.data("endpoint");
		var verb = $this.data("verb");
		var fxId = $this.data("fxId");
		console.log($this);
		console.log("url: "+ url);
		console.log("verb: " +  verb + "\n");
		console.log("fxId: " + fxId);
		switch ($this.data("verb")) {
			case "GET":
				if(fxId) {
					url += "/" + fxId; 
					console.log('url + id:' + url );
				}
				$.get(url, function(data,status) {
    			console.log("Response Data: " + data + "\n");
    			console.log("Response Status: " + status + "\n");
    			$("div#response_placeholder").innerHTML = ("Data: " + data + "\nStatus: " + status);
    			});
				
			break;
			case "POST":
				if (fxId) {
					$.post(url, { fxId: $this.data('fxId')},function(data, status) {
					$("div#response_placeholder").innerHTML  = ("Data: " + data + "\nStatus: " + status);
					}); 
				break;	
				}
				$.post(url, function(data, status) {
					$("div#response_placeholder").innerHTML  = ("Data: " + data + "\nStatus: " + status);
				});
			break;
			case "DELETE":
				if(fxId) {
					url += "/" + fxId; 
					console.log('url + id:' + url );
				}
				$.ajax({
    				url: url, 
    				type: 'DELETE',
    				success: function(data,status) {
    					console.log("Response Data: " + data + "\n");
    					console.log("Response Status: " + status + "\n");
    					$("div#response_placeholder").innerHTML = ("Data: " + data + "\nStatus: " + status);
    				}
    			});
			break;
		}
		});
	});
	console.log("JavaScript loaded");
});

