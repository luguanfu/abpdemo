//单据位置控制js
		$(function() {
			DataFor();
		})
		function DataFor() {
			var jsond = [{
					'x': 108,
					'y': 75,
					'fwTool': '0',
					'w': 100,
					'h': 15,
					't': 'left'
				}, {
					'x': 420,
					'y': 78,
					'fwTool': '1',
					'w': 35,
					'h': 15,
					't': 'center',
					'color': 'red'

				}, {
					'x': 475,
					'y': 78,
					'fwTool': '2',
					'w': 20,
					'h': 15,
					't': 'center',
					'color': 'red'
				},

				{
					'x': 510,
					'y': 78,
					'fwTool': '3',
					'w': 20,
					'h': 15,
					't': 'center',
					'color': 'red'
				},

				{
					'x': 140,
					'y': 103,
					'fwTool': '4',
					'w': 425,
					'h': 25,
					't': 'left'
				}, {
					'x': 140,
					'y': 132,
					'fwTool': '5',
					'w': 425,
					'h': 25,
					't': 'left'
				}, {
					'x': 225,
					'y': 161,
					'fwTool': '6',
					'w': 232,
					'h': 20,
					't': 'left',
					'color': 'red'
				}, {
					'x': 475,
					'y': 160,
					'fwTool': '7',
					'w': 85,
					'h': 15,
					't': 'left',
					'color': 'red'
				}, {
					'x': 180,
					'y': 190,
					'fwTool': '8',
					'w': 150,
					'h': 24,
					't': 'center'
				}, {
					'x': 415,
					'y': 190,
					'fwTool': '9',
					'w': 150,
					'h': 24,
					't': 'center'
				}, {
					'x': 65,
					'y': 240,
					'fwTool': '10',
					'w': 145,
					'h': 55,
					't': 'center'
				}, {
					'x': 220,
					'y': 240,
					'fwTool': '11',
					'w': 110,
					'h': 55,
					't': 'center'
				}, {
					'x': 392,
					'y': 220,
					'fwTool': '12',
					'w': 176,
					'h': 20,
					't': 'center'
				}, {
					'x': 355,
					'y': 250,
					'fwTool': '13',
					'w': 35,
					'h': 15,
					't': 'center'
				}, {
					'x': 404,
					'y': 250,
					'fwTool': '14',
					'w': 18,
					'h': 15,
					't': 'center'
				}, {
					'x': 434,
					'y': 250,
					'fwTool': '15',
					'w': 18,
					'h': 15,
					't': 'center'
				}, {
					'x': 505,
					'y': 250,
					'fwTool': '16',
					'w': 25,
					'h': 15,
					't': 'center',
					'color': 'red'

				}
			];
			
			for(var i = 0; i < jsond.length; i++) { //循环添加div
				var divObj = $('<div> <input class="bills_input" type="text" id="ShuRu' + i + '" /></div>'); //定义一个div
				divObj.attr({
						"id": i,
						"rel": jsond[i].fwTool,
						"title": "借款单"
					}).css({ //改变div样式
						"left": jsond[i].x,
						"top": jsond[i].y,
						'position': 'absolute',
						'width': jsond[i].w,
						'height': jsond[i].h,
						'text-align': jsond[i].t,
						'color': jsond[i].color

					})
					.appendTo($('#fombody')); //添加一个div
			}
		}
		
		
		
		

