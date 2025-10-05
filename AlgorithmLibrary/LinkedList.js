// Animation logic for Singly Linked List: Insert at beginning and end

function LinkedListAnim(am) {
    this.init(am);
}

LinkedListAnim.prototype = new Algorithm();
LinkedListAnim.prototype.constructor = LinkedListAnim;
LinkedListAnim.superclass = Algorithm.prototype;

var LINKED_LIST_ELEM_WIDTH = 80;
var LINKED_LIST_ELEM_HEIGHT = 40;
var LINKED_LIST_START_X = 200;
var LINKED_LIST_START_Y = 200;
var LINKED_LIST_SPACING = 100;

LinkedListAnim.prototype.init = function(am) {
    LinkedListAnim.superclass.init.call(this, am);
    this.addControls();
    this.reset();
};

LinkedListAnim.prototype.addControls = function() {
    this.insertBeginField = addInputToAlgorithmBar("Text", "");
    this.insertBeginButton = addButtonToAlgorithmBar("Insert at Beginning");
    this.insertBeginButton.onclick = this.insertAtBeginningCallback.bind(this);

    this.insertEndField = addInputToAlgorithmBar("Text", "");
    this.insertEndButton = addButtonToAlgorithmBar("Insert at End");
    this.insertEndButton.onclick = this.insertAtEndCallback.bind(this);

    this.clearButton = addButtonToAlgorithmBar("Clear");
    this.clearButton.onclick = this.clearCallback.bind(this);
};

LinkedListAnim.prototype.reset = function() {
    this.list = [];
    this.nodeIDs = [];
    this.nextIndex = 0;
    this.headID = this.nextIndex++;
    this.cmd("CreateLabel", this.headID, "Head", LINKED_LIST_START_X - 40, LINKED_LIST_START_Y);
};

LinkedListAnim.prototype.insertAtBeginningCallback = function() {
    var value = this.insertBeginField.value;
    if (value !== "") {
        this.doInsertAtBeginning(value);
        this.insertBeginField.value = "";
    }
};

LinkedListAnim.prototype.insertAtEndCallback = function() {
    var value = this.insertEndField.value;
    if (value !== "") {
        this.doInsertAtEnd(value);
        this.insertEndField.value = "";
    }
};

LinkedListAnim.prototype.clearCallback = function() {
    this.commands = [];
    for (var i = 0; i < this.nodeIDs.length; i++) {
        this.cmd("Delete", this.nodeIDs[i]);
    }
    this.nodeIDs = [];
    this.list = [];
    this.cmd("Disconnect", this.headID, null);
    this.cmd("SetNull", this.headID, 1);
    this.cmd("Step");
    this.doAnimation();
};

LinkedListAnim.prototype.doInsertAtBeginning = function(value) {
    this.commands = [];
    var nodeID = this.nextIndex++;
    this.list.unshift(value);
    this.nodeIDs.unshift(nodeID);

    var x = LINKED_LIST_START_X;
    var y = LINKED_LIST_START_Y;

    this.cmd("CreateLinkedList", nodeID, value, LINKED_LIST_ELEM_WIDTH, LINKED_LIST_ELEM_HEIGHT, x, y, 0.25, 0, 1, 1);
    this.cmd("SetNull", nodeID, 1);

    if (this.nodeIDs.length > 1) {
        this.cmd("Connect", nodeID, this.nodeIDs[1]);
        this.cmd("SetNull", nodeID, 0);
    }
    this.cmd("Connect", this.headID, nodeID);
    this.cmd("SetNull", this.headID, 0);

    // Reposition all nodes
    for (var i = 0; i < this.nodeIDs.length; i++) {
        this.cmd("Move", this.nodeIDs[i], LINKED_LIST_START_X + i * LINKED_LIST_SPACING, LINKED_LIST_START_Y);
    }
    this.cmd("Step");
    this.doAnimation();
};

LinkedListAnim.prototype.doInsertAtEnd = function(value) {
    this.commands = [];
    var nodeID = this.nextIndex++;
    this.list.push(value);
    this.nodeIDs.push(nodeID);

    var x = LINKED_LIST_START_X + (this.nodeIDs.length - 1) * LINKED_LIST_SPACING;
    var y = LINKED_LIST_START_Y;

    this.cmd("CreateLinkedList", nodeID, value, LINKED_LIST_ELEM_WIDTH, LINKED_LIST_ELEM_HEIGHT, x, y, 0.25, 0, 1, 1);
    this.cmd("SetNull", nodeID, 1);

    if (this.nodeIDs.length > 1) {
        this.cmd("Connect", this.nodeIDs[this.nodeIDs.length - 2], nodeID);
        this.cmd("SetNull", this.nodeIDs[this.nodeIDs.length - 2], 0);
    }
    this.cmd("Connect", this.headID, this.nodeIDs[0]);
    this.cmd("SetNull", this.headID, 0);

    this.cmd("Step");
    this.doAnimation();
};

LinkedListAnim.prototype.doAnimation = function() {
    this.animationManager.StartNewAnimation(this.commands);
    this.commands = [];
};

var currentAlg;

function init() {
    var animManag = initCanvas();
    currentAlg = new LinkedListAnim(animManag);
}
