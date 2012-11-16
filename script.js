/**
 * Returns the current time
 * @returns {Number} Returns the current time in milliseconds.
 */
function getTime() {
    return (new Date()).valueOf();
}

/**
 * Task class
 * @param {Function} callback will be called upon timeout.
 * @param {Number} timeout the timeout from scheduler start to use.
 * @param {String} description description for the task.
 */
function Task(callback, timeout, description) {
    this.callback = callback;
    this.timeout = timeout;
    
    if (arguments.length === 3) {
        this.description = description;
    };
}

/**
 * Compares the timeouts of two tasks.
 * @param {Task} task1
 * @param {Task} task2
 */
function compareTask(task1, task2) {
    return task1.timeout - task2.timeout;
}

function Scheduler(tasks, resolution) {
    this.tasks = tasks.sort(compareTask);
    this.taskIndex = 0;
    this.resolution = resolution;
    this.interval = null;
    this.currentTime = 0;
    this.isRunning = true;
    
    this.addTask = function(task) {
        this.tasks.push(task);
        this.tasks.sort(compareTask);
    };
    
    this.start = function() {
        if (this.interval === null) {
        this.interval = setInterval(this.timingEvent, this.resolution);
        }
        this.running = false;
    };
    
    this.stop = function() {
        if (this.isRunning) {
            clearInterval(this.interval);
            this.interval = null;
            this.running = false;
        }
    };
    
    this.reset = function() {
        this.stop();
        this.setCurrentTime(0);
        this.taskIndex = 0;
    };
    
    this.setCurrentTime = function(currentTime) {
        var reRun = this.isRunning;
        this.stop();
        this.currentTime = currentTime;
        for (this.taskIndex = 0;
            (this.taskIndex < this.tasks.length) &&
                (this.tasks[this.taskIndex].timeout <= this.currentTime);
            ++this.taskIndex);
        if (reRun) {
            this.start();
        }
    };
    
    this.getCurrentTime = function() {
        return this.currentTime;
    };
    
    var self = this;
    this.timingEvent = function() {
        self.currentTime += self.resolution;
        for (; (self.taskIndex < self.tasks.length) && (self.tasks[self.taskIndex].timeout <= self.currentTime); ++self.taskIndex) {
            self.tasks[self.taskIndex].callback();
        }
        
        if (self.taskIndex >= self.tasks.length) {
            self.stop();
        }
    };
}

function createTextSetter(id, text) {
    function textSetter() {
        document.querySelector(id).innerText = text;
    };
    return textSetter;
}

function init() {
    var tasks = [
        new Task(createTextSetter("#display", "first"), 0),
        new Task(createTextSetter("#display", "second"), 2000),
        new Task(createTextSetter("#display", "third"), 4000),
        new Task(createTextSetter("#display", "fourth"), 6000),
        new Task(createTextSetter("#display", "fifth"), 8000),
        new Task(createTextSetter("#display", "sixth"), 10000),
        new Task(createTextSetter("#display", "seventh"), 12000)
    ];
    
    var sched = new Scheduler(tasks, 500);
    
    document.querySelector("#start").onclick = function(){sched.start();};
    document.querySelector("#stop").onclick = function(){sched.stop();};
    document.querySelector("#reset").onclick = function(){sched.reset();};
}



function startMoving() {
    var api = impress();
    var movements = [
        new Task(function(){api.next();}, 1000),
        new Task(function(){api.next();}, 2000),
        new Task(function(){api.next();}, 3000),
        new Task(function(){api.prev();}, 4000),
        new Task(function(){api.next();}, 5000),
        new Task(function(){api.next();}, 6000),
        new Task(function(){api.prev();}, 7000),
        new Task(function(){api.next();}, 8000)
    ];
    
    var sched = new Scheduler(movements, 500);
    sched.start();
}