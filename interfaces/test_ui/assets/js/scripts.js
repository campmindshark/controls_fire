$(document).ready(function() {
	console.log("Start");
	var base_url = "http://192.168.2.2:5000/";
	function process_respone(data,status) {
		$("div#response_placeholder.row").replaceWith('<div id="response_placeholder" class="row">' + 'Data: ' + data + '\nStatus: ' + status + '</div>');
	}
	$("button.btn_ajax").each(function(){
		var $this = $(this);
		$this.on("click", function() {
		console.log('click');
		var url = base_url + $this.data("endpoint");
		var verb = $this.data("verb");
		var fxId = $this.data("fxId");
		var state = $this.data("state");
		console.log($this);
		console.log("url: " + url);
		console.log("verb: " + verb);
		console.log("fxId: " + fxId);
		console.log("state: " + state);
		switch ($this.data("verb")) {
			case "GET":
				if(fxId) {
					url += "/" + fxId; 
					console.log('url + id:' + url );
				}
				$.get(url, function(data, status) {
					process_respone(data,status);
				});
			break;
			case "POST":
				if (state) {
					url += "/" + fxId; 
					console.log('url + id:' + url );
					$.post(url, { state: $this.data('state')}, function(data, status) {
					process_respone(data,status);
					});
					break;
				}
				if (fxId) {
					$.post(url, { fxId: $this.data('fxId')},function(data, status) {
					process_respone(data,status);
				}); 
				break;	
				}
				$.post(url, process_respone(data,status));
			break;
			case "DELETE":
				if(fxId) {
					url += "/" + fxId; 
					console.log('url + id:' + url );
				}
				$.ajax({
    				url: url, 
    				type: 'DELETE',
    				success: function(data, status) {
					process_respone(data,status);
				}
    			});
			break;
		}
		});
	});
	console.log("JavaScript loaded");
});

