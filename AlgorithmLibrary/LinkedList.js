// Singly Linked List Animation: Insert at Beginning and End
// For malinga93142/datastructures_animation

function LinkedListAnim(am) {
    this.init(am);
}

LinkedListAnim.prototype = new Algorithm();
LinkedListAnim.prototype.constructor = LinkedListAnim;
LinkedListAnim.superclass = Algorithm.prototype;

// Layout constants
var LL_ELEM_WIDTH = 80;
var LL_ELEM_HEIGHT = 40;
var LL_START_X = 200;
var LL_START_Y = 200;
var LL_SPACING = 100;

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
    this.cmd("CreateLabel", this.headID, "Head", LL_START_X - 40, LL_START_Y);
    this.cmd("SetNull", this.headID, 1);
    this.doAnimation();
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

    var x = LL_START_X;
    var y = LL_START_Y;

    this.cmd("CreateLinkedList", nodeID, value, LL_ELEM_WIDTH, LL_ELEM_HEIGHT, x, y, 0.25, 0, 1, 1);
    this.cmd("SetNull", nodeID, 1);

    if (this.nodeIDs.length > 1) {
        // Connect new node to previous head
        this.cmd("Connect", nodeID, this.nodeIDs[1]);
        this.cmd("SetNull", nodeID, 0);
    }
    this.cmd("Connect", this.headID, nodeID);
    this.cmd("SetNull", this.headID, 0);

    // Animate reposition of all nodes
    for (var i = 0; i < this.nodeIDs.length; i++) {
        this.cmd("Move", this.nodeIDs[i], LL_START_X + i * LL_SPACING, LL_START_Y);
    }
    this.cmd("Step");
    this.doAnimation();
};

LinkedListAnim.prototype.doInsertAtEnd = function(value) {
    this.commands = [];
    var nodeID = this.nextIndex++;
    this.list.push(value);
    this.nodeIDs.push(nodeID);

    var x = LL_START_X + (this.nodeIDs.length - 1) * LL_SPACING;
    var y = LL_START_Y;

    this.cmd("CreateLinkedList", nodeID, value, LL_ELEM_WIDTH, LL_ELEM_HEIGHT, x, y, 0.25, 0, 1, 1);
    this.cmd("SetNull", nodeID, 1);

    if (this.nodeIDs.length > 1) {
        // Connect previous tail to new node
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

// Global for visualization main
var currentAlg;

function init() {
    var animManag = initCanvas();
    currentAlg = new LinkedListAnim(animManag);
}
