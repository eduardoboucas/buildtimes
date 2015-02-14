var VideoLooper = (function () {
	var loopInterval = 3000; // Interval between loops (in milliseconds). Use 0 for continuous loop.
	var transitionDelay = 40;
	
	var videos = [];
	var scheduledStop = false;
	var ready = false;
	var autoplay = false;
	var sequenceBegan = false;
	var video0EndCallback, video2EndCallback;
	
	var init = function (elementsArray, aplay) {
		autoplay = aplay || false;
		
		$.each(elementsArray, function (key, value) {
			$(value).off("canplay").on("canplay", loadCheck);
		});

		videos = elementsArray;

		bindEvents();
		loadCheck();
	};
	
	var getVideoElement = function (index) {
		return $(videos[index]).get(0);	
	};
	
	var loadCheck = function () {
		if (sequenceBegan) {
			return false;
		}

		for (var i = 0, numVideos = videos.length; i < numVideos; i++) {
			if (!((getVideoElement(i).readyState == 3) || (getVideoElement(i).readyState == 4))) {
				return false;
			}
		}
			
		// All videos are loaded!
		ready = true;
		
		if (autoplay) {
			beginSequence();
		}
		
		return true;
	};
	
	var beginWhenReady = function (callback) {
		video0EndCallback = callback;
		
		if (ready) {
			beginSequence();
		} else {
			autoplay = true;		
		}
	};
	
	var begin = function (callback) {
		if (!ready) {
			return false;
		}
		
		video0EndCallback = callback;
		beginSequence();
	}

	var beginSequence = function () {
		sequenceBegan = true;
		getVideoElement(0).play();
		
		setTimeout(function () {
			$(videos[0]).show();
		}, transitionDelay);
	};
	
	var startLoop = function () {
		if (!scheduledStop) {
			getVideoElement(1).play();
			setTimeout(function () {
				$(videos[1]).show();	
			}, transitionDelay);
			setTimeout(startLoop, loopInterval);
		}				
	};
	
	var endLoop = function (endCallback) {
		scheduledStop = true;

		if (endCallback !== undefined) {
			video2EndCallback = endCallback;	
		}		
		
		if (getVideoElement(1).paused) {
			getVideoElement(2).play();
			setTimeout(function () {
				$(videos[2]).show();
			}, transitionDelay);
		}	
	};
	
	var bindEvents = function () {
		$(videos[0]).off("ended.looper").on("ended.looper", function (a) {
			startLoop();
			
			if (video0EndCallback !== undefined) {
				video0EndCallback();
			}			
		});
		
		$(videos[1]).off("ended.looper").on("ended.looper", function () {
			if (scheduledStop) {
				endLoop();
			}
		});

		$(videos[2]).off("ended.looper").on("ended.looper", function () {
			$(videos[2]).hide();
			$(videos[1]).hide();
			$(videos[0]).hide();
			scheduledStop = false;

			console.log('Ended');

			if (video2EndCallback !== undefined) {
				video2EndCallback();
			}
		});
	};
	
	return {
		init: init,
		beginWhenReady: beginWhenReady,
		begin: begin,
		end: endLoop
	};
})();