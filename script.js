var currentTime = 0;
var interval = 100; //milliseconds
var timerIntervalObject;

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
    }
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
    this.interval = none;
    this.currentTime = 0;
    
    this.addTask = function(task) {
        this.tasks.push(task);
        this.tasks.sort(compareTask);
    };
    
    this.start = function() {
        this.interval = setInterval(this.timingEvent, this.resolution);
    };
    
    this.stop = function() {
        clearInterval(this.interval);
        this.interval = none;
    };
    
    this.setCurrentTime = function(currentTime) {
        this.currentTime = currentTime;
    };
    
    this.getCurrentTime = function() {
        return this.currentTime;
    };
    
    this.timingEvent = function() {
        this.currentTime += this.resolution;
        
        for (; this.tasks[this.taskIndex] <= this.currentTime; ++this.taskIndex) {
            this.tasks[this.taskIndex].callback();
        }
    };
}

function timerFunction() {
    currentTime += interval;
    var display = document.querySelector("#display");
    display.innerText = currentTime;
}

function init() {
    timerIntervalObject = setInterval(timerFunction, interval);
}