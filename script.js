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
    
    this.addTask = function(task) {
        this.tasks.push(task);
        this.tasks.sort(compareTask);
    };
    
    this.start = function() {
        if (this.interval === null) {
        this.interval = setInterval(this.timingEvent, this.resolution);
        }
    };
    
    this.stop = function() {
        clearInterval(this.interval);
        this.interval = null;
    };
    
    this.reset = function() {
        this.stop();
        this.setCurrentTime = 0;
        this.taskIndex = 0;
    };
    
    this.setCurrentTime = function(currentTime) {
        this.currentTime = currentTime;
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
    
    document.querySelector("#start").onclick = sched.start.bind(sched);
    document.querySelector("#stop").onclick = sched.stop.bind(sched);
    document.querySelector("#reset").onclick = sched.reset.bind(sched);
}